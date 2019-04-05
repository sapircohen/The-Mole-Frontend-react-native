
import React,{Component} from 'react';
import NotificationPopup from 'react-native-push-notification-popup/src/components/index';
import { View,Text } from "react-native";

// ...
export default class NotificationPopupToShow extends React.Component{
  render() {
    return (
      <View style={styles.container}>
        <NotificationPopup ref={ref => this.popup = ref} />
      </View>
    );
  }
}