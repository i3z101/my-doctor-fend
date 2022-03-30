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
import utils from "../../helper/utils";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { doctorAuthActions} from "../../store/actions/auth-actions";
import generalActions from "../../store/actions/general-actions";
import axios from "axios";
import { ResponseType } from "../../helper/types";
import appointmentsActions from "../../store/actions/appointments-actions";
import FixedContainer from "../patients-components/reuseable/fixed-container";
import GeneralInfoText from "../patients-components/reuseable/general-info-text";
import ImageMenu from "../patients-components/reuseable/image-menu";
import errorHandler from "../../helper/error-handler";


const IndexComponent: FC<{navigation:NavigationProp<any>}> = ({navigation})=> {    
    const doctorAuthReducer = useSelector((state:any)=> state.doctorAuth);
    const appointmentsReducer = useSelector((state:any)=> state.appointments);
    const dispatch = useDispatch();

    const findDoctorAuthInfo = async(): Promise<any> => {
        try {
            const doctorAuthInfo = await AsyncStorage.getItem("doctor-auth");
            if(doctorAuthInfo) {
                const convertedObjectInfo = JSON.parse(doctorAuthInfo);
                dispatch(doctorAuthActions.login(convertedObjectInfo));
                return;
            }
            navigation.dispatch(StackActions.replace('register-login'))
        }catch(err: any) {
            utils.showAlertMessage("ERROR 😔", err.message);
        }
    } 

    const fetchAllData = useCallback( async (): Promise<any>=> {
        try{
            const data = await utils.sendRequest("GET", `${utils.BACKEND_URL}/shared/all-data?field=appointments`,{},{'Authorization': `BEARER ${doctorAuthReducer.authToken}`});
            const response: ResponseType = await data.json();
            if(response.statusCode != 200) {
                errorHandler(response.message, response.statusCode);
            }
            dispatch(appointmentsActions.addAllAppointments(response.appointments));
        }catch(err:any) {
            utils.showAlertMessage("ERROR 😔", err.message)
        }
    }, [doctorAuthReducer]) 

    useEffect(()=>{
        if(doctorAuthReducer.authToken == "") {
            findDoctorAuthInfo()
        }
    }, [])

    useEffect(()=> {
        if(appointmentsReducer.appointments.length < 1 && doctorAuthReducer.authToken != "") {
            fetchAllData();
        }
    }, [doctorAuthReducer])

    

    return <FixedContainer>
    <ImageMenu Image={MedicalCare} navigation={navigation} />
    <GeneralInfoText mainText={`Hi ${doctorAuthReducer.doctorFullName}`} secondText="We hope you are well today" />
    <CardIconsContainer>
        <TouchableOpacity style={{marginBottom:'10%'}} onPress={()=>navigation.navigate("doctor-appointments")}>
            <Animated.View entering={FadeInLeft.duration(700)}>
                <View style={styles.circleContainer}>
                    <Appointment height={30} width={30}/>
                </View>
            </Animated.View>
            <Text style={styles.circleText}>APPOINTMENTS</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{marginBottom:'10%'}} onPress={()=>{}}>
            <Animated.View entering={FadeInRight.duration(700)}>
                <View style={styles.circleContainer}>
                    <Folder height={30} width={30}/>
                </View>
                <Text style={styles.circleText}>MEDICAL FILES</Text>
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
        <TouchableOpacity onPress={()=>navigation.navigate('emergency')}>
            <Animated.View entering={SlideInRight.duration(700)}>
                <View style={{...styles.circleContainer, backgroundColor:'red', width:'70%'}}>
                    <Emergency height={30} width={30}/>
                </View>
                <Text style={styles.circleText}>EMERGENCY</Text>
            </Animated.View>
        </TouchableOpacity>
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
        width:'24.5%',
        display:'flex',
        justifyContent: 'center',
        alignItems:'center',
        marginRight: '5%',
        marginVertical: utils.deviceHeight <= 667 ? Platform.OS == 'ios' ? '17.5%' : '10%'  : Platform.OS == 'ios' ? '30%' : '30%',
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