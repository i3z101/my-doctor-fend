import React, { FC } from "react";
import CallPatientPage from "../../../components/doctors-components/appointments/call-patient-screen";
import {NavigationWithRoute } from "../../../helper/types";


const CallPatient: FC<NavigationWithRoute> = ({navigation, route}) => {
    return <CallPatientPage navigation={navigation} route={route} />
}


export default CallPatient;