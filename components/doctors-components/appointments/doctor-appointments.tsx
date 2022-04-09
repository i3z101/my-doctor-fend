import { NavigationProp } from "@react-navigation/native";
import React, { FC, Fragment, useCallback, useState } from "react";
import VideoCall from "../../../assets/imgs-icon/video-call.svg";
import { useDispatch, useSelector } from "react-redux";
import CardIconsContainer from "../../shared/card-icons-container";
import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import CenteredText from "../../shared/centered-text";
import colors from "../../../assets/colors";
import { AppointmentType, ResponseType } from "../../../helper/types";
import { AntDesign } from '@expo/vector-icons';
import CallDoctorCard from "../../patients-components/reuseable/call-doctor-card";
import ImageMenu from "../../patients-components/reuseable/image-menu";
import FixedContainer from "../../patients-components/reuseable/fixed-container";
import { EvilIcons } from '@expo/vector-icons';
import Spinner from "../../shared/spinner";
import utils from "../../../helper/utils";
import appointmentsActions from "../../../store/actions/appointments-actions";
import doctorAuthReducer from "../../../store/reducers/doctor-auth-reducer";
import errorHandler from "../../../helper/error-handler";

const DoctorAppointmentsPage: FC<{navigation: NavigationProp<any>}> = ({navigation}) => {
    const dispatch = useDispatch();
    const doctorAuthReducer = useSelector((state:any)=>state.doctorAuth)
    const todayDate = new Date(new Date().toDateString()).getTime();
    const appointmentsReducer = useSelector((state:any)=>state.appointments);
    const nextCalls: AppointmentType[] = appointmentsReducer.appointments.filter((appointment: AppointmentType)=> new Date(appointment.appointmentDate).getTime() >= todayDate);
    const previousCalls: AppointmentType[] = appointmentsReducer.appointments.filter((appointment: AppointmentType)=> new Date(appointment.appointmentDate).getTime() < todayDate);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    
    const refreshAppointments = useCallback( async (): Promise<any>=> {
        try{
            setRefreshing(true);
            const data = await utils.sendRequest("GET", `${utils.BACKEND_URL}/shared/all-data?field=appointments`, {}, {'Authorization': `BEARER ${doctorAuthReducer.authToken}`});
            const response: ResponseType = await data.json();
            if(response.statusCode != 200) {
                errorHandler(response.message, response.statusCode);
            }
            dispatch(appointmentsActions.addAllAppointments(response.appointments));
            setRefreshing(false);
        }catch(err:any) {
            setRefreshing(false);
            utils.showAlertMessage("ERROR 😔", err.message, [{
                text: 'Ok',
                style: 'cancel'
            }])
        }
    }, [appointmentsReducer])

   return <FixedContainer>
        <ImageMenu hasBackElement navigation={navigation} Image={VideoCall} />
        <CardIconsContainer containerStyle={{...styles.cardContainer, alignItems:'center'}}>
            <View style={{width:'100%'}}>
            {!refreshing ?
                <>
                <TouchableOpacity style={styles.addBtn}>
                    <EvilIcons name="refresh" size={42} color="black" onPress={()=>refreshAppointments()} />
                </TouchableOpacity>
                {appointmentsReducer.appointments.length > 0 ?
                    <Fragment>
                        {nextCalls.length > 0 ?
                        <View style={{...styles.listsContainer, marginTop:'-1%'}}>
                            <CallDoctorCard data={nextCalls} title="Upcoming call" hasBtns navigation={navigation} doctor={true}/>
                            </View>
                        : <Text>No upcoming calls</Text>
                        }
                    <View style={{height:20, width:'90%', borderBottomWidth:2 ,borderBottomColor: colors.secondColor}}></View>
                        {previousCalls.length > 0 ?
                        <View style={{...styles.listsContainer, marginTop:'1%'}}>
                            <CallDoctorCard data={previousCalls} title="Previous call" navigation={navigation} doctor={true}/>
                            </View>
                        : <Text>No previous calls</Text>
                        }
                    </Fragment>
                    :<CenteredText text="No appointments yet"/>
                }
                </>
                : <View>
                    <Spinner size={40} color={colors.mainColor}/>
                </View>
            }
            </View>
        </CardIconsContainer>
    </FixedContainer>
}

const styles = StyleSheet.create({
    cardContainer: {
        marginTop: '17%'
    },
    listsContainer: {
        width:'100%', 
        // marginLeft:'-1%'
    },
    addBtn: {
        display:'flex', 
        justifyContent:'flex-end', 
        alignItems:'flex-end', 
        marginLeft:'80%', 
        marginTop:'-5%', 
        width:'20%'
    },
})

export default DoctorAppointmentsPage;