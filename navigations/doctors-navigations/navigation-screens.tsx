import AsyncStorage from "@react-native-async-storage/async-storage";
import { createDrawerNavigator, DrawerContent, DrawerContentScrollView, DrawerItem, DrawerItemList } from "@react-navigation/drawer";
import { DrawerNavigationHelpers } from "@react-navigation/drawer/lib/typescript/src/types";
import { DrawerActions, NavigationProp, StackActions } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { Button, Text } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import colors from "../../assets/colors";
import MyInfoPage from "../../components/doctors-components/my-info/my-info";
import utils from "../../helper/utils";
import Index from "../../pages/doctors";
import CallPatient from "../../pages/doctors/appointments/call-patient";
import DoctorAppointments from "../../pages/doctors/appointments/doctor-appointments";
import Emergency from "../../pages/doctors/emergency/emergency";
import MedicalFiles from "../../pages/doctors/medical-files/medical-files";
import RegisterLoginDoctor from "../../pages/doctors/register-login/register-login";
import appointmentsActions from "../../store/actions/appointments-actions";
import { doctorAuthActions } from "../../store/actions/auth-actions";
import medicalFilesActions from "../../store/actions/medical-files-actions";

const Stack = createNativeStackNavigator();

const Drawer = createDrawerNavigator();

const NavStack = () => {
    return <Stack.Navigator  initialRouteName="index">
        <Stack.Group screenOptions={{
            gestureEnabled: false,
            fullScreenGestureEnabled: false,
        }}
        >
            <Stack.Screen name="index" component={Index} options={{
                headerShown: false
            }} />
            <Stack.Screen name="doctor-appointments" component={DoctorAppointments} options={{
                headerShown: false
            }}/>
            <Stack.Screen name="call-patient" component={CallPatient} options={{
                headerShown: false
            }}/>
            <Stack.Screen name="medical-files" component={MedicalFiles} options={{
                headerShown: false
            }}/>
            <Stack.Screen name="emergency" component={Emergency} options={{
                headerShown: false
            }}/>
            <Stack.Screen name="my-info" component={MyInfoPage} options={{
                headerShown: false
            }}/>
        </Stack.Group>
        <Stack.Screen name="register-login" component={RegisterLoginDoctor} options={{
                headerShown: false
        }}
        />
    </Stack.Navigator>
}


const NavDrawer = () => {
    const dispatch = useDispatch();
    const doctorAuthReducer = useSelector((state:any)=>state.doctorAuth);
    const logoutHandler = async(navigation: DrawerNavigationHelpers) => {
        await AsyncStorage.removeItem("doctor-auth");
        dispatch(doctorAuthActions.logout());
        dispatch(appointmentsActions.clearAppointmentsAndDoctors());
        dispatch(medicalFilesActions.clearMedicalFiles());
        navigation.dispatch(StackActions.replace('register-login'))
        await utils.sendRequest('PATCH', `${utils.BACKEND_URL}/doctors/logout`, {}, {'Authorization': `BEARER ${doctorAuthReducer.authToken}`});
    }

    return <Drawer.Navigator screenOptions={{
        drawerActiveBackgroundColor: colors.mainColor,
        drawerActiveTintColor: colors.thirdColor,
        drawerType:'front'
    }}
    drawerContent = {(props)=> {
        return <DrawerContentScrollView {...props}>
                <DrawerItemList {...props} />
                {doctorAuthReducer.authToken != "" && 
                <DrawerItem
                label={"Logout"}
                onPress={()=>logoutHandler(props.navigation)}
                labelStyle={{color: 'tomato', fontSize: 14, fontWeight:'600', textAlign:'center'}}
                />
                }
            </DrawerContentScrollView>
    }}
    >
        <Drawer.Screen name="index-drawer" component={NavStack} options={{
            headerShown:false,
            title: 'Home 🏠',
            swipeEnabled: false,
            gestureEnabled: false
        }}/>
    </Drawer.Navigator>
}

export default NavDrawer