import React, { FC } from "react";
import { ActivityIndicator } from "react-native";
import colors from "../../assets/colors";


const Spinner: FC<{color?: string, size?: number, style?: any}> = ({color, size, style})=> {
    return <ActivityIndicator color={color || colors.thirdColor} size={size || 22} style={style}/>
} 


export default Spinner;