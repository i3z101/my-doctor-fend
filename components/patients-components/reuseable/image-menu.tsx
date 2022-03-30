import { DrawerActions, NavigationProp } from '@react-navigation/native';
import React, { FC, Fragment } from 'react';
import { Button, Platform, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { SlideInLeft } from 'react-native-reanimated';
import colors from '../../../assets/colors';
import Menu from '../../../assets/imgs-icon/menu.svg';
import { Ionicons } from '@expo/vector-icons';
import utils from '../../../helper/utils';
type ImageMenuComponent = {
    Image: any,
    navigation: NavigationProp<any>,
    hasBackElement?: boolean
}

const ImageMenu:FC<ImageMenuComponent> = ({Image, navigation, hasBackElement}) => {
    return <Fragment>
        <Animated.View entering={SlideInLeft.duration(400)} style={styles.svgIconContainer}>
        <Image style={{top:'15%'}} height={150} width={250} />
        <TouchableOpacity onPress={()=>navigation.dispatch(DrawerActions.toggleDrawer())}>
            <Menu style={styles.menu}  width={150}/>
        </TouchableOpacity>
    </Animated.View>
    {hasBackElement &&
        <TouchableOpacity onPress={()=>navigation.goBack()} style={{marginLeft: '6%', marginVertical:'-8%', zIndex:100, width:'20%'}}>
        <Animated.View entering={SlideInLeft.duration(400)}>
            <Ionicons name="chevron-back-sharp" size={50} color="white" />
        </Animated.View>
        </TouchableOpacity>
    }
    </Fragment>
}

const styles = StyleSheet.create({
    svgIconContainer: {
        display:'flex', 
        flexDirection:'row-reverse', 
        alignItems:'center', 
        position:'relative'
    },
    menu: {
        marginLeft: utils.deviceWidth < 395 ? Platform.OS == 'ios' ? 0 : '-2%' :  utils.deviceWidth < 500 ? '20%' : '35%'
    }
})


export default ImageMenu