import { MedicalFileReducerType, MedicalFileType } from "../../helper/types";

export const ADD_ALL_MEDICAL_FILES = "ADD_ALL_MEDIICAL_FILES";
export const ADD_MEDICAL_FILE = "ADD_MEDICAL_FILE";
export const UPDATE_MEDICAL_FILE = "UPDATE_MEDICAL_FILE";

export default {
    addAllMedicalFiles: (medicalFiles: MedicalFileReducerType[]) => {
        return {
            type: ADD_ALL_MEDICAL_FILES,
            medicalFiles
        }
    },
    addMedicalFile: (medicalFile: MedicalFileType) => {
        return { 
            type: ADD_MEDICAL_FILE,
            medicalFile
        }
    },
    updateMedicalFile: (updatedMedicalFile: MedicalFileType)=> {
        return {
            type: UPDATE_MEDICAL_FILE,
            updatedMedicalFile
        }
    }
}