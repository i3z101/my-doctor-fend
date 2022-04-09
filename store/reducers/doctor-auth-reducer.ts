import { Reducer } from "react";
import { AnyAction } from "redux";
import { DoctorAuthType } from "../../helper/types";
import { DOCTOR_LOGIN, DOCTOR_LOGOUT, REGISTER_DOCTOR } from "../actions/auth-actions";

const initState: DoctorAuthType = {
    authToken: "",
    doctorId: "",
    doctorPhone: "",
    doctorFullName: "",
    doctorEmail: "",
    doctorClinic: "",
    doctorCertificate: "",
    doctorPhoto: "",
    doctorPricePerHour: "",
    doctorGraduatedFrom: "",
    acquiredAppointments: [],
    isAccountActive: true,
    updatePermitted: "",
    pushToken: ""
} 

const doctorAuthReducer: Reducer<DoctorAuthType, AnyAction> = (state= initState, action): DoctorAuthType => {
    switch(action.type) {
        case REGISTER_DOCTOR:
            return {
                ...state,
                ...action.data
            }
        case DOCTOR_LOGIN:
            return {
                ...state,
                ...action.data
            }
        case DOCTOR_LOGOUT:
            return {
                authToken: "",
                doctorId: "",
                doctorPhone: "",
                doctorFullName: "",
                doctorEmail: "",
                doctorClinic: "",
                doctorCertificate: "",
                doctorPhoto: "",
                doctorPricePerHour: "",
                doctorGraduatedFrom: "",
                acquiredAppointments: [],
                isAccountActive: true,
                updatePermitted: "",
                pushToken: ""
            }
        default:
            return state;
    }
} 


export default doctorAuthReducer;