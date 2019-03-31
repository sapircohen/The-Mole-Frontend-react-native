import { FlatGrid } from 'react-native-super-grid';
import React,{Component} from 'react';
import {View,StyleSheet,ImageBackground,TouchableOpacity} from 'react-native';
import {Button,Icon,Text} from 'native-base';
import NetworkHeader from '../common/NetworkHeader';
import BannerMole from "../common/BannerMole";
import firebase from 'firebase';

import {images} from '../constant/images';

const STATE = {
  OPEN:1,
  JOIN:2,
  NEXT:4,
  DONE:3,
}

export default class Categories extends Component{
    static navigationOptions = ({ navigation }) =>{
        return{
        headerTitle:"Choose a category",
        headerBackground: (
          <NetworkHeader/>
        ),
        headerTitleStyle: { color: '#4D5F66',fontSize:20 },
        headerLeft: 
         ( <Button
            onPress={()=>navigation.navigate('ChooseAGame')}
            style={{backgroundColor:"transparent"}}>
              <Icon style={{color:"#4D5F66",fontSize:32}}  name="ios-arrow-round-back" />
          </Button>
         ),
        }
      }

      StartANewGame = (categoryName)=>{
        //use firebase right here!
        const ref = firebase.database().ref("/theMole"+categoryName);
        console.log(ref);
        //creating a game:
          const user = firebase.auth().currentUser;
          const currentGame = {
            creator:{
              uid:user.uid,
              displayName:user.displayName
            },
            state:STATE.OPEN
          }
          ref.push().set(currentGame);
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
    
        return (
        <View flex={1}>
          {/* <BannerMole title={'more categories are coming soon:)'}/> */}
          <FlatGrid
            itemDimension={130}
            items={items}
            style={styles.gridView}
            spacing={20}
            renderItem={({ item, index }) => (
              <TouchableOpacity onPress={()=>this.StartANewGame(item.name)}>
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
