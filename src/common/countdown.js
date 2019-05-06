import React from "react";
import { StyleSheet, View } from "react-native";
import TimerCountdown from "react-native-timer-countdown";


class CountdownTimer extends React.Component{
    Expire = ()=>{
      this.props.Expired();
    }
    shouldComponentUpdate(){
      if (!this.props.startAgain) {
        return false;
      }
      return true;
    }
    render(){
    return(<View style={styles.container}>
      <TimerCountdown
        initialMilliseconds={1000 * 30}
        // onTick={}
        onExpire={() => this.Expire()}
        
        formatMilliseconds={(milliseconds) => {
          const remainingSec = Math.round(milliseconds / 1000);
          const seconds = parseInt((remainingSec % 60).toString(), 10);
          const minutes = parseInt(((remainingSec / 60) % 60).toString(), 10);
          const hours = parseInt((remainingSec / 3600).toString(), 10);
          const s = seconds < 10 ? '0' + seconds : seconds;
          const m = minutes < 10 ? '0' + minutes : minutes;
          let h = hours < 10 ? '0' + hours : hours;
          h = h === '00' ? '' : h + ':';
          return s;
          // h + m + ':' +
        }}
        allowFontScaling={true}
        style={{ fontSize: 22 }}
      />
    </View>)
    }
  }
   
  const styles = StyleSheet.create({
    container: {
     // borderWidth:1,
      flex: 1,
      backgroundColor: "#fff",
      alignItems: "center",
      justifyContent: "center"
    }
  });
   
export default CountdownTimer;