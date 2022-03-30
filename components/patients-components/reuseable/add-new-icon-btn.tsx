import { NavigationProp } from "@react-navigation/native";
import React, { FC } from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { AntDesign } from '@expo/vector-icons';

const AddNewIconBtn: FC<{onPress: ()=>void}> = ({onPress}) => {
    return <TouchableOpacity onPress={onPress} style={styles.addBtn}>
        <AntDesign name="plus" size={30} color="black" />
    </TouchableOpacity>
}

const styles = StyleSheet.create({
    addBtn: {
        display:'flex', 
        justifyContent:'flex-end', 
        alignItems:'flex-end', 
        marginLeft:'80%', 
        marginTop:'-5%', 
        width:'20%'
    },
})

export default AddNewIconBtn