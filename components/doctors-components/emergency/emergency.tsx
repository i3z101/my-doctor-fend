import React, { FC, useEffect, useState } from "react";
import { Button, SafeAreaView, StatusBar, StyleSheet, View, PermissionsAndroid, Text, Platform } from "react-native";
import { NavigationType } from "../../../helper/types";
import Loading from '../../../assets/imgs-icon/loading.svg';
import { io } from "socket.io-client";
import utils from "../../../helper/utils";
import * as WebBrowser from 'expo-web-browser';
import * as Notifications from 'expo-notifications';
import AsyncStorage from "@react-native-async-storage/async-storage";
import FixedContainer from "../../patients-components/reuseable/fixed-container";
import ImageMenu from "../../patients-components/reuseable/image-menu";
import WaitingRoomText from "../../shared/waiting-room-text";
import { useSelector } from "react-redux";

const EmergencyPage: FC<NavigationType> = ({navigation}) => {
  const roomId = Math.ceil(Math.random() * 10000000000000000000).toString(16);
    let client = io(`${utils.RAW_BACKEND_URL}/emergency`);
    const doctorAuthReducer = useSelector((state:any) => state.doctorAuth);

    const getPushTokenAndHandleForgroundNotification = async () => {
      client.emit('doctor-join', {
        doctorFullName: doctorAuthReducer.doctorFullName,
        pushToken: doctorAuthReducer.pushToken,
        roomId
      })
      await handleForgroundNotification()
    }

    const handleForgroundNotification = async () => {
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldPlaySound: true,
          shouldShowAlert: true,
          shouldSetBadge: false
        })
      })
    }
    
    const callUser = async () => {
      await WebBrowser.openBrowserAsync(`${utils.RAW_BACKEND_URL}/emergency/${roomId}?receiver=true`, {
        createTask: false,
        enableDefaultShareMenuItem: true,
        readerMode: false
      })
      
      
    }
   
    
    useEffect(()=> {
        
        Notifications.requestPermissionsAsync().then(val => {
          if(val.status == 'granted') {
            getPushTokenAndHandleForgroundNotification()
          }
        })

        client.on('patient-join', ()=>{
            Notifications.requestPermissionsAsync().then(val => {
              if(val.status == 'granted') {
                getPushTokenAndHandleForgroundNotification()
              }
            })
        })


        client.on('patient-calling', patientRoomId => {
          if(patientRoomId == roomId) {
            callUser()
          }
        })

        // client.on('join', (token) => {
        //   setPushToken(token)
        //   callUser(token);
        // })

        // client.on('pushToken', token => {
        //   setPushToken(token)
        //   callUser(token);
        // })
        return ()=> {
          client.disconnect();
        }
      
    }, [client])
        
        












    return (
        <FixedContainer>
          <ImageMenu Image={Loading} navigation={navigation} hasBackElement/>
          <WaitingRoomText mainText="Waiting For Patient To Join..." secondText="The page will open automatically once the patient joined" />
          <Text>{client.id}</Text>
        </FixedContainer>
    );
  };
  
  const styles = StyleSheet.create({
    body: {
      ...StyleSheet.absoluteFillObject
    },
    stream: {
      flex: 1
    },
    footer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0
    },
  });

export default EmergencyPage;