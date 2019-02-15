import React,{ Component } from 'react';
import {Box,Text} from 'react-native-design-utility'
import { Avatar } from 'react-native-elements';
import FABStartGame from '../common/StartAGame'
import firebase from 'firebase';
import { firstFromTime } from 'uuid-js';

class ProfileScreen extends Component{
    static navigationOptions = {
      header: null,
    }
    state = {
      userName:"",
      userPic:"",
      email:""
    }
    componentDidMount(){
      //get current user info from firebase auth, current user
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
          <Box f={1} center>
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
            <Box f={1} style={{marginLeft:"93%",marginBottom:"5%"}} >
              <FABStartGame/> 
            </Box>
        </Box>
        )
    }
}

export default ProfileScreen;
