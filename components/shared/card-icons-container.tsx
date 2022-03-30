import React, { FC } from 'react'
import { StyleSheet, View } from 'react-native'
import colors from '../../assets/colors'
import utils from '../../helper/utils'



const CardIconsContainer: FC<{containerStyle?:any}> = ({containerStyle,children}) => {
 
    return <View style={{...styles.container, ...containerStyle}}>
            <View style={styles.cardInnerContainer}>
                {children}
            </View>
    </View>
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.thirdColor,
        height:utils.deviceHeight,
        borderTopLeftRadius: 90,
        flex:1,
    },
    cardInnerContainer: {
        marginTop:'10%', 
        marginLeft: utils.deviceWidth < 395 ? '5%' : utils.deviceWidth < 500 ? '7%' : '9%',
        display:'flex',
        flexDirection:'row',
        justifyContent: 'space-between',
        flexWrap:'wrap',
        width: utils.deviceWidth < 395 ? '93%' : utils.deviceWidth < 500 ? '85%' : '65%'
    },
})

export default CardIconsContainer