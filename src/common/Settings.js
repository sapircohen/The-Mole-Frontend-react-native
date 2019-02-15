import React, { Component } from 'react';
import { Container, Header, View, Button, Icon, Fab } from 'native-base';

export default class FABSettings extends Component {
  constructor(props) {
  super(props)
    this.state = {
      active: false
    };
  }
  render() {
    return (  
      <Container>
        <View style={{ flex: 1 }}>
          <Fab
            active={this.state.active}
            direction="right"
            containerStyle={{ }}
            style={{ backgroundColor: '#00f0f0' }}
            position="bottomLeft"
            onPress={() => this.setState({ active: !this.state.active })}>
            <Icon name="md-build" />
            <Button style={{ backgroundColor: '#000000'}}>
                <Icon  name="md-settings" />
            </Button>
            <Button on style={{ backgroundColor: '#3B5998' }}>
                <Icon name="ios-alert" />
            </Button>
            <Button on style={{ backgroundColor: '#000000' }}>
              <Icon backgroundColor="white" name="ios-cart" />
            </Button>
          </Fab>
        </View>
      </Container>
    );
  }
}
