import React from "react";
import {Alert,StyleSheet,Image,Text,View,ImageBackground,TouchableOpacity,ScrollView,TouchableHighlight} from "react-native";
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
    REMOVE:0,
    OPEN:1,
    JOIN:2,
    START:3,
    NEXTCreator:4,
    NEXTJoiner:5,
    WINCreator:6,
    WINJoiner:7,
}
let list = [];
// let Vertecies = [
//   { name: '1 Vertex', code: '#1abc9c' ,image:images.bomb1}, 
//   { name: '3 Vertex', code: '#3498db',image:images.bomb3 },
//   { name: '5 Vertex', code: '#34495e' ,image:images.bomb5},
// ];

let listJoiner = [];
let listCreator = [];

let currentGamekey = '';
let categoryPlayed='';

export default class GameBoard extends React.Component{
  state = {
    isStarted:false,
    modalTargetVisible:false,
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
    creatorTarget:{},
    creatorNext:'',
    creatorCurrentNode:'',
    creatorVerteciesToChooseFrom:[],
    joinerPath:[],
    joinerTarget:{},
    joinerNext:'',
    joinerCurrentNode:'',
    joinerVerteciesToChooseFrom:[],
    user:firebase.auth().currentUser.uid,
    joinerUid:'',
    creatorUid:'',
    category:'',
    newList:false
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
    this.setState({
      modalTargetVisible:false,
      modalVisible:false
    },()=>{
      //if game winner is the creator
      if (game.state == STATE.WINCreator) {
        if (this.state.user==this.state.creatorUid) {
          this.props.navigation.navigate('Winner');
        }
        if (this.state.user==this.state.joinerUid) {
          this.props.navigation.navigate('Loser');
        }
      }
      //if game winner is the joiner
      if (game.state == STATE.WINJoiner) {
        if (this.state.user==this.state.joinerUid) {
          this.props.navigation.navigate('Winner');
        }
        if (this.state.user==this.state.creatorUid) {
          this.props.navigation.navigate('Loser');
        }
      }
    })
  }
  nextJoinerTurn =  (gamer)=>{
    if (firebase.auth().currentUser.uid == gamer.joiner.uid) {
      this.setState({
        isCreatorTurn:false,
        wait:false,
        timerStart:true,
        oponentPathCount:gamer.currentCreatorPathCount
      })
    }
    if (firebase.auth().currentUser.uid == gamer.creator.uid) {
      this.setState({
        isCreatorTurn:false,
        wait:true,
        timerStart:true,
      })
    }
  }
  nextCreatorTurn = (gamer)=>{
      if (firebase.auth().currentUser.uid == gamer.creator.uid) {
        this.setState({
          isCreatorTurn:true,
          wait:false,
          timerStart:true,
          oponentPathCount:gamer.currentJoinerPathCount
        })
      }
      if (firebase.auth().currentUser.uid == gamer.joiner.uid) {
        this.setState({
          isCreatorTurn:true,
          wait:true,
          timerStart:true,
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
        case STATE.REMOVE: this.gameRemoved(game);
          break;
        default:
          break;
      }
    })
  }
  gameRemoved = ()=>{
    Alert.alert(
      'Player left the game!',
      '',
      [
        {text: 'OK', onPress: () => {this.props.navigation.navigate('Profile')}},
      ],
    );   
  }
  startGame = (game)=>{
    this.setState({
        timerStart:true,
        joinerUid:game.joiner.uid,
        creatorUid:game.creator.uid,
        joinerPath:game.JoinerPath.path,
        joinerNext:game.JoinerPath.next,
        joinerCurrentNode:game.JoinerPath.target,
        creatorPath:game.CreatorPath.path,
        creatorNext:game.CreatorPath.next,
        creatorCurrentNode:game.CreatorPath.target,
        oponentPathCount: this.state.user == game.joiner.uid ? game.CreatorPath.length : game.JoinerPath.length,
        yourPathCount: this.state.user == game.joiner.uid ? game.JoinerPath.length : game.CreatorPath.length,

      },()=>{
          this.setState({
            joinerVerteciesToChooseFrom:[this.state.joinerNext,...game.JoinerPath.verteciesToChooseFrom],
            creatorVerteciesToChooseFrom:[this.state.creatorNext,...game.CreatorPath.verteciesToChooseFrom],
        },()=>{
          this.fetchDataFromWiki(game);
          window.setTimeout(()=>{
            console.log(this.state.creatorTarget);
            console.log(this.state.joinerTarget);
            this.setState({
              isStarted:true
            })
            const ref =  firebase.database().ref("/theMole"+categoryPlayed);
            const gameRef = ref.child(currentGamekey);
            gameRef.update(({
              'currentJoinerPathCount': game.JoinerPath.length,
              'currentCreatorPathCount': game.CreatorPath.length,
              'state': STATE.NEXTCreator
            }));

            //gameRef.update(({'state': STATE.NEXTCreator}));
        },5000)
      })
    })
  }
  fetchListForcCreatorFromWiki = ()=>{
    //get pics for each article
    listCreator = [];
    //fetch creator vertecies to choose from
    this.state.creatorVerteciesToChooseFrom.map((item,key)=>{
      let API = 'https://en.wikipedia.org/w/api.php?action=query&titles='+item+'&prop=pageimages&format=json&pithumbsize=400';
      fetch(API)
        .then(response => response.json())
        .then(data => {
        var pgid = Object.keys(data.query.pages)[0];
        if (typeof data.query.pages[pgid].thumbnail !== "undefined") {
          let article = {
            title:item,
            image:data.query.pages[pgid].thumbnail.source
          }
          listCreator.push(article);
        }
        else {
          let article = {
            title:item,
            image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6g5X-oXWXB0OlpfvqY0XmoZik1FiTSwB5YBIN7m4xOunbUXKC'
          }
          listCreator.push(article);
        }
      })
      .then(()=>{
        this.setState({newList:true})
      })
    })
  }
  fetchListForJoinerFromWiki = ()=>{
    //get pics for each article
    listJoiner = [];
    //fetch creator vertecies to choose from
    this.state.joinerVerteciesToChooseFrom.map((item,key)=>{
      let API = 'https://en.wikipedia.org/w/api.php?action=query&titles='+item+'&prop=pageimages&format=json&pithumbsize=400';
      fetch(API)
        .then(response => response.json())
        .then(data => {
        var pgid = Object.keys(data.query.pages)[0];
        if (typeof data.query.pages[pgid].thumbnail !== "undefined") {
          let article = {
            title:item,
            image:data.query.pages[pgid].thumbnail.source
          }
          listJoiner.push(article);
        }
        else {
          let article = {
            title:item,
            image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6g5X-oXWXB0OlpfvqY0XmoZik1FiTSwB5YBIN7m4xOunbUXKC'
          }
          listJoiner.push(article);
        }
      })
      .then(()=>{
        this.setState({newList:true})
      })
    })
  }
  fetchDataFromWiki = (game)=>{
    //get pics for each article
    listJoiner = [];
    listCreator = [];
    //fetch joiner vertecies to choose from
    this.state.joinerVerteciesToChooseFrom.map((item,key)=>{
      let API = 'https://en.wikipedia.org/w/api.php?action=query&titles='+item+'&prop=pageimages&format=json&pithumbsize=400';
      fetch(API)
        .then(response => response.json())
        .then(data => {
        var pgid = Object.keys(data.query.pages)[0];
        if (typeof data.query.pages[pgid].thumbnail !== "undefined") {
          let article = {
            title:item,
            image:data.query.pages[pgid].thumbnail.source
          }
          listJoiner.push(article);
        }
        else {
          let article = {
            title:item,
            image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6g5X-oXWXB0OlpfvqY0XmoZik1FiTSwB5YBIN7m4xOunbUXKC'
          }
          listJoiner.push(article);
        }
      })
    })
    //fetch creator vertecies to choose from
    this.state.creatorVerteciesToChooseFrom.map((item,key)=>{
      let API = 'https://en.wikipedia.org/w/api.php?action=query&titles='+item+'&prop=pageimages&format=json&pithumbsize=400';
      fetch(API)
        .then(response => response.json())
        .then(data => {
        var pgid = Object.keys(data.query.pages)[0];
        if (typeof data.query.pages[pgid].thumbnail !== "undefined") {
          let article = {
            title:item,
            image:data.query.pages[pgid].thumbnail.source
          }
          listCreator.push(article);
        }
        else {
          let article = {
            title:item,
            image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6g5X-oXWXB0OlpfvqY0XmoZik1FiTSwB5YBIN7m4xOunbUXKC'
          }
          listCreator.push(article);
        }
      })
    })
    //fetch creator target 
    let API1 = 'https://en.wikipedia.org/w/api.php?action=query&titles='+game.CreatorPath.target+'&prop=pageimages&format=json&pithumbsize=400';
      fetch(API1)
        .then(response => response.json())
        .then(data => {
        var pgid = Object.keys(data.query.pages)[0];
        if (typeof data.query.pages[pgid].thumbnail !== "undefined") {
          let article = {
            title:game.CreatorPath.target,
            image:data.query.pages[pgid].thumbnail.source
          }
          this.setState({
            creatorTarget:article
          })
        }
        else {
          let article = {
            title:game.CreatorPath.target,
            image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6g5X-oXWXB0OlpfvqY0XmoZik1FiTSwB5YBIN7m4xOunbUXKC'
          }
          this.setState({
            creatorTarget:article
          })  
        }
    })
    //fetch joiner target 
    let API2 = 'https://en.wikipedia.org/w/api.php?action=query&titles='+game.JoinerPath.target+'&prop=pageimages&format=json&pithumbsize=400';
    fetch(API2)
      .then(response => response.json())
      .then(data => {
      var pgid = Object.keys(data.query.pages)[0];
      if (typeof data.query.pages[pgid].thumbnail !== "undefined") {
        let article = {
          title:game.JoinerPath.target,
          image:data.query.pages[pgid].thumbnail.source
        }
        this.setState({
          joinerTarget:article
        })
      }
      else {
        let article = {
          title:game.JoinerPath.target,
          image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6g5X-oXWXB0OlpfvqY0XmoZik1FiTSwB5YBIN7m4xOunbUXKC'
        }
        this.setState({
          joinerTarget:article
        })
      }
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
  }
  getArticleInfo = (title)=>{
    //get article info from wikipedia.
    this.setState({
      timerStart:false,       
    },()=>{
      InfoApi = 'http://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exlimit=1&explaintext&exintro&titles='+title+'&redirects=';
      myRequest = new Request(InfoApi, body); 
      fetch(myRequest)
        .then(response => response.json())
        .then(data => {
          console.log(data)
          var pageid = Object.keys(data.query.pages)[0];
          this.setState({   
            timerStart:false,       
            dialogContent:data.query.pages[pageid].extract,
            dialogTitle:title,
          },()=>{
            this.setState({
              timerStart:false,
              modalVisible:true,
              pathVisible:false,
            })
          })
      })
    })
     
  }
  getDataOnTarget = ()=>{
    if (this.state.creatorUid == this.state.creatorUid) {
      this.setState({
        timerStart:false,          
      },()=>{
        InfoTitle = this.state.creatorTarget.title;
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
              timerStart:false,
              modalTargetVisible:true,
              pathVisible:false,
            })
          })
        })  
      })
      
    }
    
    if (this.state.user == this.state.joinerUid) {
      this.setState({
        timerStart:false,
      },()=>{
        //fetch for this.state.creatorTarget
      InfoTitle = this.state.joinerTarget.title;
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
            timerStart:false,
            modalTargetVisible:true,
            pathVisible:false,
          })
        })
        })  
      })
    }
  }
  cancelInfo = ()=>{
    this.setState({
      timerStart:false,
      modalVisible: false,
      modalTargetVisible:false,
      pathVisible:false,
    });
  }
  nextMove = (title)=>{
    const ref =  firebase.database().ref("/theMole"+categoryPlayed);
    const gameRef = ref.child(currentGamekey);
    
    this.setState({
      timerStart:false,
      modalVisible: false,
      modalTargetVisible:false,
      pathVisible:false,
    },()=>{
      //check who's turn is it..
      if (this.state.user==this.state.creatorUid && !this.state.wait) {
        //1. check if chosen node equal to target
        if (this.state.creatorTarget.title==title) {
          //we have a winner.
          gameRef.update(({'state': STATE.WINCreator}));
          //show confetty
          //show staff to oponent
        }
        else{
          let uri = 'https://proj.ruppin.ac.il/bgroup65/prod/api/networkGetPath/?source='+title+'&target='+this.state.creatorTarget.title+'&categoryNAME='+this.state.category;
          console.log(uri);
          fetch(uri)
          .then(response => response.json())
          .then((data)=>{
            if (data[0][0]=='not found') {
              alert('no path from ' + title + ' to ' + this.state.creatorTarget.title + ' try another article..')
            }
            else{
              article={
                title:title,
                image:images.logo
              }
              list.push(article);
              gameRef.update(({'currentCreatorPathCount': data[0].length}));
              let firstVertex = data[0][1];
              let TwoMore = data[1];
              this.setState({
                creatorVerteciesToChooseFrom:[firstVertex,...TwoMore],
                yourPathCount:data[0].length
              },()=>{
                this.fetchListForcCreatorFromWiki();
                this.changeTurn();
              })
            }
          })
        }
      }

      //JOINER METHODS
      if (this.state.user==this.state.joinerUid && !this.state.wait) {
        //1. check if chosen node equal to target
        if (this.state.joinerTarget.title==title) {
          //we have a winner.
          gameRef.update(({'state': STATE.WINJoiner}));
        }
        else{
          let uri = 'https://proj.ruppin.ac.il/bgroup65/prod/api/network/?source='+title+'&target='+this.state.joinerTarget.title+'&categoryNAME='+this.state.category;
          console.log(uri);
          fetch(uri)
          .then(response => response.json())
          .then((data)=>{
            if (data[0][0]=='not found') {
              alert('no path from ' + title + ' to ' + this.state.joinerTarget.title + ' try another article..')
            }
            else{
              article={
                title:title,
                image:images.logo
              }
              list.push(article);
              console.log(data);
              gameRef.update(({'currentJoinerPathCount': data[0].length}));
              let firstVertex = data[0][1];
              let TwoMore = data[1];

              this.setState({
                joinerVerteciesToChooseFrom:[firstVertex,...TwoMore],
                yourPathCount:data[0].length
              },()=>{
                this.fetchListForJoinerFromWiki();
                this.changeTurn();
              })
            }
          })
        }
      }
    })

    //IF NOT:
    //2. update current node
    //3. get path from current node to target
    //4. get more random vertecies to show as options
    //5. change turn's

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
                        <Thumbnail source={item.image} />
                      </Left>
                      <Body>
                        <Text>{item.title}</Text>
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
            visible={this.state.modalTargetVisible}
            dialogTitle={<DialogTitle title={this.state.dialogTitle} />}
          >
            <DialogContent>
              <ScrollView>
                <Text>
                  {this.state.dialogContent}
                </Text>
                <DialogFooter>
                  <DialogButton
                    text="OK"
                    onPress={() => {this.cancelInfo()}}
                  />
                </DialogFooter>
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
                <DialogFooter>
                  <DialogButton
                    text="CANCEL"
                    onPress={() => {this.cancelInfo()}}
                  />
                  <DialogButton
                    text="OK"
                    onPress={() => {this.nextMove(this.state.dialogTitle)}}
                  />
                </DialogFooter>
              </ScrollView>
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
              {this.state.user==this.state.creatorUid ?<Text style={{textAlign:'center',fontSize:15}}>{this.state.creatorTarget.title}</Text>:<Text style={{textAlign:'center',fontSize:15}}>{this.state.joinerTarget.title}</Text>}
            </View>
            <View flex={0.8} style={{flexDirection:'row'}}>
              <View flex={0.2}></View>
              <View flex={0.6}>
                <TouchableHighlight onPress={this.getDataOnTarget}>
                  <ImageBackground source={{uri: (this.state.user==this.state.creatorUid ? this.state.creatorTarget.image : this.state.joinerTarget.image)}} style={{ flex: 1,height:100 }} resizeMode='stretch'>
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
                items={this.state.user==this.state.creatorUid ? listCreator : listJoiner }
                style={styles.gridView}
                //staticDimension={300}
                // fixed
                spacing={10}
                renderItem={({ item, index }) => (
                  <TouchableOpacity onPress={()=>this.getArticleInfo(item.title)}>
                    <ImageBackground source={{uri:item.image}} style={{ flex: 1}} resizeMode='strech'>
                      <View style={[styles.itemContainer,{borderStyle:'solid',borderWidth:2}]}>
                        
                      </View>
                    </ImageBackground>
                    <Text style={{textAlign:'center',fontSize:16}}>{item.title}</Text>
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
              <View flex={0.3}>
              <Button
                  onPress={this.openPathHistory}
                  style={{backgroundColor:"transparent"}}>
                  <Icon style={{color:"#4D5366",fontSize:35}}  name="ios-sync" />
                </Button>
              </View>
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