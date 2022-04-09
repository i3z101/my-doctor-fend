import React, { FC } from "react";
import { FlatList, ScrollView, StyleSheet, Text, View } from "react-native";
import { NavigationType } from "../../../helper/types";
import FixedContainer from "../reuseable/fixed-container";
import ImageMenu from "../reuseable/image-menu";
import Profile from '../../../assets/imgs-icon/profile.svg';
import GeneralInfoText from "../reuseable/general-info-text";
import { useSelector } from "react-redux";
import CardIconsContainer from "../../shared/card-icons-container";
import colors from "../../../assets/colors";
import MyInfoData from "../../shared/my-info-data";
import ToUpdateText from "../../shared/to-update-text";

const MyInfoPage: FC<NavigationType> = ({navigation}) => {
    const patientAuthReducer = useSelector((state: any) => state.patientAuth);
    const appointmentsReducer = useSelector((state:any) => state.appointments);
    const medicalFilesReducer = useSelector((state: any) => state.medicalFiles);
    const medicinesReducer = useSelector((state: any) => state.medicines);
    const paidAppointments = appointmentsReducer.appointments.filter((appointment: any) => appointment.bill.status == 'paid');
    const canceledAppointments = appointmentsReducer.appointments.filter((appointment: any) => appointment.bill.status == 'canceled');
    

    return <FixedContainer>
        <ImageMenu Image={Profile} hasBackElement navigation={navigation} />
        <GeneralInfoText mainText={patientAuthReducer.patientName} secondText="Account Type: Patient" />
        <CardIconsContainer>
            <View style={{width:'100%'}}>
                <ScrollView>
                    <MyInfoData numOf="Num Of Completed Appointments" num={paidAppointments.length} />
                    <MyInfoData numOf="Num Of Canceled Appointments" num={canceledAppointments.length} />
                    <MyInfoData numOf="Num Of Medical Files" num={medicalFilesReducer.medicalFiles.length} />
                    <MyInfoData numOf="Num Of Medicines Reminders" num={medicinesReducer.medicines.length} />
                </ScrollView>
                <ToUpdateText />
            </View>
        </CardIconsContainer>
    </FixedContainer>
}



export default MyInfoPage