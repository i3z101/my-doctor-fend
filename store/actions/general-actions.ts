import { AnyAction } from "redux";

export const CHANGE_ACCOUNT_TYPE_DOCTOR = "CHANGE_ACCOUNT_TYPE_DOCTOR";
export const CHANGE_ACCOUNT_TYPE_PATIENT = "CHANGE_ACCOUNT_TYPE_PATIENT";
export const START_SEND = "START_SEND";
export const END_SEND = "END_SEND";
export const ADD_ALL_NUMBERS = "ADD_ALL_NUMBERS";
export const CLEAR_GENERAL_REDUCER = "CLEAR_GENERAL_REDUCER";

export default {
    changeAccountTypeToDoctor: (): AnyAction=> {
        return {
            type: CHANGE_ACCOUNT_TYPE_DOCTOR
        }
    },
    changeAccountTypeToPatient: (): AnyAction=> {
        return {
            type: CHANGE_ACCOUNT_TYPE_PATIENT
        }
    },
    startSend: (): AnyAction => {
        return {
            type: START_SEND
        }
    },
    endSend: (): AnyAction => {
        return {
            type: END_SEND
        }
    },
    addAllNumbers: (): AnyAction => {
        return {
            type: ADD_ALL_NUMBERS
        }
    },

    clearGeneralReducer: (): AnyAction => {
        return {
            type: CLEAR_GENERAL_REDUCER
        }
    }

}