import { AnyAction } from "redux";
import { PatientAuthType } from "../../helper/types";

//For patients
export const REGISTER_PATIENT = "REGISTER_PATIENT";
export const PATIENT_LOGIN = "PATIENT_LOGIN";
export const PATIENT_LOGOUT = "PATIENT_LOGOUT";

//For doctors
export const REGISTER_DOCTOR = "REGISTER_DOCTOR";
export const DOCTOR_LOGIN = "DOCTOR_LOGIN";
export const DOCTOR_LOGOUT = "DOCTOR_LOGOUT";


export const patientAuthActions = {
    register: (data: PatientAuthType): AnyAction => {
        return {
            type: REGISTER_PATIENT,
            data
        }
    },
    login: (data: PatientAuthType): AnyAction => {
        return {
            type: PATIENT_LOGIN,
            data
        }
    },
    logout: (): AnyAction => {
        return {
            type: PATIENT_LOGOUT
        }
    }
}

export const doctorAuthActions = {
    register: (data: PatientAuthType): AnyAction => {
        return {
            type: REGISTER_DOCTOR,
            data
        }
    },
    login: (data: PatientAuthType): AnyAction => {
        return {
            type: DOCTOR_LOGIN,
            data
        }
    },
    logout: (): AnyAction => {
        return {
            type: DOCTOR_LOGOUT
        }
    }
}