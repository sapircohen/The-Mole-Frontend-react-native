import * as React from 'react';
import {Linking,ScrollView} from 'react-native';
import {  Button, Card, Title, Paragraph } from 'react-native-paper';
import NetworkHeader from '../common/NetworkHeader';
import {images} from '../constant/images';

const wikipediaApi = 'https://en.wikipedia.org/w/api.php?format=json&action=query&generator=random&prop=extracts&exintro=&explaintext=&grnnamespace=0';
const body = { method: 'GET', dataType: 'json'};
const myRequest = new Request(wikipediaApi, body); 
let fullWikiUri = "";


class RandArticle extends React.Component{
  state = {
    randomArticle:"",
    article:false,
    randomArticleImage:"",
    randomArticleURI:""
  }
  componentDidMount(){
    fetch(myRequest)
          .then(response => response.json())
          .then(data => {
            var pageid = Object.keys(data.query.pages)[0];
            //console.log( 'data fetched:   ', data.query.pages[pageid]);
            fullWikiUri = 'https://en.wikipedia.org/wiki/';
            let wiki = data.query.pages[pageid].title;
            fullWikiUri = fullWikiUri + wiki;
            //console.log(fullWikiUri);
            this.setState({ 
              randomArticle: data.query.pages[pageid], article: true })
          })
  }
  static navigationOptions = {
    headerTitle:"Random Wiki",
    headerBackground: (
      <NetworkHeader/>
    ),
    headerTitleStyle: { color: '#000',fontSize:23 },
  }
  goBackToProfile = ()=>{
    this.props.navigation.navigate('Profile');
  }
  goBackToWikipedia = ()=>{
    Linking.openURL(fullWikiUri);
  }
  render(){
    return(
    <ScrollView>
      <Card elevation={2}>
          <Card.Cover source={images.bouncyWikiLogo}/>      
          <Card.Content>
          <Title>{this.state.randomArticle.title}</Title>
          <Paragraph>{this.state.randomArticle.extract}</Paragraph>
        </Card.Content>
        <Card.Actions>
          <Button onPress={this.goBackToProfile}>Ok</Button>
          <Button onPress={this.goBackToWikipedia}>Get the full article!</Button>
        </Card.Actions>
      </Card>
    </ScrollView>
    )
  }
}


export default RandArticle;