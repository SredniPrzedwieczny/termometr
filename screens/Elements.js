import React from "react";
import { ScrollView, StyleSheet, Dimensions } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
// Galio components
import { Block, Text, theme } from "galio-framework";
// Argon themed components
import { argonTheme } from "../constants/";
import { Button, Input } from "../components/";
import { ToastAndroid } from "react-native";

const { width } = Dimensions.get("screen");

class Elements extends React.Component {
  state = {
    "thermometerIP": null
  };

  changeIp = ipAddress =>
    this.setState({ "thermometerIP": ipAddress });

  showToast = message => {
    ToastAndroid.showWithGravityAndOffset(
      message,
      ToastAndroid.LONG,
      ToastAndroid.BOTTOM,
      25,
      50
    );
  }
    

  saveIp = async () => {
    try {
      await AsyncStorage.setItem(
        '@TemperatureAppStorage:arduinoIp',
        this.state.thermometerIP
      );
      this.showToast('Zmieniono IP termometru.');
    } catch (error) {
      this.showToast('Zmiana IP termometru nie powiodła się.');
    }
  }

  retrieveIp = async () => {
    try {
      const value = await AsyncStorage.getItem('@TemperatureAppStorage:arduinoIp');
      if (value !== null) {
        this.changeIp(value);
      }
    } catch (error) {
      this.showToast('Ustawienie IP termometru nie powiodło się.');
    }
  };

  renderWifiSettings = () => {
    if (this.state.thermometerIP === null) {
      this.retrieveIp();
    }
    return (
      <Block flex>
        <Text bold size={16} style={styles.title}>
          Ustawienia WiFi
        </Text>
        <Block row style={{ paddingHorizontal: theme.SIZES.BASE, flexDirection: "row" }}>
          <Block style={{flex: 3}}>
            <Input placeholder="IP Termometru" iconContent={<Block />} value={this.state.thermometerIP} onChangeText={text => this.changeIp(text)}/>
          </Block>
          <Block style={styles.buttonOuterLayout}>
            <Button style={styles.button} onPress={() => this.saveIp()}>Zapisz</Button>
          </Block>
        </Block>
      </Block>
    );
  }


  render() {
    return (
      <Block flex center>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30, width }}>
          {this.renderWifiSettings()}
        </ScrollView>
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    paddingBottom: theme.SIZES.BASE,
    paddingHorizontal: theme.SIZES.BASE * 2,
    marginTop: 44,
    color: argonTheme.COLORS.HEADER
  },
  group: {
    paddingTop: theme.SIZES.BASE * 2
  },
  shadow: {
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    shadowOpacity: 0.2,
    elevation: 2
  },
  optionsButton: {
    width: "auto",
    height: 34,
    paddingHorizontal: theme.SIZES.BASE,
    paddingVertical: 10
  },
  input: {
    borderBottomWidth: 1
  },
  button: {
    width: 'auto',
    alignSelf: 'stretch'
  },
  inputDefault: {
    borderBottomColor: argonTheme.COLORS.PLACEHOLDER
  },
  buttonOuterLayout: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default Elements;