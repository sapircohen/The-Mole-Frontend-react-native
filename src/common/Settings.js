import React, { Component } from 'react';
import { Container, Header, View, Button,Icon, Fab } from 'native-base';

export default class FABSettings extends Component {
  constructor(props) {
  super(props)
    this.state = {
      active: false
    };
  }
  goToBombShop = ()=>{

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
            <Icon name="md-build" />
            <Button onPress={this.goToSettings} name="settings" style={{ backgroundColor: '#000000'}}>
                <Icon  name="md-settings" />
            </Button>
            <Button onPress={this.goToIntro} name="instructions" on style={{ backgroundColor: '#3B5998' }}>
                <Icon name="ios-alert" />
            </Button>
            <Button onPress={this.goToBombShop} name="bombShop" on style={{ backgroundColor: '#000000' }}>
              <Icon backgroundColor="white" name="ios-cart" />
            </Button>
          </Fab>
        </View>
      </Container>
    );
  }
}
