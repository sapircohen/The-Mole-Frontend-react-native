import React,{ Component } from 'react';
import {Box} from 'react-native-design-utility'
import firebase from 'firebase';
import {Alert} from 'react-native';
import { storageSet } from "../constant/Storage";
import OnBoardingLogo from '../common/OnBoardingLogo'
import { Notifications } from "expo";

const STATE = {
  REMOVE:0,
  OPEN:1,
  JOIN:2,
  START:3,
  NEXTCreator:4,
  NEXTJoiner:5,
  WINCreator:6,
  WINJoiner:7
}

class SplashScreen extends Component{
    state={
      notification:{},
    }
    componentDidMount(){
        this.checkAuth();
        this._notificationSubscription = Notifications.addListener(this._handleNotification);
    }
    _handleNotificationForeGround = (game,key,category)=>{
      const ref =  firebase.database().ref("/theMole"+category);
      const gameRef = ref.child(key);
      if (game) {
        fetch('https://proj.ruppin.ac.il/bgroup65/prod/api/NetworkStartAGame?categoryNAME='+category)
          .then(response => response.json())
          .then((data)=>{
            joinerPath = {
              path: data[1],
              verteciesToChooseFrom:data[3],
              target:data[0][0],
              next:data[1][1],
              length:data[1].length,
              pathHistory:[]
            }
            creatorPath = {
              path: data[0],
              verteciesToChooseFrom:data[2],
              target:data[1][0],
              next:data[0][1],
              length:data[0].length,
              pathHistory:[]
            }
            gameRef.update(({'JoinerPath': joinerPath}));
            gameRef.update(({'CreatorPath': creatorPath}));
          })
          .then(()=>{
            gameRef.update(({'state': STATE.START}));
            this.props.navigation.navigate('GameBoard');
          })
          .catch((err)=>{
            console.log(err)
          })
      }
      else{
        gameRef.update(({'state': STATE.REMOVE}));
      }
    }
    _handleNotification = ({origin,data}) => {
        storageSet('key', data.key);
        storageSet('category', data.category);
        if (origin === 'received') {
          // Works on both iOS and Android
          Alert.alert(
            'New Game!',
            'You have an open invite to a game in ' + data.category+ ' category',
            [
              {
                text: 'Cancel game',
                onPress: () => {this._handleNotificationForeGround(false,data.key,data.category)},
                style: 'cancel',
              },
              {
                text: "Let's go!", 
                onPress: () => {this._handleNotificationForeGround(true,data.key,data.category)},
                style:'default'
              },
            ],
            {cancelable: true},
          );          
        }
        else{
        //update game state and starting paths
        const ref =  firebase.database().ref("/theMole"+data.category);
        const gameRef = ref.child(data.key);

        fetch('https://proj.ruppin.ac.il/bgroup65/prod/api/NetworkStartAGame?categoryNAME='+data.category)
          .then(response => response.json())
          .then((data)=>{
            joinerPath = {
              path: data[1],
              verteciesToChooseFrom:data[3],
              target:data[0][0],
              next:data[1][1],
              length:data[1].length,
              pathHistory:[]
            }
            creatorPath = {
              path: data[0],
              verteciesToChooseFrom:data[2],
              target:data[1][0],
              next:data[0][1],
              length:data[0].length,
              pathHistory:[]
            }
            gameRef.update(({'JoinerPath': joinerPath}));
            gameRef.update(({'CreatorPath': creatorPath}));
          })
          .then(()=>{
            gameRef.update(({'state': STATE.START}));
            this.props.navigation.navigate('GameBoard');
          })
          .catch((err)=>{
            console.log(err)
          })
        }
    }
    checkAuth = ()=>{
        firebase.auth().onAuthStateChanged(user=>{
            if(user){
                let LastLogin = 'https://proj.ruppin.ac.il/bgroup65/prod/api/PlayerLastLogin';
                fetch(LastLogin, {
                    method: 'POST',
                    headers: {
                      Accept: 'application/json',
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                     Uid:firebase.auth().currentUser.uid
                    }),
                  })
                  .catch((error)=>{
                    alert(error);
                  });                
                  this.props.navigation.navigate('Profile',
                  params={
                    lastScreen: 'Splash'
                  });
            }
            else{
                this.props.navigation.navigate('Auth')
            }
        })    
    }

    render(){
        return(
            <Box f={1} center bg="white">
                <OnBoardingLogo />
            </Box>
        )
    }
}

export default SplashScreen;