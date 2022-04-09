import { AnyAction } from "redux";
import { MedicineType } from "../../helper/types";

export const ADD_ALL_MEDICINES = "ADD_ALL_MEDICINES";
export const ADD_MEDICINE = "ADD_MEDICINE";
export const UPDATE_MEDICINE = "UPDATE_MEDICINE";
export const CLEAR_MEDICINES = "CLEAR_MEDICINES";

export default {
    addAllMedicines: (medicines: MedicineType[]): AnyAction => {
        return {
            type: ADD_ALL_MEDICINES,
            medicines
        }
    },
    addMedicine: (medicine: MedicineType): AnyAction => {
        return {
            type: ADD_MEDICINE,
            medicine
        }
    },
    updateMedicine: (medicine: MedicineType): AnyAction => {
        return {
            type: UPDATE_MEDICINE,
            medicine
        }
    },
    clearMedicines: (): AnyAction => {
        return {
            type: CLEAR_MEDICINES
        }
    }
}