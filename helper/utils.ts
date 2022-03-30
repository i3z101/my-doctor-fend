import { Alert, AlertButton, Dimensions } from "react-native";
import { MethodType } from "./types";

// const shouldTakeItEveryInNumber :number[] = [];
// const numberOfTabletsPerTime: number[] = [];
// const numberOfTimesPerDay: number[] = [];
// const numberOfDays: number[] = [];

// if(shouldTakeItEveryInNumber.length < 1 && numberOfTabletsPerTime.length < 1 && numberOfTimesPerDay.length < 1 && numberOfDays.length < 1){
//     for(let i=1; i <= 24; i++){
//         shouldTakeItEveryInNumber.push(i);
//         numberOfTabletsPerTime.push(i);
//         numberOfTimesPerDay.push(i);
//     }
//     for(let i=1; i <= 60; i++){
//         numberOfDays.push(i);
//     }
// }

const sendRequest = async (method: MethodType, url: string, data?: any,  headers?: any): Promise<Request> => {
    let sentData: Request | any = {}; 
    const defaultHeaders = {
        'Content-type': 'application/json',
        ...headers
    }
    switch(method) {
        case "GET":
            sentData = await fetch(url, {
                method: 'GET',
                headers: defaultHeaders
            })
            break;
        case "POSTFILE":
            sentData = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data',
                    ...headers
                },
                body: data
            })
            break;
        default:
            sentData = await fetch(url, {
                method: method,
                body: JSON.stringify(data),
                headers: defaultHeaders
            })
            break;
    }
    return sentData
}

const showAlertMessage = (title:string , message:string|number|any, customButton?: AlertButton[]) => {
    Alert.alert(title, message,customButton || [{
        text: "Ok",
    }])
}

export default {
    deviceWidth: Dimensions.get('screen').width,
    deviceHeight: Dimensions.get('screen').height,
    BACKEND_URL: "https://bb06-2001-16a2-cb25-a800-f1da-b62e-7f94-42ee.ngrok.io/api/v1",
    RAW_BACKEND_URL: "https://bb06-2001-16a2-cb25-a800-f1da-b62e-7f94-42ee.ngrok.io",
    sendRequest,
    showAlertMessage
}