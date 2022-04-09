import React, { FC } from "react";
import CallScreenPage from "../../../components/patients-components/call-doctor/call-screen";
import {NavigationWithRoute } from "../../../helper/types";


const CallScreen: FC<NavigationWithRoute> = ({navigation, route}) => {
    return <CallScreenPage navigation={navigation} route={route}/>
}


export default CallScreen;