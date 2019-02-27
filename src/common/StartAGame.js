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
    //this.props.GoToScreen('Categories');
    alert("Two Player game!");
  }
  AlertOnePlayer = ()=>{
    //this.props.GoToScreen('Categories');
    alert("One Player game!");
  }
  render() {
    return (  
      <Container backgroundColor="white">
        <View style={{ flex: 1 }}>
          <Fab
            active={this.state.active}
            direction="up"
            containerStyle={{ }}
            style={{ backgroundColor: '#5067FF'}}
            position="bottomRight"
            onPress={() => this.setState({ active: !this.state.active })}>
            <Icon name="logo-game-controller-b" />
            <Button onPress={this.AlertOnePlayer} style={{ backgroundColor: '#34A34F'}}>
                <Icon style={{fontSize:29}}  name="ios-contact" />
            </Button>
            <Button onPress={this.AlertTwoPlayers} on style={{ backgroundColor: '#3B5998' }}>
              <Icon style={{fontSize:29}}  name="ios-contacts" />
            </Button>
          </Fab>
        </View>
      </Container>
    );
  }
}
