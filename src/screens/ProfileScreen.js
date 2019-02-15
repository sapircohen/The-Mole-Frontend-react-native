import React,{ Component } from 'react';
import {Box,Text} from 'react-native-design-utility'
import {Button,Icon,View} from 'react-native';
import { Avatar} from 'react-native-elements';
import FABStartGame from '../common/StartAGame';
import FABSettings from '../common/Settings';
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
      this.props.navigation.navigate('Home');
      //change to navigate to AvatarScreen
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
              <Text size="lg" style={{marginTop:"5%"}}>{this.state.userName}</Text>
            </Box>
            <Box style={{marginLeft:"5%"}}>
              <Text>Games Won</Text>
            </Box>
            <Box f={1} style={{flexDirection:"row"}}>
              <Box f={1} style={{marginLeft:"100%",marginBottom:"8%"}} >
                <FABStartGame/>  
              </Box>
              <Box style={{backgroundColor:"black",marginBottom:"8%"}} >
                <FABSettings/>
              </Box>
            </Box>
          </Box>
        )
    }
}

export default ProfileScreen;
