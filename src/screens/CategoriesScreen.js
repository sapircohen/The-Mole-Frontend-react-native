import { FlatGrid } from 'react-native-super-grid';
import React,{Component} from 'react';
import {View,StyleSheet,ImageBackground} from 'react-native';
import {Button,Icon} from 'native-base';
import NetworkHeader from '../common/NetworkHeader';
import BannerMole from "../common/BannerMole";

import {images} from '../constant/images';

export default class Categories extends Component{
    static navigationOptions = ({ navigation }) =>{
        return{
        headerTitle:"Choose a category",
        headerBackground: (
          <NetworkHeader/>
        ),
        headerTitleStyle: { color: '#000',fontSize:20 },
        headerLeft: 
         ( <Button
            onPress={()=>navigation.navigate('Profile')}
            style={{backgroundColor:"transparent"}}>
              <Icon style={{color:"black",fontSize:32}}  name="ios-arrow-round-back" />
          </Button>
         ),
        }
      }
      render() {
        const items = [
          { name: 'NBA', code: '#1abc9c' ,image:images.nbaLogo}, 
          { name: 'GENERAL KNOWLEDGE', code: '#3498db',image:images.generalKnowledgeLogo },
          { name: 'Music', code: '#34495e' ,image:images.musicLogo},
          { name: 'Politics', code: '#27ae60' ,image:images.politicsLogo},
          { name: 'Celebrity', code: '#27ae60' ,image:images.celebrityLogo},
          { name: 'Films', code: '#27ae60' ,image:images.filmLogo},

        ];
    
        return (
        <View flex={1}>
          <BannerMole title={'Choose a categori'}/>
          <FlatGrid
            itemDimension={130}
            items={items}
            style={styles.gridView}
            //staticDimension={300}
            // fixed
            spacing={20}
            renderItem={({ item, index }) => (
              <ImageBackground source={item.image} style={{ flex: 1 }} resizeMode='contain'>
                <View style={[styles.itemContainer,{borderStyle:'solid',bordeeWidth:2}]}>
                </View>
              </ImageBackground>
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
