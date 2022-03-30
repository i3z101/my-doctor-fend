import React, { FC, useEffect, useRef, useState } from "react";
import colors from "../../../assets/colors";
import { NavigationType, ResponseType } from "../../../helper/types";
import FixedContainer from "../reuseable/fixed-container";
import Form from '../../../assets/imgs-icon/register-login-form.svg';
import Tick from '../../../assets/imgs-icon/tick.svg';
import {Keyboard, KeyboardAvoidingView, Platform, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { patientAuthActions } from "../../../store/actions/auth-actions";
import Animated, { SlideInLeft, SlideInRight, SlideOutLeft, SlideOutRight } from "react-native-reanimated";
import UnderlinedTextInput from "../reuseable/underlined-text-input";
import {validatePhoneOnChange, validateStringOnChange, validateEmailOnChange } from "../../../helper/validations";
import utils from "../../../helper/utils";
import axios from "axios";
import errorHandler from "../../../helper/error-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BottomSheet from '@gorhom/bottom-sheet';
import CustomBottomSheet from "../reuseable/custom-bottom-sheet";
import Button from "../reuseable/button";
import generalActions from "../../../store/actions/general-actions";
import generalReducer from "../../../store/reducers/general-reducer";
import Spinner from "../../shared/spinner";
import { StackActions } from "@react-navigation/native";

const RegisterLoginPage: FC<NavigationType> = ({navigation}) => {
    const dispatch = useDispatch();
    const generalReducer = useSelector((state: any)=> state.generalReducer);
    const [steps, setSteps] = useState(-1);
    const [lastStep, setLastStep] = useState(-2);
    const [formValue, setFormValue] = useState({
        patientPhone: {
            validation: " ",
            value: ""
        },
        patientName: {
            validation: " ",
            value: ""
        },
        patientEmail: {
            validation: "",
            value: ""
        }
    })
    const [code, setCode] = useState<string[]>([]);
    const [patientFormRequest, setPatientFormRequest] = useState<any>({});
    const [responseHandler, setRsponseHandler ] = useState<ResponseType>({
        message: "",
        statusCode: 0,
        validations: []
    });
    
    const responseBottomSheet = useRef<BottomSheet>(null);

    const autoFocusField2 = useRef<any>();
    const autoFocusField3 = useRef<any>();
    const autoFocusField4 = useRef<any>();
    const autoFocusField5 = useRef<any>();
    const autoFocusField6 = useRef<any>();


    const onChangeHandler = (value: string, name: string, codeIndex?: number, isLogin?: boolean): void => {
        switch(name) {
            case "patientName":
                validateStringOnChange(value, "patient Name", setFormValue, "patientName", true, 3, 100, true, false, false);
                break;
            case "patientPhone":
                validatePhoneOnChange(value, setFormValue, "patientPhone", true);
                break;
            case "patientEmail":
                validateEmailOnChange(value, setFormValue, "patientEmail", false);
                break;
            case "code":
                if(codeIndex) {
                    const codeCopy = [...code];
                    codeCopy[codeIndex] = value;
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

    const changeStepsHandler = (decrease?: boolean): void => {
        if(decrease){
            if(steps <= -1){
                return;
            }
            setSteps(prevState=>prevState - 1);
        }else{
            if(steps >= 3) {
                return;
            }
            setSteps(prevState=>prevState + 1); 
        }
    }

    const submitHandlerRegister = async(): Promise<any> => {
        dispatch(generalActions.startSend());
        Keyboard.dismiss();
        const patientFormData: any = {
            patientPhone: formValue.patientPhone.value.trim(),
            patientName: formValue.patientName.value.trim(),
        }
        if(formValue.patientEmail.value != "")
        patientFormData.patientEmail = formValue.patientEmail.value.trim();
        setPatientFormRequest(patientFormData);
        try {
            const data = await utils.sendRequest("POST", `${utils.BACKEND_URL}/patients/send-sms-code-registration`, patientFormData);
            const response: ResponseType = await data.json();
            if(response.statusCode != 200) {
                errorHandler(response.message, response.statusCode, response.validations);
            }
            setSteps(4);
            setLastStep(3);
        }catch(err: any) {
            dispatch(generalActions.endSend());
            setRsponseHandler(err);
            responseBottomSheet.current?.snapToIndex(1);
            return;
        }
    }
    
    const verifyCodeAndRegister = async(codeNum:string): Promise<any> => {
        try{
            dispatch(generalActions.endSend());
            const data = await utils.sendRequest("POST", `${utils.BACKEND_URL}/patients/register`, {...patientFormRequest, code: codeNum});
            const response: ResponseType = await data.json();
            if(response.statusCode != 201) {
                errorHandler(response.message, response.statusCode, response.validations);
            }
            
            await AsyncStorage.setItem("patient-auth", JSON.stringify(response.patient));
            dispatch(patientAuthActions.register(response.patient));
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
        try {
            dispatch(generalActions.startSend());
            const data = await utils.sendRequest("POST", `${utils.BACKEND_URL}/patients/send-sms-code-login`, {patientPhone: formValue.patientPhone.value});
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
            dispatch(generalActions.endSend())
            const data = await utils.sendRequest("POST", `${utils.BACKEND_URL}/patients/login`, {patientPhone: formValue.patientPhone.value, code: codeNum});
            const response: ResponseType = await data.json();
            if(response.statusCode != 200) {
                errorHandler(response.message, response.statusCode, response.validations);
            }
            
            await AsyncStorage.setItem("patient-auth", JSON.stringify(response.patient));
            dispatch(patientAuthActions.register(response.patient));
            setRsponseHandler(response);
            responseBottomSheet.current?.snapToIndex(1);
            setTimeout(()=> {
                responseBottomSheet.current?.close()
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
            await utils.sendRequest("POST",`${utils.BACKEND_URL}/shared/send-sms-code-again`, {phone: formValue.patientPhone.value.trim()})
        }catch(err:any) {
            setRsponseHandler(err);
            responseBottomSheet.current?.snapToIndex(1);
            return;
        }
    }


    return  <TouchableWithoutFeedback onPress={()=>Keyboard.dismiss()}> 
    <KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
        <FixedContainer style={styles.fixedContainer}>
        <Animated.View entering={SlideInRight.duration(700)}>
        <Form width={utils.deviceHeight <= 667 ? 200 : 270} height={utils.deviceHeight <= 667 ? 200 : 270} style={styles.formImage} />
        <View style={styles.innerContainer}>
            <Text style = {styles.textStyle}>
                MAY WE GET
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
            <TouchableOpacity style={{...styles.nextSubmitBtn, width:'55%', marginTop:'10%', backgroundColor: colors.thirdColor, borderColor: colors.thirdColor}} onPress={()=>navigation.goBack()}>
                <Text style={{...styles.nextSubmitBtnText, color:colors.mainColor}}>Click to continue as a guest</Text>
            </TouchableOpacity>
        </View>
        }
        {steps == 0 || steps == 1 ?
            <Animated.View entering={SlideInRight.duration(700)} exiting={SlideOutRight.duration(100)}>
                <UnderlinedTextInput placeholder="*Patient phone without +" validationText={formValue.patientPhone.validation}
                    attributes={{ value:formValue.patientPhone.value, onChangeText:(value)=>onChangeHandler(value, "patientPhone"),
                    returnKeyType:"default", maxLength:12, keyboardType:'phone-pad', enablesReturnKeyAutomatically:true}} />
            </Animated.View>
        : steps == 2 ? <Animated.View entering={SlideInRight.duration(700)} exiting={SlideInRight.duration(100)}>
        <UnderlinedTextInput placeholder="*Patient name" validationText={formValue.patientName.validation}
            attributes={{ value:formValue.patientName.value, onChangeText:(value)=>onChangeHandler(value, "patientName")}} />
        </Animated.View>
        : steps == 3 ? 
        <Animated.View entering={SlideInRight.duration(700)} exiting={SlideInRight.duration(100)}>
            <UnderlinedTextInput placeholder="Patient email (optional)" validationText={formValue.patientEmail.validation}
            attributes={{ value:formValue.patientEmail.value, onChangeText:(value)=>onChangeHandler(value, "patientEmail"), keyboardType: 'email-address'}} />
        </Animated.View>
        : null
        }
        {steps > -1 &&
        <View style={{flexDirection:'row', justifyContent: 'space-evenly'}}>
        <TouchableOpacity style={{...styles.nextSubmitBtn, backgroundColor: colors.secondColor, borderColor: colors.secondColor}} onPress={steps == 0 ? ()=>setSteps(1) : ()=>changeStepsHandler(true)}>
            <Text style={styles.nextSubmitBtnText}>{steps == 0 ? "Register" : steps == 1 ? "Login" : "Previous"}</Text>
        </TouchableOpacity>
        <TouchableOpacity disabled={generalReducer.isSending ? true : steps == 0 || steps == 1 ? formValue.patientPhone.validation != "" ? true : false :
        steps == 2 ? formValue.patientName.validation != "" ? true : false :
        formValue.patientEmail.validation != "" ? true : false} 
        style={{...styles.nextSubmitBtn, backgroundColor: steps == 0 || steps == 1 ? formValue.patientPhone.validation != "" ? '#ccc' : colors.mainColor: 
        steps == 2 ?  formValue.patientName.validation != "" ? '#ccc' : colors.mainColor: formValue.patientEmail.validation != "" ? '#ccc' : colors.mainColor,
        borderColor: steps == 0 || steps == 1 ? formValue.patientPhone.validation != "" ? '#ccc' : colors.mainColor: 
        steps == 2 ?  formValue.patientName.validation != "" ? '#ccc' : colors.mainColor: formValue.patientEmail.validation != "" ? '#ccc' : colors.mainColor
        }} onPress={steps == 0 ? ()=>submitHandlerLogin() : steps == 3 ? ()=> submitHandlerRegister() : ()=>changeStepsHandler()}>
            {generalReducer.isSending ? 
              <Spinner/>
            : <Text style={styles.nextSubmitBtnText}>{steps == 0 ? "Login" : steps == 3 ? "Register" : "Next" }</Text>
            }
        </TouchableOpacity>
        </View>
        }
        {steps >= 1 && steps <= 4 &&  <Text style={{...styles.nextSubmitBtnText, fontWeight:'500', color:colors.mainColor, marginTop:'5%'}}>
            {steps}/3    
        </Text>}
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
    }
})


export default RegisterLoginPage