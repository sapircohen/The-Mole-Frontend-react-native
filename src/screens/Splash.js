import React,{ Component } from 'react';
import {Box,Text} from 'react-native-design-utility'
import {Image} from 'react-native';
import firebase from 'firebase';

import OnBoardingLogo from '../common/OnBoardingLogo'

class SplashScreen extends Component{
    componentDidMount(){
        this.checkAuth();
      }

    checkAuth = ()=>{
        firebase.auth().onAuthStateChanged(user=>{
            if(user){
                this.props.navigation.navigate('Profile');
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