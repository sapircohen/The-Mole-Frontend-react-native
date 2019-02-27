import * as React from 'react';
import {  Button, Card, Title, Paragraph } from 'react-native-paper';
import NetworkHeader from '../common/NetworkHeader';
import {images} from '../constant/images';

const wikipediaApi = 'https://en.wikipedia.org/w/api.php?format=json&action=query&generator=random&prop=extracts&exintro=&explaintext=&grnnamespace=0';
const body = { method: 'GET', dataType: 'json'};
const myRequest = new Request(wikipediaApi, body); 

class RandArticle extends React.Component{
  state = {
    randomArticle:"",
    article:false,
    randomArticleImage:"",
    randomArticleImageWidth:0,
    randomArticleImageHeight:0,
  }
  //https://en.wikipedia.org/w/api.php?format=jsonfm&action=query&prop=extracts&exintro=&explaintext=
  componentDidMount(){
    fetch(myRequest)
          .then(response => response.json())
          .then(data => {
            var pageid = Object.keys(data.query.pages)[0];
            console.log( 'data fetched:   ', data.query.pages[pageid]);
            this.setState({ 
              randomArticle: data.query.pages[pageid], article: true })
          })
  }
  static navigationOptions = {
    headerTitle:"Random Wiki",
    headerBackground: (
      <NetworkHeader/>
    ),
  }
  goBackToProfile = ()=>{
    this.props.navigation.navigate('Profile');
  }
  render(){
    return(
      <Card>
        <Card.Cover source={images.wikiLogo}/>      
        <Card.Content>
        <Title>{this.state.randomArticle.title}</Title>
        <Paragraph>{this.state.randomArticle.extract}</Paragraph>
      </Card.Content>
      <Card.Actions>
        <Button onPress={this.goBackToProfile}>Ok</Button>
      </Card.Actions>
    </Card>
    )
  }
}


export default RandArticle;