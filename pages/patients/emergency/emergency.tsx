import React, { FC } from "react";
import EmergencyPage from "../../../components/patients-components/emergency/emergency";
import {NavigationWithRoute } from "../../../helper/types";


const Emergency: FC<NavigationWithRoute> = ({navigation, route}) => {
    return <EmergencyPage navigation={navigation} route={route} />
}


export default Emergency;