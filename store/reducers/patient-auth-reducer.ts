import { Reducer } from "react";
import { AnyAction } from "redux";
import { PatientAuthType } from "../../helper/types";
import { PATIENT_LOGIN, PATIENT_LOGOUT, REGISTER_PATIENT } from "../actions/auth-actions";

const initState: PatientAuthType = {
    authToken: "",
    patientName: "",
    patientId: "",
    patientPhone: "",
    patientEmail: "",
    updatePermitted: true,
    isGuest: true
}


const patientAuthReducer: Reducer<PatientAuthType, AnyAction> = (state= initState, action): PatientAuthType => {
    switch(action.type) {
        case REGISTER_PATIENT:
            return {
                ...state,
                ...action.data
            }
        case PATIENT_LOGIN:
            return {
                ...state,
                ...action.data
            }
        case PATIENT_LOGOUT:
            return {
                authToken: "",
                patientName: "",
                patientId: "",
                patientPhone: "",
                patientEmail: "",
                updatePermitted: true,
                isGuest: false
            }
        default:
            return state
    }
}


export default patientAuthReducer;