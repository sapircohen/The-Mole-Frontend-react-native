import React, { Component } from 'react';
import { Container, Content, Footer, FooterTab, Button, Icon, Text } from 'native-base';



export default class FooterNavigator extends Component {
  render() {
    return (
      <Container>
        <Content />
        <Footer>
          <FooterTab>
            <Button vertical onPress={()=>alert("need to go back to profile")}>
              <Icon name="ios-arrow-back" />
              <Text>Back</Text>
            </Button>
            <Button vertical onPress={()=>alert("need to save to DB and go back to profile")}>
              <Icon name="ios-save" />
              <Text>Save</Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }
}