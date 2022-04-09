import React, { FC } from "react";
import DoctorEmergencyListPage from "../../../components/patients-components/emergency/doctor-emergency-list";
import {NavigationType} from "../../../helper/types";


const DoctorEmergencyList: FC<NavigationType> = ({navigation}) => {
    return <DoctorEmergencyListPage navigation={navigation} />
}


export default DoctorEmergencyList;