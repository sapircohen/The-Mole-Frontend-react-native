import React from "react";
import {StyleSheet,Image,Text,View,ImageBackground,TouchableOpacity,ScrollView,TouchableHighlight} from "react-native";
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
let InfoApi = 'http://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exlimit=1&explaintext&exintro&titles='+InfoTitle+'&redirects='
const body = { method: 'GET', dataType: 'json'};
let myRequest = new Request(InfoApi, body); 

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
    historyPaths:list,
    timerStart:false,
    creatorPath:[],
    creatorTarget:'',
    creatorCurrentNode:'',
    joinerPath:[],
    joinerTarget:'',
    joinerCurrentNode:'',
    user:firebase.auth().currentUser.uid,
    joinerUid:'',
    creatorUid:'',
    category:''

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
      pathVisible:true,
      timerStart:false
    })
  }
  GetItemsFromStorage = async ()=>{
    let key = await storageGet('key');
    let category =  await storageGet('category');
    this.setState({category:category},()=>{
      this.watchGame(key,category);
    })
  }
  winner = (game)=>{

  }
  nextJoinerTurn =  (gamer)=>{
    if (firebase.auth().currentUser.uid == gamer.joiner.uid) {
      this.setState({
        isCreatorTurn:false,
        wait:false,
        timerStart:true
      })
    }
    if (firebase.auth().currentUser.uid == gamer.creator.uid) {
      this.setState({
        isCreatorTurn:false,
        wait:true,
        timerStart:true
      })
    }
  }
  nextCreatorTurn = (gamer)=>{
      if (firebase.auth().currentUser.uid == gamer.creator.uid) {
        this.setState({
          isCreatorTurn:true,
          wait:false,
          timerStart:true
        })
      }
      if (firebase.auth().currentUser.uid == gamer.joiner.uid) {
        this.setState({
          isCreatorTurn:true,
          wait:true,
          timerStart:true
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
    this.setState({
        timerStart:true,
        joinerUid:game.joiner.uid,
        creatorUid:game.creator.uid,
        joinerPath:game.JoinerPath.path,
        joinerTarget:game.JoinerPath.target,
        joinerCurrentNode:game.JoinerPath.target,
        creatorPath:game.CreatorPath.path,
        creatorTarget:game.CreatorPath.target,
        creatorCurrentNode:game.CreatorPath.target,
        oponentPathCount: this.state.user == game.joiner.uid ? game.CreatorPath.length : game.JoinerPath.length,
        yourPathCount: this.state.user == game.joiner.uid ? game.JoinerPath.length : game.CreatorPath.length,

      },()=>{
          this.setState({
            isStarted:true
          })
          const ref =  firebase.database().ref("/theMole"+categoryPlayed);
          const gameRef = ref.child(currentGamekey);
          gameRef.update(({'state': STATE.NEXTCreator}));
      })
  }
  changeTurn = ()=>{
    //check if we have a winner first
    //if we don't than update game state
    this.setState({timerStart:true},()=>{
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
    });
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
    this.setState({timerStart:true})
  }
  getArticleInfo = ()=>{
  //  //get article info from wikipedia.
    // InfoTitle = this.state.creatorTarget;
    // const title = this.state.creatorTarget.replace(' ','20%');
    // InfoApi = 'http://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exlimit=1&explaintext&exintro&titles='+title+'&redirects=';
    // myRequest = new Request(InfoApi, body); 
    
  fetch(myRequest)
    .then(response => response.json())
    .then(data => {
      console.log(data)
      var pageid = Object.keys(data.query.pages)[0];
      this.setState({          
        timerStart:false,
        dialogContent:data.query.pages[pageid].extract,
        dialogTitle:InfoTitle,
      },()=>{
        this.setState({
          modalVisible:true,
          pathVisible:false,
        })
      })
    })  
  }
  getDataOnTarget = ()=>{
    if (this.state.creatorUid == this.state.creatorUid) {
      InfoTitle = this.state.creatorTarget;
      InfoApi = 'http://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exlimit=1&explaintext&exintro&titles='+InfoTitle+'&redirects=';
      console.log(InfoApi);
      myRequest = new Request(InfoApi, body); 
      
      fetch(myRequest)
      .then(response => response.json())
      .then(data => {
        console.log(data)
        var pageid = Object.keys(data.query.pages)[0];
        this.setState({          
          timerStart:false,
          dialogContent:data.query.pages[pageid].extract,
          dialogTitle:InfoTitle,
        },()=>{
          this.setState({
            modalVisible:true,
            pathVisible:false,
          })
        })
      })  
    }
    if (this.state.user == this.state.joinerUid) {
      //fetch for this.state.creatorTarget
      InfoTitle = this.state.joinerTarget;
      //const title = InfoTitle.replace(' ','20%');
      InfoApi = 'http://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exlimit=1&explaintext&exintro&titles='+InfoTitle+'&redirects=';
      console.log(InfoApi);
      myRequest = new Request(InfoApi, body); 
      
      fetch(myRequest)
      .then(response => response.json())
      .then(data => {
        console.log(data)
        var pageid = Object.keys(data.query.pages)[0];
        this.setState({          
          timerStart:false,
          dialogContent:data.query.pages[pageid].extract,
          dialogTitle:InfoTitle,
        },()=>{
          this.setState({
            modalVisible:true,
            pathVisible:false,
          })
        })
      })  
    }
  }
  cancelInfo = ()=>{
    this.setState({
      modalVisible: false,
      pathVisible:false,
      timerStart:false
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

              {this.state.historyPaths.map((item,index)=>{
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
            height={300}
            visible={this.state.modalVisible}
            dialogTitle={<DialogTitle title={this.state.dialogTitle} />}
          >
            <DialogContent>
              <ScrollView>
                <Text>
                  {this.state.dialogContent}
                </Text>
                
              </ScrollView>
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
            </DialogContent>
            
      </Dialog>
        <View style={{flex:0.2,flexDirection:'row',marginTop:10}}>
          <View style={{flex:0.4,marginTop:'7%'}}>
            <Text style={{textAlign:'center',fontSize:21}}>You</Text>
            <Text style={{textAlign:'center',fontSize:24,color:'green'}}>{this.state.yourPathCount}</Text>
          </View>
          <View style={{flex:0.2,marginTop:'7%'}}>
           { (!this.timeStop) ? <CountdownTimer startAgain={this.state.timerStart} Expired={this.TimerExpired}/> : <Text></Text>}
          </View>
          <View style={{flex:0.4,marginTop:'7%'}}>
            <Text style={{textAlign:'center',fontSize:21}}>Opponent</Text>
            <Text style={{textAlign:'center',fontSize:24,color:'red'}}>{this.state.oponentPathCount}</Text>
          </View>
        </View>
        <View flex={0.2} style={{alignContent:'space-between',flexDirection:'row'}}>
          <View flex={0.2}></View>
          <View flex={0.6} style={{justifyContent:'center'}}>
            <View flex={0.2}>
              <Text style={{fontWeight:'bold',fontSize:18,textAlign:'center'}}>Target</Text>
            </View>
            <View flex={0.2} style={{fontWeight:'bold',textAlign:'center'}}>
              {this.state.user==this.state.creatorUid ?<Text style={{textAlign:'center',fontSize:15}}>{this.state.creatorTarget}</Text>:<Text style={{textAlign:'center',fontSize:15}}>{this.state.joinerTarget}</Text>}
            </View>
            <View flex={0.8} style={{flexDirection:'row'}}>
              <View flex={0.2}></View>
              <View flex={0.6}>
                <TouchableHighlight onPress={this.getDataOnTarget}>
                  <ImageBackground source={images.nbaLogo} style={{ flex: 1,height:100 }} resizeMode='stretch'>
                    <View style={[styles.itemContainer,{borderStyle:'solid',borderWidth:2}]}>
                    </View>
                  </ImageBackground>
                </TouchableHighlight>
              </View>
              <View flex={0.2}></View>
            </View>
          </View>
          <View flex={0.2}></View>
        </View>
        <View style={{flex:0.4,justifyContent:'space-between',alignContent:'center'}}>
          {
            this.state.wait 
          ? 
            <Text></Text>
          :
            (<View flex={1} style={{marginTop:25,justifyContent:'space-around'}}>
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
                      <View style={[styles.itemContainer,{borderStyle:'solid',borderWidth:2}]}>
                        
                      </View>
                      <Text style={{textAlign:'center',fontSize:16}}>{item.name}</Text>
                    </ImageBackground>
                  </TouchableOpacity>
                )}
              />
            </View>)
          }
        </View>
        <View style={{flex:0.1,textAlign:'center'}}>
            <View flex={1} style={{alignContent:'space-around',flexDirection:'row'}}>
              <View flex={0.3}>
                <Button
                  onPress={this.openPathHistory}
                  style={{backgroundColor:"transparent"}}>
                  <Icon style={{color:"#4D5366",fontSize:35}}  name="ios-flag" />
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
    marginTop: 60,
    flex: 1,
  },
  itemContainer: {
    justifyContent: 'space-between',
    borderRadius: 5,
    padding: 10,
    height: 100,
    //flex:0.8
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