
import React,{ Component } from "react";
import {Image,Text,StyleSheet,View,TouchableOpacity,ImageBackground,ScrollView} from "react-native";
import { FlatGrid } from 'react-native-super-grid';
import {Box} from 'react-native-design-utility'
import NetworkHeader from '../common/NetworkHeader';
import {Button,Icon} from 'native-base';
import firebase from 'firebase';
import {images} from '../constant/images';
import WikiLoader from '../common/WikiLoader';
import { ListItem,Avatar } from 'react-native-elements'

import { storageSet } from "../constant/Storage";

let gamesToShow=[];

//game states
const STATE = {
  OPEN:1,
  JOIN:2,
  START:3,
  NEXTCreator:4,
  NEXTJoiner:5,
  WINCreator:6,
  WINJoiner:7
}

let creatorUid= '';
  const items = [
    { name: 'NBA', code: '#1abc9c' ,image:images.nbaLogo,id:5}, 
    { name: 'GENERAL KNOWLEDGE', code: '#3498db',image:images.generalKnowledgeLogo,id:3 },
    { name: 'MUSIC', code: '#34495e' ,image:images.musicLogo,id:4},
    { name: 'POLITICS', code: '#27ae60' ,image:images.politicsLogo,id:6},
    { name: 'CELEBRITY', code: '#27ae60' ,image:images.celebrityLogo,id:2},
    { name: 'FILMS', code: '#27ae60' ,image:images.filmLogo,id:1},
  ];

export default class GameBoard extends React.Component{
    state = {
        show:false,
        games:[],
        isGames:false,
        isReady:true,
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



    //join a game function 
    JoinAGame = (key,categoryNameToJoin)=>{
        //use firebase right here to join existing game in a category to choose from
        const ref =  firebase.database().ref("/theMole"+categoryNameToJoin);
        const user = firebase.auth().currentUser;
        const gameRef = ref.child(key);
        
        //atomic function to prevent two users sign to the same game.
        gameRef.transaction((game)=>{
            //console.log(game)
            creatorUid = game.creator.uid;
            if (!game.joiner) {
                game.state = STATE.JOIN;
                game.joiner = {
                    uid:user.uid,
                    displayName:user.displayName,
                    picture:user.photoURL
                }
                //update values on 
                gameRef.update(({'joiner': game.joiner}));
                gameRef.update(({'state': game.state}));
                
                //send push notification for the creator in case the app is on background
                //change this to firebase messeging
                this.sendPushNotification(categoryNameToJoin,creatorUid);
                
                //store values of specific game in AysncStorage
                storageSet('key', key);
                storageSet('category', categoryNameToJoin);
                

                //get to game board
                this.props.navigation.navigate('GameBoard');

            }
        })
    }
    
      

    //SEND PUSH TO CREATOR TO COME AND PLAY
    sendPushNotification = (category,creator)=>{
      
      fetch('https://proj.ruppin.ac.il/bgroup65/prod/api/PlayerGetToken/?uid='+creator)
      .then((token)=>{
        console.log(token._bodyInit);
        fetch("https://exp.host/--/api/v2/push/getReceipts",{
          method:'POST',
          headers:{
            Accept:'application/json',
            'Content-Type':'application/json'
          },
          body:JSON.stringify({
            to:token._bodyInit,
            sound:'default',
            title:'New game',
            body:'Come play with ' + firebase.auth().currentUser + ' in ' + category + ' category game'
          })
        })
        .catch((error)=>{
          console.log(error);
        })
      })
    }
    //show all games if exists
    ShowGames=(categoryNameToJoin)=>{
        this.setState({
            games:[],
            show:true,
            isReady:false
        },()=>{
        gamesToShow=[];
        const ref =  firebase.database().ref("/theMole"+categoryNameToJoin);
        const openGames = ref.orderByChild("state").equalTo(STATE.OPEN);
        console.log(openGames);
        openGames.on("child_added",(snapshot,key)=>{
          const data = snapshot.val();
          //igonre our on games 
          if (data.creator.uid!=firebase.auth().currentUser.uid) {
          //push to an array
          game = {
              key:snapshot.key,
              data,
              category:categoryNameToJoin
          }
          gamesToShow.push(game);
          this.setState({
            isGames:true,
            games:gamesToShow,
            isReady:true
          })
          }
        })
      })
      setInterval(()=>{
        if (!this.state.isReady) {
          this.setState({
            isReady:true
          })
        }
      },5000)
    }
    render() {
        
        if (!this.state.isReady) {
          return(
            <Box f={1} center bg="white">
              <WikiLoader/>
            </Box>
          )
        }
        else{
        if (!this.state.show) {
            return (
                <View flex={1}>
                  <FlatGrid
                    itemDimension={130}
                    items={items}
                    style={styles.gridView}
                    spacing={20}
                    renderItem={({ item, index }) => (
                      <TouchableOpacity onPress={()=>this.ShowGames(item.name)}>
                        <ImageBackground source={item.image} style={{ flex: 1 }} resizeMode='contain'>
                          <View style={[styles.itemContainer,{borderStyle:'solid',bordeeWidth:2}]}>
                          </View>
                        </ImageBackground>
                      </TouchableOpacity>
                    )}
                  />
                  </View>
                );
        }
        else if(this.state.games.length!==0){
        return(
          <View flex={1} style={{margin:"5%"}}>
          <Text style={{fontSize:25,fontWeight:'bold',textAlign:'center'}}>Join a game</Text>
          <ScrollView>
              <View>

                  {this.state.games.map((l, i) => (
                  <ListItem
                      onPress={()=>this.JoinAGame(l.key,l.category)}
                      key={i}
                      leftAvatar={<Avatar
                          source={ {uri: l.data.creator.picture} }
                          size="large"
                      />}
                      title={l.data.creator.displayName}
                      titleStyle={{color:'#3A5173',fontWeight:'bold'}}
                      subtitle={"Category: " +l.category}
                      subtitleStyle={{color:'#627365'}}
                      rightIcon={
                          <Icon 
                          name='ios-arrow-round-forward'
                          style={{fontSize: 25, color: '#000'}}
                          />
                      }
                  />
                  ))
                  }
              </View>
          </ScrollView>
      </View>
        )
      }   
      return(
        <Box f={1} center bg="white">
          <Text>No open games:(</Text>
        </Box>
      )
    }
  }
}



//STYLES
const styles = StyleSheet.create({
    gridView: {
      marginTop: 20,
      flex: 1,
    },
    itemContainer: {
      justifyContent: 'flex-end',
      borderRadius: 5,
      padding: 10,
      height: 150,
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
