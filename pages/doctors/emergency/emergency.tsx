import React, { FC } from "react";
import EmergencyPage from "../../../components/doctors-components/emergency/emergency";
import { NavigationType } from "../../../helper/types";


const Emergency: FC<NavigationType> = ({navigation}) => {
    return <EmergencyPage navigation={navigation} />
}


export default Emergency;