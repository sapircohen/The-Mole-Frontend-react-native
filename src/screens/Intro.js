import React from 'react';
import { StyleSheet } from 'react-native';
import AppIntroSlider from '../../node_modules/react-native-app-intro-slider/AppIntroSlider';
import App from '../../App';

const styles = StyleSheet.create({
  image: {
    width: 300,
    height: 300,
  }
});

const slides = [
  {
    key: 'somethun',
    title: 'Title 1',
    text: 'Description.\nSay something cool',
    //image: require('https://data1.ibtimes.co.in/cache-img-0-450/en/full/685870/1550110791_beyonce-knowles.jpg'),
    imageStyle: styles.image,
    backgroundColor: '#59b2ab',
  },
  {
    key: 'somethun-dos',
    title: 'Title 2',
    text: 'Other cool stuff',
    //image: require('https://data1.ibtimes.co.in/cache-img-0-450/en/full/685870/1550110791_beyonce-knowles.jpg'),
    imageStyle: styles.image,
    backgroundColor: '#febe29',
  },
  {
    key: 'somethun1',
    title: 'Rocket guy',
    text: 'I\'m already out of descriptions\n\nLorem ipsum bla bla bla',
    //image: require('https://data1.ibtimes.co.in/cache-img-0-450/en/full/685870/1550110791_beyonce-knowles.jpg'),
    imageStyle: styles.image,
    backgroundColor: '#22bcb5',
  }
];

class Intro extends React.Component {
  static navigationOptions = {
    header:null,
  }
  state = {
    showRealApp: false
  }
  _onDone = () => {
    // User finished the introduction. Show real app through
    // navigation or simply by controlling state
    this.setState({ showRealApp: true });
  }
  render() {
    if (this.state.showRealApp) {
      return <App />;
    } else {
      return <AppIntroSlider slides={slides} onDone={this._onDone}/>;
    }
  }
}

export default Intro;