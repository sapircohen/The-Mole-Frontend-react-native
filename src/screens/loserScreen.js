import React,{Component} from "react";
import {Alert,StyleSheet,Image,Text,View,ImageBackground,TouchableOpacity,ScrollView,TouchableHighlight} from "react-native";
import firebase from 'firebase';

export default class LoserScreen extends React.Component{
    state={
        userUID:firebase.auth().currentUser.uid
    }
    componentDidMount(){
        this.getCashMoleFromLoser();
    }
    getCashMoleFromLoser=()=>{
        //decrease cashMole by -25 and set +0 wins
        const cash = -25;
        const win = 0;
        const endpoint = 'http://proj.ruppin.ac.il/bgroup65/prod/api/playerWinOrLose?win='+win+'&cashMole='+cash+'&uid='+firebase.auth().currentUser.uid;
          fetch(endpoint)
            .then(response => response.json())
            .then((data)=>{
                alert('You got +1 WIN and +25 CashMole!')
            })
            .catch((error)=>{
              console.log(error);
            })
    }
    render(){
        return(
            <View flex={1}>
                <Text>You Lost!</Text>
            </View>
        )
    }
}