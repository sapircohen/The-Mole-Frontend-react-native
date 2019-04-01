
import React,{ Component } from "react";
import {Image,Text} from "react-native";
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
    DONE:3,
    NEXTCreator:4,
    NEXTJoiner:5,
  }

export default class GameBoard extends React.Component{
  static navigationOptions = ({ navigation }) =>{
    return{
      headerTitle: (
        <Image style={{ width: 90, height: 50 }} source={images.logo}/>
      ),
      headerBackground: (
        <NetworkHeader/>
      ),
      headerTitleStyle: { color: '#4D5F66',fontSize:23 },
      headerLeft: 
        ( <Button
            onPress={()=>navigation.navigate('ChooseAGame')}
            style={{backgroundColor:"transparent"}}>
            <Icon style={{color:"#4D5F66",fontSize:32}}  name="ios-arrow-round-back" />
        </Button>
        ),
    }
}
  render(){
    return(
      <Box f={1} center>
        <Text>GAME BOARD</Text>
      </Box>
    )
  }
}