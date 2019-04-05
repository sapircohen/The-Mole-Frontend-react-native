
import React,{ Component } from "react";
import {AsyncStorage,Image,Text} from "react-native";
import {Box} from 'react-native-design-utility'
import NetworkHeader from '../common/NetworkHeader';
import {Button,Icon,Container, Header, Content,} from 'native-base';
import firebase from 'firebase';
import {images} from '../constant/images';
import WikiLoader from '../common/WikiLoader';
import { storageGet } from "../constant/Storage";

//1. start a game from categories screen
//2. manage the game state in this component
//3. HANDLE STATES!

const STATE = {
    OPEN:1,
    JOIN:2,
    START:3,
    NEXTCreator:4,
    NEXTJoiner:5,
    WINCreator:6,
    WINJoiner:7
  }

export default class GameBoard extends React.Component{
  state = {
    isStarted:false,
  }
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
  componentDidMount(){
    this.GetItemsFromStorage();
    
    //get key and category from AysncStorage
  }
  GetItemsFromStorage = async ()=>{
    let key = await storageGet('key');
    let category =  await storageGet('category');
    this.watchGame(key,category);
  }
  
  watchGame = (key,categoryNameToJoin)=>{
    const ref =  firebase.database().ref("/theMole"+categoryNameToJoin);
    const gameRef = ref.child(key);  
    
    gameRef.on('value',(snapshot)=>{
      const game = snapshot.val();
      switch (game.state) {
        case STATE.JOIN: this.setState({isStarted:true})
          break;
        case STATE.START: this.setState({isStarted:true})
          break;
        case STATE.WINCreator: this.winner(game.creator);
          break;
        case STATE.WINJoiner: this.winner(game.joiner);
          break;
        case STATE.NEXTJoiner: //some function
          break;
        case STATE.NEXTCreator: //some function
          break;
        default:
          break;
      }
    })
    
  }


  render(){
    if (!this.state.isStarted) {
      return(
        <Box f={1} center bg="white">
          <WikiLoader/>
        </Box>
      )
    }
    return(
      <Box f={1} center>
        <Text>GAME BOARD</Text>
      </Box>
    )
  }
}