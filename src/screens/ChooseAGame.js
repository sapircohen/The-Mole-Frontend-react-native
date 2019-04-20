import React,{ Component } from "react";
import {Image,Text,StyleSheet} from "react-native";
import {Box} from 'react-native-design-utility'
import NetworkHeader from '../common/NetworkHeader';
import {Button,Icon,Container, Header, Content} from 'native-base';
import firebase from 'firebase';
import {images} from '../constant/images';


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
        MyGames = ()=>{
            this.props.navigation.navigate('MyOpenGames');
        }
        GamesWon = ()=>{
            this.props.navigation.navigate('GamesWon');
        }
    render(){
        return(
            <Box f={1} center bg="#fff">
                <Button onPress={this.ChooseACategory} style={styles.buttonStyle} block bordered dark>
                    <Text style={styles.textStyle}>Create a new game</Text>
                </Button>
                <Button onPress={this.JoinAGame} style={styles.buttonStyle} block bordered dark>
                    <Text style={styles.textStyle}>Join a game</Text>
                </Button>
                <Button onPress={this.MyGames} style={styles.buttonStyle} block bordered dark>
                    <Text style={styles.textStyle}>My opened games</Text>
                </Button>
                <Button onPress={this.GamesWon} style={styles.buttonStyle} block bordered dark>
                    <Text style={styles.textStyle}>Games WON</Text>
                </Button>
            </Box>
        )
    }
}

//STYLE
const styles = StyleSheet.create({
    buttonStyle:{
        'margin':10,
    },
    textStyle:{
        'fontSize':20,
        'color':'#000',
        'fontWeight':'100'
    },
})