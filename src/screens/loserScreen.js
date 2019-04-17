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
        //fetch POST take 25 cash moles from user
    }
    render(){
        return(
            <View flex={1}>
                <Text>You Lost!</Text>
            </View>
        )
    }
}