import { NavigationProp, Route } from "@react-navigation/native";
import React, { FC, useEffect } from "react";
import FixedContainer from "../reuseable/fixed-container";
import ImageMenu from "../reuseable/image-menu";
import Appointment from "../../../assets/imgs-icon/book-appointments.svg";
import ConfirmationIcon from "../../../assets/imgs-icon/confirmation-icon.svg";
import CardIconsContainer from "../../shared/card-icons-container";
import { Alert, Platform, StyleSheet, Text, View } from "react-native";
import colors from "../../../assets/colors";
import BorderedButton from "../reuseable/bordered-button";
import ReversedButtons from "../reuseable/reversed-buttons";
import utils from "../../../helper/utils";

const AppointmentConfirmationPage:  FC<{navigation: NavigationProp<any>, route: Route<any>}> = ({navigation, route}) => {
    const {date, time, doctorFullName} = route.params as any;
    useEffect(()=> {
        utils.showAlertMessage("Appointment saved 😎", "We allready set the appointment to your calendar. Please go to call a doctor page to see your upcoming calls with your doctors", [
            {
                style: 'default',
                text: "Ok, Thank you",
                onPress: ()=> navigation.navigate("index")
            }
        ])
    },[])
    return <FixedContainer>
        <ImageMenu Image={Appointment} navigation={navigation} />
        <CardIconsContainer containerStyle={{marginTop:'20%'}}>
           <View style={{marginTop:'-7%', width:'100%'}}>
               <Text style={styles.savedMessage}>Your appointment has been saved</Text>
               <View style={styles.dateTimeMessageContainer}>
                   <Text>Date: </Text>
                   <Text style={styles.dateTimeMessage}>{date}</Text>
               </View>
               <View style={styles.dateTimeMessageContainer}>
                    <Text>Time: </Text>
                    <Text style={styles.dateTimeMessage}>{time}</Text>
               </View>
               <View style={styles.dateTimeMessageContainer}>
                    <Text>Dcotor: </Text>
                    <Text style={styles.dateTimeMessage}>{doctorFullName}</Text>
               </View>
               
               <ConfirmationIcon style={{alignSelf:'center', marginTop: '8%'}} width={85} height={85} />
           </View>
        </CardIconsContainer>
    </FixedContainer>
}


const styles = StyleSheet.create({
    savedMessage: {
        textAlign:'center', 
        marginTop:'5%', 
        fontWeight:'700', 
        fontSize:15
    },
    dateTimeMessageContainer: {
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        marginTop: '8%',
        paddingLeft: '17%',
    },
    dateTimeMessage: {
        color: colors.mainColor,
        fontSize: 17,
        fontWeight: '700',
    },
    btnLeftContainer: {
        marginLeft:'-10%',
        alignItems:'center', 
        marginTop: utils.deviceHeight <= 667 ? '5%' : '15%', 
        width: '40%'
    },
    btnRightContainer: {
        marginRight: utils.deviceWidth < 395 ? '-5%' : '-10%', 
        alignItems: 'center', 
        marginLeft: '25%', 
        backgroundColor: colors.secondColor, 
        marginTop: utils.deviceHeight <= 667 ? '5%' : '15%',
        width:'35%'
    },
})

export default AppointmentConfirmationPage