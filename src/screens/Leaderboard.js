import React,{Component} from 'react';
import { List, ListItem,Avatar } from 'react-native-elements';
import WikiLoader from '../common/WikiLoader';
import {Box} from 'react-native-design-utility';


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
            <Box f={1} center bg="white">
                <List containerStyle={{marginBottom: 20}}>
                {
                    list.map((l) => (
                    <ListItem
                        roundAvatar
                        avatar={{uri:l.avatar_url}}
                        key={l.name}
                        title={l.name}
                        />
                    ))
                }
                </List>
            </Box>)

    }
}