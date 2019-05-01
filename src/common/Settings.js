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
      //<Container>
        <View style={{ flex: 1 }}>
          <Fab 
            active={this.state.active}
            direction="up"
            containerStyle={{ }}
            style={{ backgroundColor: '#E6E386' }}
            position="bottomLeft"
            onPress={() => this.setState({ active: !this.state.active })}>
            <Icon name="ios-options" />
            {/* <Button onPress={this.goToSettings} name="settings" style={{ backgroundColor: '#808080'}}>
                <Icon style={{fontSize:29}} name="md-settings" />
            </Button> */}
            <Button onPress={this.goToIntro} name="instructions" on style={{ backgroundColor: '#81BFAF' }}>
                <Icon style={{fontSize:30}} name="ios-help-buoy" />
            </Button>
          </Fab>
        </View>
      //</Container>
    );
  }
}
