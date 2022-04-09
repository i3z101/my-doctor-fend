import { NavigationProp } from "@react-navigation/native";
import React, { FC } from "react";
import {View, Text, FlatList, StyleSheet, TouchableOpacity, Platform} from "react-native";
import { useSelector } from "react-redux";
import colors from "../../../assets/colors";
import { AppointmentType } from "../../../helper/types";
import utils from "../../../helper/utils";
import * as WebBrowser from 'expo-web-browser';

const CallDoctorCard: FC<{data: AppointmentType[], title: string, navigation: NavigationProp<any> ,hasBtns?: boolean, doctor?: boolean}> = ({data, title, navigation ,hasBtns, doctor}) => {
    const patientAuthReducer = useSelector((state:any)=>state.patientAuth);
    const appointmentsReducer = useSelector((state:any)=> state.appointments);

    const openBill = async (billPath: string) => {
        await WebBrowser.openBrowserAsync(`${utils.RAW_BACKEND_URL}${billPath}`);
    }
    

    return <View style={{width:'95%'}}>
                <View>
                    <Text style={{textAlign:'left', fontSize:25, fontWeight:'bold'}}>{title}<Text style={{fontSize:18}}>s</Text></Text>
                </View>
                <FlatList        
                style={{height: utils.deviceHeight <= 667 ? 130 : 200}}
                data={data}
                keyExtractor={(item)=>item.appointmentId}
                renderItem= {({item})=> {
                return <View style={styles.cardOuterContainer}>
                        {hasBtns &&
                        <View style={{...styles.rowStyle, marginBottom:5}}>
                        {!doctor ?
                            item.doctor.isAccountActive ?
                            <>
                                <TouchableOpacity onPress={()=>navigation.navigate('appointment-date', {
                                    appointmentId: item.appointmentId,
                                    appointmentDate: item.appointmentDate,
                                    appointmentTime: item.appointmentTime,
                                    doctorId: item.doctor.doctorId,
                                    doctorFullName: item.doctor.doctorFullName,
                                    doctorClinic: item.doctor.doctorClinic,
                                    eventId: item.eventId,
                                    billId: item.bill.billId,
                                    doctorPushToken: item.doctor.pushToken,
                                    acquiredAppointments: doctor ? item.doctor.acquiredAppointments : appointmentsReducer.doctors.find((doc: any)=>doc.doctorId == item.doctor.doctorId).acquiredAppointments
                                })}>
                                    <Text style={styles.fileNameTextStyle}>Manage</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={()=> openBill(item.billPath)}>
                                    <Text style={{color: 'blue', textDecorationLine:'underline'}}>Bill invoice</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={()=>navigation.navigate(doctor ? 'call-patient' : 'call-screen', {
                                    roomId: item.roomId
                                })}>
                                    <Text style={styles.fileNameTextStyle}>Call</Text>
                                </TouchableOpacity>
                            </>
                            : <Text style={{fontWeight: '700', textAlign:'center'}}>Doctor's account is not active</Text>
                        : item.patientActiveAccount ?
                        <>
                            <TouchableOpacity onPress={()=> openBill(item.billPath)}>
                                    <Text style={{color: 'blue', textDecorationLine:'underline'}}>Bill invoice</Text>
                                </TouchableOpacity>
                            <TouchableOpacity onPress={()=>navigation.navigate(doctor ? 'call-patient' : 'call-screen', {
                                roomId: item.roomId
                            })}>
                                <Text style={styles.fileNameTextStyle}>Call</Text>
                            </TouchableOpacity>
                        </>
                        : <Text style={{fontWeight: '700', textAlign:'center'}}>Patient's account is not active</Text> 
                        }
                        </View>
                        }
                        <View style={{borderWidth:2, borderColor: colors.mainColor, borderRadius:7}}>
                            <View style={{padding:7}}>
                                <View style={{...styles.space}}>
                                    <Text style={{width:'100%'}}>Patient: {!doctor ? patientAuthReducer.patientName : item.patientName}</Text>
                                    <Text style={{width:'100%', marginTop:'1%', fontWeight:'700'}}>Dr: {item.doctor.doctorFullName}</Text>
                                </View>
                                <View>
                                    <Text style={{fontSize:12, fontWeight:'700'}}>Date Time: {item.appointmentDate + " " + item.appointmentTime}</Text>
                                    <Text style={{fontSize:12}}>Clinic: {item.doctor.doctorClinic}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                }}
                />
            </View>
}

const styles = StyleSheet.create({
    cardOuterContainer: {
        marginTop: '5%',
    },
    rowStyle: {
        flexDirection: 'row',
        justifyContent:'space-between'
    },
    space: {
        marginBottom: '1%'
    },
    fileNameTextStyle: {
        color: colors.mainColor,
        fontWeight:'bold'
    }
})


export default CallDoctorCard