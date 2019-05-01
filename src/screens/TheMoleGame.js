import React from "react";
import {Alert,StyleSheet,Image,Text,View,ImageBackground,TouchableOpacity,ScrollView,Platform,TouchableHighlight} from "react-native";
import {Box} from 'react-native-design-utility'
import NetworkHeader from '../common/NetworkHeader';
import {Button,Icon,List, ListItem, Left, Body,Container, Content, Footer, FooterTab } from 'native-base';
import firebase from 'firebase';
import {images} from '../constant/images';
import WikiLoader from '../common/WikiLoader';
import { storageGet } from "../constant/Storage";
import { FlatGrid } from 'react-native-super-grid';
import CountdownTimer from "../common/countdown";
import Dialog, {DialogTitle, DialogFooter, DialogButton, DialogContent } from 'react-native-popup-dialog';

import {
  BallIndicator,
  BarIndicator,
  DotIndicator,
  MaterialIndicator,
  PacmanIndicator,
  PulseIndicator,
  SkypeIndicator,
  UIActivityIndicator,
  WaveIndicator
} from 'react-native-indicators';

let InfoTitle='Google';
let InfoApi = 'http://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exlimit=1&explaintext&exintro&titles='+InfoTitle+'&redirects='
const body = { method: 'GET', dataType: 'json'};
let myRequest = new Request(InfoApi, body); 

let fontVertex = 10;
let marTop = 38;
let footerHeight = 60;
if (Platform.OS==='ios') {
  fontVertex = 12;
  marTop = 20;
  footerHeight = 80;
}
let categoryImage = '';

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
let listJoiner = [];
let listCreator = [];

let currentGamekey = '';
let categoryPlayed='';

export default class GameBoard extends React.Component{
  constructor(props){
    super(props);
    this.state = {
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
      newList:false,
      notFount:false,
      noNewCards:false
    }
    this.getArticleInfo =this.getArticleInfo.bind(this);
  }
  
  static navigationOptions = ({ navigation }) =>{
    return{
      headerTitle: (
        <Image style={{ width: 90, height: 50,flex:1 }} resizeMode='contain' source={images.logo}/>
      ),
      headerBackground: (
        <NetworkHeader/>
      ),
      headerTitleStyle: { color: '#4D5F66',fontSize:23 },
      headerRight:<Text></Text>,
      headerLeft: 
        ( <Button
            onPress={()=>navigation.navigate('ChooseAGame')}
            style={{backgroundColor:"transparent",elevation:0}}>
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
    switch (category) {
      case 'NBA':
        categoryImage='https://a4.espncdn.com/combiner/i?img=%2Fi%2Fespn%2Fmisc_logos%2F500%2Fnba.png';
        break;
      case 'FILMS':
        categoryImage='https://drhurd.com/wp-content/uploads/2016/01/Oscar-statue.jpg';
        categoryImage='https://st4.depositphotos.com/18664664/23955/v/1600/depositphotos_239558178-stock-illustration-cinema-celebrity-icon-trendy-cinema.jpg';
        break;
      case 'CELEBRITY':
        categoryImage='https://st4.depositphotos.com/18657574/21815/v/1600/depositphotos_218157006-stock-illustration-fame-vector-icon-isolated-transparent.jpg';

        break;
      case 'GENERAL KNOWLEDGE':
        categoryImage='https://video-images.vice.com/_uncategorized/1489779368199-einstein.jpeg';
        categoryImage='https://ih1.redbubble.net/image.25918527.1383/flat,550x550,075,f.jpg';
        break;
      case 'MUSIC':
        categoryImage='https://d85wutc1n854v.cloudfront.net/live/products/600x375/WB0PGGM81.png';
        categoryImage='https://c8.alamy.com/comp/HM0655/music-note-kawaii-character-vector-illustration-design-HM0655.jpg';
        break;
      case 'POLITICS':
        categoryImage='http://www.cfiargentina.org/wp-content/uploads/2015/04/politics.png';
        categoryImage='https://www.washingtonpost.com/pbox.php?url=http://wp-stat.s3.amazonaws.com/emoji/shared/resources/share/politics/fb_share.jpg&w=1484&op=resize&opt=1&filter=antialias&t=20170517';
        break;
      default:
        break;
    }
    this.setState({category:category},()=>{
      this.watchGame(key,category);
    })
  }
  winner = (game)=>{
    const ref =  firebase.database().ref("/theMole"+categoryPlayed);
    const gameRef = ref.child(currentGamekey);
            
    this.setState({
      modalTargetVisible:false,
      modalVisible:false
    },()=>{
      //if game winner is the creator
      if (game.state == STATE.WINCreator) {
        if (this.state.user==this.state.creatorUid) {
          this.props.navigation.navigate('Winner');
          let path = [];
          path.push(game.JoinerPath.target);
          this.state.historyPaths.map((p)=>{
            path.push(p.title);
          })
          path.push(this.state.creatorTarget.title);
          gameRef.update(({
            'pathWon': path,
          }));
        }
        if (this.state.user==this.state.joinerUid) {
          this.props.navigation.navigate('Loser');
        }
      }
      //if game winner is the joiner
      if (game.state == STATE.WINJoiner) {
        if (this.state.user==this.state.joinerUid) {
          
          this.props.navigation.navigate('Winner');
          let path = [];
          path.push(game.CreatorPath.target);
          this.state.historyPaths.map((p)=>{
            path.push(p.title);
          })
          path.push(this.state.joinerTarget.title);
          gameRef.update(({
            'pathWon': path,
          }));
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
        case STATE.JOIN: this.checkGameStart(game);
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
  checkGameStart = ()=>{
    this.setState({isStarted:false},()=>{
      window.setTimeout(()=>{
          const ref =  firebase.database().ref("/theMole"+categoryPlayed);
          const gameRef = ref.child(currentGamekey); 
          gameRef.on('value',(snapshot)=>{
            const game = snapshot.val();
            if (game.state === STATE.JOIN) {
              const ref2 =  firebase.database().ref("/theMole"+categoryPlayed);
              const gameRef2 = ref2.child(currentGamekey);
              gameRef2.update(({
                'state': STATE.REMOVE
              }));
            }
          })
      },15000)
    })
  }
  gameRemoved = ()=>{
    Alert.alert(
      'Current game',
      'Oponnent left the game..😶',
      [
        {text: 'OK', onPress: () => {this.props.navigation.navigate('Profile')}},
      ],
    );   
  }
  startGame = (game)=>{
    this.setState({
        //timerStart:true,
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
            image:categoryImage,
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
            image:categoryImage,
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
      let API = 'https://en.wikipedia.org/w/api.php?action=query&titles='+item+'&prop=pageimages&format=json&pithumbsize=1400';
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
            image:categoryImage,
          }
          listJoiner.push(article);
        }
      })
    })
    //fetch creator vertecies to choose from
    this.state.creatorVerteciesToChooseFrom.map((item,key)=>{
      let API = 'https://en.wikipedia.org/w/api.php?action=query&titles='+item+'&prop=pageimages&format=json&pithumbsize=1400';
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
            image:categoryImage,
          }
          listCreator.push(article);
        }
      })
    })
    //fetch creator target 
    let API1 = 'https://en.wikipedia.org/w/api.php?action=query&titles='+game.CreatorPath.target+'&prop=pageimages&format=json&pithumbsize=1400';
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
            creatorTarget:article,
            joinerCurrentNode:article
          })
        }
        else {
          let article = {
            title:game.CreatorPath.target,
            image:categoryImage,
          }
          this.setState({
            creatorTarget:article,
            joinerCurrentNode:article
          })  
        }
    })
    //fetch joiner target 
    let API2 = 'https://en.wikipedia.org/w/api.php?action=query&titles='+game.JoinerPath.target+'&prop=pageimages&format=json&pithumbsize=1400';
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
          joinerTarget:article,
          creatorCurrentNode:article
        })
      }
      else {
        let article = {
          title:game.JoinerPath.target,
          image:categoryImage,
        }
        this.setState({
          joinerTarget:article,
          creatorCurrentNode:article
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
  getArticleInfo(article){
    //get article info from wikipedia.
      InfoApi = 'http://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exlimit=1&explaintext&exintro&titles='+article.title+'&redirects=';
      myRequest = new Request(InfoApi, body); 
      fetch(myRequest)
        .then(response => response.json())
        .then(data => {
          console.log(data)
          var pageid = Object.keys(data.query.pages)[0];
          Alert.alert(
            article.title,
            data.query.pages[pageid].extract,
            [
              {
                text: 'Cancel',
                //onPress: () => {this._handleNotificationForeGround(false,data.key,data.category)},
                style: 'cancel',
              },
              {
                text: "Let's go!", 
                onPress: () => {this.nextMove(article)},
                style:'default'
              },
            ],
            {cancelable: true},
          );  
      })     
  }
  getDataOnTarget = (title)=>{    
        InfoTitle = title;
        InfoApi = 'http://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exlimit=1&explaintext&exintro&titles='+InfoTitle+'&redirects=';
        //alert(InfoApi);
        myRequest = new Request(InfoApi, body); 
        fetch(myRequest)
        .then(response => response.json())
        .then(data => {
          console.log(data)
          var pageid = Object.keys(data.query.pages)[0];
          
          Alert.alert(
            InfoTitle,
            data.query.pages[pageid].extract,
            [
              {
                text: "OK", 
                style:'default'
              },
            ],
          );  
        
        })  
  }
  cancelInfo = ()=>{
    this.setState({
      timerStart:false,
      modalVisible: false,
      modalTargetVisible:false,
      pathVisible:false,
    });
  }
  nextMove = (articleMove)=>{
    //alert(articleMove.title)
    const ref =  firebase.database().ref("/theMole"+categoryPlayed);
    const gameRef = ref.child(currentGamekey);
    
    this.setState({
      timerStart:false,
      modalVisible: false,
      modalTargetVisible:false,
      pathVisible:false,
      notFount:false
    },()=>{
      //check who's turn is it..
      if (this.state.user==this.state.creatorUid && !this.state.wait) {
        //1. check if chosen node equal to target
        if (this.state.creatorTarget.title==articleMove.title) {
          //we have a winner.
          gameRef.update(({'state': STATE.WINCreator}));
        }
        else{
          let uri = 'https://proj.ruppin.ac.il/bgroup65/prod/api/networkGetPath/?source='+articleMove.title+'&target='+this.state.creatorTarget.title+'&categoryNAME='+this.state.category;
          console.log(uri);
          fetch(uri)
          .then(response => response.json())
          .then((data)=>{
            
            if (data.length ===1) {
              this.setState({
                notFount:true
              })
            }
            else{
              article={
                title:articleMove.title,
                image:images.logo
              }
              list.push(article);
              gameRef.update(({'currentCreatorPathCount': data[0].length}));
              let firstVertex = data[0][1];
              let TwoMore = data[1];
              this.setState({
                creatorVerteciesToChooseFrom:[firstVertex,...TwoMore],
                yourPathCount:data[0].length,
                creatorCurrentNode:articleMove
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
        if (this.state.joinerTarget.title==articleMove.title) {
          //we have a winner.
          gameRef.update(({'state': STATE.WINJoiner}));
        }
        else{
          let uri = 'https://proj.ruppin.ac.il/bgroup65/prod/api/network/?source='+articleMove.title+'&target='+this.state.joinerTarget.title+'&categoryNAME='+this.state.category;
          console.log(uri);
          fetch(uri)
          .then(response => response.json())
          .then((data)=>{
            if (data[0][0]=='not found') {
              this.setState({
                notFount:true
              })
            }
            else{
              article={
                title:articleMove.title,
                image:images.logo
              }
              list.push(article);
              console.log(data);
              gameRef.update(({'currentJoinerPathCount': data[0].length}));
              let firstVertex = data[0][1];
              let TwoMore = data[1];

              this.setState({
                joinerVerteciesToChooseFrom:[firstVertex,...TwoMore],
                yourPathCount:data[0].length,
                joinerCurrentNode:articleMove
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
  changeCards = ()=>{

    if ((this.state.creatorUid === this.state.user && !this.state.wait) || (this.state.joinerUid === this.state.user && !this.state.wait)) {
          Alert.alert("Change cards",
          "Pass your turn and change cards?",
          [
          {
            text: 'OK', 
            onPress: this.getNewCards,
            style: 'destructive'
          },
          {text: 'CANCEL'},
          ],
          {cancelable: true}
      )
    }
    else{
      Alert.alert('‼️',
      'wait for your turn...',
      [
      {
        text: 'OK', 
        style: 'destructive'
      },
      ],
    )
    }
  }
  getNewCards = ()=>{
    let endpoint = '';
    
    if (this.state.user == this.state.creatorUid) {
      endpoint = 'https://proj.ruppin.ac.il/bgroup65/prod/api/networkGetRandomVerteciesFromVertex3/?source='+this.state.creatorCurrentNode.title+'&categoryName='+categoryPlayed;
    }
    if (this.state.user == this.state.joinerUid) {
      endpoint = 'https://proj.ruppin.ac.il/bgroup65/prod/api/networkGetRandomVerteciesFromVertex3/?source='+this.state.joinerCurrentNode.title+'&categoryName='+categoryPlayed;
    }
    fetch(endpoint)
      .then(response => response.json())
      .then((data)=>{
          if (data.length === 0 ) {
            Alert.alert("😟",
            'New cards are missing, please choose from the giving options.',
            [
            {
              text: 'OK', 
              style: 'destructive'
            },
            ],
          )
            return;
          }
          if (this.state.user == this.state.creatorUid) {
            this.setState({
              creatorVerteciesToChooseFrom:data,
              timerStart:false,
              noNewCards:false
            },()=>{
              this.fetchListForcCreatorFromWiki();
              const ref =  firebase.database().ref("/theMole"+categoryPlayed);
              const gameRef = ref.child(currentGamekey);
              gameRef.update(({'state': STATE.NEXTJoiner}));
            })        
          }
          if (this.state.user == this.state.joinerUid) {
            this.setState({
              joinerVerteciesToChooseFrom:data,
              timerStart:false
            },()=>{
              this.fetchListForJoinerFromWiki();
              const ref =  firebase.database().ref("/theMole"+categoryPlayed);
              const gameRef = ref.child(currentGamekey);
              gameRef.update(({'state': STATE.NEXTCreator}));
            })
          }
        
      })
      .catch((error)=>{
        console.log(error);
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
      <View style={{flex:9}}>
        <Dialog 
            footer={<DialogButton
              text="OK"
              onPress={() => {this.cancelInfo()}}
            />  }
            width={0.9}
            height={0.8}
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
                        <Text note>{index+1}.</Text>
                      </Left>
                      <Body>
                        <Text>{item.title}</Text>
                        <Text note></Text>
                      </Body>
                    </ListItem>
              </List>
              )
                })
              }       
              </ScrollView>    
            </DialogContent>
      </Dialog>
        
        
        <View style={{flex:2,flexDirection:'row',marginTop:10}}>
          <View style={{flex:0.4,marginTop:'7%'}}>
            <Text style={{textAlign:'center',fontSize:21}}>You</Text>
            <Text style={{textAlign:'center',fontSize:24,color:'green'}}>{this.state.yourPathCount}</Text>
          </View>
          <View style={{flex:0.2,marginTop:'7%'}}>
            <CountdownTimer startAgain={this.state.timerStart} Expired={this.TimerExpired}/>
          </View>
          <View style={{flex:0.4,marginTop:'7%'}}>
            <Text style={{textAlign:'center',fontSize:21}}>Opponent</Text>
            <Text style={{textAlign:'center',fontSize:24,color:'red'}}>{this.state.oponentPathCount}</Text>
          </View>
        </View> 
        
        
        <View flex={2} style={{alignContent:'space-between',flexDirection:'row',marginTop:10}}>
          <View flex={0.2}></View>
          <View flex={0.6} style={{justifyContent:'center'}}>
            <View flex={0.3}>
              <Text style={{fontWeight:'bold',fontSize:18,textAlign:'center',color:'#80D3A1'}}>Target</Text>
            </View>
            <View flex={0.2} style={{fontWeight:'bold',textAlign:'center',marginTop:(Platform.OS==='ios'?1:4),overflow:'visible'}}>
              {this.state.user==this.state.creatorUid ?<Text style={{textAlign:'center',fontSize:13}}>{this.state.creatorTarget.title}</Text>:<Text style={{textAlign:'center',fontSize:15}}>{this.state.joinerTarget.title}</Text>}
            </View>
            <View flex={0.5} style={{flexDirection:'row',marginTop:10}}>
              <View flex={0.3}></View>
              <View flex={0.4}>
                  {this.state.user==this.state.creatorUid ? 
                  (
                    //<TouchableHighlight onPress={()=>this.getArticleInfo(this.state.creatorTarget.title)}>
                      <ImageBackground source={{uri: this.state.creatorTarget.image}} style={{ flex: 1,overflow: 'hidden',borderRadius:'5%',borderWidth:0.5}} resizeMode='stretch'>
                        <View>
                        </View>
                      </ImageBackground>  
                    //</TouchableHighlight>
                  )
                  :
                  (
                    //<TouchableHighlight onPress={()=>this.getArticleInfo(this.state.joinerTarget.title)}>
                      <ImageBackground source={{uri: this.state.joinerTarget.image}} style={{ flex: 1,overflow: 'hidden',borderRadius:'5%',borderWidth:0.5}} resizeMode='stretch'>
                          <View>
                          </View>
                      </ImageBackground>
                    //</TouchableHighlight>
                  )
                }
              </View>
              <View flex={0.3}>
              </View>
            </View>
          </View>
        </View>
       
       
        <View style={{flex:3,marginTop:marTop}}>
          {
            this.state.wait 
          ? 
            <Box f={1} center bg="white">
              <BarIndicator color='#E8C5F7'/>
            </Box>
            // 
          :
            (<View flex={1} style={{marginTop:15}}>
            {this.state.notFount ?
              <Text style={{textAlign:'center',fontSize:18,fontWeight:'bold',color:'#96B2CC'}}>Lucky u, only one vertex found</Text>
              :
              <Text style={{textAlign:'center',fontSize:18,fontWeight:'bold',color:'#96B2CC'}}>Choose an option</Text>
            }
              <FlatGrid
                itemDimension={80}
                items={this.state.user==this.state.creatorUid ? listCreator : listJoiner }
                style={styles.gridView}
                //staticDimension={300}
                // fixed
                spacing={20}
                renderItem={({ item, index }) => (
                  <TouchableOpacity onPress={()=>this.getArticleInfo(item)}>
                    <ImageBackground source={{uri:item.image}} style={{ flex: 1,overflow: 'hidden',borderRadius:"5%",borderWidth:1}} resizeMode='stretch'>
                      <View style={[styles.itemContainer]}>
                        
                      </View>
                    </ImageBackground>
                    <Text style={{textAlign:'center',fontSize:fontVertex,fontWeight:'100'}}>{item.title}
                    {`
            
                    `}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>)
          }
        </View>
        
        <View flex={2} style={{alignContent:'space-between',flexDirection:'row',marginBottom:20}}>
          <View flex={0.2}></View>
          <View flex={0.6} style={{justifyContent:'center'}}>
            <View flex={0.3}>
              <Text style={{fontWeight:'bold',fontSize:18,textAlign:'center',color:'#F2BBAD'}}>Source</Text>
            </View>
            <View flex={0.2} style={{fontWeight:'bold',textAlign:'center',marginTop:(Platform.OS==='ios'?2:4)}}>
              {this.state.user==this.state.joinerUid ?<Text style={{textAlign:'center',fontSize:13}}>{this.state.joinerCurrentNode.title}</Text>:<Text style={{textAlign:'center',fontSize:15}}>{this.state.creatorCurrentNode.title}</Text>}
            </View>
            <View flex={0.5} style={{flexDirection:'row',marginTop:10}}>
              <View flex={0.3}></View>
              <View flex={0.4}>
                  {this.state.user==this.state.joinerUid ? 
                  (
                    //<TouchableHighlight onPress={()=>this.getArticleInfo(this.state.creatorTarget.title)}>
                      <ImageBackground source={{uri: this.state.joinerCurrentNode.image}} style={{ flex: 1,overflow: 'hidden',borderRadius:'5%',borderWidth:0.5}} resizeMode='stretch'>
                        <View>
                        </View>
                      </ImageBackground>  
                    //</TouchableHighlight>
                  )
                  :
                  (
                    //<TouchableHighlight onPress={()=>this.getArticleInfo(this.state.joinerTarget.title)}>
                      <ImageBackground source={{uri: this.state.creatorCurrentNode.image}} style={{ flex: 1,overflow: 'hidden',borderRadius:'5%',borderWidth:0.5}} resizeMode='stretch'>
                          <View>
                          </View>
                      </ImageBackground>
                    //</TouchableHighlight>
                  )
                }
              </View>
              <View flex={0.3}>
              </View>
            </View>
          </View>
        </View>
        
       
        <Footer>
          <ImageBackground source={images.network} style={{width: '100%', height:footerHeight,color:'transparent'}}>
            <FooterTab style={{backgroundColor:'transparent'}}>
                    {/* <Button vertical onPress={this.openPathHistory}>
                      <Icon style={styles.iconStyleFlag} name="ios-flag" />
                    </Button> */}
              <View></View>
              <Button vertical onPress={this.changeCards}>
                <Icon style={styles.iconStyleSync} name="ios-sync" />
              </Button>
              <View></View>
            </FooterTab>
          </ImageBackground>
        </Footer>
       
    </View>
    )
  }
}


//STYLE
const styles = StyleSheet.create({
  gridView: {
    flex: 1,
    marginTop:'1%',
    alignContent:'space-between',
    justifyContent:'space-between',
  },
  itemContainer: {
    justifyContent: 'space-between',
    padding: 10,
    height: 60,
  },
  itemName: {
    fontSize: 13,
    color: '#fff',
    fontWeight: '600',
  },
  itemCode: {
    fontWeight: '600',
    fontSize: 12,
    color: '#fff',
  },
  iconStyleSync:{
    backgroundColor:'transparent',
    color:'#000',
    fontSize:38
  },
  iconStyleFlag:{
    backgroundColor:'transparent',
    color:'#71C4C6',
    fontSize:33
  },
  textStyle:{
    fontSize:15,
    fontWeight:'bold',
    color:'black'
  }
});
