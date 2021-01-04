import React from 'react';
export const TempContext = React.createContext();  //exporting context object
export default class TempContextProvider extends React.Component {
  state = {
    'upperLimit': 100,
    'lowerLimit': 0,
    'temperature': 21,
    'isRunning': false,
    setLowerLimit: (value) => this.setState({lowerLimit: value}),
    setUpperLimit: (value) => this.setState({upperLimit: value}),
    setTemperature: (value) => this.setState({temperature: value}),
    setIsRunning: (value) => this.setState({isRunning: value})
  }
  render() {
    return (
      <TempContext.Provider value={{state: this.state}}>
        {this.props.children}
      </TempContext.Provider>
    );
  }
}