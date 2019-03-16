import React,{ Component  } from "react";
import { View } from "react-native";
import { ListItem } from 'react-native-elements'

let title = '';
let API = 'https://en.wikipedia.org/w/api.php?action=query&titles='+title+'&prop=pageimages&format=json&pithumbsize=100';

const list = [
//   {
//     name: 'Amy Farha',
//     avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
//     subtitle: 'Vice President'
//   },
//   {
//     name: 'Chris Jackson',
//     avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
//     subtitle: 'Vice Chairman'
//   },
//    // more items
]

export default class WikiList extends Component{
    state={
        imageList:[],
    }
    componentDidMount = ()=>{
        console.log(this.props.pathsList);
        this.props.pathsList.map(article=>{
            title=article;
            console.log(API);
            fetch(API)
                .then(response => response.json())
                .then(data => {
                console.log(data);
                var pageid = Object.keys(data.query.pages)[0];
                fullWikiUri = 'https://en.wikipedia.org/wiki/';
                let wiki = data.query.pages[pageid].title;
                fullWikiUri = fullWikiUri + wiki;
                // this.setState({ 
                //     randomArticle: data.query.pages[pageid],
                //     article: true,
                //     isReady:true
                // })
            })
        })
    }
    render(){
        return(
            <View>
            {
                list.map((l, i) => (
                <ListItem
                    key={i}
                    leftAvatar={{ source: { uri: l.avatar_url } }}
                    title={l.name}
                    subtitle={l.subtitle}
                />
                ))
            }
            </View>
        )
    }
}