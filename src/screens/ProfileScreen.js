import React,{ Component } from 'react';
import {Box,Text} from 'react-native-design-utility'
import { Avatar } from 'react-native-elements';
import FABStartGame from '../common/StartAGame'

class ProfileScreen extends Component{
    static navigationOptions = {
      header: null,
    }
    componentDidMount(){
      console.log(this.props.navigation)
    }
    EditAvatarPic = () =>{
      this.props.navigation.navigate('Home');
      //change to navigate to AvatarScreen
    }
    render(){
        const userName = this.props.navigation.getParam('userName','No name');
        return(
          <Box f={1} center>
              <Box f={1} center>
                <Avatar size='xlarge' 
                rounded
                source={{
                  uri:
                    'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
                }}
                showEditButton
                onEditPress={this.EditAvatarPic}
              />
              <Text size="lg" style={{marginTop:"5%"}}>{JSON.stringify(userName)}</Text>
            </Box>
            <Box f={1} style={{marginLeft:"93%",marginBottom:"5%"}} >
              <FABStartGame/> 
            </Box>
        </Box>
        )
    }
}

export default ProfileScreen;
