import React,{ Component } from 'react';
import {Box} from 'react-native-design-utility'
import { StyleSheet,ImageBackground,ActivityIndicator,Image} from 'react-native';
import {Button,Icon, Content} from 'native-base';
import { Avatar,Text} from 'react-native-elements';
import FABStartGame from '../common/StartAGame';
import FABSettings from '../common/Settings';
import FABBombShop from '../common/BombShop';
import firebase from 'firebase';
import NetworkHeader from '../common/NetworkHeader';
import { Col, Row, Grid } from "react-native-easy-grid";

import {images} from '../constant/images';

const styles = StyleSheet.create({
  baseColumns:{
    padding:10,

  },
  dataViewCash:{
    alignItems:'center',
    borderStyle:'solid',
    borderColor:'grey',
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
  },
  textStyleForGrid:{
    textAlign:'center',
    color:'black',
    fontSize:20
  },
  colStyleForGrid:{
    backgroundColor:'transparent',
    borderStyle:'solid',
    borderRadius:20,
    // borderWidth:1,
    margin:8,
    //backgroundColor:'#70A380'
  }
})


class ProfileScreen extends Component{
    static navigationOptions = ({ navigation }) =>{
    return{
      headerTitle: (
        <Image style={{ width: 90, height: 50 }} source={images.logo}/>
      ),
      headerBackground: (
        <NetworkHeader/>
      ),
      headerTitleStyle: { color: '#4D5F66',fontSize:23 },
      headerRight: 
       ( <Button
          onPress={()=>navigation.navigate('Article')}
          style={{backgroundColor:"transparent"}}>
            <Icon style={{color:"#8B7FB0",fontSize:35}}  name="md-paper" />
        </Button>
       ),
      headerLeft: 
       ( <Button
          onPress={()=>navigation.navigate('Paths')}
          style={{backgroundColor:"transparent"}}>
          <Icon style={{color:"#8B7FB0",fontSize:35}}  name="ios-infinite" />
        </Button>
       ),
      }
    }
    state = {
      userName:"",
      userPic:"",
      email:"",
      isReady:false
    }
    NavigateToHelp = ()=>{
      this.props.navigation.navigate('Intro');
    }
    componentDidMount(){
      //get current user info from firebase auth
        this.setState({
          userName:firebase.auth().currentUser.displayName,
          userPic:firebase.auth().currentUser.photoURL,
          email:firebase.auth().currentUser.email,
          isReady:true
        })
    }
    EditAvatarPic = () =>{
      this.props.navigation.navigate('Avatar');
    }
    changeScreen=(screenName)=>{ 
     this.props.navigation.navigate(screenName);
    }
    render(){
      if (!this.state.isReady) {
        return(
          <Box f={1} center bg="white">
            <ActivityIndicator color='purple' size="large"/>
          </Box>
        )
      }
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
              <Text h5 style={{fontWeight:"bold",marginTop:"5%"}}>{this.state.userName}</Text>
            </Box>
                  <Content contentContainerStyle={{ flex: 1}}>
                    <Grid style={{justifyContent:'space-evenly'}}>
                      <Col style={styles.colStyleForGrid}>
                        <Row>
                          <Col >
                            <Text style={styles.textStyleForGrid}>400</Text>
                            <ImageBackground resizeMode='contain' style={{ flex: 1 }} source={images.dollar_coins}>
                            <Row></Row>
                            </ImageBackground>      
                            </Col>                 
                        </Row>
                      </Col>

                      <Col style={styles.colStyleForGrid}>
                        <Row>
                          <Col >
                            <Text style={styles.textStyleForGrid}>400</Text>
                            <ImageBackground resizeMode='contain' style={{ flex: 1 }} source={images.prize}>
                              <Row></Row>
                            </ImageBackground>
                          </Col>                        
                        </Row>
                      </Col>

                      {/* <Col style={styles.colStyleForGrid}>
                        <Row>
                          <Col >
                            <Text style={styles.textStyleForGrid}>20</Text>
                            <ImageBackground resizeMode='contain' style={{ flex: 1 }} source={images.bomb}>
                              <Row></Row>
                            </ImageBackground>
                          </Col>                        
                        </Row>
                      </Col> */}

                    </Grid>
                </Content>
            <Box f={1} style={{marginBottom:"3%"}}>
              <Box f={1} >
                <FABStartGame GoToScreen={this.changeScreen}/> 
              </Box>
              <Box style={{marginLeft:"37%"}}>
                <FABBombShop GoToScreen={this.changeScreen}/>
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
