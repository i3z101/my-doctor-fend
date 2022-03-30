import { NavigationProp } from "@react-navigation/native";
import React, { FC } from "react";
import FixedContainer from "../reuseable/fixed-container";
import ImageMenu from "../reuseable/image-menu";
import Medicine from "../../../assets/imgs-icon/medicines.svg";
import GeneralInfoText from "../reuseable/general-info-text";
import CardIconsContainer from "../../shared/card-icons-container";
import { useSelector } from "react-redux";
import { FlatList, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import CenteredText from "../../shared/centered-text";
import colors from "../../../assets/colors";
import AddNewIconBtn from "../reuseable/add-new-icon-btn";
import utils from "../../../helper/utils";
import { MedicinesReducer, NavigationWithRoute } from "../../../helper/types";

const MyMedicinesPage: FC<NavigationWithRoute> = ({navigation, route}) => {
    const medicinesReducer: MedicinesReducer = useSelector((state:any)=> state.medicines);
    
    return <FixedContainer>
        <ImageMenu hasBackElement navigation={navigation} Image={Medicine} />
        <CardIconsContainer containerStyle={{marginTop: '20%'}}>
            <View style={{width: '100%'}}>
                <AddNewIconBtn onPress={()=>navigation.navigate('add-medicine', {
                    medicineInfo: null
                })} />
                {medicinesReducer.medicines.length > 0 ? 
                <FlatList
                style={{height: utils.deviceHeight <= 667 ? 300 : Platform.OS == 'ios' ? 400 : 500}}
                data={medicinesReducer.medicines}
                keyExtractor={(item: any)=>item.medicineId}
                renderItem= {({item})=> {
                    return <View style={styles.cardOuterContainer}>
                        <View style={{...styles.rowStyle, marginBottom:5}}>
                            <Text style={styles.fileNameTextStyle}>Medicine Name: {item.medicineName}</Text>
                            <TouchableOpacity onPress={()=>navigation.navigate('add-medicine', {
                                medicineInfo: item
                            })}>
                                <Text style={styles.fileNameTextStyle}>Manage</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{borderWidth:2, borderColor: colors.mainColor, borderRadius:7}}>
                            <View style={{padding:7}}>
                                <View style={{...styles.rowStyle, ...styles.space}}>
                                        <Text>Times/Day: {item.timesPerDay}</Text>
                                    <Text>Every {item.shouldTakeItEvery}hr(s)</Text>
                                    <Text>Number of days: {item.numberOfDays}</Text>
                                </View>
                                {item.listDates.map((dateTime, idx)=> {
                                    return <View style={{...styles.rowStyle, justifyContent:'space-evenly', marginBottom: 4}} key={idx}>
                                    <Text style={{fontWeight:'700', width:'55%', fontSize:12}}>Time {idx + 1}: {item.tabletsPerTime} tablet(s) on {dateTime.day}</Text>
                                    <Text style={{fontWeight:'800', color:colors.mainColor, fontSize: 12}}>At: {dateTime.time} {Number(dateTime.time.split(":")[0]) >= 12 ? "PM" : "AM" }</Text>
                                    {new Date().getTime() > new Date(dateTime.day + " " + dateTime.time).getTime() ? <Text style={{fontSize: 12}}>✅</Text> : <Text style={{fontSize:12}}>⏳</Text>}
                                </View>
                                })}
                            </View>
                        </View>
                    </View>
                }}
            />
                : <CenteredText text="No medicines found" />
                }
            </View>
        </CardIconsContainer>
    </FixedContainer>
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
        marginBottom: '2%'
    },
    fileNameTextStyle: {
        color: colors.mainColor,
        fontWeight:'bold'
    }
})


export default MyMedicinesPage;