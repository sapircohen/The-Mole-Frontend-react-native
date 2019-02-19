import React from 'react';
import { StyleSheet } from 'react-native';
import AppIntroSlider from '../../node_modules/react-native-app-intro-slider/AppIntroSlider';
import App from '../../App';

const styles = StyleSheet.create({
  image: {
    width: 300,
    height: 300,
  },
  text:{
    fontSize: 21,
  },
  title:{
    fontSize: 50,
  }
});

const slides = [
  {
    key: 'Help1',
    title: 'The Mole',
    titleStyle:styles.title,
    text: 'Your Goal is to get from one Wikipedia article - your base,\n To another article - your target.',
    //image: require('https://data1.ibtimes.co.in/cache-img-0-450/en/full/685870/1550110791_beyonce-knowles.jpg'),
    imageStyle: styles.image,
    textStyle: styles.text,
    backgroundColor: '#59b2ab',
  },
  {
    key: 'Help2',
    title: 'The Mole',
    titleStyle:styles.title,
    text: 'In order to win the game,\nTry to get to the base article of your opponent in the\nshortest path and as fast as you can!',
    //image: require('https://data1.ibtimes.co.in/cache-img-0-450/en/full/685870/1550110791_beyonce-knowles.jpg'),
    imageStyle: styles.image,
    textStyle: styles.text,
    backgroundColor: '#febe29',
  },
  {
    key: 'Help3',
    title: 'The Mole',
    titleStyle:styles.title,
    text: 'You can choose to perform a defensive move instead of attacking.\n\nPlace a Bomb in your opponent Path\nIn order to prevent the opponent from reaching your Base article.\nThe opponent won\'t know where you placed the Bomb!',
    //image: require('https://data1.ibtimes.co.in/cache-img-0-450/en/full/685870/1550110791_beyonce-knowles.jpg'),
    imageStyle: styles.image,
    textStyle: styles.text,
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
      return this.props.navigation.navigate('Profile');
    } else {
      return <AppIntroSlider slides={slides} onDone={this._onDone}/>;
    }
  }
}

export default Intro;