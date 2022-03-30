import React, { FC } from "react";
import { StyleSheet, View } from "react-native";
import colors from "../../../assets/colors";

const FixedContainer: FC<{style?: any}> = ({children, style})=> {
    return <View style={{...styles.container, ...style}}>
        {children}
    </View>
}

const styles = StyleSheet.create({
    container: {
        display:'flex',
        flex:1,
        backgroundColor: colors.mainColor
    },
})

export default FixedContainer