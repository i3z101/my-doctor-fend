import React, { FC } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import MedicalFilesPage from "../../../components/patients-components/medicalFiles/medical-files";
import { NavigationType } from "../../../helper/types";


const MedicalFiles: FC<NavigationType> = ({navigation}) => {    
    return <MedicalFilesPage navigation={navigation} />
}



export default MedicalFiles;