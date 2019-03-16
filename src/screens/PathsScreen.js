import React,{ Component } from "react";
import {Image, StyleSheet,View ,TouchableOpacity,Linking,ScrollView,ActivityIndicator} from "react-native";
import {Button,Icon, Text} from 'native-base';
import  NetworkHeader from '../common/NetworkHeader';
import Autocomplete from 'react-native-autocomplete-input';
import { ListItem,Avatar } from 'react-native-elements'
import { images } from "../../src/constant/images";
import {Box} from 'react-native-design-utility';


const styles = StyleSheet.create({
    container: {
        paddingTop: 15,
        borderRadius:50
      },
      autocompleteContainer: {
        marginLeft: 10,
        marginRight: 10,
      },
      itemText: {
        fontSize: 20,
        margin: 1,
        color:'#3C4037'
      },

      infoText: {
        textAlign: 'center'
      },
      list:{
        borderColor:"grey",
        borderWidth:0.6,
        borderStyle:'solid',
        backgroundColor:'#E2B5FF',
        position:'relative'
      },
      openingText: {
        textAlign: 'center'
      },
        textInputStyle:{
            height:40,
            borderColor:'grey',
            borderWidth:1,
            margin:'5%',
            padding:10,
            borderRadius:10
        },
        title:{
            textAlign:'center',

        }
})

export default class Paths extends React.Component{
    static navigationOptions = ({ navigation }) =>{
        return{
            headerTitle: (
                <Image style={{ width: 220, height: 39 }} source={images.SIXDOW}/>
            ),
          headerBackground: (
            <NetworkHeader/>
          ),
          headerTitleStyle: { color: '#4D5F66',fontSize:23 },
          headerLeft: 
           ( <Button
              onPress={()=>navigation.navigate('Profile')}
              style={{backgroundColor:"transparent"}}>
              <Icon style={{color:"#4D5F66",fontSize:29}}  name="ios-arrow-back" />
            </Button>
           ),
          }
        }
    state={
        path:[],
        paths:[],
        articles: [],
        secondArticles:[],
        query: '',
        secondQuery:'',
        isReady:true
    }
    FirstOpenSearchWiki = (text)=>{
        const serachTerm = text;
        const API = 'https://en.wikipedia.org/w/api.php?action=opensearch&search='+serachTerm+'&limit=10&namespace=0&format=json';

        console.log(serachTerm);
        console.log(API);
        fetch(API)
          .then(response => response.json())
          .then(data => {
            console.log(data[1]);
            this.setState({ 
              articles:data[1],
              query: text,
             })
          })
    }

    SecondOpenSearchWiki = (text)=>{
        const serachTerm = text;
        const API = 'https://en.wikipedia.org/w/api.php?action=opensearch&search='+serachTerm+'&limit=10&namespace=0&format=json';

        console.log(serachTerm);
        console.log(API);
        fetch(API)
          .then(response => response.json())
          .then(data => {
            console.log(data[1]);
            this.setState({ 
                secondArticles:data[1],
                secondQuery: text,
             })
          })
    }
    SearchPath = ()=>{      
        this.setState({
            paths:[this.state.query,this.state.secondQuery],
            path:[],
            isReady:false
        },()=>
        {
        this.state.paths.map((article,i)=>{
            let API = 'https://en.wikipedia.org/w/api.php?action=query&titles='+article+'&prop=pageimages&format=json&pithumbsize=100';
            console.log(API);
            fetch(API)
                .then(response => response.json())
                .then(data => {
                console.log(data);

                //getting the page id for extracting information about the article 
                var pageid = Object.keys(data.query.pages)[0];
                
                //getting the full url to redirect user onPress
                fullWikiUri = 'https://en.wikipedia.org/wiki/';
                let wiki = data.query.pages[pageid].title;
                fullWikiUri = fullWikiUri + wiki;
                
                //updating the list to be rendered
                let wikiArticleForList = {
                    name:data.query.pages[pageid].title,
                    avatar_url:data.query.pages[pageid].thumbnail.source,
                    wikiUrl:fullWikiUri
                }
                this.setState(prevState => ({
                    path:[...prevState.path,wikiArticleForList],
                    isReady:true
                }))
            })
        })
        console.log(this.state.path.length)
    })

    //need to get path from api (not working for the moment)

        // const source = this.state.query.replace(' ','%20');
        // const target = this.state.secondQuery.replace(' ','%20');;
        // const pathsUri = 'http://proj.ruppin.ac.il/bgroup65/prod/api/SIXDOW?source='+source+'&target='+target;
        // console.log(pathsUri)
        // fetch(pathsUri)
        //   .then(response => response.json())
        //   .then(data => {
        //     console.log(data);
        //     this.setState({ 
        //         path:data
        //      })
        //   })
    }
    render(){
        const comp = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();
        if (!this.state.isReady) {
            return(
              <Box f={1} center bg="white">
                <ActivityIndicator color='purple' size="large"/>
              </Box>
            )
          }
        return(
            <View flex={1} style={{marginTop:'4%'}}>
                <Text style={{textAlign:'center',marginTop:'5%',fontSize:24}}>Find the shortest paths{"\n"}From</Text>

                <View style={styles.container}>
                    <Autocomplete
                    listStyle={styles.list}
                    autoCapitalize="words"
                    autoCorrect={false}
                    containerStyle={styles.autocompleteContainer}
                    data={this.state.articles.length === 1 && comp(query, this.state.articles[0]) ? [] : this.state.articles}
                    defaultValue={this.state.query}
                    onChangeText={text => this.FirstOpenSearchWiki(text)}
                    renderItem={(wikiTitle) => (
                        <TouchableOpacity onPress={() => this.setState({ query: wikiTitle,articles:[]})}>
                            <Text style={styles.itemText}>
                                {wikiTitle}
                            </Text>
                        </TouchableOpacity>
                    )}
                    />
                </View>
                <Text style={{textAlign:'center',fontSize:24,marginTop:'3%'}}>To</Text>
                <View style={styles.container}>
                    <Autocomplete
                    listStyle={styles.list}
                    autoCapitalize="words"
                    autoCorrect={false}
                    containerStyle={styles.autocompleteContainer}
                    data={this.state.secondArticles.length === 1 && comp(query, this.state.secondArticles[0]) ? [] : this.state.secondArticles}
                    defaultValue={this.state.secondQuery}
                    onChangeText={text => this.SecondOpenSearchWiki(text)}
                    renderItem={(wikiTitle) => (
                        <TouchableOpacity onPress={() => this.setState({ secondQuery: wikiTitle,secondArticles:[] })}>
                            <Text style={styles.itemText}>
                                {wikiTitle}
                            </Text>
                        </TouchableOpacity>
                    )}
                    />
                </View>
                <View flex={1} style={{margin:"5%"}}>
                    <Button style={{backgroundColor:"#E384FF"}} onPress={this.SearchPath} block >
                        <Text style={{fontSize:25,fontWeight:'bold'}}>Let's Go!</Text>
                    </Button>
                    <ScrollView>
                        <View>
                        {
                            this.state.path.map((l, i) => (
                            <ListItem
                                onPress={()=> Linking.openURL(l.wikiUrl)}
                                key={i}
                                leftAvatar={<Avatar
                                    source={ {uri: l.avatar_url } }
                                    size="large"
                                />}
                                title={l.name}
                                subtitle={l.subtitle}
                                rightIcon={
                                    <Icon 
                                    name='ios-infinite'
                                    />
                                }
                            />
                            ))
                        }
                        </View>
                    </ScrollView>
                </View>
            </View>
        );
    }
}
