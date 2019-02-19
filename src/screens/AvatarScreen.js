import React,{ Component } from 'react';
import {Text} from 'react-native-design-utility'
import FooterNavigator from '../common/Footer'
import { Container } from 'native-base';
import {StyleSheet, FlatList, View, Alert, Platform} from 'react-native';
import NetworkHeader from '../common/NetworkHeader';

const styles = StyleSheet.create({
    MainContainer :{
    justifyContent: 'center',
    flex:1,
    margin: 10,
    paddingTop: (Platform.OS) === 'ios' ? 20 : 0
    },
    GridViewBlockStyle: {
      justifyContent: 'center',
      flex:1,
      alignItems: 'center',
      height: 100,
      margin: 5,
      backgroundColor: '#00BCD4',
      borderRadius:150
    },
    GridViewInsideTextItemStyle: {
     color: '#fff',
     padding: 10,
     fontSize: 18,
     justifyContent: 'center',
    },
  });


class AvatarScreen extends Component{
    state = {
        GridViewItems: [
          {key: 'One'},
          {key: 'Two'},
          {key: 'Three'},
          {key: 'Four'},
          {key: 'Five'},
          {key: 'Six'},
          {key: 'Seven'},
          {key: 'Eight'},
          {key: 'Nine'}
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
    GetGridViewItem (item) {
        Alert.alert(item);    
    }
    render(){
        
        return(
            <Container>
                <View style={styles.MainContainer}>
                    <FlatList
                    data={ this.state.GridViewItems }
                    renderItem={({item}) =>
                        <View style={styles.GridViewBlockStyle}>
                        <Text style={styles.GridViewInsideTextItemStyle} onPress={this.GetGridViewItem.bind(this, item.key)} > "sapir"</Text>
                        </View>
                    }
                    numColumns={3}
                    />
                </View> 
              <FooterNavigator BackOrSave={this.BackToProfileScreen}/>
            </Container>
        )
    }
}

export default AvatarScreen;