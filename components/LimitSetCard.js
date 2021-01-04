import React from 'react';
import { withNavigation } from '@react-navigation/compat';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';
import { Block, Text, theme } from 'galio-framework';
import NumericInput from 'react-native-numeric-input';
import {TempContext} from './TempContextProvider';
import EventEmitter from "react-native-eventemitter";

import { argonTheme } from '../constants';

const titles = {
  MIN_TEMP: 'Temp. Min.',
  MAX_TEMP: 'Temp. Maks.'
}

export default class LimitSetCard extends React.Component {
  
  setUpperLimit(value) {
    this.context.state.setUpperLimit(value);
    EventEmitter.emit("limitChange");
  }
  
  setLowerLimit(value) {
    this.context.state.setLowerLimit(value);    
    EventEmitter.emit("limitChange");
  }

  render() {
    const { style, } = this.props;
    
    const cardContainer = [styles.card, styles.shadow, style];
    const imgContainer = [styles.imageContainer];

    return (
      <TempContext.Consumer> 
        {context => {
          var upperLimit = context.state.upperLimit;
          var lowerLimit = context.state.lowerLimit;
          return (
            <Block card flex style={cardContainer}>    
              <Block style={imgContainer}>
                <Text bold size={16} style={styles.title}>
                  {titles.MIN_TEMP}
                </Text>
                <Block row style={{ paddingHorizontal: theme.SIZES.BASE, flexDirection: "row" }}>
                  <Block style={{flex: 3}}>
                    <NumericInput initValue={lowerLimit} maxValue={upperLimit} type='up-down' onChange={(value) => this.setLowerLimit(value)} />
                  </Block>
                </Block>
              </Block>  
              <Block style={imgContainer}>
                <Text bold size={16} style={styles.title}>
                  {titles.MAX_TEMP}
                </Text>
                <Block row style={{ paddingHorizontal: theme.SIZES.BASE, flexDirection: "row" }}>
                  <Block style={{flex: 3}}>
                    <NumericInput initValue={upperLimit} minValue={lowerLimit} type='up-down' onChange={(value) => this.setUpperLimit(value)}/>
                  </Block>
                </Block>
              </Block>
            </Block>
          )}}
      </TempContext.Consumer> 
    );
  }

}



LimitSetCard.contextType = TempContext;

LimitSetCard.propTypes = {
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
  },
  buttonOuterLayout: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  }
});