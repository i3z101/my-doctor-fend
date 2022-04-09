import React, { FC } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import colors from '../../assets/colors'


const ToUpdateText: FC = () => {
    return <View style={styles.contactUsContainer}>
        <Text style={styles.contactUsText}>To Update Your Information, Please Contact <Text style={{color: colors.mainColor, fontWeight:'800'}}>US</Text></Text>
    </View>
}

const styles = StyleSheet.create({
    contactUsContainer: {
        justifyContent: 'center',
        marginTop: '4%',
        alignItems: 'center'
    },
    contactUsText: {
        textAlign: 'center',
        width:'70%',
        fontWeight: '600'
    }
})

export default ToUpdateText