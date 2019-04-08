
import React,{ Component,ReactDOM } from "react";
import {AsyncStorage,Image,Text,View} from "react-native";
import {Box} from 'react-native-design-utility'
import NetworkHeader from '../common/NetworkHeader';
import {Button,Icon,Container, Header, Content} from 'native-base';
import firebase from 'firebase';
import {images} from '../constant/images';
import WikiLoader from '../common/WikiLoader';
import { storageGet } from "../constant/Storage";

import CountdownTimer from "../common/countdown";

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

var currentGamekey = '';
var categoryPlayed='';

export default class GameBoard extends React.Component{
  state = {
    isStarted:false,
    yourPathCount:0,
    oponentPathCount:0,
    isCreatorTurn:true,
    timeStop:false,
    wait:true
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
  }
  GetItemsFromStorage = async ()=>{
    let key = await storageGet('key');
    let category =  await storageGet('category');
    this.watchGame(key,category);
  }
  winner = (game)=>{

  }
  nextJoinerTurn =  (gamer)=>{
    if (firebase.auth().currentUser.uid == gamer.joiner.uid) {
      this.setState({
        isCreatorTurn:false,
        wait:false
      })
    }
    if (firebase.auth().currentUser.uid == gamer.creator.uid) {
      this.setState({
        isCreatorTurn:false,
        wait:true
      })
    }
  }
  nextCreatorTurn = (gamer)=>{
      if (firebase.auth().currentUser.uid == gamer.creator.uid) {
        this.setState({
          isCreatorTurn:true,
          wait:false
        })
      }
      if (firebase.auth().currentUser.uid == gamer.joiner.uid) {
        this.setState({
          isCreatorTurn:true,
          wait:true
        })
      }
  }
  watchGame = (key,categoryNameToJoin)=>{

    currentGamekey = key;
    categoryPlayed = categoryNameToJoin;

    const ref =  firebase.database().ref("/theMole"+categoryNameToJoin);
    const gameRef = ref.child(key);  
    
    gameRef.on('value',(snapshot)=>{
      const game = snapshot.val();
      switch (game.state) {
        case STATE.JOIN: this.setState({isStarted:false})
          break;
        case STATE.START: this.startGame(game);
          break;
        case STATE.WINCreator: this.winner(game);
          break;
        case STATE.WINJoiner: this.winner(game);
          break;
        case STATE.NEXTJoiner: this.nextJoinerTurn(game);
          break;
        case STATE.NEXTCreator: this.nextCreatorTurn(game);
          break;
        default:
          break;
      }
    })
    
  }
  startGame = (game)=>{
    this.setState({isStarted:true},()=>{
      //fetch 6 random articles and check if path count is the same.
      
      //do it on server side.

      //after fetch, first turn is the creator's turn
      const ref =  firebase.database().ref("/theMole"+categoryPlayed);
      const gameRef = ref.child(currentGamekey);
      gameRef.update(({'state': STATE.NEXTCreator}));
    })
  }
  changeTurn = ()=>{
    //check if we have a winner first
    //if we don't than update game state
    if (this.state.isCreatorTurn) {
        const ref =  firebase.database().ref("/theMole"+categoryPlayed);
        const gameRef = ref.child(currentGamekey);
        gameRef.update(({'state': STATE.NEXTJoiner}));
    }
    else{
        const ref =  firebase.database().ref("/theMole"+categoryPlayed);
        const gameRef = ref.child(currentGamekey);
        gameRef.update(({'state': STATE.NEXTCreator}));
    }
  }
  TimerExpired = ()=>{
    if (this.state.isCreatorTurn) {
        const ref =  firebase.database().ref("/theMole"+categoryPlayed);
        const gameRef = ref.child(currentGamekey);
        gameRef.update(({'state': STATE.NEXTJoiner}));
    }
    else{
        const ref =  firebase.database().ref("/theMole"+categoryPlayed);
        const gameRef = ref.child(currentGamekey);
        gameRef.update(({'state': STATE.NEXTCreator}));
    }
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
      <View style={{flex:3}}>
        <View style={{flex:0.1,flexDirection:'row'}}>
          <View style={{flex:0.4,marginTop:'7%'}}>
            <Text style={{textAlign:'center',fontSize:21}}>You</Text>
            <Text style={{textAlign:'center',fontSize:24,color:'green'}}>{this.state.yourPathCount}</Text>
          </View>
          <View style={{flex:0.2,marginTop:'7%'}}>
           { (!this.timeStop) ? <CountdownTimer Expired={this.TimerExpired}/> : <Text></Text>}
          </View>
          <View style={{flex:0.4,marginTop:'7%'}}>
            <Text style={{textAlign:'center',fontSize:21}}>Opponent</Text>
            <Text style={{textAlign:'center',fontSize:24,color:'red'}}>{this.state.oponentPathCount}</Text>
          </View>
        </View>
        <View style={{flex:0.1,textAlign:'center'}}>
         <Text >{firebase.auth().currentUser.displayName}</Text>
          {this.state.wait ? <Text>Not your turn!</Text>:<Text>Your turn!</Text>}
        </View>
        <Button onPress={this.changeTurn}>
          <Text>Change turn's</Text> 
        </Button>
      </View>
    )
  }
}