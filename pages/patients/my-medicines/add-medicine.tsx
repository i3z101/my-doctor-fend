import { NavigationProp, Route } from "@react-navigation/native";
import React, { FC } from "react";
import AddMedicinePage from "../../../components/patients-components/my-medicines/add-medicine";


const AddMedicine: FC<{navigation: NavigationProp<any>, route: Route<any>}> = ({navigation, route}) => {
    return <AddMedicinePage navigation={navigation} route={route} />
}


export default AddMedicine;