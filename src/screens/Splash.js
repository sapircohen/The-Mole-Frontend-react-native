import React,{ Component } from 'react';
import {Box,Text} from 'react-native-design-utility'
import firebase from 'firebase';

import OnBoardingLogo from '../common/OnBoardingLogo'

class SplashScreen extends Component{
    componentDidMount(){
        this.checkAuth();
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