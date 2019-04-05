
import React,{Component} from 'react';
import { View,Text } from 'react-native';
import NotificationPopup from 'react-native-push-notification-popup';
import {images} from '../constant/images';

export default class NotificationPopupToShow extends React.Component{
  componentDidMount(){
    this.ShowPopUp();
  }

  ShowPopUp = ()=>{
    this.popup.show({
      onPress: ()=> {this.PressedNotification()},
      appIconSource:images.logo,
      appTitle: 'The Mole',
      timeText: 'Now',
      title: this.props.title,
      body: this.props.body + '😀',
    });
  }
  PressedNotification = ()=>{
    
    switch (this.popup.state.title) {
      case 'Notification':
        alert("hello notification");
        break;
      case 'Start A Game':
        alert("hello Start A Game");
      break;
      default:
        break;
    }
  }
  render() {
    return (
      <View style={{position:'absolute',zIndex:4}}>
        <NotificationPopup ref={ref => this.popup = ref} />
      </View>
    );
  }
}