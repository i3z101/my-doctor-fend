import { NavigationProp, RouteProp } from "@react-navigation/native";
import React, { FC } from "react";
import AddMedicalFilePage from "../../../components/patients-components/medicalFiles/add-medical-file";


const AddMedicalFile: FC<{navigation: NavigationProp<any>, route: RouteProp<any>}> = ({navigation, route}) => {
    return <AddMedicalFilePage navigation={navigation} route={route}/>
}


export default AddMedicalFile