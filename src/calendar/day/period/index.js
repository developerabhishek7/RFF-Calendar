import _ from 'lodash';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {TouchableWithoutFeedback, Text, View, Image} from 'react-native';
import {shouldUpdate} from '../../../component-updater';
import Dot from '../../dot';
import * as defaultStyle from '../../../style';
import styleConstructor from './style';
import moment from "moment"
import scale,{verticalScale} from "../../../helpers/scale"


class Day extends Component {
  static displayName = 'IGNORE';

  static propTypes = {
    // TODO: selected + disabled props should be removed
    state: PropTypes.oneOf(['selected', 'disabled', 'today', '']),
    // Specify theme properties to override specific styles for calendar parts. Default = {}
    theme: PropTypes.object,
    marking: PropTypes.any,
    onPress: PropTypes.func,
    onLongPress: PropTypes.func,
    date: PropTypes.object,
    markingExists: PropTypes.bool
  };

  constructor(props) {
    super(props);

    this.theme = {...defaultStyle, ...(props.theme || {})};
    this.style = styleConstructor(props.theme);

    this.markingStyle = this.getDrawingStyle(props.marking || []);
    this.onDayPress = this.onDayPress.bind(this);
    this.onDayLongPress = this.onDayLongPress.bind(this);
  }

  onDayPress() {
    this.props.onPress(this.props.date);
  }

  onDayLongPress() {
    this.props.onLongPress(this.props.date);
  }

  shouldComponentUpdate(nextProps) {
    const newMarkingStyle = this.getDrawingStyle(nextProps.marking);

    if (!_.isEqual(this.markingStyle, newMarkingStyle)) {
      this.markingStyle = newMarkingStyle;
      return true;
    }

    return shouldUpdate(this.props, nextProps, ['state', 'children', 'onPress', 'onLongPress']);
  }

  getDrawingStyle(marking) {
    const defaultStyle = {textStyle: {}, containerStyle: {}};
    if (!marking) {
      return defaultStyle;
    }
    if (marking.disabled) {
      defaultStyle.textStyle.color = this.theme.textDisabledColor;
    } else if (marking.selected) {
      defaultStyle.textStyle.color = this.theme.selectedDayTextColor;
    }
    const resultStyle = ([marking]).reduce((prev, next) => {
      if (next.quickAction) {
        if (next.first || next.last) {
          prev.containerStyle = this.style.firstQuickAction;
          prev.textStyle = this.style.firstQuickActionText;
          if (next.endSelected && next.first && !next.last) {
            prev.rightFillerStyle = '#c1e4fe';
          } else if (next.endSelected && next.last && !next.first) {
            prev.leftFillerStyle = '#c1e4fe';
          }
        } else if (!next.endSelected) {
          prev.containerStyle = this.style.quickAction;
          prev.textStyle = this.style.quickActionText;
        } else if (next.endSelected) {
          prev.leftFillerStyle = '#c1e4fe';
          prev.rightFillerStyle = '#c1e4fe';
        }
        return prev;
      }

      const color = next.color;
      if (next.status === 'NotAvailable') {
        prev.textStyle = this.style.naText;
      }
      if (next.startingDay) {
        prev.startingDay = {
          color
        };
      }
      if (next.endingDay) {
        prev.endingDay = {
          color
        };
      }
      if (!next.startingDay && !next.endingDay) {
        prev.day = {
          color
        };
      }
      if (next.textColor) {
        prev.textStyle.color = next.textColor;
      }
      if (marking.customTextStyle) {
        defaultStyle.textStyle = marking.customTextStyle;
      }
      if (marking.customContainerStyle) {
        defaultStyle.containerStyle = marking.customContainerStyle;
      }
      return prev;
    }, defaultStyle);
    return resultStyle;
  }

  render() {
    const flags = this.markingStyle;
    const containerStyle = [this.style.base];
    const textStyle = [this.style.text];
    let leftFillerStyle = {};
    let rightFillerStyle = {};
    let fillerStyle = {};
    let fillers;

    if (this.props.state === 'disabled') {
      textStyle.push(this.style.disabledText);
    } else if (this.props.state === 'today') {
      containerStyle.push(this.style.today);
      textStyle.push(this.style.todayText);
    }

    if (this.props.marking) {
      containerStyle.push({
        borderRadius: scale(17)
      });

      const flags = this.markingStyle;
      if (flags.textStyle) {
        textStyle.push(flags.textStyle);
      }
      if (flags.containerStyle) {
        containerStyle.push(flags.containerStyle);
      }
      if (flags.leftFillerStyle) {
        leftFillerStyle.backgroundColor = flags.leftFillerStyle;
      }
      if (flags.rightFillerStyle) {
        rightFillerStyle.backgroundColor = flags.rightFillerStyle;
      }

      if (flags.startingDay && !flags.endingDay) {
        leftFillerStyle = {
          backgroundColor: this.theme.calendarBackground
        };
        rightFillerStyle = {
          backgroundColor: "rgba(3,178,216,0.1)"
        };
        containerStyle.push({
          backgroundColor: flags.startingDay.color,
          borderRadius:scale(50)
        });
      } else if (flags.endingDay && !flags.startingDay) {
        rightFillerStyle = {
          backgroundColor: this.theme.calendarBackground
        };
        leftFillerStyle = {
          backgroundColor: "rgba(3,178,216,0.1)"
        };
        containerStyle.push({
          backgroundColor: flags.endingDay.color,
          borderRadius:scale(50)
        });
      } else if (flags.day) {
        leftFillerStyle = {backgroundColor: flags.day.color};
        rightFillerStyle = {backgroundColor: flags.day.color};
        // #177 bug
        fillerStyle = {backgroundColor: flags.day.color};
      } else if (flags.endingDay && flags.startingDay) {
        rightFillerStyle = {
          backgroundColor: this.theme.calendarBackground
        };
        leftFillerStyle = {
          backgroundColor: this.theme.calendarBackground
        };
        containerStyle.push({
          backgroundColor: flags.endingDay.color,
          borderRadius:scale(50)
        });
      }
      var rightBorderStyle = {}
      var leftBorderStyle = {}
      if( !this.props.marking.startingDay && !this.props.marking.endingDay){
        let day = moment(this.props.date.dateString).day()
        if(day == 6){
          rightBorderStyle =  {
            borderTopRightRadius : scale(20),
            borderBottomRightRadius : scale(20),
          }
        }else if( day == 0){
          leftBorderStyle =  {
            borderTopLeftRadius : scale(20),
            borderBottomLeftRadius : scale(20),
          }
        }
      }
      fillers = (
        <View style={[this.style.fillers, fillerStyle, rightBorderStyle, leftBorderStyle]}>
          <View style={[this.style.leftFiller, leftFillerStyle, leftBorderStyle]}/>
          <View style={[this.style.rightFiller, rightFillerStyle,rightBorderStyle]}/>
        </View>
      );
    }

    const {marking: {marked, dotColor}, theme} = this.props;
    return (
      <TouchableWithoutFeedback
        testID={this.props.testID}
        onPress={this.onDayPress}
        onLongPress={this.onDayLongPress}
        disabled={this.props.marking.disableTouchEvent}
        accessible
        accessibilityRole={this.props.marking.disableTouchEvent ? undefined : 'button'}
        accessibilityLabel={this.props.accessibilityLabel}
      >
        <View style={[this.style.wrapper]}>
        {(this.props.marking.startingDay && this.props.showDateRange) && <Image source={require('../../../../src/img/Vector-Left.png')} style={{position:'absolute', left:scale(-5), top:scale(15), zIndex:10, height:scale(6), width:scale(6) }}></Image>}

          {fillers}
          <View style={[containerStyle]}>
            <Text allowFontScaling={false} style={[textStyle,{fontSize:scale(16)}]}>{String(this.props.children)}</Text>
            <Dot
              theme={theme}
              isMarked={marked}
              dotColor={dotColor}
            />
          </View>
        {( this.props.marking.endingDay && this.props.showDateRange) && <Image source={require('../../../../src/img/Vector-Right.png')} style={{position:'absolute', right:scale(-5), top:scale(15), height:scale(6), width:scale(6) }}></Image>}

        </View>
      </TouchableWithoutFeedback>
    );
  }
}

export default Day;
