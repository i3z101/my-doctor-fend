import { Reducer } from "react";
import { AnyAction } from "redux";
import { AppointmentsReducer } from "../../helper/types";
import { ADD_ALL_APPOINTMENTS, ADD_ALL_DOCTORS, ADD_APPOINTMENT, CANCEL_APPOINTMENT, CLEAR_APPOINTMENTS_DOCTORS, UPDATE_APPOINTMENT_DATE_TIME } from "../actions/appointments-actions";


const initState: AppointmentsReducer = {
    appointments: [],
    doctors: []
}


const appointmentsReducer: Reducer<AppointmentsReducer, AnyAction> = (state= initState, action): AppointmentsReducer => {
    switch(action.type) {
        case ADD_ALL_APPOINTMENTS:
            return {
                ...state,
                appointments: action.appointments
            }
        case ADD_APPOINTMENT:
            const doctorsCopy = [...state.doctors];
            const doctor = doctorsCopy.find((doctor)=> doctor.doctorId == action.appointment.doctor.doctorId);
            if(doctor != null) {
               doctor.acquiredAppointments = action.acquiredAppointments
            }
            return {
                ...state,
                appointments: state.appointments.concat(action.appointment),
                doctors: doctorsCopy
            }
        case UPDATE_APPOINTMENT_DATE_TIME:
            const updatedAppointments = [...state.appointments];
            const updatedAppointment = updatedAppointments.find((appointment)=>appointment.appointmentId == action.appointmentId);
            if(updatedAppointment) {
                updatedAppointment.appointmentDate = action.appointmentDate;
                updatedAppointment.appointmentTime = action.appointmentTime;
                updatedAppointment.eventId = action.updatedEventId
            }
            const doctorsUpdatedCopy = [...state.doctors];
            const doctorUpdated = doctorsUpdatedCopy.find((doctor)=> doctor.doctorId == action.doctorId);
            if(doctorUpdated != null) {
               doctorUpdated.acquiredAppointments = action.acquiredAppointments
            }
            return {
                ...state,
                appointments: updatedAppointments,
                doctors: doctorsUpdatedCopy
            }
        case CANCEL_APPOINTMENT:
            const canceledDoctorCopy = [...state.doctors];
            const doctorCanceled = canceledDoctorCopy.find((doctor)=>doctor.doctorId == action.doctorId);
            if(doctorCanceled != null) {
                doctorCanceled.acquiredAppointments = action.acquiredAppointments
            }
            const updatedAppointmentsWithoutCanceled = state.appointments.filter((appointment)=>appointment.appointmentId != action.appointmentId);
            return {
                ...state,
                appointments: updatedAppointmentsWithoutCanceled,
                doctors: canceledDoctorCopy
            }
        case ADD_ALL_DOCTORS:
            return {
                ...state,
                doctors: action.doctors
            }
        case CLEAR_APPOINTMENTS_DOCTORS:
            return {
                appointments: [],
                doctors: []
            }
        default:
            return state
    }
} 

export default appointmentsReducer;