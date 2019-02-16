import React, { Component } from 'react';
import { Button,Container, Content, List, ListItem, Text, Icon, Left, Body, Right, Switch } from 'native-base';
import FooterNavigator from '../common/Footer'

export default class SettingsScreen extends Component {
    static navigationOptions = {
      headerTitle: "Settings",
    };
    // backToProfile = ()=>{

    // }
  render() {
    return (
        <Container>
          <Content>
            <ListItem icon>
              <Left>
                <Button style={{ backgroundColor: "#FF9501" }}>
                  <Icon active name="ios-airplane" />
                </Button>
              </Left>
              <Body>
                <Text>Airplane Mode</Text>
              </Body>
              <Right>
                <Switch value={true} />
              </Right>
            </ListItem>
            <ListItem icon>
              <Left>
                <Button style={{ backgroundColor: "#007AFF" }}>
                  <Icon active name="wifi" />
                </Button>
              </Left>
              <Body>
                <Text>Wi-Fi</Text>
              </Body>
              <Right>
                <Text>GeekyAnts</Text>
                <Icon active name="arrow-forward" />
              </Right>
            </ListItem>
            <ListItem icon>
              <Left>
                <Button style={{ backgroundColor: "#007AFF" }}>
                  <Icon active name="bluetooth" />
                </Button>
              </Left>
              <Body>
                <Text>Bluetooth</Text>
              </Body>
              <Right>
                <Text>On</Text>
                <Icon active name="arrow-forward" />
              </Right>
            </ListItem>
          </Content>
          <FooterNavigator />
        </Container>
    );
  }
}