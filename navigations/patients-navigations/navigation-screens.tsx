import AsyncStorage from "@react-native-async-storage/async-storage";
import { createDrawerNavigator, DrawerContent, DrawerContentScrollView, DrawerItem, DrawerItemList } from "@react-navigation/drawer";
import { DrawerNavigationHelpers } from "@react-navigation/drawer/lib/typescript/src/types";
import { DrawerActions, NavigationProp, StackActions } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { Button, Text } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import colors from "../../assets/colors";
import Index from "../../pages/patients";
import AppointmentConfirmation from "../../pages/patients/appointments/appointment-confirmation";
import AppointmentDate from "../../pages/patients/appointments/appointment-date";
import Appointments from "../../pages/patients/appointments/appointments";
import CallDoctor from "../../pages/patients/call-doctor/call-doctor";
import CallScreen from "../../pages/patients/call-doctor/call-screen";
import Epharmacy from "../../pages/patients/e-pharmacy/e-pharmacy";
import Emergency from "../../pages/patients/emergency/emergency";
import DoctorEmergencyList from "../../pages/patients/emergency/emergency-doctor-list";
import AddMedicalFile from "../../pages/patients/medical-files/add-medical-file";
import MedicalFiles from "../../pages/patients/medical-files/medical-files";
import MyInfo from "../../pages/patients/my-info/my-info";
import AddMedicine from "../../pages/patients/my-medicines/add-medicine";
import MyMedicine from "../../pages/patients/my-medicines/my-medicine";
import RegisterLogin from "../../pages/patients/register-login/register-login";
import appointmentsActions from "../../store/actions/appointments-actions";
import { patientAuthActions } from "../../store/actions/auth-actions";
import medicalFilesActions from "../../store/actions/medical-files-actions";
import medicinesActions from "../../store/actions/medicines-actions";

const Stack = createNativeStackNavigator();

const Drawer = createDrawerNavigator();

const NavStack = () => {
    const patientAuthReducer = useSelector((state:any)=> state.patientAuth);
    return <Stack.Navigator  initialRouteName="index">
        <Stack.Group screenOptions={{
            gestureEnabled: false,
            fullScreenGestureEnabled: false,
        }}
        >
            <Stack.Screen name="index" component={Index} options={{
                headerShown: false
            }} />
            <Stack.Screen name="appointments" component={Appointments} options={{
                headerShown: false
            }}/>
            <Stack.Screen name="appointment-date" component={AppointmentDate} options={{
                headerShown: false
            }}/>
            <Stack.Screen name="appointment-confirmation" component={AppointmentConfirmation} options={{
                headerShown: false
            }}/>
            <Stack.Screen name="call-doctor" component={CallDoctor} options={{
                headerShown: false
            }}/>
            <Stack.Screen name="call-screen" component={CallScreen} options={{
                headerShown: false
            }}/>
            <Stack.Screen name="e-pharmacy" component={Epharmacy} options={{
                headerShown: false
            }}/>
            <Stack.Screen name="medical-files" component={MedicalFiles} options={{
                headerShown: false
            }}/>
            <Stack.Screen name="add-medical-file" component={AddMedicalFile} options={{
                headerShown: false
            }}/>
            <Stack.Screen name="my-medicines" component={MyMedicine} options={{
                headerShown: false
            }}/>
            <Stack.Screen name="add-medicine" component={AddMedicine} options={{
                headerShown: false
            }}/>
            <Stack.Screen name="emergency" component={Emergency} options={{
                headerShown: false
            }}/>
            <Stack.Screen name="doctors-emergency" component={DoctorEmergencyList} options={{
                headerShown: false
            }}/>
            <Stack.Screen name="my-info" component={MyInfo} options={{
                headerShown: false
            }}/>
        </Stack.Group>
        <Stack.Screen name="register-login" component={RegisterLogin} options={{
                headerShown: false
        }}
        />
    </Stack.Navigator>
}


const NavDrawer = () => {
    const dispatch = useDispatch();
    const patientAuthReducer = useSelector((state:any)=>state.patientAuth);
    const logoutHandler = async(navigation: DrawerNavigationHelpers) => {
        await AsyncStorage.removeItem("patient-auth");
        navigation.dispatch(StackActions.replace('index'))
        dispatch(patientAuthActions.logout());
        dispatch(appointmentsActions.clearAppointmentsAndDoctors());
        dispatch(medicalFilesActions.clearMedicalFiles());
        dispatch(medicinesActions.clearMedicines())
    }

    return <Drawer.Navigator screenOptions={{
        drawerActiveBackgroundColor: colors.mainColor,
        drawerActiveTintColor: colors.thirdColor,
        drawerType:'front'
    }}
    drawerContent = {(props)=> {
        return <DrawerContentScrollView {...props}>
                <DrawerItemList {...props} />
                {patientAuthReducer.authToken != "" && 
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
        <Drawer.Screen name="about" component={NavStack} options={{
            headerShown:false,
            title: 'Cart 🛒',
            swipeEnabled: false,
            gestureEnabled: false
        }}/>
        <Drawer.Screen name="contact" component={NavStack} options={{
            headerShown:false,
            title: 'Contact 📧',
            swipeEnabled: false,
            gestureEnabled: false
        }}/>
    </Drawer.Navigator>
}

export default NavDrawer