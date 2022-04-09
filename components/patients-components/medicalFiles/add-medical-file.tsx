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
import { DoctorType, ResponseType } from "../../../helper/types";
import UnderlinedTextInput from "../reuseable/underlined-text-input";
import utils from "../../../helper/utils";
import errorHandler from "../../../helper/error-handler";
import generalActions from "../../../store/actions/general-actions";
import Spinner from "../../shared/spinner";
import CustomBottomSheet from "../reuseable/custom-bottom-sheet";
import Button from "../reuseable/button";

const AddMedicalFilePage: FC<{navigation: NavigationProp<any>, route: RouteProp<any>}> = ({navigation, route}) => {
    const {medicalFile} = route.params as any;
    const patientAuthReducer = useSelector((state: any)=>state.patientAuth);
    const generalReducer = useSelector((state: any)=>state.generalReducer);
    const appointmentsReducer = useSelector((state: any)=>state.appointments);
    const dispatch = useDispatch();
    const [offSet, setOffset] = useState(false);
    const [doctors, setDoctors] = useState<DoctorType[]>([]);
    const [medicalFileData, setMedicalFileData] = useState({
        diseaseName: {
            value: '',
            validation: ''
        },
        patientName: {
            value: patientAuthReducer.patientName,
            validation: ''
        },
        medicineName: {
            value: '',
            validation: ''
        },
        clinic: '',
        doctor: {
            doctorId: '',
            doctorFullName: ''
        }
    })
    const [responseHandler, setRsponseHandler ] = useState<ResponseType>({
        message: "",
        statusCode: 0,
        validations: []
    });
    const autoFocusPatientName = useRef<any>();
    const autoFocusMedicineName = useRef<any>();
    const clinicModal = useRef<BottomSheet>(null);
    const doctorModal = useRef<BottomSheet>(null);
    const responseBottomSheet = useRef<BottomSheet>(null);

    useEffect(()=> {
        if(medicalFile != null) {
            setMedicalFileData((prevState)=>({
                ...prevState,
                diseaseName: {
                    value: medicalFile.disease,
                    validation: ''
                },
                patientName: {
                    value: medicalFile.patientName,
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
                validateStringOnChange(value, "Disease name", setMedicalFileData, "diseaseName", true, 3, 100, true, true, false);
                break;
            case "patientName":
                validateStringOnChange(value, "Patient name", setMedicalFileData, "patientName" ,true, 3, 100, true, false, false);
                break;
            case "medicineName":
                validateStringOnChange(value, "Medicine name", setMedicalFileData, "medicineName" ,true, 3, 150, true, false, true, ",");
                break;
            case "clinic":
                setMedicalFileData((prevState)=>({
                    ...prevState,
                    clinic: value
                }));
                setDoctors(appointmentsReducer.doctors.filter((doctor: DoctorType) => doctor.doctorClinic == value));
                setMedicalFileData((prevState)=>({
                    ...prevState,
                    doctor: {
                        doctorId: '',
                        doctorFullName: ''
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

    const updateHandler = async (): Promise<any> => {
        dispatch(generalActions.startSend())
        try {
            const data = await utils.sendRequest('PATCH', `${utils.BACKEND_URL}/patients/medical-files/update-medical-file`, {
                fileName: medicalFile.fileName,
                disease: medicalFileData.diseaseName.value.trim(),
                clinic: medicalFileData.clinic.trim(),
                patientName: medicalFileData.patientName.value.trim(),
                doctor: medicalFileData.doctor.doctorId.trim(),
                medicine: medicalFileData.medicineName.value.trim(),
            }, {'Authorization': `BEARER ${patientAuthReducer.authToken}`})
            const response: ResponseType = await data.json();
            console.log(response);
            if(response.statusCode != 201) {
                errorHandler(response.message, response.statusCode, response.validations ? response.validations : []);
            }
            dispatch(medicalFilesActions.updateMedicalFile({
                fileName: medicalFile.fileName,
                disease: medicalFileData.diseaseName.value,
                clinic: medicalFileData.clinic,
                patientName: medicalFileData.patientName.value,
                doctor: medicalFileData.doctor,
                medicine: medicalFileData.medicineName.value,
            }))
            dispatch(generalActions.endSend())
            utils.showAlertMessage("Medical file updated 😎", response.message, [
                {
                    style: 'default',
                    text: "Ok, Thank you",
                    onPress: ()=> navigation.goBack()
                }
            ])
        }catch(err: any) {
            dispatch(generalActions.endSend())
            setRsponseHandler(err)
            responseBottomSheet.current?.snapToIndex(1)
        }
    }
    
   const submitHandler = async (): Promise<any> => {
       dispatch(generalActions.startSend())
       const fileName = patientAuthReducer.patientId.slice(0, 5) + Math.ceil(Math.random() * 100000).toString(16);
       try{
            const data = await utils.sendRequest('POST', `${utils.BACKEND_URL}/patients/medical-files/add-medical-file`, {
                fileName: fileName,
                disease: medicalFileData.diseaseName.value.trim(),
                clinic: medicalFileData.clinic.trim(),
                patientName: medicalFileData.patientName.value.trim(),
                doctor: medicalFileData.doctor.doctorId.trim(),
                medicine: medicalFileData.medicineName.value.trim(),
            }, {'Authorization': `BEARER ${patientAuthReducer.authToken}`})

            const response: ResponseType = await data.json();
            
            if(response.statusCode != 201) {
                errorHandler(response.message, response.statusCode, response.validations? response.validations : [])
            }
            dispatch(medicalFilesActions.addMedicalFile({
                fileName: fileName,
                disease: medicalFileData.diseaseName.value,
                clinic: medicalFileData.clinic,
                patientName: medicalFileData.patientName.value,
                doctor: medicalFileData.doctor,
                medicine: medicalFileData.medicineName.value,
            }));
            dispatch(generalActions.endSend());
            utils.showAlertMessage("Medical file saved 😎", response.message, [
                {
                    style: 'default',
                    text: "Ok, Thank you",
                    onPress: ()=> navigation.goBack()
                }
            ])
       }catch(err: any){
            dispatch(generalActions.endSend())
            setRsponseHandler(err)
            responseBottomSheet.current?.snapToIndex(1)
       }
       
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
                        {medicalFileData.patientName.validation == "" &&
                        <Text style={{fontSize: 12, color: colors.mainColor, marginTop: '-5%', marginBottom: '5%', paddingLeft: '7%'}}>*If patient name is not you, please change it </Text>
                        }
                        <UnderlinedTextInput placeholder="Medicine Name(s) separated by ,*" validationText={medicalFileData.medicineName.validation} refer={autoFocusMedicineName} attributes={{
                             returnKeyType:"next",  value:medicalFileData.medicineName.value, onChangeText:(value)=>onChangeHandler(value, "medicineName"),
                             onEndEditing:()=>onFocus(), onFocus:()=>onFocus()}} />
                        
                        <TouchableOpacity onPress={()=>clinicModal.current?.snapToIndex(1)} style={{...styles.textInput, marginBottom:'5%'}}>
                            <Text style={{color:medicalFileData.clinic.trim() != "" ? colors.secondColor : "#ccc"}}>{medicalFileData.clinic.trim() != "" ? 
                            medicalFileData.clinic : "Choose clinic*"}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity disabled={medicalFileData.clinic.trim() == "" ? true : doctors.length < 1 ? true : false} onPress={()=>doctorModal.current?.snapToIndex(1)} style={styles.textInput}>
                            <Text style={{color:medicalFileData.doctor.doctorFullName.trim() != "" ? colors.secondColor : "#ccc"}}>{medicalFileData.doctor.doctorFullName.trim() != "" ? 
                            medicalFileData.doctor.doctorFullName: doctors.length < 1 ? "No doctors"  : "Choose doctor*"}</Text>
                        </TouchableOpacity>
                    </ScrollView>
                    <ReversedButtons
                        children ={generalReducer.isSending ? <Spinner  /> : null}
                        btnText= {medicalFile != null ? "Update" : "Confirm"}
                        btnTextTwo="Cancel"
                        btnLeftAttribute={{disabled: generalReducer.isSending ? true : medicalFileData.diseaseName.value.length < 1 || medicalFileData.diseaseName.validation.length > 0 || 
                            medicalFileData.patientName.value.length < 1 || medicalFileData.patientName.validation.length > 0 ||
                            medicalFileData.medicineName.value.length < 1 || medicalFileData.medicineName.validation.length > 0 ||
                            medicalFileData.doctor.doctorFullName.length < 1 ? true : false}}
                        btnRightAttribute= {{disabled: generalReducer.isSending ? true : false}}
                        onPressOne={()=>medicalFile != null ? updateHandler() : submitHandler()}
                        onPressTwo={()=>navigation.goBack()}
                        btnContainerStyleOne={{...styles.btnLeftContainer, 
                        backgroundColor: medicalFileData.diseaseName.value.length < 1 || medicalFileData.diseaseName.validation.length > 0 || 
                        medicalFileData.patientName.value.length < 1 || medicalFileData.patientName.validation.length > 0 ||
                        medicalFileData.medicineName.value.length < 1 || medicalFileData.medicineName.validation.length > 0 ||
                        medicalFileData.doctor.doctorFullName.length < 1 ? '#ccc': colors.mainColor}}
                        btnContainerStyleTwo={styles.btnRightContainer}
                    />
                </View>
            </TouchableWithoutFeedback>
            </CardIconsContainer>
        </FixedContainer>

        <CustomBottomSheet bottomSheetProps={{
            snapPoints: {value: ["25%", "65%"]}, index: -1, enableContentPanningGesture:false, enableHandlePanningGesture:false, children: ""}}
            scrollViewProps={{style: {height:55}}}
            refValue={clinicModal}
            title= ""
            titleStyle={styles.bottomsheetLabel}
            scrollbale={true}>
            <View>
                <Text style={{fontWeight:'bold', textAlign:'center', marginBottom: '2%'}}>Choose a clinic</Text>
                {constantValues.clinics.filter((item)=>item.clinic != "ALL").map((item)=> {
                    return <TouchableOpacity style={styles.bottomSheetCardContainer} key={item.id} onPress={()=>onChangeHandler(item.clinic, "clinic")}>
                        <Text style={styles.bottomSheetCardText}>{item.clinic}</Text>
                    </TouchableOpacity>
                })}
            </View>
            </CustomBottomSheet>

            <CustomBottomSheet bottomSheetProps={{
            snapPoints: {value: ["25%", "65%"]}, index: -1, enableContentPanningGesture:false, enableHandlePanningGesture:false, children: ""}}
            scrollViewProps={{style: {height:55}}}
            refValue={doctorModal}
            title= ""
            titleStyle={styles.bottomsheetLabel}
            scrollbale={true}>
            <View>
                <Text style={{fontWeight:'bold', textAlign:'center', marginBottom: '2%'}}>Choose a doctor</Text>
                {doctors.map((item)=> {
                    return <TouchableOpacity style={styles.bottomSheetCardContainer} key={item.doctorId} onPress={()=>onChangeHandler({doctorFullName: item.doctorFullName, doctorId: item.doctorId}, "doctor")}>
                        <Text style={styles.bottomSheetCardText}>{item.doctorFullName}</Text>
                    </TouchableOpacity>
                })}
            </View>
            </CustomBottomSheet>

        <CustomBottomSheet bottomSheetProps={{
            snapPoints: {value: ["25%", "65%"]}, index: -1, enableContentPanningGesture:false, enableHandlePanningGesture:false, children: ""}}
            scrollViewProps={{style: {height:55}}}
            refValue={responseBottomSheet}
            title= ""
            titleStyle={styles.bottomsheetLabel}
            scrollbale={true}>
           <View>
            <Text style={{textAlign:'center', fontWeight:'600', fontSize:17, color:'tomato'}}>{responseHandler.message}</Text>
            {responseHandler.validations.length > 0 && responseHandler.validations.map((value: string)=> {
                return <Text key={value} style={{fontWeight:'600', fontSize: 13, color: 'tomato', paddingLeft:'3%', marginTop: '5%'}}>#{value}</Text>
            })}
            <Button buttonText="Ok, i will handle that" onPress={()=>responseBottomSheet.current?.close()} buttonContainerStyle={styles.validationBottomSheetBtn} buttonTextStyle={styles.validationBottomSheetBTxt} />
            </View>
        </CustomBottomSheet>
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
    },
    bottomsheetLabel: {
        textAlign:'center', 
        fontSize:17, 
        fontWeight:'600'
    },
    validationBottomSheetBtn: {
        backgroundColor: colors.secondColor,
        width: '50%',
        padding: '2%',
        borderRadius: 8,
        alignSelf: 'center',
        marginLeft: '10%',
        marginTop: '10%'
    },
    validationBottomSheetBTxt: {
        color: colors.thirdColor
    }
})

export default AddMedicalFilePage