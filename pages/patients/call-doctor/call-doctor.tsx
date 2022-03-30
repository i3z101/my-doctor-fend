import React, { FC } from "react";
import { StyleSheet, Text, View } from "react-native";
import CallDoctorPage from "../../../components/patients-components/call-doctor/call-doctor";
import { NavigationType } from "../../../helper/types";


const CallDoctor: FC<NavigationType> = ({navigation}) => {  
    return <CallDoctorPage navigation={navigation}/>
}


export default CallDoctor;