import React, { FC, RefAttributes } from "react";
import { StyleSheet, Text, TextInput, TextInputProps, View } from "react-native";

const UnderlinedTextInput: FC<{placeholder: string, validationText: string, attributes: TextInputProps, refer?:any}> = ({placeholder,validationText, attributes, refer}) => {
    return <View style={styles.inputContainer}>
        <TextInput style={styles.textInput} placeholder={placeholder} {...attributes} ref={refer ? refer : null}/>
        <Text style={styles.validationText}>{validationText}</Text> 
    </View>
}

const styles = StyleSheet.create({
    inputContainer: {
        width: '100%',
        marginBottom: '3%',
    },
    textInput: {
        alignSelf:'center',
        width: '85%',
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
        padding: '1.5%'
    },
    validationText: {
        paddingLeft:'8%', 
        fontSize:10, 
        color:'tomato'
    },
})

export default UnderlinedTextInput;