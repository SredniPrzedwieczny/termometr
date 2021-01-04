import React from 'react';
import { StyleSheet, ToastAndroid } from 'react-native';
import { Block, theme, Text } from 'galio-framework';
import { TempContext } from './TempContextProvider';
import Button from './Button';
import EventEmitter from "react-native-eventemitter";


import { argonTheme } from '../constants';

const titles = {
  START: 'Start',
  STOP: 'Stop'
}

export default class StartMeasCard extends React.Component {

  onButton = (context) => {
    let newIsRunning = context.state.isRunning === false;
    context.state.setIsRunning(newIsRunning);
    if (newIsRunning) {        
      EventEmitter.emit("startEvent");
      this.showToast("Rozpoczynam pomiar.");
    } else {
      EventEmitter.emit("stopEvent");
      this.showToast("Kończę pomiar.");
    }
  };

  showToast = message => {
    ToastAndroid.showWithGravityAndOffset(
      message,
      ToastAndroid.LONG,
      ToastAndroid.BOTTOM,
      25,
      50
    );
  }

  render = () => {
    const { style } = this.props;
    
    const cardContainer = [styles.card, styles.shadow, style];
    const imgContainer = [styles.imageContainer];    

    return (   
      <TempContext.Consumer> 
        {(context) => {
          let isRunning = context.state.isRunning;
          let buttonTitle = "";
          var buttonColor = "";

          if (isRunning) {
            buttonColor = "ERROR";
            buttonTitle = titles.STOP;
          } else {
            buttonColor = "SUCCESS";
            buttonTitle = titles.START;
          }

          return (
            <Block card flex style={cardContainer}>
              <Block style={imgContainer}>
                  <Button color={buttonColor} style={styles.button} onPress={() => this.onButton(context)}>{buttonTitle}</Button>
              </Block> 
            </Block>
          );
        }}
      </TempContext.Consumer> 
    );
  }
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
    flexDirection: 'column'
  },
  imageContainer: {
    borderRadius: 3,
    overflow: 'hidden',
    padding: theme.SIZES.BASE / 2
  },
  horizontalStyles: {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  verticalStyles: {
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0
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
  tempStyle: { 
    paddingHorizontal: theme.SIZES.BASE, 
    flexDirection: "row" 
  },
  start: {
    backgroundColor: argonTheme.COLORS.SUCCESS
  },
  stop: {
    backgroundColor: argonTheme.COLORS.ERROR
  }
});