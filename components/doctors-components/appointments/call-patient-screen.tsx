import React, { FC, useEffect, useState } from "react";
import { Button, SafeAreaView, StatusBar, StyleSheet, View, PermissionsAndroid, Text, Platform } from "react-native";
import { NavigationType, NavigationWithRoute } from "../../../helper/types";
import Loading from '../../../assets/imgs-icon/loading.svg';
import { io } from "socket.io-client";
import utils from "../../../helper/utils";
import * as WebBrowser from 'expo-web-browser';
import * as Notifications from 'expo-notifications';
import AsyncStorage from "@react-native-async-storage/async-storage";
import FixedContainer from "../../patients-components/reuseable/fixed-container";
import ImageMenu from "../../patients-components/reuseable/image-menu";
import WaitingRoomText from "../../shared/waiting-room-text";



const CallPatientPage: FC<NavigationWithRoute> = ({navigation, route}) => {
  const {roomId} = route.params as any
    let client = io(`${utils.RAW_BACKEND_URL}/appointments`, {
      query: {
        roomId
      }
    });

    
    useEffect(()=> {

        client.emit('doctor-join', {
          payload: roomId
        })

        client.on('patient-join', (args) => {
          client.emit('doctor-join', {
            payload: roomId
          })
          // callUser(args)
        })
        
        client.on('pushToken', args => {  
          console.log("jjii");
          
          callUser(args);
        })

        return ()=> {
          client.disconnect()
        }
      
    }, [])
        
        




    const callUser = async (token: string) => {
      const b = await WebBrowser.openBrowserAsync(`${utils.RAW_BACKEND_URL}/appointments/${roomId}?pushToken=${token}`, {
        createTask: false,
        enableDefaultShareMenuItem: true,
        readerMode: false
      })
      
      console.log(b.type);
      
      
    }








    return (
        <FixedContainer>
          <ImageMenu Image={Loading} navigation={navigation} hasBackElement/>
          <WaitingRoomText mainText="Waiting For Patient To Join..." secondText="The page will open automatically once the patient joined" />
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

export default CallPatientPage;