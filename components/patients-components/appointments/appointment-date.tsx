import { NavigationProp, Route } from "@react-navigation/native";
import React, { FC, useEffect, useRef, useState } from "react";
import { Alert, AlertButton, Platform, StyleSheet, Text, View } from "react-native";
import { AcquiredAppointmentsType, DoctorsTimesType, NavigationType, ResponseType } from "../../../helper/types";
import FixedContainer from "../reuseable/fixed-container";
import ImageMenu from "../reuseable/image-menu";
import Appointment from "../../../assets/imgs-icon/book-appointments.svg";
import CardIconsContainer from "../../shared/card-icons-container";
import constantValues from "../../../helper/constantValues.json";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { DatePicker } from 'react-native-woodpicker'
import colors from "../../../assets/colors";
import BorderedButton from "../reuseable/bordered-button";
import * as Calendar from 'expo-calendar';
import { useDispatch, useSelector } from "react-redux";
import appointmentsActions from "../../../store/actions/appointments-actions";
import ReversedButtons from "../reuseable/reversed-buttons";
import utils from "../../../helper/utils";
import axios from "axios";
import errorHandler from "../../../helper/error-handler";
import generalActions from "../../../store/actions/general-actions";
import Spinner from "../../shared/spinner";
import * as WebBrowser from 'expo-web-browser';
import { WebView } from 'react-native-webview';
import Button from "../reuseable/button";

const AppointmentDatePage: FC<{navigation: NavigationProp<any>, route: Route<any>}> = ({navigation, route}) => {
    //FOR ANDROID ONLY
    const [intervalTime, setIntervalTime] = useState<any>(); 
    const [paymentTimeoutToClose, setPaymentTimeoutToClose] = useState<any>();
    const ONE_DAY: number = 86400000;
    const THREE_HOURS: number = 10800000;
    const dispatch = useDispatch();
    const patientAuthReducer = useSelector((state:any)=>state.patientAuth);
    const generalReducer = useSelector((state: any)=>state.generalReducer);
    const [time, setTime] = useState<string>();
    const [times, setTimes] = useState<DoctorsTimesType[]>(constantValues.times);
    const [dateInfo, setDate] = useState<{date: Date, formattedDate: string}>({
        date: new Date(),
        formattedDate: ''
    });
    const [updateMood, setUpdateMood] = useState<boolean>(false);
    const [showAndroidBrowser, setShowAndroidBrowser] = useState<boolean>(false);
   
    
    const {doctorId, doctorFullName, acquiredAppointments, doctorClinic, appointmentId ,appointmentDate, appointmentTime, eventId, doctorPrice, billId} = route.params as any;


    useEffect(()=>{
        if(appointmentTime && appointmentTime  ) {
            setTime(appointmentTime);
            setDate((prevState)=>({
                ...prevState,
                formattedDate: appointmentDate
            }))
        }
    },[])

    useEffect(()=>{
        const {appointmentDate} = route.params as any
        
        if(appointmentDate){
            setUpdateMood(true);
            filteredTime(appointmentDate)
        }
    }, [])

    useEffect(()=>{
        if(Platform.OS == 'android') {
            filteredTime(new Date().toDateString());
        }
    }, [])

  
    const changeDateHandler = (date:Date): void => {
        setDate((prevState)=> ({
            ...prevState,
            date: date,
            formattedDate: new Date(date).toDateString()
        }));

        filteredTime(date.toDateString());
    }

    const filteredTime = (date: Date|string): void => {
        
        times.map((item, idx)=> {
            if(new Date(`${date} ${item.time.split(" ")[0]}`).getTime() < new Date().getTime()) {
                times[idx].available = false;
            }else{
                times[idx].available = true;
            }
            
        })
            
        if(acquiredAppointments.length > 0) {
            acquiredAppointments.map((appointment: AcquiredAppointmentsType)=> {
                if(new Date(appointment.appointmentDate).toDateString() == new Date(date).toDateString()) {
                    times.map((item, idx)=> {
                        appointment.acquiredTimes.map((acquiredTime)=> {
                            if(item.time == acquiredTime || new Date(`${date} ${item.time.split(" ")[0]}`).getTime() < new Date().getTime()) {
                                times[idx].available = false;
                            }
                        })
                    })
                }
            });
        }
    }

    const changeTimeHandler = (time: string): void => {
        setTime(time);
    }

    const getDefaultCalendarSource = async() => {
        const defaultCalendar = await Calendar.getDefaultCalendarAsync();
        return defaultCalendar.source;
    }
    
    const createCalendarEvent = async (dateTime: number): Promise<string|number> => {
        const defaultCalendarSource = Platform.OS == 'ios' ? await getDefaultCalendarSource() : {
            type: Calendar.EntityTypes.EVENT,
            isLocalAccount: true,
            name: `Appintment with ${doctorFullName}`
        }
        const eventId = await Calendar.createCalendarAsync({
            title: "Appointment",
            entityType: Calendar.EntityTypes.EVENT,
            source: defaultCalendarSource,
            ownerAccount: 'personal',
            accessLevel: Calendar.CalendarAccessLevel.OWNER,
            name: "Appointments",
            color: colors.mainColor
        })
        
        
        await Calendar.createEventAsync(eventId, {
            
            startDate: new Date(dateTime).toISOString(),
            endDate: new Date(dateTime+3600000).toISOString(),
            title: `Appointment with Dr.${doctorFullName}`,
            timeZone: "GMT+8",
            alarms: [
                {
                    relativeOffset: -30
                }
            ]
        })
        return eventId;
    }

    const checkPaymentStatus = async(): Promise<any> => {
        dispatch(generalActions.startSend());
        const formattedDoctorName: string = doctorFullName.replace(/[" "]/g, "-");
        const formattedDate: string = dateInfo.formattedDate.replace(/[" "]/g, "-");
        const formattedTime: string|undefined = time?.replace(/[" "]/g, "-");
        /**
         * These two variables' job iosAndroidTimeoutToCloseInner & iosAndroidIntervalTimeInner :
         * 1- To run in IOS and clear both timeout and interval because webBrowser run inside the application for IOS.
         * 2- For android to clear both timeout and interval in case unsuccessful payment. For cancel button we need 
            intervalTime, paymentTimeoutToClose because webView displays the payment page
         */
        const iosAndroidTimeoutToCloseInner = setTimeout(()=> {
                if(Platform.OS == 'ios') {
                    WebBrowser.dismissBrowser();
                }else {
                    setShowAndroidBrowser(false);
                    setIntervalTime(null);
                }
                dispatch(generalActions.endSend());
                utils.showAlertMessage("Unsuccessful Payment 😔", "Please complete the payment");
                clearInterval(iosAndroidIntervalTimeInner);
                return;
            }, 78000);

        const iosAndroidIntervalTimeInner = setInterval(async()=>{
                const data = await utils.sendRequest("GET", `${utils.RAW_BACKEND_URL}/payment-status?date=${formattedDate}&time=${formattedTime}`, {});
                const response: ResponseType = await data.json();
                if(response.statusCode == 200){
                    if(Platform.OS == 'ios') {
                        WebBrowser.dismissBrowser();
                    }else {
                        setShowAndroidBrowser(false);
                        setIntervalTime(null)
                    }
                    clearInterval(iosAndroidIntervalTimeInner);
                    clearTimeout(iosAndroidTimeoutToCloseInner);
                    confirmHandler(response.billId);
                }
            }, 1000)

            if(Platform.OS == 'ios') {
                const browser = await WebBrowser.openBrowserAsync(`${utils.RAW_BACKEND_URL}/payment?amount=${doctorPrice}&doctorFullName=${formattedDoctorName}&date=${formattedDate}&time=${formattedTime}`, {
                    toolbarColor: colors.mainColor,
                    controlsColor: colors.thirdColor,
                    enableBarCollapsing: true,
                    dismissButtonStyle: 'cancel',
                });
                if(browser.type == 'cancel') {
                    WebBrowser.dismissBrowser();
                    clearInterval(iosAndroidIntervalTimeInner);
                    clearTimeout(iosAndroidTimeoutToCloseInner);
                    dispatch(generalActions.endSend());
                }
            }else {
                setShowAndroidBrowser(true);
                setIntervalTime(iosAndroidIntervalTimeInner);
            }



    }

    const confirmHandler = async(billId: string): Promise<any> => {
        if(time) {
            const rawDate = new Date(dateInfo.formattedDate).toISOString().split("T")[0]+"T"+time.split(" ")[0];
            const dateTime = Platform.OS == 'ios' ? new Date(rawDate).getTime()+ONE_DAY : (new Date(rawDate).getTime()+ONE_DAY) - THREE_HOURS;
            const {status} = await Calendar.requestCalendarPermissionsAsync();
            try{ 
                if(status == "granted") {
                    const newEventId = await createCalendarEvent(dateTime);
                    const data = await utils.sendRequest("POST", `${utils.BACKEND_URL}/patients/appointments/add-new-appointment`, {
                        appointmentDate: dateInfo.formattedDate, 
                        appointmentTime: time, 
                        eventId: newEventId,
                        doctorId,
                        billId
                    }, {'Authorization': `BEARER ${patientAuthReducer.authToken}`});
                    const response: ResponseType = await data.json();
                    if(response.statusCode != 201) {
                        errorHandler(response.message, response.statusCode, newEventId);
                    }
                    dispatch(appointmentsActions.addAppointment({
                        appointmentId: response.appointmentId,
                        doctor: {
                            doctorFullName,
                            doctorId,
                            doctorClinic
                        },
                        appointmentDate: new Date(dateTime).toDateString(),
                        appointmentTime: time,
                        eventId: newEventId,
                        patientName: patientAuthReducer.patientName,
                        billId: ""
                    }, response.acquiredAppointments))
                }
                navigation.navigate("appointment-confirmation", {
                    date: dateInfo.formattedDate,
                    time,
                    doctorFullName,
                    doctorClinic
                })
                dispatch(generalActions.endSend()) 
            }catch(err:any) {
                dispatch(generalActions.endSend());
                await Calendar.deleteCalendarAsync(err.validations);
                utils.showAlertMessage("ERROR 😔", err.message);
            }
            
            
        }
    }

    const updateHandler = async(): Promise<any> => {
        if(time) {
            dispatch(generalActions.startSend());
            const rawDate = new Date(dateInfo.formattedDate).toISOString().split("T")[0]+"T"+time.split(" ")[0];
            const dateTime = Platform.OS == 'ios' ? new Date(rawDate).getTime()+ONE_DAY : (new Date(rawDate).getTime()+ONE_DAY) - THREE_HOURS;
            const {status} = await Calendar.requestCalendarPermissionsAsync();
            try{
                if(status == "granted") {
                       await Calendar.deleteCalendarAsync(eventId);
                       const updatedEventId = await createCalendarEvent(dateTime);
                       const data = await utils.sendRequest ("PATCH",`${utils.BACKEND_URL}/patients/appointments/update-appointment`, {
                        appointmentId,
                        appointmentDate: dateInfo.formattedDate,
                        appointmentTime: time,
                        eventId: updatedEventId,
                        doctorId,
                        prevTime: appointmentTime,
                        prevDate: appointmentDate,
                        patient: patientAuthReducer.patientId
                    }, {'Authorization': `BEARER ${patientAuthReducer.authToken}`});
                        const response: ResponseType = await data.json();
                        if(response.statusCode != 200) {
                            errorHandler(response.message, response.statusCode, updatedEventId);
                        }
                        dispatch(appointmentsActions.updateAppointmentDateTime(appointmentId, dateInfo.formattedDate, time, response.acquiredAppointments, doctorId ,updatedEventId));
                    }
                    navigation.navigate("appointment-confirmation", {
                        date: dateInfo.formattedDate,
                        time,
                        doctorFullName,
                        doctorClinic
                    }) 
                    dispatch(generalActions.endSend()) 
            }catch(err: any) {
                dispatch(generalActions.endSend()) 
                await Calendar.deleteCalendarAsync(err.validations);
                utils.showAlertMessage("ERROR 😔", err.message);
            }
        }
    }

    const cancelAppointment = async(): Promise<any> => {
        try {
            dispatch(generalActions.startSend());
            const data = await utils.sendRequest("DELETE",`${utils.BACKEND_URL}/patients/appointments/delete-appointment`,{
                appointmentId,
                appointmentDate,
                appointmentTime,
                doctorId,
                billId
            }, {'Authorization': `BEARER ${patientAuthReducer.authToken}`});
            const response: ResponseType = await data.json();
            if(response.statusCode != 200) {
                errorHandler(response.message, response.statusCode);
            }
            await Calendar.deleteCalendarAsync(eventId);
            dispatch(appointmentsActions.cancelAppointment(appointmentId, doctorId, response.acquiredAppointments));
            utils.showAlertMessage("Canceled 👍", `Your appointment with Dr.${doctorFullName} has been canceled`,
            [
                {
                    text: "Ok, thank you",
                    onPress: ()=> navigation.navigate('call-doctor')
                }
            ]
            )
            dispatch(generalActions.endSend()) 
        }catch(err: any) {
            dispatch(generalActions.endSend()) 
            utils.showAlertMessage("ERROR 😔", err.message);
        }
    }

    const cancePaymentAndroid = (): void => {
        setShowAndroidBrowser(false);
        clearInterval(intervalTime);
        clearTimeout(paymentTimeoutToClose);
        dispatch(generalActions.endSend());
    }


    return !showAndroidBrowser ? <FixedContainer>
        <ImageMenu navigation={navigation} Image={Appointment} hasBackElement />
        <CardIconsContainer containerStyle={{marginTop:'20%'}}>
            <View style={{alignSelf:'center', width:'100%'}}>
                <Text style={{textAlign:'center', fontSize:15, fontWeight:'bold'}}>Dr.{doctorFullName}'s appointments</Text>
                <DatePicker
                    value={dateInfo.date}
                    onDateChange={(date:any)=>changeDateHandler(date)}
                    textInputStyle={{color:colors.mainColor, textAlign:'center'}}
                    title="AppointmentDate"
                    isNullable={false}
                    text={dateInfo.formattedDate != "" ? dateInfo.formattedDate : "Choose a date"}
                    iosDisplay = "spinner"
                    textColor= {colors.mainColor}
                    minimumDate = {new Date()}
                    style={{height: 70, borderBottomWidth:2, borderBottomColor: colors.mainColor, marginBottom: '5%'}}
                 />
                 {dateInfo.formattedDate && times.length > 0 ? 
                 <ScrollView style={{height: utils.deviceHeight <= 667 ? 160 : Platform.OS == 'ios' ? 270 : 290}}>
                    <View style={styles.timesContainer}>
                        {times.map((item: DoctorsTimesType)=> {
                            return <TouchableOpacity key={item.id} 
                            style={{...styles.timeContainer, backgroundColor: item.time == time ? colors.mainColor : !item.available ? "#ccc" : colors.secondColor}} 
                            disabled={!item.available ? true : false} onPress={()=>changeTimeHandler(item.time)}>
                                <Text style={{...styles.timeText}}>{item.time}</Text>
                            </TouchableOpacity>
                        })}
                    </View>
                 </ScrollView>
                 : null
                }
                {updateMood ? 
                    <ReversedButtons 
                    onPressOne={()=>updateHandler()}
                    onPressTwo={()=>Alert.alert("Cancel appointment", `Are you sure to cancel your appointment with Dr.${doctorFullName}`, [
                        {
                            text: "Yes, sure",
                            style: 'cancel',
                            onPress: ()=> cancelAppointment()
                        },
                        {
                            text: "No, I will keep it",
                            style:'default'
                        }
                    ])}
                    btnText= "update"
                    btnTextTwo="Cancel"
                    btnContainerStyleOne={styles.btnLeftContainer}
                    btnContainerStyleTwo={styles.btnRightContainer}
                    children={generalReducer.isSending ? <Spinner /> : null }
                />:
                time && dateInfo.formattedDate.length > 0 &&
                    <BorderedButton children={generalReducer.isSending ? <Spinner /> : null } btnText={"Confirm"} onPress={()=>checkPaymentStatus()} />
                }
            </View>
        </CardIconsContainer>
    </FixedContainer>
    :
        <View style={{flex:1}}>
            <View style={{width:'100%', backgroundColor: colors.mainColor}}>
                <Button buttonText="Cancel" onPress={()=>cancePaymentAndroid()} buttonContainerStyle={{backgroundColor: 'transparent', borderColor: 'transparent' ,width: '30%'}} buttonTextStyle={{color: colors.thirdColor}} />
            </View>
            <WebView 
                source={{uri: `${utils.RAW_BACKEND_URL}/payment?amount=${doctorPrice}&doctorFullName=${doctorFullName.replace(/[" "]/g, "-")}&date=${dateInfo.formattedDate.replace(/[" "]/g, "-")}&time=${time?.replace(/[" "]/g, "-")}`}}
                style={{flex: 1}}
            />
        </View>
}

const styles = StyleSheet.create({
    timesContainer: {
        flex:1,
        display:'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems:'center',
        flexWrap: 'wrap'
    },
    timeContainer: {
        justifyContent:'center',
        backgroundColor: colors.secondColor,
        padding: '2%',
        width: 100,
        marginBottom: '10%',
        borderBottomRightRadius: 8,
        borderTopLeftRadius: 8
    },
    timeText: {
        color: colors.thirdColor,
        textAlign: 'center',
        fontSize: 14,
        fontWeight: '700'
    },
    btnLeftContainer: {
        marginLeft:'-10%',
        alignItems:'center', 
        marginTop: utils.deviceHeight <= 667 ? Platform.OS == 'ios'? '10%' :'3%' : '3%', 
        width: '40%'
    },
    btnRightContainer: {
        marginRight: utils.deviceWidth < 395 ? '-5%' : utils.deviceWidth < 500 ? '-8%' : '-10%', 
        alignItems: 'center', 
        marginLeft: '25%', 
        backgroundColor: 'tomato', 
        marginTop: utils.deviceHeight <= 667 ? Platform.OS == 'ios'? '10%' :'3%' : '3%', 
        width:'35%'
    },
})

export default AppointmentDatePage;