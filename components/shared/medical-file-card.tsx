import { Platform } from 'expo-modules-core'
import React, { FC } from 'react'
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useSelector } from 'react-redux'
import colors from '../../assets/colors'
import { NavigationType } from '../../helper/types'
import utils from '../../helper/utils'

const MedicalFileCard: FC<NavigationType> = ({navigation}) => {
    const medicalFileReducer = useSelector((state:any)=> state.medicalFiles);
    return <FlatList
        style={{height: utils.deviceHeight <= 667 ? 300 : Platform.OS == 'ios' ? 400 : 500}}
        data={medicalFileReducer.medicalFiles}
        keyExtractor={(item)=>item.fileName}
        renderItem= {({item})=> {
        return <View style={styles.cardOuterContainer}>
            <View style={{...styles.rowStyle, marginBottom:5}}>
                <Text style={styles.fileNameTextStyle}>File Name: {item.fileName}</Text>
                <TouchableOpacity onPress={()=>navigation.navigate('add-medical-file', {
                    medicalFile: item
                })}>
                    <Text style={styles.fileNameTextStyle}>Manage</Text>
                </TouchableOpacity>
            </View>
            <View style={{borderWidth:2, borderColor: colors.mainColor, borderRadius:7}}>
                <View style={{padding:7}}>
                    <View style={{...styles.space}}>
                        <Text style={{width:'100%'}}>Disease: {item.disease}</Text>
                        <Text style={{width:'100%', fontWeight:'700'}}>Dr: {item.doctor.doctorFullName}</Text>
                    </View>
                    <View>
                        <Text style={{width:'100%'}}>Patient: {item.patientName}</Text>
                        <Text style={{width:'100%'}}>Medicine: {item.medicine}</Text>
                    </View>
                </View>
            </View>
        </View>
    }}
/>
}

const styles = StyleSheet.create({
    cardOuterContainer: {
        marginTop: '5%',
    },
    addBtn: {
        display:'flex', 
        justifyContent:'flex-end', 
        alignItems:'flex-end', 
        marginLeft:'80%', 
        marginTop:'-5%', 
        width:'20%'
    },
    rowStyle: {
        flexDirection: 'row',
        justifyContent:'space-between'
    },
    space: {
        marginBottom: '1%'
    },
    fileNameTextStyle: {
        color: colors.mainColor,
        fontWeight:'bold'
    }
})


export default MedicalFileCard