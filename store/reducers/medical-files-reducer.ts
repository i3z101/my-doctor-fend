import { Reducer } from "react"
import {MedicalFileReducerType} from '../../helper/types';
import { ADD_ALL_MEDICAL_FILES, ADD_MEDICAL_FILE, UPDATE_MEDICAL_FILE } from "../actions/medical-files-actions";

const initState: MedicalFileReducerType = {
    medicalFiles: []
}


const medicalFilesReducer: Reducer<MedicalFileReducerType, any> = (state= initState, action): MedicalFileReducerType => {
    switch(action.type) {
        case ADD_ALL_MEDICAL_FILES:
            return {
                ...state,
                medicalFiles: action.medicalFiles
            }
        case ADD_MEDICAL_FILE:
            return {
                ...state,
                medicalFiles: state.medicalFiles.concat(action.medicalFile).reverse()
            }
        case UPDATE_MEDICAL_FILE:
            const updatedMedicalFileCopy = [...state.medicalFiles];
            const foundMedicalFileIndex = updatedMedicalFileCopy.findIndex((item)=>item.fileName == action.updatedMedicalFile.fileName);
            updatedMedicalFileCopy[foundMedicalFileIndex] = action.updatedMedicalFile
            return {
                ...state,
                medicalFiles: updatedMedicalFileCopy
            }
    }
    return state;
}

export default medicalFilesReducer