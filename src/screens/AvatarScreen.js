import React,{ Component } from 'react';
import {Box,Text} from 'react-native-design-utility'
import FooterNavigator from '../common/Footer'
import { Container } from 'native-base';

class AvatarScreen extends Component{
    static navigationOptions = {
        headerTitle: "Avatars",
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
                <Box f={1} center>
                    <Text>Avatar Screen</Text>
                </Box>
                <FooterNavigator BackOrSave={this.BackToProfileScreen}/>
            </Container>
        )
    }
}

export default AvatarScreen;