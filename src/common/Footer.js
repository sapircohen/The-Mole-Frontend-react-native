import React, { Component } from 'react';
import { Container, Content, Footer, FooterTab, Button, Icon, Text } from 'native-base';



export default class FooterNavigator extends Component {
  GoBack = ()=>{
    this.props.BackOrSave('Back');
  }
  GoSave = ()=>{
    //save prefferences to DB
    //go back to profile if saves uploded successfuly
    alert('Changes been saved!');
    this.props.BackOrSave('Save');
  }
  render() {
    return (
      <Container>
        <Content />
        <Footer>
          <FooterTab>
            <Button vertical onPress={this.GoBack}>
              <Icon name="ios-arrow-back" />
              <Text>Back</Text>
            </Button>
            <Button vertical onPress={this.GoSave}>
              <Icon name="ios-save" />
              <Text>Save</Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }
}