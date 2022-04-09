import React, { FC, useEffect, useState } from "react";
import {DoctorEmergencyList, NavigationType } from "../../../helper/types";
import FixedContainer from "../reuseable/fixed-container";
import ImageMenu from "../reuseable/image-menu";
import VideoCall from "../../../assets/imgs-icon/video-call.svg";
import CardIconsContainer from "../../shared/card-icons-container";
import { FlatList, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import utils from "../../../helper/utils";
import EmptyListMessage from "../reuseable/empty-list-message";
import { io } from "socket.io-client";
import colors from "../../../assets/colors";
import { AntDesign } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';

const DoctorEmergencyListPage: FC<NavigationType> = ({navigation}) => {

    let client = io(`${utils.RAW_BACKEND_URL}/emergency`);
    const [listDoctors, setListDoctors] = useState<DoctorEmergencyList[]>([]);

    const addDoctors = (newDoctor: DoctorEmergencyList)=> {
        setListDoctors(prevState=> prevState.concat(newDoctor));
    }

    const deleteDoctor = (doctorSocketId: string) => {
        // doctorsCopy = doctorsCopy.filter((doctor) => doctor.doctorSocketId != doctorSocketId);
        setListDoctors(prevState=> prevState.filter(doctor => doctor.doctorSocketId != doctorSocketId));
    }

    const callUser = async (roomId: string, pushToken: string) => {
        client.emit('call-doctor', roomId)
        await WebBrowser.openBrowserAsync(`${utils.RAW_BACKEND_URL}/emergency/${roomId}?pushToken=${pushToken}`, {
            createTask: false,
            enableDefaultShareMenuItem: true,
            readerMode: false
          })
    }

    useEffect(()=> {

        client.emit("patient-join");

        client.on('doctor-join', args=> {
            addDoctors({
                doctorSocketId: args.doctorSocketId,
                doctorFullName: args.doctorFullName,
                roomId: args.roomId,
                pushToken: args.pushToken
            })
        })

        client.on('doctor-left', doctorSocketId=> {
            deleteDoctor(doctorSocketId)
        })
        
        

        return ()=> {
            client.disconnect()
        }
    }, [])


    return <FixedContainer>
        <ImageMenu Image={VideoCall} hasBackElement navigation={navigation} />
        <CardIconsContainer containerStyle={{marginTop: '17%'}}>
            <View style={{width:'100%'}}>
                <FlatList        
                    style={{height: utils.deviceHeight <= 667 ? 300 : Platform.OS == 'ios' ? 400 : 500}}
                    data = {listDoctors}
                    keyExtractor= {(item) => item.doctorSocketId}
                    ListEmptyComponent = {<EmptyListMessage message="No available doctors" />}
                    renderItem = {({item}) => {
                        return <TouchableOpacity style={styles.container} onPress={()=>callUser(item.roomId, item.pushToken)}>
                            <Text style={styles.text}>Dr.{item.doctorFullName} is available</Text>
                            <AntDesign name="right" size={24} color="black" />
                        </TouchableOpacity>
                    }}
                />
            </View>
        </CardIconsContainer>
    </FixedContainer>
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderColor: colors.mainColor,
        borderRadius: 7,
        padding: 5,
        marginBottom: '5%',
        flexDirection:'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '95%',
        alignSelf: 'center'
    },
    text: {
        fontSize: 14.5,
        color: colors.secondColor,
        fontWeight: '600'
    }
})


export default DoctorEmergencyListPage