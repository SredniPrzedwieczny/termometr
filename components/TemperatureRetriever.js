import React from 'react';
import { ToastAndroid } from 'react-native';
import { TempContext } from './TempContextProvider';
import { Block,Text } from 'galio-framework';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EventEmitter from "react-native-eventemitter";
import * as Speech from 'expo-speech';

export default class TemperatureRetriever extends React.Component {

  state = {
    "ip" : null,
    "interval": null,
    "callbacks": {},
    "upperLimitCrossed": false,
    "lowerLimitCrossed": false,
    "calls": 0,
    "activeCalls": 0,
    "lastMethod": ""
  }

  retrieveIp = async () => {
    try {
      const value = await AsyncStorage.getItem('@TemperatureAppStorage:arduinoIp');
      if (value !== null) {
        this.setState({ "ip": value })
      }
    } catch (error) {
      this.emergencyStop();
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

  checkLimits() {
    let contextState = this.context.state;
    let upperLimit = contextState.upperLimit;
    let lowerLimit = contextState.lowerLimit;
    let temperature = contextState.temperature;

    if (this.state.upperLimitCrossed === false && temperature > upperLimit) {
      Speech.speak('Uwaga. Przekroczono górny limit temperatury.');
      this.state.upperLimitCrossed = true;
    } else if (this.state.upperLimitCrossed === true && temperature <= upperLimit) {
      this.state.upperLimitCrossed = false;
    } else if (this.state.lowerLimitCrossed === false && temperature < lowerLimit) {
      Speech.speak('Uwaga. Przekroczono dolny limit temperatury.');
      this.state.lowerLimitCrossed = true;
    } else if (this.state.lowerLimitCrossed === true && temperature >= lowerLimit) {
      this.state.lowerLimitCrossed = false;
    }
  }

  timeout(ms, promise) {
    return new Promise(function(resolve, reject) {
      setTimeout(function() {
        reject(new Error("timeout"))
      }, ms);
      promise.then(resolve, reject)
    })
  }

  tick() {
    let options = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    }
    this.timeout(9900, fetch('http://' + this.state.ip + '/arduino/analog/0', options))
      .then((response) => {
        if (response.ok) {
          return response.json()
        } else {
          throw new Error('badData');
        }
      })
      .then((json) => {   
        this.context.state.setTemperature(json.temperature);
        EventEmitter.emit("tempChange");
      })
      .catch((error) => {
        if (error.message === "badData") {
          this.emergencyStop();
          throw error;
        } else {
          EventEmitter.emit("tempChange");
        }
        
      });
  }

  emergencyStop() {
    Speech.speak('Uwaga. Wystąpił błąd. Pomiar zatrzymany.');
    this.showToast('Wystąpił błąd. Kończę pomiar.');
    this.context.state.setIsRunning(false);
    EventEmitter.emit("stopEvent");
  }

  componentDidMount() {
    this.state.callbacks = {
      "startEvent": () => this.start(),
      "stopEvent": () => this.stop(),
      "tempChange": () => this.checkLimits(),
      "limitChange": () => this.checkLimits()
    }
    EventEmitter.on("startEvent", this.state.callbacks.startEvent);
    EventEmitter.on("tempChange", this.state.callbacks.tempChange);
    EventEmitter.on("limitChange", this.state.callbacks.limitChange);
    EventEmitter.on("stopEvent", this.state.callbacks.stopEvent);
  }

  componentWillUnmount() {
    EventEmitter.removeListener("startEvent", this.state.callbacks.startEvent);
    EventEmitter.removeListener("tempChange", this.state.callbacks.tempChange);
    EventEmitter.removeListener("limitChange", this.state.callbacks.limitChange);
    EventEmitter.removeListener("stopEvent", this.state.callbacks.stopEvent);
  }

  start() {
    this.state.ip = this.retrieveIp();
    this.state.interval = setInterval(() => this.tick(), 10000);
    this.tick();
  }

  stop() {
    clearInterval(this.state.interval);
  }

  render() {
    return (
      <Block/>
    );
  }
}

TemperatureRetriever.contextType = TempContext;