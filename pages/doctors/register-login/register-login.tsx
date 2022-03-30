import React, { FC } from "react";
import RegisterLoginDoctorPage from "../../../components/doctors-components/register-login/register-login";
import { NavigationType } from "../../../helper/types";



const RegisterLoginDoctor: FC<NavigationType> = ({navigation}) => {
    return <RegisterLoginDoctorPage navigation={navigation} />
}

export default RegisterLoginDoctor