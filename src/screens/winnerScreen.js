import React,{Component} from "react";
import {Text,View} from "react-native";
import ConffetiForWinner from "../common/ConffetiForWinner";
import firebase from 'firebase';

export default class Winner extends React.Component{
    state= {
        showConffeti:false,
        userUID:firebase.auth().currentUser.uid
    }
    componentDidMount(){
        this.setCashMoleForWinner();
        this.setState({
            showConffeti:true
        },()=>{
            window.setTimeout(()=>{
                this.setState({
                    showConffeti:false
                })
            },3000)
        })
    }
    setCashMoleForWinner = ()=>{
        //increase wins and cashMole for the winner
        const cash = 25;
        const win = 1;
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
        if (this.state.showConffeti) {
            return(
                <ConffetiForWinner/>
            )
        }
        return(
            <View flex={1}>
                <Text>Good job! You Won 25 CASH MOLE!</Text>
            </View>
        )
    }
}