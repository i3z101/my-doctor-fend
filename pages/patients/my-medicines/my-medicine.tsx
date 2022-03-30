import { NavigationProp } from "@react-navigation/native";
import React, { FC } from "react";
import { StyleSheet, Text, View } from "react-native";
import MyMedicinesPage from "../../../components/patients-components/my-medicines/my-medicines";
import { NavigationWithRoute } from "../../../helper/types";


const MyMedicine: FC<NavigationWithRoute> = ({navigation, route}) => {    
    return <MyMedicinesPage navigation={navigation} route={route} />
}

export default MyMedicine;