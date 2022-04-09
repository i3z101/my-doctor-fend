import React, { FC } from "react";
import { StyleSheet, Text } from "react-native";
import colors from "../../assets/colors";


const WaitingRoomText: FC<{mainText: string, secondText: string}> = ({mainText, secondText}) => {
    return <>
    <Text style={{...styles.loadingText, marginTop:'55%'}}>{mainText}</Text>
    <Text style={{...styles.loadingText, marginTop: '10%', fontSize:16.5, fontWeight:'bold'}}>{secondText}</Text>
    </>
}

const styles = StyleSheet.create({

    loadingText: {
      fontSize: 20,
      textAlign: 'center',
      color: colors.thirdColor
    }

});


export default WaitingRoomText