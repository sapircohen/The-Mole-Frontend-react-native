import React,{ Component } from 'react';
import FooterNavigator from '../common/Footer'
import {Text} from 'react-native';
import { Container } from 'native-base';
import {StyleSheet, FlatList, View, Platform,Image} from 'react-native';
import NetworkHeader from '../common/NetworkHeader';
import {images} from '../constant/images';
import Lightbox from 'react-native-lightbox/Lightbox/';
import {Button} from 'react-native-elements';

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
    static navigationOptions = {
      headerTitle: "Avatars",
      headerBackground: (
        <NetworkHeader/>
      ),
      headerTitleStyle: { color: '#000',fontSize:20 },
    };

    BackToProfileScreen = (screenName) =>{
        if (screenName==='Back') {
          this.props.navigation.navigate('Profile');
        }
        else{  
          this.props.navigation.navigate('Profile');
        }
      }
    render(){
        return(
            <Container>
                <View  style={styles.MainContainer}>
                    <FlatList
                    data={ this.state.GridViewItems }
                    renderItem={({item}) =>
                        <View on style={styles.GridViewBlockStyle}>
                          <Lightbox activeProps={activeProps} pinchToZoom swipeToDismiss>
                            <Image style={styles.GridViewInsideImageItemStyle} source={item.key} />
                          </Lightbox>
                          <Button 
                            title="take me!"
                            style={{paddingBottom:1,paddingTop:1}}
                            type='outline'
                          />
                        </View>
                    }
                    numColumns={2}
                    />
                </View> 
              <FooterNavigator BackOrSave={this.BackToProfileScreen}/>
            </Container>
        )
    }
}


export default AvatarScreen;