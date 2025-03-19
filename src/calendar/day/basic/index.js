import React, { Component } from 'react';
import { TouchableOpacity, Text, View, ImageBackground } from 'react-native';
import PropTypes from 'prop-types';
import { shouldUpdate } from '../../../component-updater';
import Dot from '../../dot';
import styleConstructor from './style';
import { Platform } from "react-native";
import scale, { verticalScale } from "../../../helpers/scale"

const appFonts = {
  INTER_REGULAR: "Inter-Regular",
  INTER_SEMI_BOLD: "Inter-SemiBold",
  INTER_BOLD: "Inter-Bold",
  SITIKA_REGULAR: "sitka-small",
  SITIKA_BOLD: "sitka-medium",
  SITIKA_SEMIBOLD: "sitka-large",
};

class Day extends Component {
  static displayName = 'IGNORE';

  static propTypes = {
    // TODO: disabled props should be removed
    state: PropTypes.oneOf(['disabled', 'today', '']),
    // Specify theme properties to override specific styles for calendar parts. Default = {}
    theme: PropTypes.object,
    marking: PropTypes.any,
    onPress: PropTypes.func,
    onLongPress: PropTypes.func,
    date: PropTypes.object,
    disableAllTouchEventsForDisabledDays: PropTypes.bool,
    isOffPeakFare: PropTypes.bool
  };

  constructor(props) {
    super(props);
    this.state = {
      circleType: 0,
      isOutBounded: this.props.isOutBounded,
      classSelected: this.props.classSelected,
      selectedDate: this.props.classSelected,
    }

    this.style = styleConstructor(props.theme);
    this.todayColor = '#03B2D8'
    this.onDayPress = this.onDayPress.bind(this);
    this.onDayLongPress = this.onDayLongPress.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.forceUpdate()
    if (this.props !== nextProps) {
      this.setState({
        classSelected: nextProps.classSelected,
        isOutBounded: nextProps.isOutBounded,
        selectedDate: nextProps.selectedDate,

      })
      this.forceUpdate()
      var classData = this.props.classSelected
      var availabilityData = this.props.theme.availabilityData.availability
      var availabilityArray = []
      if (availabilityData) {
        Object.entries(availabilityData).map(item => {
          availabilityArray.push(item[1])
        })

        let flag = 0
        for (let index = 0; index < classData.length; index++) {
          if (classData[index] && availabilityArray[index]) {
            flag = flag + 1
          }
        }
        this.setState({
          circleType: flag
        })
      }
    }
  }

  componentWillMount() {
    var classData = this.props.classSelected
    var availabilityData = this.props.theme.availabilityData.availability
    var availabilityArray = []
    if (availabilityData) {
      Object.entries(availabilityData).map(item => {
        availabilityArray.push(item[1])
      })

      let flag = 0

      for (let index = 0; index < classData.length; index++) {

        if (classData[index] && availabilityArray[index]) {
          flag = flag + 1
        }
      }
      this.setState({
        circleType: flag
      })
    }

  }
  componentDidMount() {
  }

  onDayPress() {
    this.props.onPress(this.props.date);
  }
  onDayLongPress() {
    this.props.onLongPress(this.props.date);
  }

  shouldComponentUpdate(nextProps) {
    return shouldUpdate(this.props, nextProps, [
      'state',
      'children',
      'marking',
      'onPress',
      'onLongPress',
    ]);
  }
  getBackgroundColor(details) {

    var data
    if (this.state.isOutBounded) {
      data = this.props.theme.availabilityData.outbound_availability
    } else {
      data = this.props.theme.availabilityData.inbound_availability
    }
    if (data[details.dateString]) {
      if (data[details.dateString].peak || !this.props.isOffPeakValue) {
        return 'white'
      } else {
        return '#C7E4F4'
      }

    }
  }

  getTextColor(details) {
    var data
    if (this.state.isOutBounded) {
      data = this.props.theme.availabilityData.outbound_availability
    } else {
      data = this.props.theme.availabilityData.inbound_availability
    }
    if (data[details.dateString]) {
      if (data[details.dateString].peak) {
        return '#132C52'
      } else {
        return '#132C52'

      }
    }

  }

  getEconomyColor(data, details, passengerCount) {
    if (data[details.dateString].economy && data[details.dateString].economy.seats >= passengerCount) {
      return '#2044FF'
    } else {
      return 'rgb(231,237,241)'
    }
  }
  getPremiumColor(data, details, passengerCount) {
    if (data[details.dateString].premium && data[details.dateString].premium.seats >= passengerCount) {
      return '#FEA41D'
    } else {
      return 'rgb(231,237,241)'
    }

  }
  getBusinessColor(data, details, passengerCount) {
    if (data[details.dateString].business && data[details.dateString].business.seats >= passengerCount) {
      return '#A905F6'
    } else {
      return 'rgb(231,237,241)'
    }
  }

  getFirstColor(data, details, passengerCount) {
    if (data[details.dateString].first && data[details.dateString].first.seats >= passengerCount) {
      return '#ED1870'
    } else {
      return 'rgb(231,237,241)'
    }
  }


  getFullCircelColor(details) {
    var data;
    var passengerCount = this.props.passengerCount
    if (this.state.isOutBounded) {
      data = this.props.theme.availabilityData.outbound_availability
    } else {
      data = this.props.theme.availabilityData.inbound_availability
    }

    let classes = this.state.classSelected
    let index = -1
    for (i = 0; i < classes.length; i++) {
      if (classes[i] == true) {
        index = i
      }
    }
    if (!data[details.dateString]) {
      return 'white'
    } else {
      switch (index) {
        case 0: {
          return this.getEconomyColor(data, details, passengerCount)
        }
        case 1: {
          return this.getPremiumColor(data, details, passengerCount)
        }
        case 2: {
          return this.getBusinessColor(data, details, passengerCount)
        }
        case 3: {
          return this.getFirstColor(data, details, passengerCount)
        }
        default: {
          return 'rgb(231,237,241)'
        }
      }
    }
  }

  getQuarterCircleColor(details, index) {
    var data;
    var passengerCount = this.props.passengerCount
    if (this.state.isOutBounded) {
      data = this.props.theme.availabilityData.outbound_availability
    } else {
      data = this.props.theme.availabilityData.inbound_availability
    }
    color = this.getBackgroundColor(details)
    if (!data[details.dateString]) {
      return 'white'
    } else {
      switch (index) {
        case 1: {
          return this.getFirstColor(data, details, passengerCount)

        }
        case 2: {
          return this.getEconomyColor(data, details, passengerCount)
        }
        case 3: {
          return this.getBusinessColor(data, details, passengerCount)
        }
        case 4: {

          return this.getPremiumColor(data, details, passengerCount)
        }
      }
    }
  }

  getHalfCircleColor(details, index) {
    var data;
    if (this.state.isOutBounded) {
      data = this.props.theme.availabilityData.outbound_availability
    } else {
      data = this.props.theme.availabilityData.inbound_availability

    }
    let classes = this.state.classSelected
    var availabilityData = this.props.theme.availabilityData.availability
    var availabilityArray = []
    var passengerCount = this.props.passengerCount
    if (availabilityData) {
      Object.entries(availabilityData).map(item => {
        availabilityArray.push(item[1])
      })
    }
    let indexArray = []
    for (i = 0; i < classes.length; i++) {
      if (classes[i] && availabilityArray[i]) {
        indexArray.push(i)
      }
    }
    if (!data[details.dateString]) {
      return 'white'
    } else {
      switch (index) {
        case 1: {
          switch (indexArray[1]) {
            case 0: {
              return this.getEconomyColor(data, details, passengerCount)
            }
            case 1: {
              return this.getPremiumColor(data, details, passengerCount)
            }
            case 2: {
              return this.getBusinessColor(data, details, passengerCount)
            }
            case 3: {
              return this.getFirstColor(data, details, passengerCount)
            }

          }
        }
        case 2: {
          switch (indexArray[0]) {
            case 0: {
              return this.getEconomyColor(data, details, passengerCount)
            }
            case 1: {
              return this.getPremiumColor(data, details, passengerCount)
            }
            case 2: {
              return this.getBusinessColor(data, details, passengerCount)
            }
            case 3: {
              return this.getFirstColor(data, details, passengerCount)
            }

          }
        }
      }
    }

  }

  threePartCircleColor(details, index) {
    var data;
    if (this.state.isOutBounded) {
      data = this.props.theme.availabilityData.outbound_availability
    } else {
      data = this.props.theme.availabilityData.inbound_availability

    }
    var passengerCount = this.props.passengerCount
    let classes = this.state.classSelected
    let indexArray = []
    for (i = 0; i < classes.length; i++) {
      if (classes[i] == true) {
        indexArray.push(i)
      }
    }
    if (!data[details.dateString]) {
      return 'white'
    } else {
      switch (index) {
        case 1: {
          switch (indexArray[0]) {
            case 0: {
              return this.getEconomyColor(data, details, passengerCount)
            }
            case 1: {
              return this.getPremiumColor(data, details, passengerCount)
            }
            case 2: {
              return this.getBusinessColor(data, details, passengerCount)
            }
            case 3: {
              return this.getFirstColor(data, details, passengerCount)
            }

          }
        }
        case 2: {
          switch (indexArray[1]) {
            case 0: {
              return this.getEconomyColor(data, details, passengerCount)
            }
            case 1: {
              return this.getPremiumColor(data, details, passengerCount)
            }
            case 2: {
              return this.getBusinessColor(data, details, passengerCount)
            }
            case 3: {
              return this.getFirstColor(data, details, passengerCount)
            }

          }
        }
        case 3: {
          switch (indexArray[2]) {
            case 0: {
              return this.getEconomyColor(data, details, passengerCount)
            }
            case 1: {
              return this.getPremiumColor(data, details, passengerCount)
            }
            case 2: {
              return this.getBusinessColor(data, details, passengerCount)
            }
            case 3: {
              return this.getFirstColor(data, details, passengerCount)
            }

          }
        }
      }
    }


  }



  halfCirclesView(date, detail, isDisabled) {
    let i = 0.75
    return (
      <TouchableOpacity onPress={() => {
        this.onDayPress()
      }}>
        <View style={{ borderColor: this.state.selectedDate && this.state.selectedDate.dateString == detail.dateString ? '#03B2D8' : 'white', borderWidth: this.state.selectedDate && this.state.selectedDate.dateString == detail.dateString ? scale(5) : 0, borderRadius: scale(20), justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
          <View>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ height: scale(40) * i, width: scale(20) * i, backgroundColor: 'transparent', overflow: 'hidden' }}>
                <View style={{ position: 'absolute', top: 0, left: 0, height: scale(40) * i, width: scale(40) * i, borderRadius: scale(20) * i, borderWidth: scale(2.5), borderColor: isDisabled && isDisabled.color !== this.todayColor ? 'white' : this.getHalfCircleColor(detail, 1) }} />
              </View>
              <View style={{ height: scale(40) * i, width: scale(20) * i, backgroundColor: 'transparent', overflow: 'hidden' }}>
                <View style={{ position: 'absolute', top: 0, right: 0, height: scale(40) * i, width: scale(40) * i, borderRadius: scale(20) * i, borderWidth: scale(2.5), borderColor: isDisabled && isDisabled.color !== this.todayColor ? 'white' : this.getHalfCircleColor(detail, 2) }} />
              </View>
            </View>
            <View style={{ position: 'absolute', left: scale(18) * i, height: scale(40) * i, width: scale(4) * i, backgroundColor: 'white' }} />
            <View style={{ position: 'absolute', top: scale(5.5) * i, left: scale(5.5) * i, justifyContent: 'center', alignItems: 'center', backgroundColor: isDisabled && isDisabled.color !== this.todayColor ? 'white' : this.getBackgroundColor(detail), borderRadius: scale(15) * i, height: scale(29) * i, width: scale(29) * i, borderWidth: 0.7, borderColor: "#FFF", fontFamily: appFonts.INTER_REGULAR }}>
              <Text style={{ fontSize: isDisabled && isDisabled.color !== this.todayColor ? scale(14) : scale(14) * i, color: isDisabled && isDisabled.color !== this.todayColor ? '#E1E4E7' : this.getTextColor(detail), fontFamily: appFonts.INTER_REGULAR, fontWeight: '500' }}>
                {String(date)}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  threePartCirclesView(date, detail, isDisabled) {
    let i = 0.75
    return (
      <TouchableOpacity onPress={() => {
        this.onDayPress()
      }}>
        <View style={{
          borderColor: this.state.selectedDate && this.state.selectedDate.dateString == detail.dateString ? '#03B2D8' : 'white', borderWidth: this.state.selectedDate && this.state.selectedDate.dateString == detail.dateString ? scale(5) : 0, borderRadius: scale(20), justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', transform: [{ rotate: '0deg' }]
        }}>
          <View style={{ height: scale(40) * i, overflow: 'hidden' }}>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ height: scale(22) * i, width: scale(20) * i, backgroundColor: 'transparent', overflow: 'hidden' }}>
                <View style={{ position: 'absolute', top: 0, left: 0, height: scale(40) * i, width: scale(40) * i, borderRadius: scale(20) * i, borderWidth: scale(2), borderColor: isDisabled && isDisabled.color !== this.todayColor ? 'white' : this.threePartCircleColor(detail, 3) }} />
              </View>
              <View style={{ height: scale(22) * i, width: scale(20) * i, backgroundColor: 'transparent', overflow: 'hidden' }}>
                <View style={{ position: 'absolute', top: 0, right: 0, height: scale(40) * i, width: scale(40) * i, borderRadius: scale(20) * i, borderWidth: scale(2), borderColor: isDisabled && isDisabled.color !== this.todayColor ? 'white' : this.threePartCircleColor(detail, 1) }} />
              </View>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ height: scale(17.3) * i, width: scale(40) * i, backgroundColor: 'transparent', overflow: 'hidden' }}>
                <View style={{ position: 'absolute', bottom: 0, left: 0, height: scale(40) * i, width: scale(40) * i, borderRadius: scale(20) * i, borderWidth: scale(2), borderColor: isDisabled && isDisabled.color !== this.todayColor ? 'white' : this.threePartCircleColor(detail, 2) }} />
              </View>
            </View>
            <View style={{ position: 'absolute', left: scale(18) * i, height: scale(3) * i, width: scale(4) * i, backgroundColor: 'white' }} />
            <View style={{ position: 'absolute', height: scale(4) * i, top: scale(22) * i, width: scale(5) * i, backgroundColor: 'white', transform: [{ rotate: '70deg' }] }} />
            <View style={{ position: 'absolute', height: scale(4) * i, top: scale(22) * i, left: scale(36) * i, width: scale(5) * i, backgroundColor: 'white', transform: [{ rotate: '-70deg' }] }} />
            <View style={{ position: 'absolute', height: scale(30) * i, width: scale(30) * i, justifyContent: 'center', alignItems: 'center', backgroundColor: isDisabled && isDisabled.color !== this.todayColor ? 'white' : this.getBackgroundColor(detail), borderRadius: scale(15) * i, top: scale(5) * i, left: scale(5) * i, borderWidth: 0.7, borderColor: "#FFF" }}>
              <Text style={{ fontSize: isDisabled && isDisabled.color !== this.todayColor ? scale(14) : scale(14) * i, color: isDisabled && isDisabled.color !== this.todayColor ? '#E1E4E7' : this.getTextColor(detail), fontFamily: appFonts.INTER_REGULAR, fontWeight: '500' }}>
                {String(date)}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )
  }



  fullCircle(date, detail, isDisabled) {
    let i = 0.75
    return (
      <TouchableOpacity onPress={() => {
        this.onDayPress()
      }}>
        <View
          style={{
            borderColor: this.state.selectedDate && this.state.selectedDate.dateString == detail.dateString ? '#03B2D8' : 'white', borderWidth: this.state.selectedDate && this.state.selectedDate.dateString == detail.dateString ? scale(5) : 0, borderRadius: scale(20),
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'white',
          }}>
          <View>
            <View style={{ flexDirection: 'row' }}>
              <View
                style={{
                  height: scale(40) * i,
                  width: scale(40) * i,
                  backgroundColor: 'transparent',
                }}>
                <View
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    height: scale(40) * i,
                    width: scale(40) * i,
                    borderRadius: scale(20) * i,
                    borderWidth: scale(2.5),
                    borderColor: isDisabled && isDisabled.color !== this.todayColor ? 'white' : this.getFullCircelColor(detail),
                  }}
                />
              </View>
            </View>
            <View
              style={{
                position: 'absolute',
                top: scale(5.5) * i,
                left: scale(5.5) * i,
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
                backgroundColor: isDisabled && isDisabled.color !== this.todayColor ? 'white' : this.getBackgroundColor(detail),
                borderRadius: Platform.OS == 'android' ? scale(16) * i : scale(15) * i,
                height: Platform.OS == 'android' ? scale(30) * i : scale(29) * i,
                width: Platform.OS == 'android' ? scale(30) * i : scale(29) * i,
                borderWidth: 0.7, borderColor: "#FFF"
              }}>
              <Text style={{ fontSize: isDisabled && isDisabled.color !== this.todayColor ? scale(14) : scale(14) * i, color: isDisabled && isDisabled.color !== this.todayColor ? '#E1E4E7' : this.getTextColor(detail), alignSelf: 'center', fontFamily: appFonts.INTER_REGULAR, fontWeight: '500' }}>
                {String(date)}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  quarterCirclesView(date, detail, isDisabled) {
    let i = 0.75
    return (
      <TouchableOpacity onPress={() => {
        this.onDayPress()
      }}>
        <View style={{
          borderColor: this.state.selectedDate && this.state.selectedDate.dateString == detail.dateString ? '#03B2D8' : 'white', borderWidth: this.state.selectedDate && this.state.selectedDate.dateString == detail.dateString ? 5 : 0, borderRadius: 20,
          justifyContent: 'center', alignItems: 'center', backgroundColor: 'white'
        }}>
          <View style={{ height: scale(40) * i, overflow: 'hidden' }}>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ height: scale(20) * i, width: scale(20) * i, backgroundColor: 'transparent', overflow: 'hidden' }}>
                <View style={{ position: 'absolute', top: 0, left: 0, height: scale(40) * i, width: scale(40) * i, borderRadius: scale(20) * i, borderWidth: scale(2.5), borderColor: isDisabled && isDisabled.color !== '#03B2D8' ? 'white' : this.getQuarterCircleColor(detail, 1) }} />
              </View>
              <View style={{ height: scale(20) * i, width: scale(20) * i, backgroundColor: 'transparent', overflow: 'hidden' }}>
                <View style={{ position: 'absolute', top: 0, right: 0, height: scale(40) * i, width: scale(40) * i, borderRadius: scale(20) * i, borderWidth: scale(2.5), borderColor: isDisabled && isDisabled.color !== '#03B2D8' ? 'white' : this.getQuarterCircleColor(detail, 2) }} />
              </View>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ height: scale(20) * i, width: scale(20) * i, backgroundColor: 'transparent', overflow: 'hidden' }}>
                <View style={{ position: 'absolute', bottom: 0, left: 0, height: scale(40) * i, width: scale(40) * i, borderRadius: scale(20) * i, borderWidth: scale(2.5), borderColor: isDisabled && isDisabled.color !== '#03B2D8' ? 'white' : this.getQuarterCircleColor(detail, 3) }} />
              </View>
              <View style={{ height: scale(20) * i, width: scale(20) * i, backgroundColor: 'transparent', overflow: 'hidden' }}>
                <View style={{ position: 'absolute', bottom: 0, right: 0, height: scale(40) * i, width: scale(40) * i, borderRadius: scale(20) * i, borderWidth: scale(2.5), borderColor: isDisabled && isDisabled.color !== '#03B2D8' ? 'white' : this.getQuarterCircleColor(detail, 4) }} />
              </View>
            </View>
            <View style={{ position: 'absolute', left: scale(18) * i, height: scale(40) * i, width: scale(4) * i, backgroundColor: 'white' }} />
            <View style={{ position: 'absolute', top: scale(18) * i, height: scale(4) * i, width: scale(40) * i, backgroundColor: 'white' }} />
            <View style={{ position: 'absolute', top: scale(5.5) * i, left: scale(5.2) * i, justifyContent: 'center', alignItems: 'center', backgroundColor: isDisabled && isDisabled.color !== '#03B2D8' ? 'white' : this.getBackgroundColor(detail), borderRadius: scale(15) * i, height: scale(29) * i, width: scale(29) * i, borderWidth: 0.7, borderColor: "#FFF" }}>
              <Text style={{ fontSize: isDisabled && isDisabled.color !== '#03B2D8' ? scale(14) : scale(14) * i, color: isDisabled && isDisabled.color !== '#03B2D8' ? '#E1E4E7' : this.getTextColor(detail), fontFamily: appFonts.INTER_REGULAR, fontWeight: '500' }}>
                {String(date)}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )
  }
  getAppropriateCircle(textStyle, containerStyle) {
    if (this.state.circleType == 4) {
      return this.quarterCirclesView(this.props.children, this.props.date, textStyle[1])
    } else if (this.state.circleType == 3) {
      return this.threePartCirclesView(this.props.children, this.props.date, textStyle[1])
    } else if (this.state.circleType == 2) {
      return this.halfCirclesView(this.props.children, this.props.date, textStyle[1])
    } else if (this.state.circleType == 1) {
      return this.fullCircle(this.props.children, this.props.date, textStyle[1])
    } else {
      return <TouchableOpacity
        testID={this.props.testID}
        style={containerStyle}
        onPress={this.onDayPress}
        onLongPress={this.onDayLongPress}
        activeOpacity={activeOpacity}
        disabled={shouldDisableTouchEvent}
        accessibilityRole={isDisabled ? undefined : 'button'}
        accessibilityLabel={this.props.accessibilityLabel}
      >
        <Text allowFontScaling={false} style={textStyle}>{String(this.props.children)}</Text>
        <Dot
          theme={theme}
          isMarked={marked}
          dotColor={dotColor}
          isSelected={selected}
          isToday={isToday}
          isDisabled={isDisabled}
        />
      </TouchableOpacity>
    }
  }

  render() {
    const { theme, disableAllTouchEventsForDisabledDays } = this.props;
    const containerStyle = [this.style.base];
    const textStyle = [this.style.text];
    let marking = this.props.marking || {};
    if (marking && marking.constructor === Array && marking.length) {
      marking = {
        marking: true,
      };
    }

    const isDisabled =
      typeof marking.disabled !== 'undefined'
        ? marking.disabled
        : this.props.state === 'disabled';
    const isToday = this.props.state === 'today';

    const {
      marked,
      dotColor,
      selected,
      selectedColor,
      selectedTextColor,
      activeOpacity,
      disableTouchEvent,
    } = marking;

    if (selected) {
      containerStyle.push(this.style.selected);
      textStyle.push(this.style.selectedText);

      if (selectedColor) {
        containerStyle.push({ backgroundColor: selectedColor });
      }

      if (selectedTextColor) {
        textStyle.push({ color: selectedTextColor });
      }
    } else if (isDisabled) {
      textStyle.push(this.style.disabledText);
    } else if (isToday) {
      containerStyle.push(this.style.today);
      textStyle.push(this.style.todayText);
    }

    let shouldDisableTouchEvent = false;
    if (typeof disableTouchEvent === 'boolean') {
      shouldDisableTouchEvent = disableTouchEvent;
    } else if (
      typeof disableAllTouchEventsForDisabledDays === 'boolean' &&
      isDisabled
    ) {
      shouldDisableTouchEvent = disableAllTouchEventsForDisabledDays;
    }
    if (this.state.circleType > 1 || this.state.circleType == 1) {
      return (
        this.getAppropriateCircle(textStyle, containerStyle)

      )
    } else {
      return (
        <TouchableOpacity
          testID={this.props.testID}
          style={containerStyle}
          onPress={this.onDayPress}
          onLongPress={this.onDayLongPress}
          activeOpacity={activeOpacity}
          disabled={shouldDisableTouchEvent}
          accessibilityRole={isDisabled ? undefined : 'button'}
          accessibilityLabel={this.props.accessibilityLabel}
        >
          <Text allowFontScaling={false} style={textStyle}>{String(this.props.children)}</Text>
          <Dot
            theme={theme}
            isMarked={marked}
            dotColor={dotColor}
            isSelected={selected}
            isToday={isToday}
            isDisabled={isDisabled}
          />
        </TouchableOpacity>
      )
    }
  }
}

export default Day;
