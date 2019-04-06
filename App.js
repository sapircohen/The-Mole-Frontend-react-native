import React from 'react';
import { StyleSheet,View,Button,ActivityIndicator} from 'react-native';
import {UtilityThemeProvider, Box,Text} from 'react-native-design-utility';

import Navigation from './src/screens/index';
import {images} from './src/constant/images';
import {cacheImages} from './src/utils/cachImage';
import firebase from 'firebase';
import {FirebaseConfig} from './src/constant/ApiKeys';
//initializing firebase for auth
firebase.initializeApp(FirebaseConfig);


export default class App extends React.Component {

  state ={
    isReady:false,
    notification: {},
  }
  componentDidMount(){
    this.cacheAssets();
  }
  
  cacheAssets = async () =>{
    const imagesAssets = cacheImages(Object.values(images));
    await Promise.all([...imagesAssets]);
    this.setState({isReady:true});

  }

  render() {
    
    if (!this.state.isReady) {
      return(
        <Box f={1} center bg="white">
          <ActivityIndicator size="large"/>
        </Box>
      )
    }
    return (
      <UtilityThemeProvider>
        <Navigation  />
      </UtilityThemeProvider>
    );
  }
}

