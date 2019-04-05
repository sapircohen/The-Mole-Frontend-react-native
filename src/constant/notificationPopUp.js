
import React,{Component} from 'react';
import { View,Text } from 'react-native';
import NotificationPopup from 'react-native-push-notification-popup/src/components/index';


export default class NotificationPopupToShow extends React.Component{
  componentDidMount(){
    this.ShowPopUp();
  }

  ShowPopUp = ()=>{
    alert(this.props.popup);
    // this.popup.show({
    //   onPress: function() {console.log('Pressed')},
    //   appIconSource:images.logo,
    //   appTitle: 'Some App',
    //   timeText: 'Now',
    //   title: 'Hello World',
    //   body: 'This is a sample message.\nTesting emoji 😀',
    // });
  }

  render() {
    return (
      <View>
        <NotificationPopup ref={ref => this.popup = ref} />
      </View>
    );
  }
}