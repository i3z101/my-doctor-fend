import { NavigationProp, Route } from '@react-navigation/native';
import React, { FC } from 'react';
import AppointmentDatePage from '../../../components/patients-components/appointments/appointment-date';
import { NavigationType } from '../../../helper/types';


const AppointmentDate: FC<{navigation: NavigationProp<any>, route: Route<any>}> = ({navigation, route}) => {
    return <AppointmentDatePage navigation= {navigation} route={route}/>
}

export default AppointmentDate