import React,{ Component } from 'react';
import {Box} from 'react-native-design-utility'
import {Button,Icon,View} from 'react-native';
import { Avatar,Text} from 'react-native-elements';
import FABStartGame from '../common/StartAGame';
import FABSettings from '../common/Settings';
import FABBombShop from '../common/BombShop';
import firebase from 'firebase';


class ProfileScreen extends Component{
    static navigationOptions = {
      header:null,
    }
    state = {
      userName:"",
      userPic:"",
      email:""
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
      //change to navigate to AvatarScreen
    }
    changeScreen = (screenName)=>{
      this.props.navigation.navigate(screenName);
      //this.props.navigation.push(screenName);
    }

    render(){
        return(
            <Box f={1} bg="white">
              <Box f={1} center>
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
            <Box style={{marginLeft:"5%"}}>
              <Text>Games Won</Text>
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
