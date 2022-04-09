import React, { FC } from "react";
import { FlatList, ScrollView, StyleSheet, Text, View } from "react-native";
import { NavigationType } from "../../../helper/types";
import Profile from '../../../assets/imgs-icon/profile.svg';
import { useSelector } from "react-redux";
import CardIconsContainer from "../../shared/card-icons-container";
import colors from "../../../assets/colors";
import MyInfoData from "../../shared/my-info-data";
import ToUpdateText from "../../shared/to-update-text";
import FixedContainer from "../../patients-components/reuseable/fixed-container";
import ImageMenu from "../../patients-components/reuseable/image-menu";
import GeneralInfoText from "../../patients-components/reuseable/general-info-text";

const MyInfoPage: FC<NavigationType> = ({navigation}) => {
    const doctorAuthReducer = useSelector((state: any) => state.doctorAuth);
    const appointmentsReducer = useSelector((state:any) => state.appointments);
    const medicalFilesReducer = useSelector((state: any) => state.medicalFiles);
    const paidAppointments = appointmentsReducer.appointments.filter((appointment: any) => appointment.bill.status == 'paid');
    const canceledAppointments = appointmentsReducer.appointments.filter((appointment: any) => appointment.bill.status == 'canceled');
    

    return <FixedContainer>
        <ImageMenu Image={Profile} hasBackElement navigation={navigation} />
        <GeneralInfoText mainText={doctorAuthReducer.doctorFullName} secondText="Account Type: Doctor" />
        <CardIconsContainer>
            <View style={{width:'100%'}}>
                <ScrollView>
                    <MyInfoData numOf="Num Of Completed Appointments" num={paidAppointments.length} />
                    <MyInfoData numOf="Num Of Canceled Appointments" num={canceledAppointments.length} />
                    <MyInfoData numOf="Num Of Medical Files" num={medicalFilesReducer.medicalFiles.length} />
                </ScrollView>
                <ToUpdateText />
            </View>
        </CardIconsContainer>
    </FixedContainer>
}



export default MyInfoPage