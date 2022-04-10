import { NavigationProp, RouteProp } from "@react-navigation/native";
import React from "react";
import { ButtonProps, TouchableOpacityProps } from "react-native";


export type NavigationType = {
    navigation: NavigationProp<any>
}

export type NavigationWithRoute = {
    navigation: NavigationProp<any>,
    route: RouteProp<any>
}

export type ClinicType = {
    id: string,
    clinic: string
}

export type DoctorType = {
    doctorId: string,
    doctorFullName: string,
    doctorClinic: string,
    doctorPhoto: string,
    doctorBio: string,
    doctorPricePerHour: number,
    acquiredAppointments: AcquiredAppointmentsType[],
    pushToken: string
}

export type DoctorsTimesType = {
    id: string,
    time: string,
    available: boolean
}

export type AcquiredAppointmentsType = {
    appointmentDate: number,
    acquiredTimes: string[]
}

export type MedicalFileType = {
    fileName: string | null,
    disease: string | null,
    doctor: {
        doctorId: string | null,
        doctorFullName: string | null
    },
    clinic: string,
    patientName: string | null,
    medicine: string | null
}

export type MedicalFileReducerType = {
    medicalFiles: MedicalFileType[]
}

export type BorderedBtnType = {
    btnText: string,
    onPress: ()=> any,
    btnContainerStyle?: any, 
    btnTextStyle?: any,
    btnAttribute?: TouchableOpacityProps
}
export type BorderedReversedBtnType = {
    btnText: string,
    btnTextTwo: string
    onPressOne: ()=> any,
    onPressTwo: ()=> any,
    btnContainerStyleOne?: any,
    btnContainerStyleTwo?: any,
    btnTextStyle?: any,
    btnLeftAttribute?:TouchableOpacityProps,
    btnRightAttribute?:TouchableOpacityProps
}


export type AppointmentsReducer = {
    appointments: AppointmentType[],
    doctors: DoctorType[]
}

export type AppointmentType = {
    appointmentId: string,
    doctor: {
        doctorId: string,
        doctorFullName: string,
        doctorClinic: string,
        [extraProps: string]: any
    },
    appointmentDate: string,
    appointmentTime: string,
    eventId: string|number,
    bill: {
        billId: string,
        status: string
    },
    patientName: string,
    roomId: string,
    billPath: string,
    [extraProps: string]: any
}

export type MedicineType = {
    medicineId: string,
    medicineName: string,
    timesPerDay: number,
    tabletsPerTime: number,
    shouldTakeItEvery: number,
    numberOfDays: number,
    startTime: string,
    startDate: string,
    eventId: string|number,
    listDates: ListDatesType[]
}

export type MedicinesReducer = {
    medicines: MedicineType[]
}


export type ListDatesType = {
    day: string,
    time: string
}


export type ProductType = {
    productId: string,
    productName: string,
    productDescription: string,
    productImage: string,
    productPrice: string,
    productOwner: string
}

export type CartItemType = {
    productId: string,
    quantity: number,
    finalProductPrice: number
}

export type CartType = {
    cartId: string,
    cartItems: CartItemType[],
    finalAmount: number
}

export type ProductCartReducerType = {
    products: ProductType[],
    cart: CartType
}


export type PatientAuthType = {
    authToken: string,
    patientId: string,
    patientPhone: string,
    patientName: string,
    patientEmail?: string,
    updatePermitted: boolean,
    isGuest: boolean,
    pushToken: string
}

export type DoctorAuthType = {
    authToken: string,
    doctorId: string,
    doctorPhone: string,
    doctorFullName: string,
    doctorEmail: string,
    doctorClinic: string,
    doctorCertificate: string,
    doctorPhoto: string,
    doctorPricePerHour: string,
    doctorGraduatedFrom: string,
    acquiredAppointments: AcquiredAppointmentsType[],
    isAccountActive: boolean,
    updatePermitted: string,
    pushToken: string
}

export type ResponseType = {
    message: string,
    statusCode: number,
    validations: any[],
    [otherData: string]: any
}


export type GeneralReducerType = {
    accountType: string,
    isSending: boolean,
    shouldTakeItEveryInNumber: number[],
    numberOfTabletsPerTime: number[],
    numberOfTimesPerDay: number[],
    numberOfDays: number[]
}

export type DoctorEmergencyList = {
    doctorSocketId: string,
    doctorFullName: string,
    roomId: string,
    pushToken: string
}

export type MethodType = "GET" | "POST" | "PATCH" | "DELETE" | "POSTFILE"



