import React, { FC, useCallback, useEffect } from "react";
import { Dimensions, Platform, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions, Button, Alert } from "react-native";
import colors from "../../assets/colors";
import MedicalCare from '../../assets/imgs-icon/medical-care.svg';
import Appointment from '../../assets/imgs-icon/appointment.svg';
import Folder from '../../assets/imgs-icon/folder.svg';
import Call from '../../assets/imgs-icon/call.svg';
import Folders from '../../assets/imgs-icon/folder.svg';
import Medicine from '../../assets/imgs-icon/medicine.svg';
import Emergency from '../../assets/imgs-icon/emergency.svg';
import Epharmacy from '../../assets/imgs-icon/e-pharmacy.svg';
import { Feather } from '@expo/vector-icons';
import { DrawerActions, NavigationProp, StackActions } from "@react-navigation/native";
import Animated, {BounceInLeft, FadeInDown, FadeInLeft, FadeInRight, FadeInUp, SlideInLeft, SlideInRight, SlideInUp } from 'react-native-reanimated'; 
import CardIconsContainer from "../shared/card-icons-container";
import FixedContainer from "./reuseable/fixed-container";
import ImageMenu from "./reuseable/image-menu";
import GeneralInfoText from "./reuseable/general-info-text";
import utils from "../../helper/utils";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { patientAuthActions } from "../../store/actions/auth-actions";
import generalActions from "../../store/actions/general-actions";
import axios from "axios";
import { ResponseType } from "../../helper/types";
import appointmentsActions from "../../store/actions/appointments-actions";
import errorHandler from "../../helper/error-handler";
import medicinesActions from "../../store/actions/medicines-actions";
import medicalFilesActions from "../../store/actions/medical-files-actions";


const IndexComponent: FC<{navigation:NavigationProp<any>}> = ({navigation})=> {  
    const generalReducer = useSelector((state:any)=> state.generalReducer);  
    const patientAuthReducer = useSelector((state:any)=> state.patientAuth);
    const appointmentsReducer = useSelector((state:any)=> state.appointments);
    const dispatch = useDispatch();

    useEffect(()=>{
        if(generalReducer.shouldTakeItEveryInNumber.length < 1 && generalReducer.numberOfTabletsPerTime.length < 1 && 
            generalReducer.numberOfTimesPerDay.length < 1 && generalReducer.numberOfDays.length < 1){
                dispatch(generalActions.addAllNumbers())
        }
    }, [])

    const findPatientAuthInfo = async(): Promise<any> => {
        try {
            const patientAuthInfo = await AsyncStorage.getItem("patient-auth");
            if(patientAuthInfo) {
                const convertedObjectInfo = JSON.parse(patientAuthInfo);
                dispatch(patientAuthActions.login(convertedObjectInfo));
            }
        }catch(err: any) {
            utils.showAlertMessage("ERROR 😔", err.message);
        }
    } 

    const fetchAllData = useCallback( async (): Promise<any>=> {
        try{
            const data = await utils.sendRequest("GET",`${utils.BACKEND_URL}/shared/all-data`, {}, {'Authorization': `BEARER ${patientAuthReducer.authToken}`});
            const response: ResponseType = await data.json();;
            if(response.statusCode != 200) {
                errorHandler(response.message, response.statusCode);
            }
            dispatch(appointmentsActions.addAllDoctors(response.doctors));
            dispatch(appointmentsActions.addAllAppointments(response.appointments));
            dispatch(medicalFilesActions.addAllMedicalFiles(response.medicalFiles));
            dispatch(medicinesActions.addAllMedicines(response.medicines));
        }catch(err:any) {
            Alert.alert("ERROR 😔", err.message, [{
                text: 'Ok',
                style: 'cancel'
            }])
        }
    }, [patientAuthReducer]) 

    useEffect(()=>{
        if(patientAuthReducer.authToken == "") {
            findPatientAuthInfo()
        }
    }, [])

    useEffect(()=> {
        if(appointmentsReducer.doctors.length < 1 && patientAuthReducer.authToken != "") {            
            fetchAllData();
        }
    }, [patientAuthReducer])

    

    const changeAccountToDoctor = async(): Promise<void> => {
        await AsyncStorage.setItem("accountType", "doctor");
        dispatch(generalActions.changeAccountTypeToDoctor());
    }

    return <FixedContainer>
    <ImageMenu Image={MedicalCare} navigation={navigation} />
    <GeneralInfoText mainText={`Hi ${patientAuthReducer.patientName}`} secondText="We hope you are well today" />
    <CardIconsContainer>
        {patientAuthReducer.authToken != "" && !patientAuthReducer.isGuest ? 
        <>
        <TouchableOpacity style={{marginBottom:'10%'}} onPress={()=>navigation.navigate('appointments')}>
            <Animated.View entering={FadeInLeft.duration(700)}>
                <View style={styles.circleContainer}>
                    <Appointment height={30} width={30}/>
                </View>
            </Animated.View>
            <Text style={styles.circleText}>APPOINTMENTS</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{marginBottom:'10%'}} onPress={()=>navigation.navigate('call-doctor')}>
            <Animated.View entering={FadeInUp.duration(700)}>
                <View style={{...styles.circleContainer, width:'60%'}}>
                    <Call height={30} width={25} style={{marginLeft:'10%'}} />
                </View>
            </Animated.View>
            <Text style={styles.circleText}>Call A DOCTOR</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{marginBottom:'10%'}} onPress={()=>navigation.navigate('medical-files')}>
            <Animated.View entering={FadeInRight.duration(700)}>
                <View style={styles.circleContainer}>
                    <Folder height={30} width={30}/>
                </View>
                <Text style={styles.circleText}>MEDICAL FILES</Text>
            </Animated.View>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>navigation.navigate('my-medicines')}>
            <Animated.View entering={FadeInDown.duration(700)}>
                <View style={{...styles.circleContainer, width:'60%'}}>
                    <Medicine height={30} width={30}/>
                </View>
                <Text style={styles.circleText}>MY MEDICINES</Text>
            </Animated.View>
        </TouchableOpacity>
        {/* <TouchableOpacity onPress={()=>navigation.navigate('e-pharmacy')}>
            <Animated.View entering={SlideInLeft.duration(700)}>
                <View style={{...styles.circleContainer, width:'65%'}}>
                    <Epharmacy height={30} width={30}/>
                </View>
                <Text style={styles.circleText}>E-PHARMACY</Text>
            </Animated.View>
        </TouchableOpacity> */}
        <TouchableOpacity onPress={()=>{navigation.navigate('doctors-emergency')}}>
            <Animated.View entering={SlideInRight.duration(700)}>
                <View style={{...styles.circleContainer, backgroundColor:'red', width:'70%'}}>
                    <Emergency height={30} width={30}/>
                </View>
                <Text style={styles.circleText}>EMERGENCY</Text>
            </Animated.View>
        </TouchableOpacity>
        </>
        :<View style={{alignItems:'center', marginLeft: utils.deviceWidth <= 375 ? '16%' : "22%"}}>
        <TouchableOpacity onPress={()=>navigation.navigate('doctors-emergency')}>
            <Animated.View entering={SlideInRight.duration(700)}>
                <View style={{...styles.circleContainer, backgroundColor:'red', width:'70%'}}>
                    <Emergency height={30} width={30}/>
                </View>
                <Text style={styles.circleText}>EMERGENCY</Text>
            </Animated.View>
        </TouchableOpacity>
        <Animated.View entering={SlideInRight.duration(700)}>
        <TouchableOpacity style={styles.registerLoginBtn} onPress={()=>navigation.navigate('register-login')}>
                <Text style={{textAlign: 'center', fontSize: 14, color:colors.thirdColor, padding:10}}>Login / Register to use all features </Text>
        </TouchableOpacity>
        <TouchableOpacity style={{...styles.registerLoginBtn, backgroundColor:colors.secondColor, borderColor: colors.secondColor, marginTop: '15%'}} onPress={()=>changeAccountToDoctor()}>
                <Text style={{textAlign: 'center', fontSize: 14, color:colors.thirdColor, padding:10}}>Doctor? Click to continue </Text>
        </TouchableOpacity>
            </Animated.View>
        </View>
        }
         {patientAuthReducer.authToken != "" && !patientAuthReducer.isGuest &&
        <TouchableOpacity style={{width:'100%', display:'flex', alignItems:'flex-end'}} onPress={()=>navigation.navigate('my-info')}>
        <Animated.View entering={SlideInUp.duration(700)}>
            <View style={styles.settingsContainer}>
                <Feather name="settings" size={30} color={colors.thirdColor} />
                <Text style={{color:colors.thirdColor}}>MY INFO</Text>
            </View>
        </Animated.View>
        </TouchableOpacity>
        }
    </CardIconsContainer>
</FixedContainer>
}

const styles = StyleSheet.create({
    cardIndexContainer: {
        backgroundColor: colors.thirdColor,
        height:utils.deviceHeight,
        borderTopLeftRadius: 90
    },
    cardInnerContainer: {
        marginTop:'10%', 
        marginLeft:'5%',
        display:'flex',
        flexDirection:'row',
        justifyContent:'space-around',
        flexWrap:'wrap'
    },
    circleContainer: {
        backgroundColor: colors.mainColor,
        width: '55%',
        borderRadius:35,
        padding:12,
        shadowColor: colors.secondColor,
        shadowOpacity:1,
        shadowOffset: {width: 2, height:2,},
        elevation: 10,
        shadowRadius: 5,
        marginBottom: '8%',
        display:'flex',
        alignSelf:'center',
    },
    circleText: {
        fontSize: Platform.OS == 'ios' ? 12 : 13,
        fontWeight:'bold'
    },
    settingsContainer: {
        backgroundColor:colors.mainColor,
        width:'25.5%',
        display:'flex',
        justifyContent: 'center',
        alignItems:'center',
        marginRight: '5%',
        marginTop: utils.deviceHeight <= 667 ? Platform.OS == 'ios' ? '17.5%' : '8.5%'  : Platform.OS == 'ios' ? '28%' : '32%',
        padding:15,
        borderTopRightRadius: 35,
        borderTopLeftRadius: 35,
    },
    registerLoginBtn: {
        backgroundColor:colors.mainColor, 
        borderRadius:7, 
        borderWidth:1, 
        borderColor: colors.mainColor, 
        marginTop:'25%',
        shadowColor: colors.secondColor,
        shadowOffset: {
            width: 0,
            height: 1
        },
        shadowOpacity: 1,
        shadowRadius: 4,
        elevation: 4
    }
})

export default IndexComponent;