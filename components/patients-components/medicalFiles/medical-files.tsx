import { NavigationProp } from "@react-navigation/native";
import React, { FC } from "react";
import { useSelector } from "react-redux";
import FixedContainer from "../reuseable/fixed-container";
import ImageMenu from "../reuseable/image-menu";
import MedicalFile from "../../../assets/imgs-icon/medical-file.svg";
import GeneralInfoText from "../reuseable/general-info-text";
import CardIconsContainer from "../../shared/card-icons-container";
import { FlatList, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AntDesign } from '@expo/vector-icons';
import colors from "../../../assets/colors";
import CenteredText from "../../shared/centered-text";
import AddNewIconBtn from "../reuseable/add-new-icon-btn";
import utils from "../../../helper/utils"; 
import MedicalFileCard from "../../shared/medical-file-card";

const MedicalFilesPage: FC<{navigation: NavigationProp<any>}> = ({navigation}) => {
    const medicalFileReducer = useSelector((state:any)=> state.medicalFiles);
    return <FixedContainer>
        <ImageMenu hasBackElement navigation={navigation} Image={MedicalFile} />
        <CardIconsContainer containerStyle={styles.cardContainerStyle}>
            <View style={{width:'100%'}}>
                <AddNewIconBtn onPress={()=>navigation.navigate('add-medical-file', {
                    medicalFile: null
                })} />
                {medicalFileReducer.medicalFiles.length > 0 ?
                    <MedicalFileCard navigation={navigation}/>
                : <CenteredText text="You don't have a medical file yet. Create one!" />
                }
            </View>
        </CardIconsContainer>
    </FixedContainer>
}


const styles = StyleSheet.create({
    cardContainerStyle: {
        marginTop: '22%',
    },
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

export default MedicalFilesPage;