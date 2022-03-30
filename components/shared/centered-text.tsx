import React, { FC } from "react";
import { View, Text, StyleSheet } from "react-native";
import utils from "../../helper/utils";


const CenteredText: FC<{text: string}> = ({text}) => {
    return <View style={styles.textContainer}>
        <Text style={{textAlign:'center', fontWeight:'bold'}}>{text}</Text>
    </View>
}

const styles = StyleSheet.create({
    textContainer: {
        display:'flex', 
        flexDirection:'column', 
        justifyContent:'center', 
        alignItems:'center', 
        marginVertical: '50%'
    }
})

export default CenteredText;