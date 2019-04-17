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
        this.setState({
            showConffeti:true
        },()=>{
            window.setTimeout(()=>{
                this.setState({
                    showConffeti:false
                })
                this.setCashMoleForWinner();
            },3000)
        })
    }
    setCashMoleForWinner = ()=>{
        //fetch POST 
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