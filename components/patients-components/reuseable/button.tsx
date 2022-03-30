import React, { FC } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import colors from "../../../assets/colors";


type ButtonType = {
    buttonText: string,
    onPress: ()=> void
    buttonContainerStyle?: any,
    buttonTextStyle?: any
}

const Button: FC<ButtonType> = ({buttonText, onPress, buttonContainerStyle, buttonTextStyle})=> {
    return <View>
            <TouchableOpacity style={{...styles.buttonContainer, ...buttonContainerStyle}} onPress={onPress}>
                <Text style={{...styles.buttonText, ...buttonTextStyle}}>{buttonText}</Text>
            </TouchableOpacity>
        </View>
}

const styles = StyleSheet.create({
    buttonContainer: {
        backgroundColor: colors.thirdColor, 
        padding:'4%', 
        borderWidth:1, 
        borderColor: colors.thirdColor,
        borderRadius: 30, 
        marginRight:'10%'
    },
    buttonText: {
        textAlign:'center', 
        fontWeight:'bold'
    }
})

export default Button;