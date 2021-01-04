import React from 'react';
import PropTypes from 'prop-types';
import { Text,View, StyleSheet, Dimensions } from 'react-native';
import { Block, theme } from 'galio-framework';
import { LineChart, Grid, YAxis, XAxis } from 'react-native-svg-charts'
import {TempContext} from './TempContextProvider';
import { Line } from 'react-native-svg'
import EventEmitter from "react-native-eventemitter";

const screenWidth = Dimensions.get("window").width;

import { argonTheme } from '../constants';

export default class TempChartCard extends React.Component {

  state = {
    data: [],
    minValue: 100,
    maxValue: 0,
    interval: null,
    callbacks: {}
  };

  zeroPad = number => number.toString().padStart(2, '0');

  tick() {
    var today = new Date();
    var time = this.zeroPad(today.getHours()) + ":" + this.zeroPad(today.getMinutes()) + ":" + this.zeroPad(today.getSeconds());  
    var temperature = this.context.state.temperature;
    var value = {
      temperature: temperature,
      time: time
    };
    this.state.minValue = Math.min(temperature, this.state.minValue);
    this.state.maxValue = Math.max(temperature, this.state.maxValue);
    let dataset = this.state.data;
    dataset.push(value);
    if (dataset.length > 360) {
      dataset.shift();
    }
  }

  stop() {
    this.state.data = [];
  }

  componentDidMount() {
    this.state.callbacks = {
      "tempChange": () => this.tick(),
      "stopEvent": () => this.stop()
    }
    EventEmitter.on("tempChange", this.state.callbacks.tempChange);
    EventEmitter.on("stopEvent", this.state.callbacks.stopEvent);
  }

  componentWillUnmount() {
    EventEmitter.removeListener("tempChange", this.state.callbacks.tempChange);
    EventEmitter.removeListener("stopEvent", this.state.callbacks.stopEvent);
  }

  formatXLabel(_, index) {
    if (index%60 !== 0) {
      return '';
    }
    return this.state.data[index].time;
  }


  render() {
    const { style } = this.props;
    
    const cardContainer = [styles.card, styles.shadow, style];
    const imgContainer = [styles.imageContainer];    
    const contentInset = { top: 20, bottom: 20, left: 20, right: 20 }
    let data = this.state.data;

    let upperLimit = this.context.state.upperLimit;
    let lowerLimit = this.context.state.lowerLimit;
    
    var minTempValue = this.state.minValue;
    var maxTempValue = this.state.maxValue;

    var minValue = Math.min(minTempValue, lowerLimit) - 5;
    var maxValue = Math.max(maxTempValue, upperLimit) + 5;

    const HorizontalLines = (({ y }) => (
      <View>
      <Line
          key={ 'max-line' }
          x1={ '0%' }
          x2={ '100%' }
          y1={ y(upperLimit) }
          y2={ y(upperLimit) }
          stroke={ 'red' }
          strokeDasharray={ [ 4, 8 ] }
          strokeWidth={ 2 }
      />
        <Line
            key={ 'min-line' }
            x1={ '0%' }
            x2={ '100%' }
            y1={ y(lowerLimit) }
            y2={ y(lowerLimit) }
            stroke={ 'blue' }
            strokeDasharray={ [ 4, 8 ] }
            strokeWidth={ 2 }
        />
      </View>
    ))

    return (
      <Block card flex style={cardContainer}>
        <Block style={imgContainer}>
          <View style={{ height: 400 }}>
          <View style={{ height: 400, flexDirection: 'row' }}>
            <YAxis
                data={data}
                contentInset={contentInset}
                svg={{
                    fill: 'grey',
                    fontSize: 10,
                }}
                numberOfTicks={10}
                min = {minValue}
                max = {maxValue}
                yAccessor={({ item }) => item.temperature}
                formatLabel={(value) => `${value}ºC`}
            />
            <LineChart
                style={{ flex: 1 }}
                data={data}
                svg={{ stroke: 'rgb(134, 65, 244)' }}
                contentInset={contentInset}
                yMin = {minValue}
                yMax = {maxValue}
                yAccessor={({ item }) => item.temperature}
            >
            <Grid/>
            <HorizontalLines />
            </LineChart>
            </View>
            <XAxis
              data={data}
              formatLabel={(_, index) => this.formatXLabel(_, index)}
              contentInset={contentInset}
              svg={{ fontSize: 10, fill: 'black' }}
            />
          </View>
        </Block> 
      </Block>
    );
  }
  getOutputStyle() {
    return [styles.imageContainer];
  }
}

TempChartCard.contextType = TempContext;

TempChartCard.propTypes = {
  item: PropTypes.object,
  horizontal: PropTypes.bool,
  full: PropTypes.bool,
  ctaColor: PropTypes.string,
  imageStyle: PropTypes.any,
}

const styles = StyleSheet.create({
  title: {
    paddingBottom: theme.SIZES.BASE * 0.5,
    paddingHorizontal: theme.SIZES.BASE * 0.2,
    color: argonTheme.COLORS.HEADER
  },
  card: {
    backgroundColor: theme.COLORS.WHITE,
    marginVertical: theme.SIZES.BASE,
    borderWidth: 0,
    minHeight: 114,
    paddingBottom: theme.SIZES.BASE * 0.5,
    flexDirection: 'column'
  },
  cardTitle: {
    flex: 1,
    flexWrap: 'wrap',
    paddingBottom: 6
  },
  cardDescription: {
    padding: theme.SIZES.BASE / 2
  },
  imageContainer: {
    borderRadius: 3,
    overflow: 'hidden',
    padding: theme.SIZES.BASE / 2
  },
  image: {
    // borderRadius: 3,
  },
  horizontalImage: {
    height: 122,
    width: 'auto',
  },
  horizontalStyles: {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  verticalStyles: {
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0
  },
  fullImage: {
    height: 215
  },
  shadow: {
    shadowColor: theme.COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    shadowOpacity: 0.1,
    elevation: 2,
  },
  button: {
    width: 'auto',
    alignSelf: 'stretch'
  }
});