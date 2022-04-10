import React, { FC, useEffect, useState } from "react";
import { Button, SafeAreaView, StatusBar, StyleSheet, View, PermissionsAndroid, Text, Platform } from "react-native";
import { NavigationType, NavigationWithRoute } from "../../../helper/types";
import Loading from '../../../assets/imgs-icon/loading.svg';
import { io } from "socket.io-client";
import utils from "../../../helper/utils";
import * as WebBrowser from 'expo-web-browser';
import * as Notifications from 'expo-notifications';
import AsyncStorage from "@react-native-async-storage/async-storage";
import ImageMenu from "../reuseable/image-menu";
import FixedContainer from "../reuseable/fixed-container";
import colors from "../../../assets/colors";
import WaitingRoomText from "../../shared/waiting-room-text";
import { useSelector } from "react-redux";



const EmergencyPage: FC<NavigationWithRoute> = ({navigation, route}) => {
    let client = io(`${utils.RAW_BACKEND_URL}/emergency`);
    const patientAuthReducer = useSelector((state: any) => state.patientAuth)
    

    const getPushTokenAndHandleForgroundNotification = async () => {
      client.emit('join', {
        socketID: client.id,
        payload: patientAuthReducer.pushToken
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
    
    useEffect(()=> {


      Notifications.requestPermissionsAsync().then(val => {
        if(val.status == 'granted') {
            getPushTokenAndHandleForgroundNotification();
          }
        })

        client.on('join', (args) => {
            client.emit('pushToken', {
              socketID: client.id,
              payload: patientAuthReducer.pushToken
            })
            callUser()
      })
      
    
      return ()=> {
        setTimeout(()=> {
          client.disconnect()
        }, 700)
      }
          
    }, [])
        


    const callUser = async () => {
        await WebBrowser.openBrowserAsync(`${utils.RAW_BACKEND_URL}/appointments/123?receiver=true`, {
          createTask: false,
          enableDefaultShareMenuItem: true,
          readerMode: false
        })
    }








    return (
        <FixedContainer>
          <ImageMenu Image={Loading} navigation={navigation} hasBackElement/>
          <WaitingRoomText mainText="Waiting For Doctor To Join..." secondText="The page will open automatically once the doctor joined" />
        </FixedContainer>
    );
  };
  
  const styles = StyleSheet.create({

    loadingText: {
      fontSize: 20,
      textAlign: 'center',
      color: colors.thirdColor
    }

  });

export default EmergencyPage;