import {createAppContainer,createStackNavigator,createSwitchNavigator,createBottomTabNavigator} from 'react-navigation';
import React,{Component} from 'react';

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

const TabNavigator = createBottomTabNavigator(
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

//settings screen . . .
const SettingsNavigator = createStackNavigator(
    {
        Settings: {
            getScreen: ()=> require('./SettingsScreen').default,
        }
    },
)

const MainNavigator = createStackNavigator({
    Tab:TabNavigator,
})

//using switch navigator for better performence
const AppNavigator = createSwitchNavigator(
    {
        Splash:{
            getScreen:()=>require('./Splash').default,
        },
        Auth: AuthNavigator,
        Avatar: MainNavigator,
        Profile:ProfileNavigator,
        Intro:IntroNavigator,
        Settings:SettingsNavigator,
    },{
        initialRouteName:'Splash'
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