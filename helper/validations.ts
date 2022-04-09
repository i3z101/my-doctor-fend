export const validateStringOnChange = (value: string, name: string, setState: (prevState: any)=>void, keyNameInState: string, isRequired: boolean, min: number, max: number, containSpace:boolean, containNumeric: boolean, containSymbolsCharacters: boolean, symbol?:string): void => {
    let message:string = "";
    if(isRequired){
        if(value.trim() == ""){
            message = `${name} required`;
        }else if(containSpace && containNumeric && containSymbolsCharacters) {
            if(!value.trim().match(`(^[^*&^%$#@!~+-=?؟])([A-Za-z\s0-9${symbol}])+$`)){
                message = `${name} should contain english characters or numbers or ${symbol}`;
            }else if(value.length < min || value.length > max){
                message = `${name} should be between ${min} and ${max}`;
            }else {
                message = "";
            }
        }else if(containSpace && !containNumeric && containSymbolsCharacters) {
            if(!value.trim().match(`^[^*&^%$#@!~+-=?؟][A-Za-z\s ${symbol}]+$`)){
                message = `${name} should contain english character with ${symbol} as a sperator`;
            }else if(value.length < min || value.length > max){
                message = `${name} should be between ${min} and ${max}`;
            }else {
                message = "";
            }
        }else if(containSpace && !containNumeric && !containSymbolsCharacters){
            if(!value.trim().match(/^[A-Za-z\s]+$/)){
                message = `${name} should contain only english character`;
            }else if(value.length < min || value.length > max){
                message = `${name} should be between ${min} and ${max}`;
            }else {
                message = "";
            }    
        }else if(containSpace && containNumeric && !containSymbolsCharacters) {
            if(!value.trim().match(/^[A-Za-z\s0-9]+$/)){
                message = `${name} should contain english character or numbers`;
            }else if(value.length < min || value.length > max){
                message = `${name} should be between ${min} and ${max}`;
            }else {
                message = "";
            }
        }else if(!containSpace && !containNumeric && !containSymbolsCharacters) {
            if(!value.trim().match(`[A-Za-z]+$`)){
                message = `${name} should contain english character without spaces`;
            }else if(value.length < min || value.length > max){
                message = `${name} should be between ${min} and ${max}`;
            }else {
                message = "";
            }
        }else if(!containSpace && containNumeric && !containSymbolsCharacters) {
            if(!value.trim().match(`[A-Za-z]+$`)){
                message = `${name} should contain english character or numbers without spaces`;
            }else if(value.length < min || value.length > max){
                message = `${name} should be between ${min} and ${max}`;
            }else {
                message = "";
            }
        }
    }else {
        if(value.trim() == "") {
            message = ""
        }else if(containSpace && containNumeric && containSymbolsCharacters) {        
            if(!value.trim().match(`(^[^*&^%$#@!~+-=?؟])([A-Za-z\s0-9${symbol}])+$`)){
                message = `${name} should contain english characters or numbers or ${symbol}`;
            }else if(value.length < min || value.length > max){
                message = `${name} should be between ${min} and ${max}`;
            }else {
                message = "";
            }
        }else if(containSpace && !containNumeric && containSymbolsCharacters) {
            if(!value.trim().match(`^[^*&^%$#@!~+-=?؟][A-Za-z\s${symbol}]+$`)){
                message = `${name} should contain english character or ${symbol}`;
            }else if(value.length < min || value.length > max){
                message = `${name} should be between ${min} and ${max}`;
            }else {
                message = "";
            }
        }else if(containSpace && !containNumeric && !containSymbolsCharacters){
            if(!value.trim().match(`[A-Za-z\s]+$`)){
                message = `${name} should contain only english character`;
            }else if(value.length < min || value.length > max){
                message = `${name} should contain english character or ${symbol}`;
            }else {
                message = "";
            }
        }else if(containSpace && containNumeric && !containSymbolsCharacters) {
            if(!value.trim().match(`[A-Za-z\s0-9]+$`)){
                message = `${name} should contain english character or numbers`;
            }else if(value.length < min || value.length > max){
                message = `${name} should be between ${min} and ${max}`;
            }else {
                message = "";
            }
        }else if(!containSpace && !containNumeric && !containSymbolsCharacters) {
            if(!value.trim().match(`[A-Za-z]+$`)){
                message = `${name} should contain english character without spaces`;
            }else if(value.length < min || value.length > max){
                message = `${name} should contain only english character`;
            }else {
                message = "";
            }
        }else if(!containSpace && containNumeric && !containSymbolsCharacters) {
            if(!value.trim().match(`[A-Za-z]+$`)){
                message = `${name} should contain english character or numbers without spaces`;
            }else if(value.length < min || value.length > max){
                message = `${name} should be between ${min} and ${max}`;
            }else {
                message = "";
            }
        }
    }
    setState((prevSate: any)=>({
        ...prevSate,
        [keyNameInState]: {
            ...prevSate[keyNameInState],
            validation: message
        }
    }));
}

export const validatePhoneOnChange = (value: string, setState: (prevState: any)=>void, keyNameInState: string, isRequired: boolean): void => {
    let message = ""; 
    if(isRequired) {
        if(value.trim() == ""){
            message = "Phone is required"
        }else if(!value.trim().match(/^[0-9]+$/)) {
            message = "Phone number should contain numbers only";
        }
        else if(value.length < 11) {
            message = "Phone must equal 11 or 12 numbers"
        }
    }else {
        if(value.trim() == "") {
            message = ""
        }else if(!value.trim().match(/[0-9]/)) {
            message = "Phone number should contain numbers only";
        }
        else if(value.length < 12) {
            message = "Phone must equal 12 numbers"
        }
    }
    setState((prevSate: any)=>({
        ...prevSate,
        [keyNameInState]: {
            ...prevSate[keyNameInState],
            validation: message
        }
    }));
}

export const validateEmailOnChange = (value: string, setState: (prevState: any)=>void, keyNameInState: string, isRequired: boolean): void => {
    let message: string = "";
    if(isRequired) {
        if(value.trim() == "") {
            message = "Email is required"
        }else if(!value.trim().match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          )) {
              message = "Email is not valid"
          }
    }else {
       if(value.trim() == ""){
           message = ""
       }else if(!value.trim().match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          )) {
            message = "Email is not valid"
        }
    }

    setState((prevSate: any)=>({
        ...prevSate,
        [keyNameInState]: {
            ...prevSate[keyNameInState],
            validation: message
        }
    }));
}

export const validateNumericOnChange = (value: string, name:string, min: number, setState: (prevState: any)=>void, keyNameInState: string, isRequired: boolean): void => {
    let message: string = "";
    if(isRequired){
        if(value.trim() == "") {
            message = `${name} is required`;
        }else if(!value.trim().match(/^[0-9]+$/)) {
            message = `${name} must be numeric value only`;
        }else if(Number(value) < min) {
            message = `${name} must be more than or equal ${min}`
        }
    }else{
        if(value.trim() == "") {
            message = '';
        }else if(!value.trim().match(/^[0-9]+$/)) {
            message = `${name} must be numeric value only`;
        }else if(Number(value) < min) {
            message = `${name} must be more than or equal ${min}`
        }
    }
    setState((prevSate: any)=>({
        ...prevSate,
        [keyNameInState]: {
            ...prevSate[keyNameInState],
            validation: message
        }
    }));
}