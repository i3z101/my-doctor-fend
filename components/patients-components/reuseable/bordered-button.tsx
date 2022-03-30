import React, { FC } from "react";
import { Platform, StyleProp, StyleSheet, Text, TouchableOpacity } from "react-native";
import colors from "../../../assets/colors";
import { BorderedBtnType } from "../../../helper/types";
import utils from "../../../helper/utils";



const BorderedButton: FC<BorderedBtnType> = ({btnText, onPress, btnContainerStyle, btnTextStyle, btnAttribute, children}) => {
    return <TouchableOpacity {...btnAttribute} style={{...styles.btnContainer,...btnContainerStyle}} onPress={onPress} disabled={children ? true : false}>
        {children ?
        children:
        <Text style={{...styles.btnText, ...btnTextStyle}}>{btnText}</Text>
        }
    </TouchableOpacity>
}

const styles = StyleSheet.create({
    btnContainer: {
        marginTop: utils.deviceHeight <= 667 ? Platform.OS == 'ios' ? '10%' : '8%' : '-7%', 
        backgroundColor:colors.mainColor, 
        marginLeft:utils.deviceWidth < 395 ? '-5.5%' : utils.deviceWidth < 500 ? '-10.5%' : '-20.5%' , 
        width:'30%', 
        padding:'5%', 
        borderTopRightRadius: 20, 
        borderBottomRightRadius: 20,
    },
    btnText: {
        color: colors.thirdColor,
        fontWeight: '600',
        textAlign:'center'
    }
})

export default BorderedButton