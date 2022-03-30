import { NavigationAction, NavigationProp, NavigatorScreenParams } from "@react-navigation/native";
import { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import React, { FC, useEffect } from "react";
import { Button, NavigatorIOS, Platform, StyleSheet, Text, View } from "react-native";
import colors from "../../assets/colors";
import IndexComponent from "../../components/doctors-components/index-component";
import { NavigationType } from "../../helper/types";


const Index: FC<NavigationType> = ({navigation}) => {
    return  <IndexComponent navigation={navigation}/>
}

export default Index;