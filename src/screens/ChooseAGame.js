import React,{ Component } from "react";
import {Image,Text,StyleSheet} from "react-native";
import {Box} from 'react-native-design-utility'
import NetworkHeader from '../common/NetworkHeader';
import {Button,Icon,Container, Header, Content,} from 'native-base';
import firebase from 'firebase';
import {images} from '../constant/images';

const styles = StyleSheet.create({
    buttonStyle:{
        'margin':8
    },
    textStyle:{
        'fontSize':20
    }
})
const STATE = {
    OPEN:1,
    JOIN:2,
    NEXT:4,
    DONE:3,
  }
export default class GameTime extends React.Component{
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
                onPress={()=>navigation.navigate('Profile')}
                style={{backgroundColor:"transparent"}}>
                <Icon style={{color:"#4D5F66",fontSize:32}}  name="ios-arrow-round-back" />
            </Button>
            ),
          }
        }

        ChooseACategory = ()=>{
            this.props.navigation.navigate('Categories');
        }
        JoinAGame = ()=>{
            this.props.navigation.navigate('JoinGame');
        }
    render(){
        return(
            <Box f={1} center bg="white">
                <Button onPress={this.ChooseACategory} style={styles.buttonStyle} block success>
                    <Text style={styles.textStyle}>Create a new game</Text>
                </Button>
                <Button onPress={this.JoinAGame} style={styles.buttonStyle} block info>
                    <Text style={styles.textStyle}>Join a game</Text>
                </Button>
            </Box>
        )
    }
}