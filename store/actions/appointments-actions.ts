import { Action, AnyAction } from "redux";
import { AcquiredAppointmentsType, AppointmentType, DoctorType } from "../../helper/types";

export const ADD_ALL_APPOINTMENTS: string = "ADD_ALL_APPOINTMENTS";
export const ADD_APPOINTMENT: string = "ADD_APPOINTMENT";
export const UPDATE_APPOINTMENT_DATE_TIME = "UPDATE_APPOINTMENT_DATE_TIME";
export const CANCEL_APPOINTMENT = "CANCEL_APPOINTMENT";
export const ADD_ALL_DOCTORS = "ADD_ALL_DOCTORS";
export const CLEAR_APPOINTMENTS_DOCTORS = "CLEAR_APPOINTMENTS_DOCTORS";

export default {
    addAllAppointments: (appointments: AppointmentType[]): AnyAction => {
        return {
            type: ADD_ALL_APPOINTMENTS,
            appointments
        }
    },
    addAppointment: (appointment: AppointmentType, acquiredAppointments: AcquiredAppointmentsType[]): AnyAction => {
        return {
            type: ADD_APPOINTMENT,
            appointment,
            acquiredAppointments
        }
    },
    updateAppointmentDateTime:(appointmentId: string, appointmentDate: string, appointmentTime: string, acquiredAppointments: AcquiredAppointmentsType[] ,doctorId: string ,updatedEventId: string|number): AnyAction => {
        return {
            type: UPDATE_APPOINTMENT_DATE_TIME,
            appointmentId,
            appointmentDate,
            appointmentTime,
            updatedEventId,
            acquiredAppointments,
            doctorId
        }
    },
    cancelAppointment: (appointmentId: string, doctorId: string, acquiredAppointments: AcquiredAppointmentsType[]): AnyAction => {
        return {
            type: CANCEL_APPOINTMENT,
            appointmentId,
            doctorId,
            acquiredAppointments
        }
    },
    addAllDoctors: (doctors: DoctorType[]): AnyAction => {
        return {
            type: ADD_ALL_DOCTORS,
            doctors
        }
    },
    clearAppointmentsAndDoctors: (): AnyAction => {
        return {
            type: CLEAR_APPOINTMENTS_DOCTORS
        }
    }
}