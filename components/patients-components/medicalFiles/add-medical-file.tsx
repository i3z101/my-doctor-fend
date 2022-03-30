import { NavigationProp, RouteProp } from "@react-navigation/native";
import React, { ChangeEvent, FC, useEffect, useRef, useState } from "react";
import FixedContainer from "../reuseable/fixed-container";
import ImageMenu from "../reuseable/image-menu";
import MedicalFile from "../../../assets/imgs-icon/medical-file.svg";
import CardIconsContainer from "../../shared/card-icons-container";
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import colors from "../../../assets/colors";
import ReversedButtons from "../reuseable/reversed-buttons";
import { validateStringOnChange } from "../../../helper/validations";
import { useDispatch, useSelector } from "react-redux";
import medicalFilesActions from "../../../store/actions/medical-files-actions";
import BottomSheet from '@gorhom/bottom-sheet';
import constantValues from '../../../helper/constantValues.json';
import { DoctorType } from "../../../helper/types";
import UnderlinedTextInput from "../reuseable/underlined-text-input";
import utils from "../../../helper/utils";

const AddMedicalFilePage: FC<{navigation: NavigationProp<any>, route: RouteProp<any>}> = ({navigation, route}) => {
    const {medicalFile} = route.params as any;
    //const medicalFileReducer = useSelector((state: any)=>state.medicalFiles);
    const dispatch = useDispatch();
    const [offSet, setOffset] = useState(false);
    const [doctors, setDoctors] = useState<DoctorType[]>(constantValues.doctors);
    const [medicalFileData, setMedicalFileData] = useState({
        diseaseName: {
            value: '',
            validation: ''
        },
        patientName: {
            value: '',
            validation: ''
        },
        medicineName: {
            value: '',
            validation: ''
        },
        clinic: '',
        doctor: {
            doctorId: '',
            doctorName: ''
        }
    })
    const autoFocusPatientName = useRef<any>();
    const autoFocusMedicineName = useRef<any>();
    const clinicModal = useRef<BottomSheet>(null);
    const doctorModal = useRef<BottomSheet>(null);

    useEffect(()=> {
        if(medicalFile != null) {
            setMedicalFileData((prevState)=>({
                ...prevState,
                diseaseName: {
                    value: medicalFile.disease,
                    validation: ''
                },
                patientName: {
                    value: medicalFile.patient,
                    validation:''
                },
                medicineName: {
                    value: medicalFile.medicine,
                    validation: ''
                },
                doctor: medicalFile.doctor,
                clinic: medicalFile.clinic,
            }));
        }
    }, [])

    const onFocus = (): void => {
        setOffset(!offSet)
    }

    const onChangeHandler = (value: string|any, name: string) => {
        switch(name) {
            case "diseaseName":
                validateStringOnChange(value, "Disease name", setMedicalFileData, "diseaseName", true, 3, 10, true, true, false);
                break;
            case "patientName":
                validateStringOnChange(value, "Patient name", setMedicalFileData, "patientName" ,true, 3, 100, true, true, false);
                break;
            case "medicineName":
                validateStringOnChange(value, "Medicine name", setMedicalFileData, "medicineName" ,true, 3, 150, true, false, true, ",");
                break;
            case "clinic":
                setMedicalFileData((prevState)=>({
                    ...prevState,
                    clinic: value
                }));
                setDoctors(constantValues.doctors);
                setDoctors((prevState)=>prevState.filter(doctor=>doctor.doctorClinic == value));
                setMedicalFileData((prevState)=>({
                    ...prevState,
                    doctor: {
                        doctorId: '',
                        doctorName: ''
                    }
                }))
                clinicModal.current?.close();
                return;
            case "doctor":
                setMedicalFileData((prevState)=>({
                    ...prevState,
                    doctor: value
                }))
                doctorModal.current?.close()
            default:
                break;
        }
        setMedicalFileData((prevState: any)=>({
            ...prevState,
            [name]: {
                ...prevState[name],
                value: value
            }
        }))
    }

   const submitHandler = () => {
       const fileName = Math.ceil(Math.random() * 1000000000).toString(20);
       const createdAt = new Date().toDateString();
       if(medicalFile != null) {
           dispatch(medicalFilesActions.updateMedicalFile({
                fileName: medicalFile.fileName,
                disease: medicalFileData.diseaseName.value,
                clinic: medicalFileData.clinic,
                patient: medicalFileData.patientName.value,
                doctor: medicalFileData.doctor,
                medicine: medicalFileData.medicineName.value,
                createdAt: medicalFile.createdAt
           }))
       }else {
           dispatch(medicalFilesActions.addMedicalFile({
                fileName: fileName,
                disease: medicalFileData.diseaseName.value,
                clinic: medicalFileData.clinic,
                patient: medicalFileData.patientName.value,
                doctor: medicalFileData.doctor,
                medicine: medicalFileData.medicineName.value,
                createdAt
           }));
       }
       navigation.goBack();
   }

    return <KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
        <FixedContainer>
            <ImageMenu navigation={navigation} hasBackElement={true} Image={MedicalFile} />
            <CardIconsContainer containerStyle={styles.cardContainerStyle}>
            <TouchableWithoutFeedback onPress={()=>Keyboard.dismiss}>
                <View style={{width:'100%', marginVertical: '-4%'}}>
                    <ScrollView contentContainerStyle={{marginVertical: Platform.OS == 'ios' ? offSet ? '-15%' : 0 : Platform.OS == 'android' ? offSet ? '-18%' : 0 : 0}}>
                        <UnderlinedTextInput placeholder="Disease name*" validationText={medicalFileData.diseaseName.validation} attributes={{
                            value: medicalFileData.diseaseName.value, onChangeText:(value)=>onChangeHandler(value, "diseaseName"),
                            returnKeyType:"next", onSubmitEditing:()=>autoFocusPatientName.current.focus()
                        }} />
                        
                        <UnderlinedTextInput placeholder="Patient name*" validationText={medicalFileData.patientName.validation} refer={autoFocusPatientName} 
                        attributes={{ value:medicalFileData.patientName.value, onChangeText:(value)=>onChangeHandler(value, "patientName"),
                        returnKeyType:"next", onEndEditing:Platform.OS == 'android' ? ()=>onFocus() : ()=>{}, onFocus:Platform.OS == 'android' ? ()=>onFocus() : ()=>{},
                        onSubmitEditing:()=>autoFocusMedicineName.current.focus()}} />
                        
                        <UnderlinedTextInput placeholder="Medicine Name(s) separated by ,*" validationText={medicalFileData.medicineName.validation} refer={autoFocusMedicineName} attributes={{
                             returnKeyType:"next",  value:medicalFileData.medicineName.value, onChangeText:(value)=>onChangeHandler(value, "medicineName"),
                             onEndEditing:()=>onFocus(), onFocus:()=>onFocus()}} />
                        
                        <TouchableOpacity onPress={()=>clinicModal.current?.snapToIndex(1)} style={{...styles.textInput, marginBottom:'5%'}}>
                            <Text style={{color:medicalFileData.clinic.trim() != "" ? colors.secondColor : "#ccc"}}>{medicalFileData.clinic.trim() != "" ? 
                            medicalFileData.clinic : "Choose clinic*"}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity disabled={medicalFileData.clinic.trim() == "" ? true : false} onPress={()=>doctorModal.current?.snapToIndex(1)} style={styles.textInput}>
                            <Text style={{color:medicalFileData.doctor.doctorName.trim() != "" ? colors.secondColor : "#ccc"}}>{medicalFileData.doctor.doctorName.trim() != "" ? 
                            medicalFileData.doctor.doctorName : "Choose doctor*"}</Text>
                        </TouchableOpacity>
                    </ScrollView>
                    <ReversedButtons 
                        btnText= {medicalFile != null ? "Update" : "Confirm"}
                        btnTextTwo="Cancel"
                        btnLeftAttribute={{disabled: medicalFileData.diseaseName.value.length < 1 || medicalFileData.diseaseName.validation.length > 0 || 
                            medicalFileData.patientName.value.length < 1 || medicalFileData.patientName.validation.length > 0 ||
                            medicalFileData.medicineName.value.length < 1 || medicalFileData.medicineName.validation.length > 0 ||
                            medicalFileData.doctor.doctorName.length < 1 ? true : false}}
                        onPressOne={()=>submitHandler()}
                        onPressTwo={()=>navigation.goBack()}
                        btnContainerStyleOne={{...styles.btnLeftContainer, 
                        backgroundColor: medicalFileData.diseaseName.value.length < 1 || medicalFileData.diseaseName.validation.length > 0 || 
                        medicalFileData.patientName.value.length < 1 || medicalFileData.patientName.validation.length > 0 ||
                        medicalFileData.medicineName.value.length < 1 || medicalFileData.medicineName.validation.length > 0 ||
                        medicalFileData.doctor.doctorName.length < 1 ? '#ccc': colors.mainColor}}
                        btnContainerStyleTwo={styles.btnRightContainer}
                    />
                </View>
            </TouchableWithoutFeedback>
            </CardIconsContainer>
        </FixedContainer>
                <BottomSheet snapPoints={{value: ["25%", "65%"]}} ref={clinicModal} index={-1} style={{width:'100%'}} enableContentPanningGesture={false} enableHandlePanningGesture={false}>
                <View style={{flex:1}}>
                    <Text style={{fontWeight:'bold', textAlign:'center'}}>Choose a field</Text>
                <ScrollView style={{marginVertical:'10%'}}>
                    {constantValues.clinics.filter((item)=>item.clinic != "ALL").map((item)=> {
                        return <TouchableOpacity style={styles.bottomSheetCardContainer} key={item.id} onPress={()=>onChangeHandler(item.clinic, "clinic")}>
                            <Text style={styles.bottomSheetCardText}>{item.clinic}</Text>
                        </TouchableOpacity>
                    })}
                </ScrollView>
                </View>
                </BottomSheet>
                <BottomSheet snapPoints={{value: ["25%", "65%"]}} ref={doctorModal} index={-1} style={{width:'100%'}} enableContentPanningGesture={false} enableHandlePanningGesture={false}>
                <View style={{flex:1}}>
                    <Text style={{fontWeight:'bold', textAlign:'center'}}>Choose a field</Text>
                <ScrollView style={{marginVertical:'10%'}}>
                    {doctors.map((item)=> {
                        return <TouchableOpacity style={styles.bottomSheetCardContainer} key={item.doctorId} onPress={()=>onChangeHandler({doctorName: item.doctorFullName, doctorId: item.doctorId}, "doctor")}>
                            <Text style={styles.bottomSheetCardText}>{item.doctorFullName}</Text>
                        </TouchableOpacity>
                    })}
                </ScrollView>
                </View>
                </BottomSheet>
        </KeyboardAvoidingView>
}

const styles = StyleSheet.create({
    cardContainerStyle: {
        marginTop: '22%',
    },
    inputContainer: {
        width: '100%',
        marginBottom: '3%'
    },
    textInput: {
        alignSelf:'center',
        width: '85%',
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
        padding: '1.5%',
        // height: 30
    },
    validationText: {
        paddingLeft:'8%', 
        fontSize:10, 
        color:'tomato'
    },
    btnLeftContainer: {
        marginLeft:'-10%',
        alignItems:'center', 
        marginTop: utils.deviceHeight <= 667 ? Platform.OS == 'ios'? '17%' :'10%' : '30%', 
        width: '40%'
    },
    btnRightContainer: {
        marginRight: utils.deviceWidth < 395 ? '-5%' : utils.deviceWidth < 500 ? '-10%' : '-15%', 
        alignItems: 'center', 
        marginLeft: '40%', 
        backgroundColor: 'tomato', 
        marginTop: utils.deviceHeight <= 667 ? Platform.OS == 'ios'? '17%' :'10%' : '30%',
        width:'35%'
    },
    bottomSheetCardContainer: {
        borderWidth:1, 
        backgroundColor:colors.mainColor, 
        borderColor: colors.mainColor, 
        marginBottom:'5%', 
        padding:'3%', 
        width:'90%', 
        alignSelf:'center',
        borderRadius:7
    },
    bottomSheetCardText: {
        color: colors.thirdColor, 
        fontWeight:'bold', 
        textAlign:'center'
    }
})

export default AddMedicalFilePage