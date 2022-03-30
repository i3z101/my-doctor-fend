import React, { FC } from "react";
import { StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import colors from "../../../assets/colors";
import Button from "./button";


type GeneralInfoTextType = {
    mainText: string,
    secondText: string,
    hasButton?: boolean,
    buttonText?: string,
    buttonFunction?: ()=>void
}

const GeneralInfoText: FC<GeneralInfoTextType> = ({mainText, secondText, hasButton, buttonText, buttonFunction}) => {
    return <View style={styles.textContainer}>
    <View style={styles.innerContainer}>
        <View>
            <Text style={{...styles.textStyle, fontWeight:'bold'}}>{mainText}</Text>   
            <Text style={styles.textStyle}>{secondText}</Text>
        </View>
    {hasButton && 
        <Button buttonText="Manage" onPress={buttonFunction ? buttonFunction : ()=> {}}/>
    }
    </View>
</View>
}

const styles = StyleSheet.create({
    textContainer: {
        marginTop: '20%',
        marginBottom:'5%',
        paddingLeft:'10%'
    },
    textStyle: {
        fontSize:15,
        color: colors.thirdColor
    },
    innerContainer: {
        display:'flex', 
        flexDirection:'row', 
        justifyContent:'space-between', 
        alignItems:'center'
    },
})

export default GeneralInfoText;

