import {createAppContainer,createStackNavigator,createSwitchNavigator,createBottomTabNavigator} from 'react-navigation';
import React,{Component} from 'react';
import NetworkHeader from '../common/NetworkHeader'

//Auth screen (only if the player isn't signed in)
const AuthNavigator = createStackNavigator(
    {
        Login:{
            getScreen: ()=>require('./LoginScreen').default,
        }
    },
    {
        navigationOptions:{
           header:null,
        },
    },
)

//user profile 
const ProfileNavigator = createStackNavigator(
    {
        Profile: {
            getScreen: ()=>require('./ProfileScreen').default,
        },
    },
)

const AvatarNavigator = createStackNavigator(
    {
        Avatar: {
            getScreen: ()=> require('./AvatarScreen').default,
        }
    }
)
//walkthrough game introduction . . .
const IntroNavigator = createStackNavigator(
    {
        Intro: {
            getScreen: ()=> require('./Intro').default,
        }
    }
)

//Article screen
const ArticleNavigator = createStackNavigator(
    {
        Intro: {
            getScreen: ()=> require('./article').default,
        }
    }
)

//Categories screen
const CategoriesNavigator = createStackNavigator(
    {
        Intro: {
            getScreen: ()=> require('./CategoriesScreen').default,
        }
    }
)

//settings screen . . .
const SettingsNavigator = createStackNavigator(
    {
        Settings: {
            getScreen: ()=> require('./SettingsScreen').default,
        }
    },
    {
    navigationOptions: {
        headerBackground: (
          <NetworkHeader/>
        ),
        headerTitleStyle: { color: '#000' },
      }
    },
)


//using switch navigator for better performence
const AppNavigator = createSwitchNavigator(
    {
        Splash:{
            getScreen:()=>require('./Splash').default,
        },
        Auth: AuthNavigator,
        Avatar: AvatarNavigator,
        Profile:ProfileNavigator,
        Intro:IntroNavigator,
        Settings:SettingsNavigator,
        Article:ArticleNavigator,
        Categories:CategoriesNavigator
    },{
        initialRouteName:'Splash',
    }
)

//warp with app container
const AppContainer = createAppContainer(AppNavigator);
class Navigation extends Component{
    render(){
        return <AppContainer />;
    }
}

export default Navigation;