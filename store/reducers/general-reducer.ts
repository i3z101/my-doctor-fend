import { Reducer } from "react"
import { AnyAction } from "redux"
import { GeneralReducerType } from "../../helper/types"
import {ADD_ALL_NUMBERS, CHANGE_ACCOUNT_TYPE_DOCTOR, CHANGE_ACCOUNT_TYPE_PATIENT, CLEAR_GENERAL_REDUCER, END_SEND, START_SEND } from "../actions/general-actions"



const initState: GeneralReducerType = {
    accountType: "patient",
    isSending: false,
    shouldTakeItEveryInNumber: [],
    numberOfTabletsPerTime: [],
    numberOfTimesPerDay: [],
    numberOfDays: []
}


const generalReducer: Reducer<GeneralReducerType, AnyAction> = (state= initState, action): GeneralReducerType => {
    switch(action.type) {
        case CHANGE_ACCOUNT_TYPE_DOCTOR:
            return {
                ...state,
                accountType: "doctor"
            }
        case CHANGE_ACCOUNT_TYPE_PATIENT:
            return {
                ...state,
                accountType: "patient"
            }
        case START_SEND:
            return {
                ...state,
                isSending: true
            }
        case END_SEND:
            return {
                ...state,
                isSending: false
            }
        case ADD_ALL_NUMBERS:
            const shouldTakeItEveryInNumberCopy = [...state.shouldTakeItEveryInNumber];
            const numberOfTabletsPerTimeCopy = [...state.numberOfTabletsPerTime];
            const numberOfTimesPerDayCopy = [...state.numberOfTimesPerDay];
            const numberOfDaysCopy = [...state.numberOfDays];
            for(let i=1; i <= 24; i++){
                shouldTakeItEveryInNumberCopy.push(i);
                numberOfTabletsPerTimeCopy.push(i);
                numberOfTimesPerDayCopy.push(i);
            }
            for(let i=1; i <= 60; i++){
                numberOfDaysCopy.push(i);
            }
            return {
                ...state,
                shouldTakeItEveryInNumber: shouldTakeItEveryInNumberCopy,
                numberOfTabletsPerTime: numberOfTabletsPerTimeCopy,
                numberOfTimesPerDay: numberOfTimesPerDayCopy,
                numberOfDays: numberOfDaysCopy
            }
        case CLEAR_GENERAL_REDUCER:
            return {
                accountType: "patient",
                isSending: false,
                shouldTakeItEveryInNumber: [],
                numberOfTabletsPerTime: [],
                numberOfTimesPerDay: [],
                numberOfDays: []
            }
        default:
            return state
    }
}


export default generalReducer;