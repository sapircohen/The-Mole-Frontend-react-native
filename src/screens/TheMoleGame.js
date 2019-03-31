
import React,{ Component } from "react";
import {Image,Text,StyleSheet} from "react-native";
import {Box} from 'react-native-design-utility'
import NetworkHeader from '../common/NetworkHeader';
import {Button,Icon,Container, Header, Content,} from 'native-base';
import firebase from 'firebase';
import {images} from '../constant/images';

//1. start a game from categories screen
//2. manage the game state in this component
//3. HANDLE STATES!

const STATE = {
    OPEN:1,
    JOIN:2,
    NEXT:4,
    DONE:3,
  }

export default class GameBoard extends React.Component{
  render(){
    return(
      <Box f={1} center>
        <Text>Hello World of game!</Text>
      </Box>
    )
  }
}