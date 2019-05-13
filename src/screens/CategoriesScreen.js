import { FlatGrid } from 'react-native-super-grid';
import React,{Component} from 'react';
import {View,StyleSheet,ImageBackground,TouchableOpacity} from 'react-native';
import {Button,Icon} from 'native-base';
import NetworkHeader from '../common/NetworkHeader';
import firebase from 'firebase';
import NotificationPopupToShow from "../constant/notificationPopUp";

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
        headerTitleStyle: { color: '#4D5F66',fontSize:20,justifyContent: 'center' },
        headerLeft: 
         ( <Button
            onPress={()=>navigation.navigate('ChooseAGame')}
            style={{backgroundColor:"transparent",elevation:0}}>
              <Icon style={{color:"#403773",fontSize:32}}  name="ios-arrow-round-back" />
          </Button>
         ),
        }
      }
      state = {
        showPop:false,
        category:'',
      }
      //create a new game and insert it to firebase
      StartANewGame = (categoryName)=>{
        //use firebase right here!
        this.setState({
          showPop:false,
          category:categoryName
        },()=>{
          const ref = firebase.database().ref("/theMole"+categoryName);
          console.log(ref);
          //creating a game:
          let today = new Date();
          const dd = String(today.getDate()).padStart(2, '0');
          const mm = String(today.getMonth() + 1).padStart(2, '0');
          const yyyy = today.getFullYear();

          today = dd + '/' + mm + '/' + yyyy;
          console.log(today);
          const user = firebase.auth().currentUser;
          const currentGame = {
              Date:today,
              creator:{
                uid:user.uid,
                displayName:user.displayName,
                picture:user.photoURL
              },
              joiner:{},
              category: categoryName,
              state:STATE.OPEN
            }
            ref.push().set(currentGame);
            this.setState({
              showPop:true,
            })
        })
      }

      render() {
        const items = [
          { name: 'CELEBRITY', code: '#27ae60' ,image:images.celebrityLogo,id:2},
          { name: 'FILMS', code: '#27ae60' ,image:images.filmLogo,id:1},
          { name: 'NBA', code: '#1abc9c' ,image:images.nbaLogo,id:5}, 
          { name: 'GENERAL KNOWLEDGE', code: '#3498db',image:images.generalKnowledgeLogo,id:3 },
          { name: 'MUSIC', code: '#34495e' ,image:images.musicLogo,id:4},
          { name: 'POLITICS', code: '#27ae60' ,image:images.politicsLogo,id:6},
        ];
    
        return (
          <View flex={1}>
            {this.state.showPop && <NotificationPopupToShow title="New Game!" category={this.state.category}/>}
            <FlatGrid
              itemDimension={110}
              items={items}
              style={styles.gridView}
              spacing={30}
              renderItem={({ item, index }) => (
                <TouchableOpacity onPress={()=>this.StartANewGame(item.name)}>
                  <ImageBackground source={item.image} style={{ flex: 1 ,borderStyle:'solid',bordeeWidth:2}} resizeMode='cover'>
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

//STYLE
const styles = StyleSheet.create({
    gridView: {
      marginTop: 20,
      flex: 1,
    },
    itemContainer: {
      borderStyle:'dots',
      borderWidth:1,
      justifyContent: 'flex-end',
      borderRadius: 10,
      padding: 20,
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
