import { NavigationProp } from "@react-navigation/native";
import React, { FC } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import colors from "../../../assets/colors";
import { DoctorType } from "../../../helper/types";
import utils from "../../../helper/utils";


const AppointmentDoctorsListItems: FC<{item: DoctorType, navigation: NavigationProp<any>}> = ({item, navigation}) => {
    return <View style={styles.doctorCardContainer} key={item.doctorId}>
    <View style={styles.imageNameContainer}>
        <View style={styles.imageContainer}>
            <Image source={{uri: `${utils.RAW_BACKEND_URL}/${item.doctorPhoto}`}} style={styles.imageStyle} resizeMode='contain'/>
        </View>
        <View style={styles.nameMajoringContainer}>
            <Text style={styles.nameStyle}>Dr.{item.doctorFullName.split(" ")[0]}</Text>
            <Text style={styles.majoringStyle}>{item.doctorClinic}</Text>
        </View>
    </View>
    <View style={{height:80}}>
        <Text style={{textAlign:'center'}}>{item.doctorBio}</Text>
    </View>
        <TouchableOpacity style={styles.bookButtonContainer} onPress={()=>navigation.navigate("appointment-date", {
            doctorId: item.doctorId,
            doctorFullName: item.doctorFullName,
            acquiredAppointments: item.acquiredAppointments,
            doctorClinic: item.doctorClinic,
            doctorPrice: item.doctorPricePerHour,
            doctorPushToken: item.pushToken
        })}>
            <Text style={{color:colors.thirdColor}}>Book</Text>
            <Text style={{color: colors.thirdColor, fontWeight:'700'}}>{item.doctorPricePerHour}$/hr</Text>
        </TouchableOpacity>
    </View>
}

const styles = StyleSheet.create({
    doctorCardContainer: {
        flex:1,
        flexBasis:'47%',
        backgroundColor: colors.thirdColor,
        borderWidth: 1,
        borderColor: colors.mainColor,
        borderRadius: 7,
        marginRight: '2%',
        marginBottom:'5%',
    },
    imageNameContainer: {
        display:'flex', 
        flexDirection:'row', 
        justifyContent:'space-between', 
        marginTop:10
    },
    imageContainer: {
        width:100, 
        height:80,
    },
    doctorBioContainer: {
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
    },
    imageStyle: {
        width:'60%', 
        height:'60%', 
        borderRadius:200,
    },
    nameMajoringContainer: {
        display:'flex', 
        alignItems:'center',
        marginLeft: '-30%',
        marginVertical:'5%',
        width:'80%',
    },
    nameStyle: {
        textAlign:'center', 
        fontSize:13, 
        fontWeight:'700',
    },
    majoringStyle: {
        fontSize:11, 
        fontWeight:'700', 
        textAlign:'center',
        width:'80%',
        color: colors.mainColor,
    },
    bookButtonContainer: {
        display:'flex', 
        flexDirection:'row', 
        justifyContent:'space-between', 
        alignSelf:'center', 
        backgroundColor:colors.mainColor, 
        width:'90%', 
        padding:'4%', 
        borderRadius:7,
        marginTop:'10%',
        marginBottom:'10%'
    }
})

export default AppointmentDoctorsListItems