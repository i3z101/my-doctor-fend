import { NavigationProp } from "@react-navigation/native";
import React, { FC } from "react";
import {View, Text, FlatList, StyleSheet, TouchableOpacity, Platform} from "react-native";
import { useSelector } from "react-redux";
import colors from "../../../assets/colors";
import { AppointmentType } from "../../../helper/types";
import utils from "../../../helper/utils";

const CallDoctorCard: FC<{data: AppointmentType[], title: string, navigation: NavigationProp<any> ,hasBtns?: boolean, doctor?: boolean}> = ({data, title, navigation ,hasBtns, doctor}) => {
    const patientAuthReducer = useSelector((state:any)=>state.patientAuth);
    const appointmentsReducer = useSelector((state:any)=> state.appointments);
    return <View style={{width:'95%'}}>
                <View>
                    <Text style={{textAlign:'left', fontSize:25, fontWeight:'bold'}}>{title}<Text style={{fontSize:18}}>s</Text></Text>
                </View>
                <FlatList        
                style={{height: utils.deviceHeight <= 667 ? 130 : 230}}
                data={data}
                keyExtractor={(item)=>item.appointmentId}
                renderItem= {({item})=> {
                return <View style={styles.cardOuterContainer}>
                        {hasBtns &&
                        <View style={{...styles.rowStyle, marginBottom:5}}>
                            {!doctor &&
                            <TouchableOpacity onPress={()=>navigation.navigate('appointment-date', {
                                appointmentId: item.appointmentId,
                                appointmentDate: item.appointmentDate,
                                appointmentTime: item.appointmentTime,
                                doctorId: item.doctor.doctorId,
                                doctorFullName: item.doctor.doctorFullName,
                                doctorClinic: item.doctor.doctorClinic,
                                eventId: item.eventId,
                                billId: item.billId,
                                acquiredAppointments: item.doctor.acquiredAppointments || appointmentsReducer.doctors.find((doc: any)=>doc.doctorId == item.doctor.doctorId).acquiredAppointments
                            })}>
                                <Text style={styles.fileNameTextStyle}>Manage</Text>
                            </TouchableOpacity>
                            }
                            <TouchableOpacity onPress={()=>{}}>
                                <Text style={styles.fileNameTextStyle}>Call</Text>
                            </TouchableOpacity>
                        </View>
                        }
                        <View style={{borderWidth:2, borderColor: colors.mainColor, borderRadius:7}}>
                            <View style={{padding:7}}>
                                <View style={{...styles.rowStyle, ...styles.space}}>
                                    <Text>Patient: {!doctor ? patientAuthReducer.patientName : item.patientName}</Text>
                                    <Text>Dr: {item.doctor.doctorFullName}</Text>
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
        marginBottom: '2%'
    },
    fileNameTextStyle: {
        color: colors.mainColor,
        fontWeight:'bold'
    }
})


export default CallDoctorCard