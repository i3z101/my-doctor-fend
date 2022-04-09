import { StatusBar } from 'expo-status-bar';
import { LogBox, Platform, StyleSheet, Text, View } from 'react-native';
import { FC, Fragment, useEffect, useState } from 'react';
import medicalFilesReducer from "./store/reducers/medical-files-reducer";
import { combineReducers, createStore } from 'redux';
import { Provider, useDispatch, useSelector } from 'react-redux';
import appointmentsReducer from './store/reducers/appointments-reducer';
import medicinesReducer from './store/reducers/medicines-reducer';
import { SafeAreaView } from 'react-native-safe-area-context';
import utils from './helper/utils';
import { NavigationType } from './helper/types';
import patientAuthReducer from './store/reducers/patient-auth-reducer';
import NavContainer from './navigations/navigation-container';
import generalReducer from './store/reducers/general-reducer';
import doctorAuthReducer from './store/reducers/doctor-auth-reducer';

const rootReducers = combineReducers({
  medicalFiles: medicalFilesReducer,
  appointments: appointmentsReducer,
  medicines: medicinesReducer,
  patientAuth: patientAuthReducer,
  doctorAuth: doctorAuthReducer,
  generalReducer: generalReducer
})


export const store = createStore(rootReducers);

const App: FC<NavigationType> = ({navigation}) => {
  // LogBox.ignoreLogs(["[Unhandled promise rejection: Error: Error processing ICE candidate]"]);
  // LogBox.ignoreLogs(["Failed to set remote answer sdp"]);

  return (
    <Provider store={store}>
      <SafeAreaView style={{flex:1, marginTop: Platform.OS == 'android' ? utils.deviceHeight <= 667 ? 0 : 0 : 0}}>
        <StatusBar style="auto"/>
        <NavContainer/>
      </SafeAreaView>
    </Provider>
  );
}

export default App