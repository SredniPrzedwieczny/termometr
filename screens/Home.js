import React from 'react';
import { StyleSheet, Dimensions, ScrollView } from 'react-native';
import { Block, theme } from 'galio-framework';

import { LimitSetCard, TempContextProvider, TempChartCard, TempOutputCard, TemperatureRetriever, StartMeasCard } from '../components';

const { width } = Dimensions.get('screen');

class Home extends React.Component {
  state = {
    'upperLimit': 100,
    'lowerLimit': 0,
    'time': 0,
    'temperature': 21
  };

  renderArticles = () => {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.articles}>
        <TempContextProvider>
          <TemperatureRetriever/>
          <Block flex>
            <StartMeasCard/>
            <Block flex row>
              <LimitSetCard style={{ marginRight: theme.SIZES.BASE }} />
              <TempOutputCard style={{ marginRight: theme.SIZES.BASE }} />
            </Block>
            <TempChartCard />
          </Block>
        </TempContextProvider>
      </ScrollView>
    )
  }

  render() {
    return (
      <Block flex center style={styles.home}>
        {this.renderArticles()}
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  home: {
    width: width,    
  },
  articles: {
    width: width - theme.SIZES.BASE * 2,
    paddingVertical: theme.SIZES.BASE,
  },
});

export default Home;
