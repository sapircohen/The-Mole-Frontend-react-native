import React,{ Component } from 'react';
import {Box} from 'react-native-design-utility'
import { View, Alert,StyleSheet} from 'react-native';
import {Button,Icon} from 'native-base';
import { Avatar,Text} from 'react-native-elements';
import FABStartGame from '../common/StartAGame';
import FABSettings from '../common/Settings';
import FABBombShop from '../common/BombShop';
import firebase from 'firebase';
import NetworkHeader from '../common/NetworkHeader';
//https://en.wikipedia.org/w/api.php?action=parse&prop=sections&page=2018_AFC_Champions_League_group_stage&format=json&formatversion=2&callback=?





const styles = StyleSheet.create({
  dataViewCash:{
    alignItems:'center',
    borderStyle:'solid',
    borderColor:'grey',
    //borderWidth:1,
    padding:10,
    borderRadius:10,
    backgroundColor:'#4F86EC'
  },
  dataViewBombs:{
    alignItems:'center',
    borderStyle:'solid',
    borderColor:'grey',
    //borderWidth:1,
    padding:10,
    borderRadius:10,
    backgroundColor:'#F2BD42'
  },
  dataViewWins:{
    backgroundColor:'green',
    alignItems:'center',
    borderStyle:'solid',
    borderColor:'grey',
    backgroundColor:'#D95040',
    padding:10,
    borderRadius:10,
    marginTop:"15%"
  }
})


class ProfileScreen extends Component{
    static navigationOptions = ({ navigation }) =>{
      return{
      headerTitle:"Your Profile",
      headerBackground: (
        <NetworkHeader/>
      ),
      headerTitleStyle: { color: '#000',fontSize:23 },
      headerRight: 
       ( <Button
          onPress={()=>navigation.navigate('Article')}
          style={{backgroundColor:"transparent"}}>
            <Icon style={{color:"black",fontSize:32}}  name="md-paper" />
        </Button>
       ),
      }
    }
    state = {
      userName:"",
      userPic:"",
      email:"",
    }
    NavigateToHelp = ()=>{
      this.props.navigation.navigate('Intro');
    }
    componentDidMount(){
      //get current user info from firebase auth
        this.setState({
          userName:firebase.auth().currentUser.displayName,
          userPic:firebase.auth().currentUser.photoURL,
          email:firebase.auth().currentUser.email
        })
    }
    EditAvatarPic = () =>{
      this.props.navigation.navigate('Avatar');
    }
    changeScreen=(screenName)=>{ 
     this.props.navigation.navigate(screenName);
    }
    render(){
        return(
            <Box f={1} bg="white">
              <Box f={1} style={{marginTop:"15%"}} center>
                <Avatar size='xlarge' 
                rounded
                source={{
                  uri:
                   this.state.userPic?this.state.userPic:'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
                }}
                showEditButton
                onEditPress={this.EditAvatarPic}
              />
              <Text h4 style={{fontWeight:"bold",marginTop:"5%"}}>{this.state.userName}</Text>
            </Box>
            {/* this box is for user labels */}
            <Box f={1} style={{marginTop:"15%"}}>
                <View style={{flexDirection:"row",justifyContent:"space-around"}}>
                  <View style={styles.dataViewCash}>
                    <Text style={{fontSize:20}}>200</Text>
                    <Text style={{fontSize:20}}>Cash Mole</Text>
                  </View>
                  <View style={styles.dataViewBombs}  >
                    <Text style={{fontSize:20}}>300</Text>
                    <Text style={{fontSize:20}}>Mole Bombs</Text>
                  </View>
                </View>
                <View style={{flexDirection:"row",justifyContent:"space-around"}}>
                  <View></View>
                  <View style={styles.dataViewWins}>
                      <Text style={{fontSize:20}}>400</Text>
                      <Text style={{fontSize:20}}>Mole Wins</Text>
                  </View>
                  <View>
                  </View>
                </View>
            </Box>
            <Box f={1} style={{marginBottom:"3%"}}>
              <Box f={1} >
                <FABStartGame GoToScreen={this.changeScreen}/> 
              </Box>
              <Box style={{marginLeft:"37%"}}>
                <FABBombShop/>
              </Box>
              <Box>
                <FABSettings GoToScreen={this.changeScreen} />
              </Box>
            </Box>
          </Box>
        )
    }
}


export default ProfileScreen;
