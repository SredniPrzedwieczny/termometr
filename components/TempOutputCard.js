import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import { Block, theme, Text } from 'galio-framework';
import { TempContext } from './TempContextProvider';

import { argonTheme } from '../constants';

const titles = {
  TEMP_CURR: 'Temperatura',
  TIME_CURR: 'Czas Pomiaru'
}

const screenWidth = Dimensions.get("window").width;

export default class TempOutputCard extends React.Component {

  render = () => {
    const { style } = this.props;
    
    const cardContainer = [styles.card, styles.shadow, style];
    const imgContainer = [styles.imageContainer];

    return (   
      <TempContext.Consumer> 
        {(context) => {
          let temperature = context.state.temperature;
          let upperLimit = context.state.upperLimit;
          let lowerLimit = context.state.lowerLimit;
          
          var textStyles = [];
          if (temperature > upperLimit) {
            textStyles.push(styles.hot);
          } else if (temperature < lowerLimit) {
            textStyles.push(styles.cold);
          } else {
            textStyles.push(styles.normal);
          }

          return (
            <Block card flex style={cardContainer}>
              <Block style={imgContainer}>
                <Text bold size={16} style={styles.title}>
                  {titles.TEMP_CURR}
                </Text>
                <Block row style={styles.tempStyle}>
                  <Block style={{flex: 3}}>
                    <Text style={textStyles} size={0.1*screenWidth}>{temperature} °C</Text>
                  </Block>
                </Block>
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
  tempStyle: { 
    paddingHorizontal: theme.SIZES.BASE, 
    flexDirection: "row" 
  },
  cold: {
    color: 'blue'
  },
  hot: {
    color: 'red'
  },
  normal: {
    color: 'black'
  }
});