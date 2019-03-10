import React, { Component } from 'react';
import { Container, View, Button,Icon, Fab } from 'native-base';

export default class FABBombShop extends Component {

  goToBombShop = ()=>{
    this.props.GoToScreen('BombShop');
  }
  render() {
    return (  
      <Container>
        <View style={{ flex: 1 }}>
          <Fab
            direction="up"
            containerStyle={{ }}
            style={{ backgroundColor: '#000000' }}
            position="bottomLeft"
            onPress={this.goToBombShop}>
            <Icon name="ios-cart" />
          </Fab>
        </View>
      </Container>
    );
  }
}
