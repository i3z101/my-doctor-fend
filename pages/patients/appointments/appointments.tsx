
import React, { FC } from "react";
import { StyleSheet, Text, View } from "react-native";
import AppointmentPage from "../../../components/patients-components/appointments/appointments";
import { NavigationType } from "../../../helper/types";


const Appointments: FC<NavigationType> = ({navigation}) => {    
    return <AppointmentPage navigation={navigation} />
}


export default Appointments;