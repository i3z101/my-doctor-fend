import { Alert, AlertButton, Dimensions } from "react-native";
import { MethodType } from "./types";
import * as Notifications from 'expo-notifications';

const getPushTokenNotification = async () => {
    const pushToken = await Notifications.getExpoPushTokenAsync();
    return pushToken.data
  }

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
    BACKEND_URL: "https://fc6e-2001-16a2-cb2d-c700-e41f-8892-33fb-437.ngrok.io/api/v1",
    RAW_BACKEND_URL: "https://fc6e-2001-16a2-cb2d-c700-e41f-8892-33fb-437.ngrok.io",
    sendRequest,
    showAlertMessage,
    getPushTokenNotification
}