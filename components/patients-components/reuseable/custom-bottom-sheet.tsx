import React, { FC, ReactChild} from "react";
import BottomSheet, { BottomSheetProps, BottomSheetScrollViewMethods } from '@gorhom/bottom-sheet';
import { Dimensions, ScrollView, ScrollViewProps, StyleProp, StyleSheet, StyleSheetProperties, Text } from "react-native";


const CustomBottomSheet: FC<{bottomSheetProps: BottomSheetProps, scrollViewProps: ScrollViewProps, scrollbale?:boolean, refValue: any, title: string, titleStyle: any}> = ({bottomSheetProps, scrollViewProps, scrollbale ,refValue, title ,children, titleStyle}) => {
    const dimension: number = Dimensions.get('screen').height;
    return dimension <= 640 || scrollbale ?
        <BottomSheet ref={refValue} {...bottomSheetProps}>
            <Text style={{...titleStyle}}>{title}</Text>
            <ScrollView {...scrollViewProps}>
                {children}
            </ScrollView>
        </BottomSheet>
    : <BottomSheet ref={refValue} {...bottomSheetProps}>
        <Text style={{...titleStyle}}>{title}</Text>
        {children}
    </BottomSheet>
} 

export default CustomBottomSheet;