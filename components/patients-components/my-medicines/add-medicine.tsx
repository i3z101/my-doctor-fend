import { NavigationProp, Route } from "@react-navigation/native";
import React, { FC, useEffect, useLayoutEffect, useRef, useState } from "react";
import FixedContainer from "../reuseable/fixed-container";
import ImageMenu from "../reuseable/image-menu";
import Medicine from "../../../assets/imgs-icon/medicines.svg";
import GeneralInfoText from "../reuseable/general-info-text";
import CardIconsContainer from "../../shared/card-icons-container";
import UnderlinedTextInput from "../reuseable/underlined-text-input";
import {Dimensions, Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import colors from "../../../assets/colors";
import BottomSheet from '@gorhom/bottom-sheet';
import { DatePicker } from 'react-native-woodpicker'
import DateTimePickerModal from "react-native-modal-datetime-picker";
import ReversedButtons from "../reuseable/reversed-buttons";
import * as Calendar from 'expo-calendar';
import { validateStringOnChange } from "../../../helper/validations";
import { ListDatesType, ResponseType } from "../../../helper/types";
import CustomBottomSheet from "../reuseable/custom-bottom-sheet";
import utils from "../../../helper/utils";
import { useDispatch, useSelector } from "react-redux";
import medicinesActions from "../../../store/actions/medicines-actions";
import generalActions from "../../../store/actions/general-actions";
import errorHandler from "../../../helper/error-handler";
import Spinner from "../../shared/spinner";
import Button from "../reuseable/button";





const AddMedicinePage: FC<{navigation: NavigationProp<any>, route: Route<any>}> = ({navigation, route}) => {
    const generalReducer = useSelector((state: any)=> state.generalReducer);
    const patientAuthReducer = useSelector((state: any)=>state.patientAuth);
    const appointmentsReducer = useSelector((state: any)=>state.appointments);
    //For update purpose
    const {medicineInfo} = route.params as any
    const dispatch = useDispatch();
    const ONE_DAY: number = 86400000;
    //For android only
    const THREE_HOURS: number = 10800000;
    const shouldTakeItEveryInNumberRef = useRef<BottomSheet>(null);
    const numberOfTabletsRef = useRef<BottomSheet>(null);
    const numberOfTimesPerDayRef = useRef<BottomSheet>(null);
    const numberOfDaysRef = useRef<BottomSheet>(null);
    const responseBottomSheet = useRef<BottomSheet>(null);

    const [showTimePicker, setShowTimePicker] = useState<boolean>(false);

    const [medicineData, setMedicineData] = useState({
        medicineName: {
            value: medicineInfo ? medicineInfo.medicineName : '',
            validation: ''
        },
        timesPerDay: medicineInfo ? medicineInfo.timesPerDay : 0,
        tabletsPerTime: medicineInfo ? medicineInfo.tabletsPerTime : 0,
        shouldTakeItEvery: medicineInfo ? medicineInfo.shouldTakeItEvery : 0,
        numberOfDays: medicineInfo ? medicineInfo.numberOfDays : 0,
        startTime: medicineInfo ? medicineInfo.startTime : '',
        startDate: medicineInfo ? medicineInfo.startDate : '',
    })

    const [responseHandler, setRsponseHandler ] = useState<ResponseType>({
        message: "",
        statusCode: 0,
        validations: []
    });

    const onChangeHandler = (value: string, name: string): void => {
        validateStringOnChange(value, "Medicine name", setMedicineData, "medicineName", true, 3, 150, true, true, false);
        setMedicineData((prevState: any)=>({
            ...prevState,
            [name]: {
                ...prevState[name],
                value: value
            }
        }))
    }

    const changDateHandler = (date: Date, dateName: string): void => {
        switch(dateName) {
            case "START_DATE":
                setMedicineData(prevState=> ({
                    ...prevState,
                    startDate: new Date(date).toDateString()
                }))
                break;
            case "FINISH_DATE":
                setMedicineData(prevState=> ({
                    ...prevState,
                    stopDate: new Date(date).toDateString()
                }))
                break;
        }
    }

    const changeTimeHandler = (date: Date): void => {        
        setShowTimePicker(!showTimePicker);
        let AMorPM: string = '';
        let formattedTime:string|string[] = '';
        if(Platform.OS == 'ios') {
            //formattedTime[0] = (Number(formattedTime[0]) + 12).toString()
            formattedTime = date.toLocaleTimeString('en-US', {hour:'2-digit', minute:'2-digit'});
            
            if(formattedTime.includes("PM")) {
                formattedTime = formattedTime.split(":");
                if(!formattedTime.includes("12")){
                    formattedTime[0] = String(Number(formattedTime[0]) + 12 );
                }
                formattedTime = formattedTime.join(":")
            }else {
                if(formattedTime.includes("12")) {
                    formattedTime = formattedTime.split(":");
                    formattedTime[0] = "00";
                    formattedTime = formattedTime.join(":");
                }
            }
            setMedicineData(prevState=>({
                ...prevState,
                startTime: formattedTime.toString()
            }));
            
        }else {
            formattedTime = date.toLocaleTimeString().split(":");
            if(Number(formattedTime[0]) >= 12 ) {
                AMorPM = "PM";
            }else {
                AMorPM = "AM"
            }
            setMedicineData(prevState=>({
                ...prevState,
                startTime: `${formattedTime[0]}:${formattedTime[1]} ${AMorPM}`
            }));
        }
    }

    const calcDate = (): ListDatesType[] => {
        const ONE_HOUR = 3600000;
        let continueFromStartDate = medicineData.startDate;
        const listDates: ListDatesType[] = [];
        let arrayTime = medicineData.startTime.split(":");
        let v = 0;
        for(let i=0; i<medicineData.numberOfDays; i++) {
            for(let x= 0; x < medicineData.timesPerDay; x++){
                if(x > 0) {
                    v = 1;
                }
                /**
                 * 1- To increase hours in each iteration by shouldTakeItEvery to specify the next hour for the medicine.
                 * 2- Replace AM/PM by empty space
                 */
                let formattedTime = `${(Number(arrayTime[0]) + (v*medicineData.shouldTakeItEvery))}:${arrayTime[1].replace(/[A-Z]/g, " ")}`.trim();
                
               
                
                if(Number(formattedTime.split(":")[0]) < 10) {
                    arrayTime = formattedTime.split(":");
                    arrayTime[0] = `0${arrayTime[0]}`
                    formattedTime = arrayTime.join(":");
                }else if(Number(formattedTime.split(":")[0]) > 23) {
                    arrayTime = formattedTime.split(":");
                    arrayTime[0] = `${Number(arrayTime[0]) - 24}`
                    /***
                     * To add 0 on the left for numbers less than 10
                     * To avoid 010, 012, etc.
                     * **/
                    if(Number(arrayTime[0]) < 10) {
                        arrayTime[0] = `0${arrayTime[0]}`
                    }
                    formattedTime = arrayTime.join(":");
                }
                
                listDates.push({
                    day: continueFromStartDate,
                    time: formattedTime.trim()
                })
                arrayTime = formattedTime.split(":");
                
                /**
                 * This will change continueFromStartDate in every iteration. So the new day will be based on the time of day.
                 * Ex: if fisr tablet on Tudesday at 22:00 PM and the next tablet will be after 12 hours.
                 *     So, In the next iteration the new time for the tablet after 12 hours will be on Wedensday at 10:00 AM. and so on.
                 */
                continueFromStartDate = new Date(new Date(continueFromStartDate + " " + formattedTime).getTime() + medicineData.shouldTakeItEvery*ONE_HOUR).toDateString();
            }
        }
        
        return listDates;
    }

    const getDefaultCalendarSource = async() => {
        const defaultCalendar = await Calendar.getDefaultCalendarAsync();
        return defaultCalendar.source;
    }

    const deleteEvent = async(eventId?: string|number) => {
        await Calendar.deleteCalendarAsync(String(eventId ? eventId : medicineInfo.eventId));
    }

    const createCalendarReminder = async (listDates: ListDatesType[]): Promise<string> => {
        const defaultCalendarSource = await getDefaultCalendarSource();

        
        if(medicineInfo) {
            await deleteEvent();
        }

        const reminderId = await Calendar.createCalendarAsync({
            title: "Medicine",
            entityType: Calendar.EntityTypes.REMINDER,
            source: defaultCalendarSource,
            ownerAccount: 'personal',
            accessLevel: Calendar.CalendarAccessLevel.OWNER,
            name: "Medicine",
            color: colors.mainColor
        })
        for(let i=0; i <listDates.length; i++){
            const rawDate = new Date(listDates[i].day).toISOString().split("T")[0]+"T"+listDates[i].time;
            const dateTime = new Date(rawDate).getTime()+(1 * ONE_DAY);
            await Calendar.createReminderAsync(reminderId, {
                creationDate: new Date(dateTime).toISOString(),
                dueDate: new Date(dateTime).toISOString(),
                title: `Take ${medicineData.tabletsPerTime} tablets of your medicine ${medicineData.medicineName.value}`,
                alarms: [
                    {
                        relativeOffset: 0
                    }
                ]
            })   
        }
        
        return reminderId;
    }
    
    //For Android only since they don't have reminder like IOS
    const createCalendarEvent = async (listDates: ListDatesType[]): Promise<number> => {

        const defaultCalendarSource =  {
            type: Calendar.EntityTypes.REMINDER,
            isLocalAccount: true,
            name: `reminder medicine`
        }

        if(medicineInfo) {
            await deleteEvent();
        }

        const eventId = await Calendar.createCalendarAsync({
                title: "Medicine",
                entityType: Calendar.EntityTypes.EVENT,
                sourceId: undefined,
                source: defaultCalendarSource,
                ownerAccount: 'personal',
                accessLevel: Calendar.CalendarAccessLevel.OWNER,
                name: "Medicine",
                color: colors.mainColor,
                allowedReminders: [Calendar.AlarmMethod.ALARM, Calendar.AlarmMethod.ALERT, Calendar.AlarmMethod.DEFAULT, Calendar.AlarmMethod.DEFAULT],
                allowsModifications: true,
                isSynced: true
            })
        for(let i=0; i <listDates.length; i++){
        const rawDate = new Date(listDates[i].day).toISOString().split("T")[0]+"T"+listDates[i].time;
        const dateTime = new Date(rawDate).getTime()+(1 * ONE_DAY) - THREE_HOURS;

        await Calendar.createEventAsync(eventId, {
            startDate: new Date(dateTime),
            endDate: new Date(dateTime),
            guestsCanModify: true,
            title: `Take ${medicineData.tabletsPerTime} tablets of your medicine ${medicineData.medicineName.value}`,
            timeZone: "GMT+8:00",
            status: Calendar.EventStatus.CONFIRMED,
            accessLevel: Calendar.CalendarAccessLevel.OWNER,
            calendarId: eventId,
            alarms: [
                {
                    relativeOffset: 0,
                    method: Calendar.AlarmMethod.ALERT

                }
            ],
        })
        }
        
        return Number(eventId);

    }

    const updateHandler = async (): Promise<any> => {
        dispatch(generalActions.startSend());
        const listDates = calcDate();
        let eventId: string|number = '';
        try {
            if(Platform.OS == 'ios') {
                const calendarPermission = await Calendar.requestCalendarPermissionsAsync();
                const reminderPermission = await Calendar.requestRemindersPermissionsAsync();
                if(calendarPermission.status == "granted" && reminderPermission.status == "granted")
                eventId = await createCalendarReminder(listDates);
            }else{
                const {status} = await Calendar.requestCalendarPermissionsAsync();
                if(status == "granted") 
                eventId = await createCalendarEvent(listDates);
            }
            const data = await utils.sendRequest('PATCH', `${utils.BACKEND_URL}/patients/medicines/update-medicine`, {
                medicineId: medicineInfo.medicineId,
                eventId: eventId,
                medicineName: medicineData.medicineName.value.trim(),
                shouldTakeItEvery: medicineData.shouldTakeItEvery,
                timesPerDay: medicineData.timesPerDay,
                tabletsPerTime: medicineData.tabletsPerTime,
                numberOfDays: medicineData.numberOfDays,
                startDate: medicineData.startDate.trim(),
                startTime: medicineData.startTime.trim(),
                listDates: listDates
            }, {'Authorization': `BEARER ${patientAuthReducer.authToken}`})
            const response: ResponseType = await data.json();
            
            if(response.statusCode != 200) {
                errorHandler(response.message, response.statusCode, response.validations ? response.validations : [], eventId)
            }
            dispatch(medicinesActions.updateMedicine({
                medicineId: medicineInfo.medicineId,
                eventId: eventId,
                medicineName: medicineData.medicineName.value.trim(),
                shouldTakeItEvery: medicineData.shouldTakeItEvery,
                timesPerDay: medicineData.timesPerDay,
                tabletsPerTime: medicineData.tabletsPerTime,
                numberOfDays: medicineData.numberOfDays,
                startDate: medicineData.startDate.trim(),
                startTime: medicineData.startTime.trim(),
                listDates: listDates
            }))
            dispatch(generalActions.endSend());
            utils.showAlertMessage("Medicine updated 😎", response.message, [
                {
                    style: 'default',
                    text: "Ok, Thank you",
                    onPress: ()=> navigation.goBack()
                }
            ])

        }catch(err: any) {
            await deleteEvent(err.extraProps)
            dispatch(generalActions.endSend())
            setRsponseHandler(err)
            responseBottomSheet.current?.snapToIndex(1)
        }
        
    }


    const submitHandler = async(): Promise<any> => {
        dispatch(generalActions.startSend());
        const listDates = calcDate();
        let eventId: string|number = '';

        try {
            if(Platform.OS == 'ios') {
                const calendarPermission = await Calendar.requestCalendarPermissionsAsync();
                const reminderPermission = await Calendar.requestRemindersPermissionsAsync();
                if(calendarPermission.status == "granted" && reminderPermission.status == "granted")
                eventId = await createCalendarReminder(listDates);
            }else{
                const {status} = await Calendar.requestCalendarPermissionsAsync();
                if(status == "granted") 
                eventId = await createCalendarEvent(listDates);
            }
            const data = await utils.sendRequest('POST', `${utils.BACKEND_URL}/patients/medicines/add-medicine`, {
                eventId: eventId,
                medicineName: medicineData.medicineName.value.trim(),
                shouldTakeItEvery: medicineData.shouldTakeItEvery,
                timesPerDay: medicineData.timesPerDay,
                tabletsPerTime: medicineData.tabletsPerTime,
                numberOfDays: medicineData.numberOfDays,
                startDate: medicineData.startDate.trim(),
                startTime: medicineData.startTime.trim(),
                listDates: listDates
            }, {'Authorization': `BEARER ${patientAuthReducer.authToken}`})
            const response: ResponseType = await data.json();
            
            if(response.statusCode != 201) {
                errorHandler(response.message, response.statusCode, response.validations ? response.validations : [], eventId)
            }
            dispatch(medicinesActions.addMedicine({
                medicineId: response.medicineId,
                eventId: eventId,
                medicineName: medicineData.medicineName.value.trim(),
                shouldTakeItEvery: medicineData.shouldTakeItEvery,
                timesPerDay: medicineData.timesPerDay,
                tabletsPerTime: medicineData.tabletsPerTime,
                numberOfDays: medicineData.numberOfDays,
                startDate: medicineData.startDate.trim(),
                startTime: medicineData.startTime.trim(),
                listDates: listDates
            }))
            dispatch(generalActions.endSend());
            utils.showAlertMessage("Medicine saved 😎", response.message, [
                {
                    style: 'default',
                    text: "Ok, Thank you",
                    onPress: ()=> navigation.goBack()
                }
            ])

        }catch(err: any) {
            await deleteEvent(err.extraProps)
            dispatch(generalActions.endSend())
            setRsponseHandler(err)
            responseBottomSheet.current?.snapToIndex(1)
        }
        
    }
    


    return <KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
        <FixedContainer>
         <ImageMenu hasBackElement navigation={navigation} Image={Medicine} />
         <CardIconsContainer containerStyle={styles.container}>
             <View style={{width:'100%'}}>
                <UnderlinedTextInput placeholder="Medicine Name*" 
                validationText={medicineData.medicineName.validation} 
                attributes={{value:medicineData.medicineName.value, onChangeText:(value)=>onChangeHandler(value, "medicineName")}} />
                <View style={styles.innerContainer}>
                    <TouchableOpacity onPress={()=>{
                            Keyboard.dismiss()
                            numberOfTimesPerDayRef.current?.snapToIndex(1)
                        }
                    }>
                        <View style={styles.labelContainer}>
                            <Text style={styles.labelText}>Times Per Day</Text>
                            <MaterialIcons style={styles.arrowDown} name="keyboard-arrow-down" size={16} color="black" />
                        </View>
                        <Text style={styles.centeredText}>{medicineData.timesPerDay == 0 ? null : medicineData.timesPerDay + " time(s)"}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>{
                        Keyboard.dismiss()
                        numberOfTabletsRef.current?.snapToIndex(1)
                    }
                    }>
                        <View style={styles.labelContainer}>
                            <Text style={styles.labelText}>Tablets Per time</Text>
                            <MaterialIcons style={styles.arrowDown} name="keyboard-arrow-down" size={16} color="black" />
                        </View>
                        <Text style={styles.centeredText}>{medicineData.tabletsPerTime == 0 ? null : medicineData.tabletsPerTime + " tablet(s)"}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>{
                            Keyboard.dismiss()
                            shouldTakeItEveryInNumberRef.current?.snapToIndex(1)
                        }
                    }>
                        <View style={styles.labelContainer}>
                            <Text style={styles.labelText}>Take it Every</Text>
                            <MaterialIcons style={styles.arrowDown} name="keyboard-arrow-down" size={16} color="black" />
                        </View>
                        <Text style={styles.centeredText}>{medicineData.shouldTakeItEvery == 0 ? null : medicineData.shouldTakeItEvery + " hr(s)"}</Text>
                    </TouchableOpacity>
                </View>
                <View style={{...styles.innerContainer, justifyContent:'space-evenly', marginTop:'7%'}}>
                    <DatePicker
                        value={new Date()}
                        onDateChange={(date:any)=>changDateHandler(date, "START_DATE")}
                        textInputStyle={{color:colors.mainColor, textAlign:'center'}}
                        title="AppointmentDate"
                        isNullable={false}
                        text={medicineData.startDate != "" ? medicineData.startDate : "Choose Start date"}
                        iosDisplay = "spinner"
                        textColor= {colors.mainColor}
                        minimumDate = {new Date()}
                        style={{height: 40, borderBottomWidth:2, borderBottomColor: colors.mainColor, marginBottom: '5%'}}
                    />
                     <TouchableOpacity onPress={()=>{
                             Keyboard.dismiss()
                             numberOfDaysRef.current?.snapToIndex(1)
                        }
                        }>
                        <View style={{...styles.labelContainer, borderBottomWidth:2, borderBottomColor: colors.mainColor, marginBottom: '5%', height: 40}}>
                            {medicineData.numberOfDays != 0 ? 
                                <Text style={styles.centeredText}>{medicineData.numberOfDays + " day(s)"}</Text>
                            :<>
                            <Text style={{...styles.labelText, color:colors.mainColor, fontSize:16}}>Days to stop</Text>
                            <MaterialIcons style={styles.arrowDown} name="keyboard-arrow-down" size={16} color="black" />
                            </>
                            }
                        </View>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={{alignSelf:'center', marginTop:'5%'}} onPress={()=>setShowTimePicker(!showTimePicker)}>
                    <Text style={{...styles.labelText, fontSize:16}}>Choose start Medicine Time</Text>
                    <Text style={{...styles.centeredText, fontSize:16}}>{medicineData.startTime == '' ? null : medicineData.startTime}</Text>
                </TouchableOpacity>
                <DateTimePickerModal
                isVisible={showTimePicker}
                is24Hour={true} 
                mode="time"
                locale="en_GB"
                date={new Date()}
                onConfirm={(d)=> changeTimeHandler(d)}
                onCancel={()=>setShowTimePicker(!showTimePicker)}
                textColor= {colors.mainColor}
                />
             </View>
             <ReversedButtons 
                        children = {generalReducer.isSending ? <Spinner /> : null}
                        btnText= {medicineInfo ? "Update" : "Create" }
                        btnTextTwo={medicineInfo ? "Delete" : "Cancel" }
                        btnLeftAttribute={{disabled:generalReducer.isSending ? true : medicineData.medicineName.value.length < 1 || medicineData.medicineName.validation.length > 0 || 
                            medicineData.timesPerDay == 0 || medicineData.tabletsPerTime == 0 || medicineData.shouldTakeItEvery == 0 ||
                            medicineData.startDate == "" ||  medicineData.numberOfDays == 0 ||
                            medicineData.startTime == "" ? true : false}}
                        btnRightAttribute = {{disabled: generalReducer.isSending ? true : false}}
                        onPressOne={()=>medicineInfo ? updateHandler() : submitHandler()}
                        onPressTwo={()=>navigation.goBack()}
                        btnContainerStyleOne={{...styles.btnLeftContainer, 
                        backgroundColor: medicineData.medicineName.value.length < 1 || medicineData.medicineName.validation.length > 0 || 
                        medicineData.timesPerDay == 0 ||  medicineData.tabletsPerTime == 0 ||
                        medicineData.shouldTakeItEvery == 0 || medicineData.startDate == "" ||
                        medicineData.numberOfDays == 0 || medicineData.startTime == "" ? '#ccc': colors.mainColor}}
                        btnContainerStyleTwo={styles.btnRightContainer}
                    />
         </CardIconsContainer>
    </FixedContainer>
    <CustomBottomSheet bottomSheetProps={{
        snapPoints: {value: ["25%", "65%"]}, index: -1, enableContentPanningGesture:false, enableHandlePanningGesture:false, children: ""}}
        scrollViewProps={{style: {height:65}}}
        refValue={numberOfTimesPerDayRef}
        title="Select how many times per day"
        titleStyle={styles.bottomsheetLabel}
        >
        <View style={styles.bottomSheetInnerContainer}>
            {generalReducer.numberOfTimesPerDay.map((time:string)=> {
                return <TouchableOpacity style={styles.bottomsheetBtnContainer} key={time} onPress={()=> {
                    setMedicineData((prevState)=> ({
                        ...prevState,
                        timesPerDay: Number(time)
                    }))
                    numberOfTimesPerDayRef.current?.close() 
                }}>
                    <Text style={styles.bottomsheetBtnText}>{time}</Text>
                </TouchableOpacity>
            })}
        </View>
    </CustomBottomSheet>
    <CustomBottomSheet bottomSheetProps={{
        snapPoints: {value: ["25%", "65%"]}, index: -1, enableContentPanningGesture:false, enableHandlePanningGesture:false, children: ""}}
        scrollViewProps={{style: {height:65}}}
        refValue={numberOfTabletsRef}
        title="Select how many tablets per day"
        titleStyle={styles.bottomsheetLabel}
        >
        <View style={styles.bottomSheetInnerContainer}>
            {generalReducer.numberOfTabletsPerTime.map((time:string)=> {
                return <TouchableOpacity style={styles.bottomsheetBtnContainer} key={time} onPress={()=> {
                    setMedicineData((prevState)=> ({
                        ...prevState,
                        tabletsPerTime: Number(time)
                    }))
                    numberOfTabletsRef.current?.close() 
                }}>
                    <Text style={styles.bottomsheetBtnText}>{time}</Text>
                </TouchableOpacity>
            })}
        </View>
    </CustomBottomSheet>
    <CustomBottomSheet bottomSheetProps={{
        snapPoints: {value: ["25%", "65%"]}, index: -1, enableContentPanningGesture:false, enableHandlePanningGesture:false, children: ""}}
        scrollViewProps={{style: {height:65}}}
        refValue={shouldTakeItEveryInNumberRef}
        title="Select after how many hours you should take it"
        titleStyle={styles.bottomsheetLabel}
        >
        <View style={styles.bottomSheetInnerContainer}>
            {generalReducer.shouldTakeItEveryInNumber.map((time:string)=> {
                return <TouchableOpacity style={styles.bottomsheetBtnContainer} key={time} onPress={()=> {
                    setMedicineData((prevState)=> ({
                        ...prevState,
                        shouldTakeItEvery: Number(time)
                    }))
                    shouldTakeItEveryInNumberRef.current?.close() 
                }}>
                    <Text style={styles.bottomsheetBtnText}>{time}</Text>
                </TouchableOpacity>
            })}
        </View>
    </CustomBottomSheet>
    <CustomBottomSheet bottomSheetProps={{
        snapPoints: {value: ["25%", "65%"]}, index: -1, enableContentPanningGesture:false, enableHandlePanningGesture:false, children: ""}}
        scrollViewProps={{style: {height:55}}}
        refValue={numberOfDaysRef}
        title="Select how many days to stop"
        titleStyle={styles.bottomsheetLabel}
        scrollbale={true}
        >
        <View style={styles.bottomSheetInnerContainer}>
            {generalReducer.numberOfDays.map((time:string)=> {
                return <TouchableOpacity style={styles.bottomsheetBtnContainer} key={time} onPress={()=> {
                    setMedicineData((prevState)=> ({
                        ...prevState,
                        numberOfDays: Number(time)
                    }))
                    numberOfDaysRef.current?.close() 
                }}>
                    <Text style={styles.bottomsheetBtnText}>{time}</Text>
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
    container: {
        marginTop: '22%'
    },
    innerContainer: {
        flexDirection:'row', 
        justifyContent:'space-between', 
        // marginLeft:'-5%',
        marginTop:5,
        flexWrap:'wrap'
    },
    labelContainer: {
        flexDirection:'row', 
        alignItems:'center'
    },
    labelText: {
        fontSize:13,
        marginTop:7
    },
    arrowDown: {
        marginTop: 7
    },
    centeredText: {
        textAlign: 'center',
        marginTop: 4,
        color: colors.mainColor,
        fontWeight:'600'
    },
    bottomsheetLabel: {
        textAlign:'center', 
        fontSize:17, 
        fontWeight:'600'
    },
    bottomSheetInnerContainer: {
        flexDirection:'row', 
        justifyContent:'space-around', 
        flexWrap:'wrap', 
        marginTop:'5%'
    },
    bottomsheetBtnContainer: {
        padding:4, 
        backgroundColor: colors.mainColor, 
        borderWidth:2, borderColor: colors.mainColor, 
        width:'25%', margin:4, 
        borderRadius:8
    },
    bottomsheetBtnText: {
        color: colors.thirdColor, 
        fontSize: 18, 
        fontWeight:'600', 
        textAlign:'center'
    },
    btnLeftContainer: {
        marginLeft:'-10%',
        alignItems:'center',
        marginTop: utils.deviceHeight <= 667 ? Platform.OS == 'ios' ? '15%' : '5%' : '30%', 
        width: '40%'
    },
    btnRightContainer: {
        marginRight: utils.deviceWidth < 395 ? '-10%' : utils.deviceWidth < 500 ? '-10%' : '-15%', 
        alignItems: 'center', 
        marginLeft: utils.deviceHeight <= 667 ? '37%' : '40%', 
        backgroundColor: 'tomato', 
        marginTop: utils.deviceHeight <= 667 ? Platform.OS == 'ios' ? '15%' : '5%' : '30%',
        width:'40%'
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

export default AddMedicinePage