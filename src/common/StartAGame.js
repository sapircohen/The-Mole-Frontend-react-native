import React, { Component } from 'react';
import { Container, Header, View, Button, Icon, Fab } from 'native-base';
//import Alert from '../common/Alert';

export default class FABStartGame extends Component {
  constructor(props) {
  super(props)
    this.state = {
      active: false
    };
  }
  
  AlertTwoPlayers = ()=>{
    
  }
  AlertOnePlayer = ()=>{

  }
  render() {
    return (  
      <Container>
        <Header />
        <View style={{ flex: 1 }}>
          <Fab
            active={this.state.active}
            direction="up"
            containerStyle={{ }}
            style={{ backgroundColor: '#5067FF' }}
            position="bottomRight"
            onPress={() => this.setState({ active: !this.state.active })}>
            <Icon name="ios-rocket" />
            <Button style={{ backgroundColor: '#34A34F'}}>
                <Icon onPress={this.AlertOnePlayer} name="ios-contact" />
            </Button>
            <Button on style={{ backgroundColor: '#3B5998' }}>
              <Icon onPress={this.AlertTwoPlayers} name="ios-contacts" />
            </Button>
          </Fab>
        </View>
      </Container>
    );
  }
}
