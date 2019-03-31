
import React,{ Component } from "react";
import {Image,Text,StyleSheet,View,TouchableOpacity,ImageBackground} from "react-native";
import { FlatGrid } from 'react-native-super-grid';
import {Box} from 'react-native-design-utility'
import NetworkHeader from '../common/NetworkHeader';
import {Button,Icon,Container, Header, Content} from 'native-base';
import firebase from 'firebase';
import {images} from '../constant/images';

//join an existing game
let gamesToShow=[];
const STATE = {
    OPEN:1,
    JOIN:2,
    NEXT:4,
    DONE:3,
  }

export default class GameBoard extends React.Component{
    state = {
        show:false
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
    JoinAGame = (key)=>{
        //use firebase right here to join existing game in a category to choose from
        const user = firebase.auth().currentUser;
        const gameRef = ref.child(key);
        gameRef.transaction((game)=>{
            if (!game.joiner) {
                game.state = STATE.JOIN;
                game.joiner = {
                    uid:user.uid,
                    displayName:user.displayName
                }
            }
        })
        return game;
    }
    //show all games 
    ShowGames=(categoryNameToJoin)=>{
        this.setState({
            show:true
        },()=>{
            const ref = firebase.database().ref("/theMole"+categoryNameToJoin);
            const openGames = ref.orderByChild("state").equalTo(STATE.OPEN);
            openGames.on("child_added",(snapshot,key)=>{
                const data = snapshot.val();
                //igonre our on games 
                if (data.creator.uid!=firebase.auth().currentUser) {
                    //push to an array
                    game = {
                        key:snapshot.key,
                        data
                    }
                    gamesToShow.push(game);
                }
            })
        })
        console.log(gamesToShow);
    }
    render() {
        const items = [
          { name: 'NBA', code: '#1abc9c' ,image:images.nbaLogo,id:5}, 
          { name: 'GENERAL KNOWLEDGE', code: '#3498db',image:images.generalKnowledgeLogo,id:3 },
          { name: 'MUSIC', code: '#34495e' ,image:images.musicLogo,id:4},
          { name: 'POLITICS', code: '#27ae60' ,image:images.politicsLogo,id:6},
          { name: 'CELEBRITY', code: '#27ae60' ,image:images.celebrityLogo,id:2},
          { name: 'FILMS', code: '#27ae60' ,image:images.filmLogo,id:1},
        ];
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
        return(
            <View>
                {/* need to show games and on press return key, use render items*/}
            </View>
        )
        
    }
}
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
