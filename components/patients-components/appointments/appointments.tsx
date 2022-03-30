import { NavigationProp } from "@react-navigation/native";
import React, { FC, Fragment, useCallback, useEffect, useState } from "react";
import FixedContainer from "../reuseable/fixed-container";
import ImageMenu from "../reuseable/image-menu";
import Appointment from "../../../assets/imgs-icon/book-appointments.svg"
import GeneralInfoText from "../reuseable/general-info-text";
import CardIconsContainer from "../../shared/card-icons-container";
import { Alert, FlatList, Image, Platform, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { DoctorType, ClinicType, ResponseType } from "../../../helper/types";
import colors from "../../../assets/colors";
import constantValues from '../../../helper/constantValues.json';
import Button from "../reuseable/button";
import utils from "../../../helper/utils";
import Spinner from "../../shared/spinner";
import axios from "axios";
import appointmentsActions from "../../../store/actions/appointments-actions";
import { useDispatch, useSelector } from "react-redux";
import generalReducer from "../../../store/reducers/general-reducer";
import errorHandler from "../../../helper/error-handler";
import doctorAuthReducer from "../../../store/reducers/doctor-auth-reducer";
import EmptyListMessage from "../reuseable/empty-list-message";
import AppointmentDoctorsListItems from "../reuseable/appointment-doctors-list-items";

const AppointmentPage: FC<{navigation: NavigationProp<any>}> = ({navigation}) => {
    const dispatch = useDispatch();
    const patientAuthReducer = useSelector((state: any)=>state.patientAuth);
    const appointmentsReducer = useSelector((state:any)=> state.appointments);
    const [clinic, setClinic] = useState<string>("ALL");
    const [clinics, setClinics] = useState<ClinicType[]>(constantValues.clinics)
    const [filteredDoctors, setFilteredDoctors] = useState<DoctorType[]>([]);
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
    const [isFetching, setIsFetching] = useState<boolean>(false);

    const changeMajoringFilter = (clinic:string): void => {
        setClinic(clinic);
        if(clinic != "ALL") {
            setFilteredDoctors(appointmentsReducer.doctors.filter((doctor:DoctorType)=>doctor.doctorClinic == clinic));
        }else {
            setFilteredDoctors([]);
        }
    }

    const fetchAllDoctors = useCallback( async (notFirsTime?: boolean): Promise<any>=> {
        try{
            notFirsTime ? setIsRefreshing(true)  : setIsFetching(true);
            const data = await utils.sendRequest("GET", `${utils.BACKEND_URL}/shared/all-data?field=doctors`, {}, {'Authorization': `BEARER ${patientAuthReducer.authToken}`});
            const response: ResponseType = await data.json();
            if(response.statusCode != 200) {
                errorHandler(response.message, response.statusCode)
            }
            dispatch(appointmentsActions.addAllDoctors(response.doctors));
            notFirsTime ? setIsRefreshing(false)  : setIsFetching(false);
        }catch(err:any) {
            notFirsTime ? setIsRefreshing(false)  : setIsFetching(false);
            utils.showAlertMessage("ERROR 😔", err.message)
        }
    }, [appointmentsReducer]) 

    useEffect(()=> {
        if(appointmentsReducer.doctors.length < 1) {
            fetchAllDoctors();
        }
    }, [])

    return <FixedContainer>
        <ImageMenu navigation={navigation} Image={Appointment} hasBackElement />
        <GeneralInfoText mainText={`You have ${appointmentsReducer.appointments.length} appointment(s)`} secondText="You can check it out" hasButton buttonText="manage" buttonFunction={()=>navigation.navigate('call-doctor')} />
            <CardIconsContainer>
                {isFetching ? 
                    <View style={{width:'100%', marginTop: '15%'}}>
                        <Spinner color={colors.mainColor} size={50} />
                        <Text style={{fontWeight:'700', color: colors.mainColor, textAlign:'center'}}>Please wait</Text>
                    </View>
                : <> 
                    <FlatList
                        style={{marginTop:'-5%'}}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        data={clinics}
                        keyExtractor={(item)=>item.id}
                        renderItem={({item})=> {
                            return <View style={{backgroundColor: item.clinic == clinic ? colors.mainColor : colors.secondColor, ...styles.filterBtnContainer}}>
                                <TouchableOpacity style={{padding:15}} onPress={()=>changeMajoringFilter(item.clinic)}>
                                    <Text style={{color: item.clinic == clinic ? colors.thirdColor : colors.thirdColor, ...styles.filterBtnText}}>{item.clinic}</Text>
                                </TouchableOpacity>
                            </View>
                        }}
                        />
                    {Platform.OS == 'ios' ? 
                    <FlatList
                        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={()=>fetchAllDoctors(true)} tintColor={colors.mainColor} />}
                        refreshing={isRefreshing}
                        showsVerticalScrollIndicator={true}
                        contentContainerStyle={{marginTop:'5%'}}
                        style={{height: utils.deviceHeight <= 667 ? 265 : Platform.OS == 'ios' ? 350 : 400, marginTop:'3%'}}
                        numColumns={2}
                        data={clinic != "ALL" ?  filteredDoctors : appointmentsReducer.doctors}
                        keyExtractor={(item)=>item.doctorId}
                        ListEmptyComponent = {<EmptyListMessage message="No available doctors" />}
                        renderItem = {({item})=> {
                            return <AppointmentDoctorsListItems item={item} navigation={navigation} />
                        }}
                    />: <ScrollView
                        showsVerticalScrollIndicator={true}
                        contentContainerStyle={{marginTop:'5%', flexDirection:'row', justifyContent:'space-between', flexWrap:'wrap'}}
                        style={{height: utils.deviceHeight <= 667 ? 265 : 400, marginTop:'5%'}}
                        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={()=>fetchAllDoctors(true)} tintColor={colors.mainColor} />}
                        >
                        {clinic != "ALL" ?  
                            filteredDoctors.length > 0 ? filteredDoctors.map((item)=> {
                                return <AppointmentDoctorsListItems item={item} navigation={navigation} key={item.doctorId}/>
                            }) : <EmptyListMessage message="No availble doctors"/>
                                :appointmentsReducer.doctors.length > 0 ? appointmentsReducer.doctors.map((item: DoctorType)=> {
                                return <AppointmentDoctorsListItems item={item} navigation={navigation} key={item.doctorId}/>
                                })
                                : <EmptyListMessage message="No available doctors" />
                            }
                    </ScrollView>
                    }
                </>
                }
            </CardIconsContainer>
    </FixedContainer>
} 

const styles = StyleSheet.create({
    buttonContainer: {
        backgroundColor: colors.thirdColor, 
        padding:'4%', 
        borderWidth:1, 
        borderColor: colors.thirdColor,
        borderRadius: 30, 
        marginRight:'10%',
    },
    filterBtnContainer: {
        justifyContent:'center', 
        marginHorizontal:15, 
        borderRadius:30
    },
    filterBtnText: {
        textAlign:'center', 
        fontSize:12
    },
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

export default AppointmentPage