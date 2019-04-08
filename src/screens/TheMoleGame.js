import React from "react";
import {StyleSheet,Image,Text,View,ImageBackground,TouchableOpacity,ScrollView,FlatList} from "react-native";
import {Box} from 'react-native-design-utility'
import NetworkHeader from '../common/NetworkHeader';
import {Button,Icon,List, ListItem, Left, Body, Right, Thumbnail} from 'native-base';
import firebase from 'firebase';
import {images} from '../constant/images';
import WikiLoader from '../common/WikiLoader';
import { storageGet } from "../constant/Storage";
import { FlatGrid } from 'react-native-super-grid';
import CountdownTimer from "../common/countdown";
import Dialog, {DialogTitle, DialogFooter, DialogButton, DialogContent } from 'react-native-popup-dialog';


let InfoTitle='Google';
let InfoApi = 'http://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exlimit=1&explaintext&exintro&titles=Google&redirects='
const body = { method: 'GET', dataType: 'json'};
const myRequest = new Request(InfoApi, body); 

const STATE = {
    OPEN:1,
    JOIN:2,
    START:3,
    NEXTCreator:4,
    NEXTJoiner:5,
    WINCreator:6,
    WINJoiner:7
}
let list = [
  {
      avatar_url:images.avatar1,
      name:'avatar 1'
  },
  {
      avatar_url: images.avatar2,
      name:'avatar 2'
  },
  {
      avatar_url:images.avatar3,
      name:'avatar 3'
  },
  {
      avatar_url:images.avatar4,
      name:'avatar 4'
  }
]
let Vertecies = [
  { name: '1 Vertex', code: '#1abc9c' ,image:images.bomb1}, 
  { name: '3 Vertex', code: '#3498db',image:images.bomb3 },
  { name: '5 Vertex', code: '#34495e' ,image:images.bomb5},
];

let pathList = []

let currentGamekey = '';
let categoryPlayed='';

export default class GameBoard extends React.Component{
  state = {
    isStarted:false,
    yourPathCount:0,
    oponentPathCount:0,
    isCreatorTurn:true,
    timeStop:false,
    wait:true,
    modalVisible: false,
    dialogContent:'',
    dialogTitle:'',
    pathVisible:false,
    dataSource:list
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
  openPathHistory = ()=>{
    this.setState({
      modalVisible:false,
      pathVisible:true
    })
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
  getArticleInfo = ()=>{
    //get article info from wikipedia.
    
    fetch(myRequest)
    .then(response => response.json())
    .then(data => {
      console.log(data)
      var pageid = Object.keys(data.query.pages)[0];
      this.setState({
        dialogContent:data.query.pages[pageid].extract,
        dialogTitle:InfoTitle,
      },()=>{
        this.setState({
          modalVisible:true,
          pathVisible:false
        })
      })
    })  
  }
  cancelInfo = ()=>{
    this.setState({
      modalVisible: false,
      pathVisible:false
    });
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
      <View style={{flex:1}}>
      <Dialog 
            width={0.9}
            height={400}
            visible={this.state.pathVisible}
            dialogTitle={<DialogTitle title="Paths History" />}
            >
            <DialogContent>
            <ScrollView>

              {list.map((item,index)=>{
              return(
              <List key={index}>
                    <ListItem avatar>
                      <Left>
                        <Thumbnail source={item.avatar_url} />
                      </Left>
                      <Body>
                        <Text>{item.name}</Text>
                        <Text note></Text>
                      </Body>
                      <Right>
                        <Text note></Text>
                      </Right>
                    </ListItem>
              </List>
              )
                })
              }
                  <DialogButton
                  text="OK"
                  onPress={() => {this.cancelInfo()}}
                />         
              </ScrollView>     
            </DialogContent>
      </Dialog>
        <Dialog 
            width={0.9}
            height={400}
            visible={this.state.modalVisible}
            dialogTitle={<DialogTitle title={this.state.dialogTitle} />}
            footer={
              <DialogFooter>
                <DialogButton
                  text="CANCEL"
                  onPress={() => {this.cancelInfo()}}
                />
                <DialogButton
                  text="OK"
                  onPress={() => {this.cancelInfo()}}
                />
              </DialogFooter>
            }
          >
            <DialogContent>
              <ScrollView>
                <Text>
                  {this.state.dialogContent}
                </Text>
                <DialogButton
                  text="CANCEL"
                  onPress={() => {this.cancelInfo()}}
                />
                <DialogButton
                  text="OK"
                  onPress={() => {this.cancelInfo()}}
                />
              </ScrollView>
            </DialogContent>
      </Dialog>
        <View style={{flex:0.2,flexDirection:'row',borderWidth:1,marginTop:10}}>
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
        <View style={{flex:0.5,textAlign:'center',borderWidth:1}}>
          {
            this.state.wait 
          ? 
            <Text>Not your turn!</Text>
          :
            (<View flex={0.8}>
              <FlatGrid
                itemDimension={100}
                items={Vertecies}
                style={styles.gridView}
                //staticDimension={300}
                // fixed
                spacing={10}
                renderItem={({ item, index }) => (
                  <TouchableOpacity onPress={()=>this.getArticleInfo()}>
                    <ImageBackground source={item.image} style={{ flex: 1 }} resizeMode='contain'>
                      <View style={[styles.itemContainer,{borderStyle:'solid',bordeeWidth:2}]}>
                        
                      </View>
                      <Text>{item.name}</Text>
                    </ImageBackground>
                  </TouchableOpacity>
                )}
              />
            </View>)
          }
        </View>
        <View style={{flex:0.3,textAlign:'center',borderWidth:1}}>
            <View flex={1} style={{alignContent:'space-around',flexDirection:'row'}}>
              <View flex={0.3}>
                <Button
                  onPress={this.openPathHistory}
                  style={{backgroundColor:"transparent"}}>
                  <Icon style={{color:"#4D5F66",fontSize:32}}  name="ios-flag" />
                </Button>
              </View>
              <View flex={0.4}>
                <Button block success onPress={this.changeTurn}>
                  <Text>Go Back</Text> 
                </Button>
              </View>
              <View flex={0.3}></View>
            </View>
        </View>
    </View>
    )
  }
}


//STYLE
const styles = StyleSheet.create({
  gridView: {
    marginTop: 20,
    flex: 1,
  },
  itemContainer: {
    justifyContent: 'space-between',
    borderRadius: 5,
    padding: 10,
    height: 180,

  },
  itemName: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  itemCode: {
    fontWeight: '600',
    fontSize: 12,
    color: '#fff',
  },
});