import React, { FC, useEffect, useState } from "react";
import { Button, SafeAreaView, StatusBar, StyleSheet, View, PermissionsAndroid, Text } from "react-native";
import { NavigationType } from "../../../helper/types";
import {mediaDevices, MediaStream, RTCIceCandidate, RTCPeerConnection, RTCPeerConnectionState, RTCSessionDescription, RTCView}  from 'react-native-webrtc'
import { io } from "socket.io-client";
import utils from "../../../helper/utils";



const EmergencyPage: FC<NavigationType> = () => {
    const [localStream, setLocalStream] = useState<MediaStream|null>(null);
    const [remoteStream, setRemoteStream] = useState<MediaStream|null>(null);
    const socket = io(utils.RAW_BACKEND_URL)
    const peerConnection = new RTCPeerConnection({
      iceServers: [
          {
              urls: ['stun:stun.l.google.com:19302']
          }
      ]
    })
    useEffect(()=> {
      
      // peerConnection.onaddstream = (e) => {
      //     // console.log("Hello");
          
      //     console.log(e.stream);
      //     // setRemoteStream(e.stream);
      // }

      socket.emit('join-room')

      // socket.on('calling-user', async (args)=> {
      //   await peerConnection.setRemoteDescription(args.offer)
        
      //   // const answer = await peerConnection.createAnswer();
      //   // await peerConnection.setLocalDescription(new RTCSessionDescription(answer));
      //   // socket.emit('make-answer', {
      //   //     answer
      //   // })
      // })
      socket.on('answer-made', async (args)=> {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(args.answer));
      })
      
      // socket.on('ice-candidate', async (args)=> {
      //   await peerConnection.addIceCandidate(new RTCIceCandidate(args.candidate))
      // })

    }, [])

    const getUserMedia = async () => {
      let isFront = true, videoSourceId: any = null;
      try {
        const availableDevices = await mediaDevices.enumerateDevices();
        let videoSourceId;
      for (let i = 0; i < availableDevices.length; i++) {
        const sourceInfo = availableDevices[i];
        if (
          sourceInfo.kind == 'videoinput' &&
          sourceInfo.facing == (isFront ? 'front' : 'environment')
        ) {
          videoSourceId = sourceInfo.deviceId;
        }
      }
        const mediaStream = await mediaDevices.getUserMedia({
          video: {
            mandatory: {
              minWidth: 500,
              minHeight: 300,
              minFrameRate: 30,
            },
            facingMode: 'user',
            optional: [{sourceId: videoSourceId}]
          }
        })
        setLocalStream(mediaStream);
        peerConnection.addStream(mediaStream);
        
        peerConnection.onicecandidate = e => {
          if(e.candidate) {
            socket.emit('candidate', {
              candidate: e.candidate
            })
          }
        }
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(new RTCSessionDescription(offer));
        socket.emit('call-user', {
          offer: offer
        })

      }catch(err: any) {
        utils.showAlertMessage("ERROR", err.message);
      } 
    }





    const closeMedia = () => {
      const streamTrack = localStream?.getTracks();
      if(streamTrack) {
        for(let i=0; i < streamTrack?.length; i++) {
          if(streamTrack[i].readyState == 'live' && streamTrack[i].kind == 'video') {
            streamTrack[i].stop();
          }
        }
        setLocalStream(null);
      }
      
    }

    return (
        <View style={styles.stream}>
          <Button title="Call" onPress={()=>getUserMedia()} />
          <Button title="Close" onPress={()=>closeMedia()} />
          {localStream != null &&
            <RTCView 
              objectFit={"cover"}
              streamURL={localStream.toURL()}
              style={{height: '50%', flex:1}}
            />
          }
          {remoteStream != null && 
          <RTCView 
            objectFit={"cover"}
            streamURL={remoteStream.toURL()}
            style={{height: '50%', flex:1}}
          />
          }
        </View>
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