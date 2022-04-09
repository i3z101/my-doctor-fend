import React, { FC } from "react";
import MyInfoPage from "../../../components/doctors-components/my-info/my-info";
import { NavigationType } from "../../../helper/types";


const MyInfo: FC<NavigationType> = ({navigation}) => {
    return <MyInfoPage navigation={navigation} />
}

export default MyInfo