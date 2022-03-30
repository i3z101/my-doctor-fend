import React, { FC } from "react";
import RegisterLoginPage from "../../../components/patients-components/register-login/register-login";
import { NavigationType } from "../../../helper/types";


const RegisterLogin: FC<NavigationType> = ({navigation}) => {
    return <RegisterLoginPage navigation={navigation}/>
}


export default RegisterLogin