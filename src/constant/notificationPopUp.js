import React from 'react';
import { View } from 'react-native';
import NotificationPopup from 'react-native-push-notification-popup';

import {images} from '../constant/images';


export default class NotificationPopupToShow extends React.Component{
  componentDidMount(){
    this.ShowPopUp();
  }

  ShowPopUp = ()=>{
    this.popup.show({
      onPress: function() {console.log('Pressed')},
      appIconSource:images.logo,
      appTitle: 'New Game',
      timeText: 'Now',
      title: this.props.category + " new game created!",
      body: '😀',
    });
  }

  render() {
    return (
      <View style={{zIndex:40}}>
        <NotificationPopup ref={ref => this.popup = ref} />
      </View>
    );
  }
}