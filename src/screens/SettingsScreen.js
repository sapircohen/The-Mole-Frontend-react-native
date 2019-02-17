import React, { Component } from 'react';
import { Title,Button,Container, Content, List, ListItem, Text, Icon, Left, Body, Right, Switch, Header } from 'native-base';
import FooterNavigator from '../common/Footer'
import {View} from 'react-native';

export default class SettingsScreen extends Component {
    static navigationOptions = {
      headerTitle: "Settings",
    };
    BackToProfileScreen = (screenName) =>{
      if (screenName==='Back') {
        this.props.navigation.navigate('Profile');
      }
      else{
        this.props.navigation.navigate('Profile');
      }
    }
  render() {
    return (
        <Container>
            <View>
              <Header>
                <Left >
                  <Title style={{color:"red"}}>PROFILE SETTINGS</Title>
                </Left>
                <Right />
              </Header>
            </View>
            <Content>
            <ListItem icon>
              <Left>
                <Button style={{ backgroundColor: "#FF9501" }}>
                  <Icon active name="ios-volume-high" />
                </Button>
              </Left>
              <Body>
                <Text>Sound Mode</Text>
              </Body>
              <Right>
                <Switch value={true} />
              </Right>
            </ListItem>
            <ListItem icon>
              <Left>
                <Button style={{ backgroundColor: "#007AFF" }}>
                  <Icon active name="ios-notifications" />
                </Button>
              </Left>
              <Body>
                <Text>Send Push Notifications</Text>
              </Body>
              <Right>
                <Switch value={true} />
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
          <View>
              <Header>
                <Left >
                  <Title style={{color:"red"}}>SHARE THE APP</Title>
                </Left>
                <Right />
              </Header>
            </View>
            <Content>
            <ListItem icon>
              <Left>
                <Button style={{ backgroundColor: "blue" }}>
                  <Icon active name="logo-facebook" />
                </Button>
              </Left>
              <Body>
                <Text>Share with Facebook!</Text>
              </Body>
              <Right>
                <Icon active name="arrow-forward" />
              </Right>
            </ListItem>
            <ListItem icon>
              <Left>
                <Button style={{ backgroundColor: "green" }}>
                  <Icon active name="logo-whatsapp" />
                </Button>
              </Left>
              <Body>
                <Text>Share with Whatsapp!</Text>
              </Body>
              <Right>
                <Icon active name="arrow-forward" />
              </Right>
            </ListItem>
          </Content>
          <FooterNavigator BackOrSave={this.BackToProfileScreen} />
        </Container>
    );
  }
}