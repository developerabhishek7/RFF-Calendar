import {StyleSheet, Platform} from 'react-native';
import * as defaultStyle from '../../../style';
import scale,{verticalScale} from "../../../helpers/scale"


const STYLESHEET_ID = 'stylesheet.day.period';
const FILLER_HEIGHT = scale(32);

export default function styleConstructor(theme={}) {
  const appStyle = {...defaultStyle, ...theme};
  return StyleSheet.create({
    wrapper: {
      alignItems: 'center',
      alignSelf: 'stretch',
      marginLeft: -1
    },
    base: {
      //borderWidth: 1,
      width: scale(32),
      height: FILLER_HEIGHT,
      alignItems: 'center',
      justifyContent:'center'
    },
    fillers: {
      position: 'absolute',
      height: FILLER_HEIGHT,
      flexDirection: 'row',
      left: 0,
      right: 0
    },
    leftFiller: {
      height: FILLER_HEIGHT,
      flex: 1
    },
    rightFiller: {
      height: FILLER_HEIGHT,
      flex: 1
    },
    text: {
      marginTop:Platform.OS === 'android' ? verticalScale(5) : verticalScale(7),
      fontSize: appStyle.textDayFontSize,
      fontFamily: appStyle.textDayFontFamily,
      fontWeight: appStyle.textDayFontWeight,
      color: appStyle.dayTextColor,
      backgroundColor: 'rgba(255, 255, 255, 0)'
    },
    today: {
      backgroundColor: appStyle.todayBackgroundColor
    },
    todayText: {
      fontWeight: '500',
      color: theme.todayTextColor || appStyle.dayTextColor
      //color: appStyle.textLinkColor
    },
    disabledText: {
      color: appStyle.textDisabledColor
    },
    quickAction: {
      backgroundColor: 'white',
      borderWidth: 1,
      borderColor: '#c1e4fe'
    },
    quickActionText: {
      marginTop: 6,
      color: appStyle.textColor
    },
    firstQuickAction: {
      backgroundColor: appStyle.textLinkColor
    },
    firstQuickActionText: {
      color: 'white'
    },
    naText: {
      color: '#b6c1cd'
    },
    ...(theme[STYLESHEET_ID] || {})
  });
}
