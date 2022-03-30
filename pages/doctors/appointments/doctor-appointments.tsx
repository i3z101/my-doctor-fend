import React, { FC } from "react";
import { StyleSheet, Text, View } from "react-native";
import DoctorAppointmentsPage from "../../../components/doctors-components/appointments/doctor-appointments";
import { NavigationType } from "../../../helper/types";


const DoctorAppointments: FC<NavigationType> = ({navigation}) => {  
    return <DoctorAppointmentsPage navigation={navigation}/>
}


export default DoctorAppointments;