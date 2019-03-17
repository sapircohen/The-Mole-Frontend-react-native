import React, { Component } from 'react';
import { Container, Header, View, Button, Icon, Fab } from 'native-base';
export default class FABStartGame extends Component {
  constructor(props) {
  super(props)
    this.state = {
      active: false
    };
  }
  AlertTwoPlayers = ()=>{
    this.props.GoToScreen('Categories');
  }
  AlertOnePlayer = ()=>{
    this.props.GoToScreen('Categories');
  }
  Paths = ()=>{
    this.props.GoToScreen('Paths');
  }
  render() {
    return (  
      <Container backgroundColor="white">
        <View style={{ flex: 1 }}>
          <Fab
            active={this.state.active}
            direction="up"
            containerStyle={{ }}
            style={{ backgroundColor: '#8BBAE3'}}
            position="bottomRight"
            onPress={() => this.setState({ active: !this.state.active })}>
            <Icon name="logo-game-controller-b" />
            <Button onPress={this.AlertOnePlayer} style={{ backgroundColor: '#A0C5D4'}}>
                <Icon style={{fontSize:29}}  name="ios-contact" />
            </Button>
            <Button onPress={this.AlertTwoPlayers} on style={{ backgroundColor: '#A2C593' }}>
              <Icon style={{fontSize:29}}  name="ios-contacts" />
            </Button>
          </Fab>
        </View>
      </Container>
    );
  }
}
