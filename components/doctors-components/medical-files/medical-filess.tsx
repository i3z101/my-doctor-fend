import { NavigationProp } from "@react-navigation/native";
import React, { FC, Fragment, useCallback, useState } from "react";
import VideoCall from "../../../assets/imgs-icon/video-call.svg";
import { useDispatch, useSelector } from "react-redux";
import CardIconsContainer from "../../shared/card-icons-container";
import { FlatList, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
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
import medicalFilesActions from "../../../store/actions/medical-files-actions";
import MedicalFileCard from "../../shared/medical-file-card";

const MedicalFilesPage: FC<{navigation: NavigationProp<any>}> = ({navigation}) => {
    const dispatch = useDispatch();
    const doctorAuthReducer = useSelector((state:any)=>state.doctorAuth)
    const medicalFileReducer = useSelector((state:any)=> state.medicalFiles);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    
    const refreshMedicalFiles = useCallback( async (): Promise<any>=> {
        try{
            setRefreshing(true);
            const data = await utils.sendRequest("GET", `${utils.BACKEND_URL}/shared/all-data?field=medicalFiles`, {}, {'Authorization': `BEARER ${doctorAuthReducer.authToken}`});
            const response: ResponseType = await data.json();
            if(response.statusCode != 200) {
                errorHandler(response.message, response.statusCode);
            }
            dispatch(medicalFilesActions.addAllMedicalFiles(response.medicalFiles));
            setRefreshing(false);
        }catch(err:any) {
            setRefreshing(false);
            utils.showAlertMessage("ERROR 😔", err.message, [{
                text: 'Ok',
                style: 'cancel'
            }])
        }
    }, [medicalFileReducer])

   return <FixedContainer>
        <ImageMenu hasBackElement navigation={navigation} Image={VideoCall} />
        <CardIconsContainer containerStyle={{...styles.cardContainer, alignItems:'center'}}>
            <View style={{width:'100%'}}>
            <TouchableOpacity style={styles.addBtn}>
                <EvilIcons name="refresh" size={42} color="black" onPress={()=>refreshMedicalFiles()} />
            </TouchableOpacity>
            {!refreshing ?
                medicalFileReducer.medicalFiles.length > 0 ?
                <MedicalFileCard navigation={navigation} />
                :<CenteredText text="No medical files yet"/>
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
    cardContainerStyle: {
        marginTop: '22%',
    },
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

export default MedicalFilesPage;