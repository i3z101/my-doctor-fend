import { Reducer } from "react";
import { MedicinesReducer } from "../../helper/types";
import { ADD_ALL_MEDICINES, ADD_MEDICINE, UPDATE_MEDICINE } from "../actions/medicines-actions";

const initState: MedicinesReducer = {
    medicines: []
}



const medicinesReducer: Reducer<MedicinesReducer, any> = (state= initState, action): MedicinesReducer => {
    switch(action.type) {
        case ADD_ALL_MEDICINES:
            return {
                ...state,
                medicines: action.medicines
            }
        case ADD_MEDICINE:
            return {
                ...state,
                medicines: state.medicines.concat(action.medicine)
            }
        case UPDATE_MEDICINE:
            const medicineUpdatedCopy = [...state.medicines];
            const medicineInfoIndex = medicineUpdatedCopy.findIndex((medicine)=> medicine.medicineId == action.medicine.medicineId);
            medicineUpdatedCopy[medicineInfoIndex] = action.medicine;
            return {
                ...state,
                medicines: medicineUpdatedCopy
            }
        default:
            return state
    }
}


export default medicinesReducer

