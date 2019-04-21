import React,{ Component } from 'react';
import FooterNavigator from '../common/Footer'
import {Text} from 'react-native';
import { Container,Icon } from 'native-base';
import {StyleSheet, FlatList, View, Platform,Image} from 'react-native';
import NetworkHeader from '../common/NetworkHeader';
import {images} from '../constant/images';
import Lightbox from 'react-native-lightbox/Lightbox/';
import {Button} from 'react-native-elements';
import BannerMole from '../common/BannerMole';
 
const activeProps = {
  resizeMode: 'contain',
  flex: 1,
  width: null
};
const styles = StyleSheet.create({
    MainContainer :{
      justifyContent: 'center',
      flex:7,
      margin: 10,
      paddingTop: (Platform.OS) === 'ios' ? 20 : 0,
      borderStyle:'solid',
      height:'auto'
    },
    GridViewBlockStyle: {
      justifyContent: 'center',
      flex:1,
      alignItems: 'center',
      height: 165,
      width:135,
      margin: 5,
      backgroundColor: 'transparent',
      borderStyle:'solid',
      borderWidth:1,
      borderRadius:15
    },
    GridViewInsideImageItemStyle: {
     justifyContent: 'center',
     width:159,
     height:115,
     borderRadius:10,
     //borderStyle:'solid',
     //borderWidth:1
    },
  });


class AvatarScreen extends Component{
  static navigationOptions = ({ navigation }) =>{
    return{
    headerTitle:"Our Avatars!",
    headerBackground: (
      <NetworkHeader/>
    ),
    headerTitleStyle: { color: '#000',fontSize:20 },
    headerLeft: 
     ( <Button
        onPress={()=>navigation.navigate('Profile')}
        type='clear'
        icon={
          <Icon
            name="ios-arrow-round-back"
            style={{color:"#403773",fontSize:35}}
          />
        }
    />
     ),
    }
  }
    state = {
        GridViewItems: [
          {key: images.avatar1},
          {key: images.avatar2},
          {key: images.avatar3},
          {key: images.avatar4},
          {key: images.avatar5},
          {key: images.avatar6},
          {key: images.avatar7},
          {key: images.avatar8},
          {key: images.avatar9},
        ],
    }
    BackToProfileScreen = (screenName) =>{
        if (screenName==='Back') {
          this.props.navigation.navigate('Profile');
        }
        else{  
          this.props.navigation.navigate('Profile');
        }
      }

    changeToAvatar = (avatar)=>{
        //ajaxCall("POST", "../api/Player?avatarUrl=netta&uid=sapir", "", success, error);
        let LastLogin = 'https://proj/bgroup65/prod/Player?avatarUrl='+avatar+'&uid='+firebase.auth().currentUser.uid;
        //         fetch(LastLogin, {
        //           method: 'POST',
        //           headers: {
        //             Accept: 'application/json',
        //             'Content-Type': 'application/json',
        //           },
        //         })
        //         .catch((error)=>{
        //           console.log(error);
        //         });
    }
    render(){
        return(
            <Container>
              <BannerMole title='More avatars are coming soon:)' />
                <View  style={styles.MainContainer}>
                    <FlatList
                    data={ this.state.GridViewItems }
                    renderItem={({item}) =>
                        <View on style={styles.GridViewBlockStyle}>
                          <Lightbox activeProps={activeProps} pinchToZoom swipeToDismiss>
                            <Image style={styles.GridViewInsideImageItemStyle} source={item.key} />
                          </Lightbox>
                          <Button 
                            onPress={()=>this.changeToAvatar(item.key)}
                            title="take me!"
                            style={{paddingBottom:1,paddingTop:1}}
                            type='outline'
                          />
                        </View>
                    }
                    numColumns={2}
                    />
                </View> 
            </Container>
        )
    }
}


export default AvatarScreen;