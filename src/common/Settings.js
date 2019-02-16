import React, { Component } from 'react';
import { Container, Header, View, Button,Icon, Fab } from 'native-base';

export default class FABSettings extends Component {
  constructor(props) {
  super(props)
    this.state = {
      active: false
    };
  }
  goToIntro = ()=>{
    this.props.GoToScreen('Intro');
  }
  goToSettings = ()=>{
    this.props.GoToScreen('Settings');
  }
  render() {
    return (  
      <Container>
        <View style={{ flex: 1 }}>
          <Fab
            active={this.state.active}
            direction="up"
            containerStyle={{ }}
            style={{ backgroundColor: '#E78F4D' }}
            position="bottomLeft"
            onPress={() => this.setState({ active: !this.state.active })}>
            <Icon name="ios-options" />
            <Button onPress={this.goToSettings} name="settings" style={{ backgroundColor: '#A2A770'}}>
                <Icon  name="md-settings" />
            </Button>
            <Button onPress={this.goToIntro} name="instructions" on style={{ backgroundColor: '#7FA770' }}>
                <Icon name="ios-paper" />
            </Button>
          </Fab>
        </View>
      </Container>
    );
  }
}
