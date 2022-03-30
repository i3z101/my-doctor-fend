import React, { FC } from "react";
import { Text, View } from "react-native";
import colors from "../../../assets/colors";


const EmptyListMessage: FC<{message: string}> = ({message}) => {
    return <View style={{width:'100%', alignItems: 'center', justifyContent: 'center', marginTop: '15%'}}>
    <Text style={{fontWeight:'700', color: colors.mainColor, textAlign:'center'}}>{message}</Text>
</View>
}

export default EmptyListMessage;