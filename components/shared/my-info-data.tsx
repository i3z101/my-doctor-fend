import React, { FC } from "react";
import { StyleSheet, Text, View } from "react-native";
import colors from "../../assets/colors";


const MyInfoData: FC<{numOf: string, num: number}> = ({numOf, num}) => {
    return <View style={styles.numContainer}>
        <Text style={styles.numText}>{numOf}</Text>
        <Text style={{...styles.numText, fontWeight: '800'}}>{num}</Text>
    </View>
}


const styles = StyleSheet.create({
    numContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '85%',
        alignSelf: 'center',
        borderBottomWidth: 1,
        paddingBottom: 10,
        marginBottom: '5%'
    },
    numText: {
        fontWeight: '600',
        color: colors.mainColor,
    }
})

export default MyInfoData;