import { NavigationProp } from "@react-navigation/native";
import React, { FC } from "react";
import { StyleSheet, Text, View } from "react-native";
import { NavigationType } from "../../../helper/types";


const Epharmacy:FC<NavigationType> = ({navigation}) => {    
    return <View style={styles.container}>
        <Text>Epharmacy PAGE</Text>
    </View>
}

const styles = StyleSheet.create({
    container: {
        display:'flex',
        justifyContent:'center',
        alignItems: 'center'
    }
})

export default Epharmacy;