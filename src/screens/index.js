import {createAppContainer,createStackNavigator,createSwitchNavigator,createBottomTabNavigator} from 'react-navigation';
import React,{Component} from 'react';


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
const ProfileNavigator = createStackNavigator(
    {
        Profile: {
            getScreen: ()=>require('./ProfileScreen').default,
        },
    },
)
const TabNavigator = createBottomTabNavigator(
    {
        Home: {
            getScreen: ()=> require('./Home').default,
        }

    }
)
const IntroNavigator = createStackNavigator(
    {
        Home: {
            getScreen: ()=> require('./Intro').default,
        }

    }
)

const MainNavigator = createStackNavigator({
    Tab:TabNavigator,
})

const AppNavigator = createSwitchNavigator(
    {
        Splash:{
            getScreen:()=>require('./Splash').default,
        },
        Auth: AuthNavigator,
        Main: MainNavigator,
        Profile:ProfileNavigator,
        Intro:IntroNavigator,
    },{
        initialRouteName:'Splash'
    }
)

const AppContainer = createAppContainer(AppNavigator);
class Navigation extends Component{
    render(){
        return <AppContainer />;
    }
}

export default Navigation;