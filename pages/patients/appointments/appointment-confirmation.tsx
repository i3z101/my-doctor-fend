import { NavigationProp, Route } from "@react-navigation/native";
import React, { FC, useEffect } from "react";
import { BackHandler } from "react-native";
import AppointmentConfirmationPage from "../../../components/patients-components/appointments/appointment-confirmation";

const AppointmentConfirmation: FC<{navigation: NavigationProp<any>, route: Route<any>}> = ({navigation, route}) => {
    // useEffect(()=> {
    //     BackHandler.addEventListener("hardwareBackPress", ()=> true)
    //   }, [])
    return <AppointmentConfirmationPage navigation= {navigation} route={route}/>
}


export default AppointmentConfirmation