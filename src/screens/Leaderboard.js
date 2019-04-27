import React,{Component} from 'react';
import { Image } from "react-native";
import { Container, Content, List, ListItem, Left, Body, Right, Thumbnail, Text,Button,Icon} from 'native-base';
import WikiLoader from '../common/WikiLoader';
import {Box} from 'react-native-design-utility';
import {images} from '../constant/images';
import NetworkHeader from '../common/NetworkHeader';


//for example
const list = [
  {
    name: 'Amy Farha',
    avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
    subtitle: 'Vice President'
  },
  {
    name: 'Chris Jackson',
    avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
    subtitle: 'Vice Chairman'
  },
];

export default class Leaderboard extends React.Component{
    state={
        bestPlayers:[],
        isReady:false
    }
    static navigationOptions = ({ navigation }) =>{
      return{
          headerTitle: (
              <Text style={{fontSize:35}}>🏆</Text>
              //<Image style={{ width: 90, height: 50,flex:1 }} resizeMode='contain' source={images.logo}/>
            ),
        headerBackground: (
          <NetworkHeader/>
        ),
        headerTitleStyle: { color: '#4D5F66',fontSize:23 },
        headerRight:<Text></Text>,
        headerLeft: 
          ( <Button
              onPress={()=>navigation.navigate('ChooseAGame')}
              style={{backgroundColor:"transparent",elevation:0}}>
              <Icon style={{color:"#403773",fontSize:32}}  name="ios-arrow-round-back" />
          </Button>
          ),
          }
      }
    componentDidMount(){
        //fetch all users from db ordered by number of wins
        this.setState({
            isReady:true
        })
    }
    render(){
        if (!this.state.isReady) {
            return(
              <Box f={1} center bg="white">
                <WikiLoader/>
              </Box>
            )
        }
        return(
            <Container>
              <Content>
                <List>
                {
                    list.map((l) => (
                      
                          <ListItem avatar>
                            <Left>
                              <Thumbnail source={{ uri: l.avatar_url }} />
                            </Left>
                            <Body>
                          <Text style={{fontWeight:'bold'}}>{l.name}</Text>
                          <Text note style={{color:'#7CCB9D',fontWeight:'bold'}}>3 wins</Text>
                          </Body>
                      </ListItem>
                    ))
                }
              </List>
            </Content>
          </Container>
        )
    }
}