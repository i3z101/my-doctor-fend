import { NavigationContainer } from "@react-navigation/native";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import NavPatient from "./patients-navigations/navigation-screens";
import NavDoctor from "./doctors-navigations/navigation-screens";
import AsyncStorage from "@react-native-async-storage/async-storage";
import generalActions from "../store/actions/general-actions";


const NavContainer = () => {
  const dispatch = useDispatch();
  const generalReducer = useSelector((state: any) => state.generalReducer);

  const checkAccount = async(): Promise<void> => {
    const accountType = await AsyncStorage.getItem("accountType");
    if(accountType == "doctor") {
      dispatch(generalActions.changeAccountTypeToDoctor());
    }
  }

  useEffect(()=> {
    checkAccount();
  }, [])

    return  <NavigationContainer>
        {generalReducer.accountType == "patient" ?
           <NavPatient/>
        : <NavDoctor />
        }
        </NavigationContainer>
}

export default NavContainer;