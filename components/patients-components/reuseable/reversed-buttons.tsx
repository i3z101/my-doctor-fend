import React, { FC } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { BorderedBtnType, BorderedReversedBtnType } from "../../../helper/types";
import BorderedButton from "./bordered-button";

const ReversedButtons: FC<BorderedReversedBtnType> = ({btnText, btnTextTwo, btnTextStyle ,btnContainerStyleOne, btnContainerStyleTwo, btnLeftAttribute, btnRightAttribute, children ,onPressOne, onPressTwo}) => {
    return <View style={{display:'flex', flexDirection:'row', justifyContent:'space-between'}}>
        <BorderedButton children={children} btnAttribute={btnLeftAttribute} btnText={btnText} onPress={onPressOne} btnContainerStyle={{...styles.btnLeft, ...btnContainerStyleOne}} />
        <BorderedButton children={children} btnAttribute={btnRightAttribute} btnText={btnTextTwo} onPress={onPressTwo} btnContainerStyle={{...styles.btnRight, ...btnContainerStyleTwo}} btnTextStyle={{...styles.btnRightText, ...btnTextStyle}}/>
    </View>
}

const styles = StyleSheet.create({
    btnLeft: {
        marginLeft: Platform.OS == 'ios' ? '-30%' : '-35%', 
        width: '50%', 
        justifyContent: 'center',
    },
    btnRight: {
        transform: [
            { 
                rotate: "180deg"
            }
        ],
        width: '40%',
        marginRight: '-25%',
    },
    btnRightText: {
        transform: [
            { 
                rotate: "180deg"
            }
        ]
    }
})

export default ReversedButtons