import { NavigationProp } from "@react-navigation/native";
import React, { FC, Fragment, useCallback, useEffect, useState } from "react";
import FixedContainer from "../reuseable/fixed-container";
import ImageMenu from "../reuseable/image-menu";
import VideoCall from "../../../assets/imgs-icon/video-call.svg";
import { useDispatch, useSelector } from "react-redux";
import CardIconsContainer from "../../shared/card-icons-container";
import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import GeneralInfoText from "../reuseable/general-info-text";
import CenteredText from "../../shared/centered-text";
import colors from "../../../assets/colors";
import { AppointmentType, ResponseType } from "../../../helper/types";
import CallDoctorCard from "../reuseable/call-doctor-card";
import { AntDesign } from '@expo/vector-icons';
import AddNewIconBtn from "../reuseable/add-new-icon-btn";
import utils from "../../../helper/utils";
import errorHandler from "../../../helper/error-handler";
import appointmentsActions from "../../../store/actions/appointments-actions";
import Spinner from "../../shared/spinner";

const CallDoctorPage: FC<{navigation: NavigationProp<any>}> = ({navigation}) => {
    const todayDate = new Date(new Date().toDateString()).getTime();
    const dispatch = useDispatch();
    const patientAuthReducer = useSelector((state:any)=>state.patientAuth);
    const appointmentsReducer = useSelector((state:any)=>state.appointments);
    const nextCalls: AppointmentType[] = appointmentsReducer.appointments.filter((appointment: AppointmentType)=> new Date(appointment.appointmentDate).getTime() >= todayDate);
    const previousCalls: AppointmentType[] = appointmentsReducer.appointments.filter((appointment: AppointmentType)=> new Date(appointment.appointmentDate).getTime() < todayDate);
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

    const fetchAllAppointments = useCallback( async (): Promise<any>=> {
        try{
            setIsRefreshing(true)
            const data = await utils.sendRequest("GET", `${utils.BACKEND_URL}/shared/all-data?field=doctors`, {}, {'Authorization': `BEARER ${patientAuthReducer.authToken}`});
            const response: ResponseType = await data.json();
            if(response.statusCode != 200) {
                errorHandler(response.message, response.statusCode)
            }
            dispatch(appointmentsActions.addAllDoctors(response.doctors));
            setIsRefreshing(false)
        }catch(err:any) {
            setIsRefreshing(false)
            utils.showAlertMessage("ERROR 😔", err.message)
        }
    }, [appointmentsReducer]) 

    useEffect(()=>{
        if(appointmentsReducer.appointments.length < 1) {
            fetchAllAppointments();
        }
    }, [])


   return <FixedContainer>
        <ImageMenu hasBackElement navigation={navigation} Image={VideoCall} />
        <CardIconsContainer containerStyle={{...styles.cardContainer, alignItems:'center'}}>
            <View style={{width:'100%'}}>
            {!isRefreshing?
            <>
            <AddNewIconBtn onPress={()=>navigation.navigate('appointments')} />
            {appointmentsReducer.appointments.length > 0 ?
                <Fragment>
                    {nextCalls.length > 0 ?
                    <View style={{...styles.listsContainer, marginTop:'-1%'}}>
                        <CallDoctorCard data={nextCalls} title="Upcoming call" hasBtns navigation={navigation} />
                        </View>
                    : <Text>No upcoming calls</Text>
                    }
                <View style={{height:20, width:'90%', borderBottomWidth:2 ,borderBottomColor: colors.secondColor}}></View>
                    {previousCalls.length > 0 ?
                    <View style={{...styles.listsContainer, marginTop:'1%'}}>
                        <CallDoctorCard data={previousCalls} title="Previous call" navigation={navigation} />
                        </View>
                    : <Text>No previous calls</Text>
                    }
                </Fragment>
                
                :<CenteredText text="No appointments yet"/>
            }
            </>
            
            : <Spinner size={42} color={colors.mainColor} />
            
            }
            
            </View>
        </CardIconsContainer>
    </FixedContainer>
}

const styles = StyleSheet.create({
    cardContainer: {
        marginTop: '18%'
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

export default CallDoctorPage;