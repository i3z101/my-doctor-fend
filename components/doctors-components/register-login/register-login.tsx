import React, { FC, Fragment, useEffect, useRef, useState } from "react";
import colors from "../../../assets/colors";
import { NavigationType, ResponseType } from "../../../helper/types";
import FixedContainer from "../../patients-components/reuseable/fixed-container";
import Form from '../../../assets/imgs-icon/register-login-form.svg';
import Tick from '../../../assets/imgs-icon/tick.svg';
import {Keyboard, KeyboardAvoidingView, Platform, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View, ActivityIndicator} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { patientAuthActions } from "../../../store/actions/auth-actions";
import Animated, { color, SlideInDown, SlideInLeft, SlideInRight, SlideOutLeft, SlideOutRight } from "react-native-reanimated";
import UnderlinedTextInput from "../../patients-components/reuseable/underlined-text-input";
import {validatePhoneOnChange, validateStringOnChange, validateEmailOnChange, validateNumericOnChange } from "../../../helper/validations";
import utils from "../../../helper/utils";
import axios from "axios";
import errorHandler from "../../../helper/error-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BottomSheet from '@gorhom/bottom-sheet';
import CustomBottomSheet from "../../patients-components/reuseable/custom-bottom-sheet";
import Button from "../../patients-components/reuseable/button"
import { ScrollView, TextInput } from "react-native-gesture-handler";
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import constantValues from '../../../helper/constantValues.json';
import generalActions from "../../../store/actions/general-actions";
import Spinner from "../../shared/spinner";
import { StackActions } from "@react-navigation/native";

const RegisterLoginPage: FC<NavigationType> = ({navigation}) => {
    const dispatch = useDispatch();
    const generalReducer = useSelector((state: any)=> state.generalReducer);
    const [steps, setSteps] = useState(-1);
    const [lastStep, setLastStep] = useState(-2);
    const [focused, setFocuesd]= useState<boolean>(false);
    const [uploadOptions, setUploadOptions]= useState<boolean>(false);
    const [uploadField, setUploadField]= useState<string>('');
    const [formValue, setFormValue] = useState<{
        [key: string]: any
    }>({
        doctorPhone: {
            validation: " ",
            value: ""
        },
        doctorFullName: {
            validation: " ",
            value: ""
        },
        doctorEmail: {
            validation: " ",
            value: ""
        },
        doctorPricePerHour: {
            validation: " ",
            value: ""
        },
        doctorClinic: "",
        doctorGraduatedFrom: {
            validation: " ",
            value: ""
        },
        doctorCertificate: {
            validation: " ",
            value: {}
        },
        doctorPhoto: {
            validation: " ",
            value: {}
        }
    })
    
    const [code, setCode] = useState<string[]>([]);
    const [patientFormRequest, setPatientFormRequest] = useState<any>({});
    const [responseHandler, setRsponseHandler ] = useState<ResponseType>({
        message: "",
        statusCode: 0,
        validations: []
    });
    
    const clinicBottomSheet = useRef<BottomSheet>(null);
    const responseBottomSheet = useRef<BottomSheet>(null);

    const autoFocusField2 = useRef<any>();
    const autoFocusField3 = useRef<any>();
    const autoFocusField4 = useRef<any>();
    const autoFocusField5 = useRef<any>();
    const autoFocusField6 = useRef<any>();


    const onChangeHandler = (value: string, name: string, codeIndex?: number, isLogin?: boolean): void => {
        switch(name) {
            case "doctorFullName":
                validateStringOnChange(value, "Doctor full name", setFormValue, "doctorFullName", true, 3, 100, true, false, false);
                break;
            case "doctorGraduatedFrom":
                validateStringOnChange(value, "Doctor graduation university", setFormValue, "doctorGraduatedFrom", true, 4, 100, true, false, false);
                break;
            case "doctorPhone":
                validatePhoneOnChange(value, setFormValue, "doctorPhone", true);
                break;
            case "doctorEmail":
                validateEmailOnChange(value, setFormValue, "doctorEmail", false);
                break;
            case "doctorPricePerHour":
                validateNumericOnChange(value, "Doctor price", 5, setFormValue, "doctorPricePerHour", true);
                break;
            case "clinic":
                setFormValue((prevState: any)=>({
                    ...prevState,
                   doctorClinic: value
                }));
                clinicBottomSheet.current?.close();
                return;
            case "code":
                if(codeIndex) {
                    const codeCopy = [...code];
                    codeCopy[codeIndex] = value;
                    clinicBottomSheet.current?.close();
                    responseBottomSheet.current?.close();
                    setCode(codeCopy);
                    if(codeCopy.length > 6) {
                        Keyboard.dismiss();
                        if(isLogin) {
                            verifyCodeAndLogin(codeCopy.join(""))
                        }else{
                            verifyCodeAndRegister(codeCopy.join(""));
                        }
                    }
                    return;
                }
                break;
        }
        setFormValue((prevState: any)=>({
            ...prevState,
            [name]: {
                ...prevState[name],
                value
            }
        }))
        responseBottomSheet.current?.close();
    }

    const submitHandlerRegister = async(): Promise<any> => {
        dispatch(generalActions.startSend());
        Keyboard.dismiss();
        const form = new FormData();
        form.append("doctorPhone", formValue.doctorPhone.value.trimEnd())
        form.append("doctorFullName", formValue.doctorFullName.value.trimEnd())
        form.append("doctorGraduatedFrom", formValue.doctorGraduatedFrom.value.trimEnd())
        form.append("doctorEmail", formValue.doctorEmail.value.trimEnd())
        form.append("doctorPricePerHour", formValue.doctorPricePerHour.value.trimEnd())
        form.append("doctorClinic", formValue.doctorClinic.trimEnd())
        form.append("doctorCertificate",  formValue.doctorCertificate.value)
        form.append("doctorPhoto", formValue.doctorPhoto.value);
        try {
            const data = await utils.sendRequest("POSTFILE",`${utils.BACKEND_URL}/doctors/send-sms-code-registration`, form);
            const response: ResponseType = await data.json();
            if(response.statusCode != 200) {
                errorHandler(response.message, response.statusCode, response.validations);
            }
            setSteps(4);
            setLastStep(3);
        }catch(err: any) {
            dispatch(generalActions.endSend());
            responseBottomSheet.current?.snapToIndex(1);
            return;
        }
        
    }
    
    const verifyCodeAndRegister = async(codeNum:string): Promise<any> => {
        dispatch(generalActions.endSend())
        const form = new FormData();
        form.append("doctorPhone", formValue.doctorPhone.value.trimEnd())
        form.append("doctorFullName", formValue.doctorFullName.value.trimEnd())
        form.append("doctorGraduatedFrom", formValue.doctorGraduatedFrom.value.trimEnd())
        form.append("doctorEmail", formValue.doctorEmail.value.trimEnd())
        form.append("doctorPricePerHour", formValue.doctorPricePerHour.value.trimEnd())
        form.append("doctorClinic", formValue.doctorClinic.trimEnd())
        form.append("doctorCertificate",  formValue.doctorCertificate.value)
        form.append("doctorPhoto", formValue.doctorPhoto.value);
        form.append("code", codeNum)
        try{
            const data = await utils.sendRequest("POSTFILE",`${utils.BACKEND_URL}/doctors/register`, form);
            const response = await data.json();
            if(response.statusCode != 201) {
                errorHandler(response.message, response.statusCode, response.validations);
            }
            
            await AsyncStorage.setItem("doctor-auth", JSON.stringify(response.doctor));
            dispatch(patientAuthActions.register(response.doctor));
            setRsponseHandler(response);
            responseBottomSheet.current?.snapToIndex(1);
            setTimeout(()=> {
                responseBottomSheet.current?.close();
                navigation.dispatch(StackActions.replace('index'))
            }, 1200)
            
        }catch(err:any){
            setRsponseHandler(err);
            responseBottomSheet.current?.snapToIndex(1);
            return;
        }
    }

    const submitHandlerLogin = async(): Promise<any> => {
        dispatch(generalActions.startSend());
        try {
            const data = await utils.sendRequest("POST",`${utils.BACKEND_URL}/doctors/send-sms-code-login`,{doctorPhone: formValue.doctorPhone.value});
            const response: ResponseType = await data.json();
            if(response.statusCode != 200) {
                errorHandler(response.message, response.statusCode, response.validations);
                return;
            }
            setSteps(4);
            setLastStep(0);
        }catch(err: any) {
            dispatch(generalActions.endSend());
            setRsponseHandler(err);
            responseBottomSheet.current?.snapToIndex(1);
            return;
        }
    }

    const verifyCodeAndLogin = async(codeNum:string): Promise<any> => {
        try{
            dispatch(generalActions.endSend());
            const data = await utils.sendRequest("POST", `${utils.BACKEND_URL}/doctors/login`,{doctorPhone: formValue.doctorPhone.value.trimEnd() ,code: codeNum});
            const response: ResponseType = await data.json();
            if(response.statusCode != 200) {
                errorHandler(response.message, response.statusCode, response.validations);
                return;
            }
            if(response.statusCode != 200) {
                errorHandler(response.message, response.statusCode, response.validations);
            }
            
            await AsyncStorage.setItem("doctor-auth", JSON.stringify(response.doctor));
            dispatch(patientAuthActions.register(response.doctor));
            setRsponseHandler(response);
            responseBottomSheet.current?.snapToIndex(1);
            
            setTimeout(()=> {
                responseBottomSheet.current?.close();
                navigation.dispatch(StackActions.replace('index'))
            }, 1200)
            
        }catch(err:any){
            setRsponseHandler(err);
            responseBottomSheet.current?.snapToIndex(1);
            return;
        }
    }

    const sendCodeAgain = async(): Promise<any> => {
        try {
            await utils.sendRequest("POST", `${utils.BACKEND_URL}/shared/send-sms-code-again`, {phone: formValue.patientPhone.value.trim()})
        }catch(err:any) {
            setRsponseHandler(err);
            responseBottomSheet.current?.snapToIndex(1);
            return;
        }
    }

    const uploadDoc = async (cert?: boolean): Promise<any> => {
        if(uploadField == "doctorCertificate") {
            if(cert) {
                const data = await DocumentPicker.getDocumentAsync({type:["image/*", "application/pdf"]});
                if(data.type != "cancel") {
                    if(uploadField == "doctorCertificate"){
                        setFormValue((prevState)=> ({
                            ...prevState,
                            doctorCertificate: {
                                ...prevState.doctorCertificate,
                                validation: "",
                                value: {
                                    uri: Platform.OS === 'ios' ? 
                                    data.uri.replace('file://', '')
                                    : data.uri,
                                    name: `my_certificate.${data.uri.split(".").slice(-1).join("")}`,
                                    type: data.mimeType
                                }
                            }
                        }))
                    }
                }
            }else {
                const data: any = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    presentationStyle: ImagePicker.UIImagePickerPresentationStyle.FullScreen,
                    quality: 0,
                })
                if(!data.cancelled) { 
                    setFormValue((prevState)=> ({
                        ...prevState,
                        doctorCertificate: {
                            ...prevState.doctorCertificate,
                            validation: "",
                            value: {
                                uri: Platform.OS === 'ios' ? 
                                data.uri.replace('file://', '')
                                : data.uri,
                                name: `my_certificate.${data.uri.split(".").slice(-1).join("")}`,
                                type: data.mimeType
                            }
                        }
                    }))
                }
            }
            setUploadOptions(false);
            return;
        }
        if(cert) {
            const data = await DocumentPicker.getDocumentAsync({type:["image/*", "application/pdf"]});
            if(data.type != "cancel") {
                    setFormValue((prevState)=> ({
                        ...prevState,
                        doctorPhoto: {
                            ...prevState.doctorPhoto,
                            validation: "",
                            value: {
                                uri: Platform.OS === 'ios' ? 
                                data.uri.replace('file://', '')
                                : data.uri,
                                name: `my_photo.${data.uri.split(".").slice(-1).join("")}`,
                                type: data.mimeType
                            }
                        }
                    }))
            }
        }else {
            const data: any = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                presentationStyle: ImagePicker.UIImagePickerPresentationStyle.FullScreen,
                quality: 0,
            })
            if(!data.cancelled) { 
                setFormValue((prevState)=> ({
                    ...prevState,
                    doctorPhoto: {
                        ...prevState.doctorPhoto,
                        validation: "",
                        value: {
                            uri: Platform.OS === 'ios' ? 
                            data.uri.replace('file://', '')
                            : data.uri,
                            name: `my_photo.${data.uri.split(".").slice(-1).join("")}`,
                            type: data.mimeType
                        }
                    }
                }))
            }
        }
        setUploadOptions(false);
    }    
    

    const changeAccountType = async () => {
        await AsyncStorage.setItem("accountType", "patient");
        dispatch(generalActions.changeAccountTypeToPatient());
    }
   
    
    return <TouchableWithoutFeedback onPress={()=>Keyboard.dismiss()}> 
    <KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
        <FixedContainer style={styles.fixedContainer}>
        <Animated.View entering={SlideInRight.duration(700)}>
        <Form width={utils.deviceHeight <= 667 ? 200 : 270} height={utils.deviceHeight <= 667 ? 200 : 270} style={styles.formImage} />
        <View style={styles.innerContainer}>
            <Text style = {styles.textStyle}>
                HI DOCTOR, MAY WE GET
            </Text>
            <Text style={{...styles.textStyle, color: colors.mainColor, fontWeight:'bold'}}>
                SOME INFORMATION FROM YOU ?
            </Text>
        </View>
        {steps != 4 ?
        <View style={styles.formContiner}>
        {steps == -1 &&
        <View>
            <View style={{flexDirection:'row', justifyContent: 'space-evenly'}}>
            <TouchableOpacity style={{...styles.nextSubmitBtn, backgroundColor: colors.secondColor, borderColor: colors.secondColor}} testID="login-choice-btn" onPress={()=>setSteps(0)}>
                <Text style={styles.nextSubmitBtnText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.nextSubmitBtn} onPress={()=>setSteps(1)}>
                <Text style={styles.nextSubmitBtnText}>Register</Text>
            </TouchableOpacity>
            </View>
            <TouchableOpacity style={{...styles.nextSubmitBtn, width:'55%', marginTop:'10%', backgroundColor: colors.thirdColor, borderColor: colors.thirdColor}} onPress={()=>changeAccountType()}>
                <Text style={{...styles.nextSubmitBtnText, color:colors.mainColor}}>Click to continue as a patient</Text>
            </TouchableOpacity>
        </View>
        }
        {steps > -1 &&
            <Animated.View entering={SlideInRight.duration(700)} exiting={SlideOutRight.duration(100)}>
            <ScrollView style={{height: steps == 0 ? 50 : focused ? 100 : utils.deviceHeight <= 667 ? 250 : Platform.OS == 'ios' ? 250 : 300}}>
            <UnderlinedTextInput placeholder="*Doctor phone without +" validationText={formValue.doctorPhone.validation}
                attributes={{ value:formValue.doctorPhone.value, onChangeText:(value)=>onChangeHandler(value, "doctorPhone"),
                onFocus: ()=>setFocuesd(true), onEndEditing: ()=> setFocuesd(false),
                returnKeyType:"default", maxLength:12, keyboardType:'phone-pad', enablesReturnKeyAutomatically:true}} />
            {steps > 0 &&
            <Fragment>
                <UnderlinedTextInput placeholder="*Doctor full name" validationText={formValue.doctorFullName.validation}
                attributes={{ value:formValue.doctorFullName.value, onChangeText:(value)=>onChangeHandler(value, "doctorFullName"),
                autoCapitalize:'words', onFocus: ()=>setFocuesd(true), onEndEditing: ()=> setFocuesd(false),
                }} />
                <UnderlinedTextInput placeholder="*Doctor email" validationText={formValue.doctorEmail.validation}
                attributes={{ value:formValue.doctorEmail.value, autoCapitalize:'none', onChangeText:(value)=>onChangeHandler(value, "doctorEmail"), keyboardType: 'email-address',
                onFocus: ()=>setFocuesd(true), onEndEditing: ()=> setFocuesd(false),
                }} />
                <UnderlinedTextInput placeholder="*Doctor graduation university" validationText={formValue.doctorGraduatedFrom.validation}
                attributes={{autoCapitalize:'words', value:formValue.doctorGraduatedFrom.value, onChangeText:(value)=>onChangeHandler(value, "doctorGraduatedFrom"),
                onFocus: ()=>setFocuesd(true), onEndEditing: ()=> setFocuesd(false),
                }} />
                <UnderlinedTextInput placeholder="*Doctor price per hour" validationText={formValue.doctorPricePerHour.validation}
                attributes={{ value:formValue.doctorPricePerHour.value, onChangeText:(value)=>onChangeHandler(value, "doctorPricePerHour"), keyboardType: 'numeric',
                onFocus: ()=>setFocuesd(true), onEndEditing: ()=> setFocuesd(false),
                }} />
                <TouchableOpacity style={{marginBottom: '5%'}} onPress={()=>clinicBottomSheet.current?.snapToIndex(1)}>
                    <Text style={{textAlign: 'center', fontWeight: '600'}}>{formValue.doctorClinic.length > 0 ? formValue.doctorClinic : "Choose your clinic" }</Text>
                </TouchableOpacity>
                <View style={{flexDirection:'row', justifyContent:'space-around', marginBottom: "15%", marginLeft: '4%'}}>
                    <View>
                        <Button buttonText="*Upload your certificate" onPress={()=>{
                            setUploadOptions(true)
                            setUploadField('doctorCertificate')
                            }} buttonContainerStyle={styles.btnUploadsContainer} buttonTextStyle={{color:colors.mainColor}}/>
                        <Text style={{textAlign:'center'}}>{formValue.doctorCertificate.value.name}</Text>
                    </View>
                    <View>
                        <Button buttonText="*Upload your photo" onPress={()=>{
                            setUploadOptions(true)
                            setUploadField('doctorPhoto')
                            }} buttonContainerStyle={{...styles.btnUploadsContainer, borderColor:colors.secondColor}} buttonTextStyle={{color:colors.secondColor}}/>
                        <Text style={{textAlign:'center'}}>{formValue.doctorPhoto.value.name}</Text>
                    </View>
                </View>
                {uploadOptions &&
                    <Animated.View  entering={SlideInLeft.duration(300)} style={{marginTop: '-30%', width:'100%', backgroundColor: colors.thirdColor}}>
                        <Button buttonText="Upload from files" onPress={()=>uploadDoc(true)} buttonContainerStyle={styles.uploadFromFilesBtn} buttonTextStyle={{color: colors.secondColor}} />
                        <Button buttonText="Upload from images" onPress={()=>uploadDoc()} buttonContainerStyle={styles.uploadFromImagesBtn} buttonTextStyle={{color: colors.mainColor}}/>
                    </Animated.View>
                }
            </Fragment>
            }
            </ScrollView>
            </Animated.View>
        }
        {steps > -1 &&
        <View style={{flexDirection:'row', justifyContent: 'space-evenly'}}>
        <TouchableOpacity style={{...styles.nextSubmitBtn, backgroundColor: colors.secondColor, borderColor: colors.secondColor}} onPress={steps == 0 ? ()=>setSteps(1) : ()=>setSteps(0)}>
            <Text style={styles.nextSubmitBtnText}>{steps == 0 ? "Register" : "Login"}</Text>
        </TouchableOpacity>
        <TouchableOpacity disabled={generalReducer.isSending ? true : steps == 0 ? formValue.doctorPhone.validation != "" ? true : false :
        formValue.doctorPhone.validation != "" || formValue.doctorFullName.validation != "" || formValue.doctorGraduatedFrom.validation !== "" ||
        formValue.doctorEmail.validation != "" || formValue.doctorClinic == "" || formValue.doctorPricePerHour.validation != "" ||
        formValue.doctorPhoto.validation != "" || formValue.doctorCertificate.validation != "" ? true : false} 
        style={{...styles.nextSubmitBtn, backgroundColor: steps == 0 ? formValue.doctorPhone.validation != "" ? '#ccc' : colors.mainColor : 
        formValue.doctorPhone.validation != "" || formValue.doctorFullName.validation != "" || formValue.doctorGraduatedFrom.validation !== ""  || 
        formValue.doctorEmail.validation != "" || formValue.doctorClinic == "" || formValue.doctorPricePerHour.validation != "" ||
        formValue.doctorPhoto.validation != "" || formValue.doctorCertificate.validation != "" ? '#ccc' : colors.mainColor,
        borderColor: steps == 0 ? formValue.doctorPhone.validation != "" ? '#ccc' : colors.mainColor : 
        formValue.doctorPhone.validation != "" || formValue.doctorFullName.validation != "" || formValue.doctorGraduatedFrom.validation !== "" || 
        formValue.doctorEmail.validation != "" || formValue.doctorClinic == "" || formValue.doctorPricePerHour.validation != "" ||
        formValue.doctorPhoto.validation != "" || formValue.doctorCertificate.validation != "" ? '#ccc' : colors.mainColor
        }} onPress={steps == 0 ? ()=> submitHandlerLogin() :  ()=> submitHandlerRegister()}>
            {generalReducer.isSending ?
            <Spinner />
            :
            <Text style={styles.nextSubmitBtnText}>{steps == 0 ? "Login" : "Register" }</Text>
            }
        </TouchableOpacity>
        </View>
        }
        </View>
        :<View>
        <View style={styles.codeForm}>
             <UnderlinedTextInput placeholder="" validationText={""}
                    attributes={{ value:code[1], onChangeText:(value)=>onChangeHandler(value, "code", 1),
                    returnKeyType:"default", maxLength:1, keyboardType:'phone-pad', onKeyPress:()=>autoFocusField2.current.focus(), style: styles.codeInput}} />
             <UnderlinedTextInput refer={autoFocusField2} placeholder="" validationText={""}
                    attributes={{ value:code[2], onChangeText:(value)=>onChangeHandler(value, "code", 2),
                    returnKeyType:"default", maxLength:1, keyboardType:'phone-pad', onKeyPress:()=>autoFocusField3.current.focus(), style: styles.codeInput}} />
             <UnderlinedTextInput refer={autoFocusField3} placeholder="" validationText={""}
                    attributes={{ value:code[3], onChangeText:(value)=>onChangeHandler(value, "code", 3),
                    returnKeyType:"default", maxLength:1, keyboardType:'phone-pad', onKeyPress:()=>autoFocusField4.current.focus(), style: styles.codeInput}} />
             <UnderlinedTextInput refer={autoFocusField4} placeholder="" validationText={""}
                    attributes={{ value:code[4], onChangeText:(value)=>onChangeHandler(value, "code", 4),
                    returnKeyType:"default", maxLength:1, keyboardType:'phone-pad', onKeyPress:()=>autoFocusField5.current.focus(), style: styles.codeInput}} />
             <UnderlinedTextInput refer={autoFocusField5} placeholder="" validationText={""}
                    attributes={{ value:code[5], onChangeText:(value)=>onChangeHandler(value, "code", 5),
                    returnKeyType:"default", maxLength:1, keyboardType:'phone-pad', onKeyPress:()=>autoFocusField6.current.focus(), style: styles.codeInput}} />
             <UnderlinedTextInput refer={autoFocusField6} placeholder="" validationText={""}
                    attributes={{ value:code[6], onChangeText:(value)=>onChangeHandler(value, "code", 6, lastStep == 0 ? true : false),
                    returnKeyType:"default", maxLength:1, keyboardType:'phone-pad', style: styles.codeInput}} />
        </View>
        <TouchableOpacity style={{marginTop:'10%', backgroundColor: colors.thirdColor, borderColor: colors.thirdColor}} onPress={()=>sendCodeAgain()}>
            <Text style={{textAlign:'center', marginTop: '4%', fontWeight:'500'}}>I did not receive code ? <Text style={{ color: colors.mainColor, fontWeight:'700'}}> send again </Text></Text>
        </TouchableOpacity>
        </View>
        }
        </Animated.View>
    </FixedContainer>
    <CustomBottomSheet bottomSheetProps={{
        snapPoints: {value: ["25%", "65%"]}, index: -1, enableContentPanningGesture:false, enableHandlePanningGesture:false, children: ""}}
        scrollViewProps={{style: {height:55}}}
        refValue={responseBottomSheet}
        title= ""
        titleStyle={styles.bottomsheetLabel}
        scrollbale={true}>
        {responseHandler.statusCode == 200 || responseHandler.statusCode == 201 ? 
        <View style={{alignSelf:'center'}}>
            <Tick style={{marginLeft: '0%', marginTop:'5%'}} width={130} height={130} />
            <Text style={{color: colors.mainColor, textAlign:'center' ,fontWeight:'800', fontSize: 15, marginTop:'10%'}}>{responseHandler.message}</Text>
        </View>
        : <View>
            <Text style={{textAlign:'center', fontWeight:'600', fontSize:17, color:'tomato'}}>{responseHandler.message}</Text>
            {responseHandler.validations.length > 0 && responseHandler.validations.map((value: string)=> {
                return <Text key={value} style={{fontWeight:'600', fontSize: 13, color: 'tomato', paddingLeft:'3%', marginTop: '5%'}}>#{value}</Text>
            })}
            <Button buttonText="Ok, i will handle that" onPress={()=>responseBottomSheet.current?.close()} buttonContainerStyle={styles.validationBottomSheetBtn} buttonTextStyle={styles.validationBottomSheetBTxt} />
        </View>
        }
    </CustomBottomSheet>
    <CustomBottomSheet bottomSheetProps={{
        snapPoints: {value: ["25%", "65%"]}, index: -1, enableContentPanningGesture:false, enableHandlePanningGesture:false, children: ""}}
        scrollViewProps={{style: {height:55}}}
        refValue={clinicBottomSheet}
        title= ""
        titleStyle={styles.bottomsheetLabel}
        scrollbale={true}>
        {constantValues.clinics.filter((value)=>value.clinic != "ALL").map((item)=> {
            return <TouchableOpacity style={styles.bottomSheetCardContainer} key={item.id} onPress={()=>onChangeHandler(item.clinic, "clinic")}>
                <Text style={styles.bottomSheetCardText}>{item.clinic}</Text>
            </TouchableOpacity>
        })}
    </CustomBottomSheet>
    </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
}

const styles = StyleSheet.create({
    fixedContainer: {
        backgroundColor: colors.thirdColor
    },
    formImage: {
        alignSelf:'center',
        marginTop: Platform.OS == 'android' && utils.deviceHeight > 667 ? '10%' : 0
    },
    innerContainer: {
        marginTop: '0%'
    },
    textStyle: {
        paddingLeft: '5%',
        fontSize: 19,
        fontStyle:'italic'
    },
    formContiner: {
        marginTop: utils.deviceHeight <= 640 ? '0%' : '10%'
    },
    nextSubmitBtn: {
        width: '30%',
        alignSelf: 'center',
        marginTop:'4%',
        backgroundColor: colors.mainColor,
        borderWidth: 1,
        borderColor: colors.mainColor,
        borderRadius: 8,
        shadowColor: colors.secondColor,
        shadowOffset: {
            width: 0,
            height: 1
        },
        shadowOpacity: 1,
        shadowRadius: 3,
        elevation: 3
    },
    nextSubmitBtnText: {
        color: colors.thirdColor,
        fontWeight: '500',
        padding: 4,
        textAlign: 'center'
    },
    codeForm: {
        flexDirection:'row',
        justifyContent: 'space-evenly',
        alignSelf: 'center',
        marginLeft: '38%',
        marginTop: utils.deviceHeight <= 640 ? '4%' : '10%',
        width: '50%'
    },
    codeInput: {
        width: '20%',
        borderBottomWidth:2,
        borderBottomColor: colors.mainColor,
        paddingBottom: '5%',
        textAlign: 'center'
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
    },
    btnUploadsContainer: {
        backgroundColor: 'transparent',
        width: '80%',
        alignSelf: 'center',
        borderRadius: 8,
        borderColor: colors.mainColor
    },
    uploadFromImagesBtn: {
        backgroundColor: 'transparent',
        padding: 5,
        width: '60%',
        alignSelf: 'center',
        borderColor: colors.mainColor,
        borderRadius: 5,
        marginRight: '6%',
        marginTop: '4%'
    },
    uploadFromFilesBtn: {
        backgroundColor: 'transparent',
        padding: 5,
        width: '60%',
        alignSelf: 'center',
        borderColor: colors.secondColor,
        borderRadius: 5,
        marginRight: '6%',
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


export default RegisterLoginPage