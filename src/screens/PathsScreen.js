import React,{ Component } from "react";
import { StyleSheet,View ,TextInput} from "react-native";
import {Button,Icon, Text} from 'native-base';

//import { Col, Row, Grid } from "react-native-easy-grid";
import  NetworkHeader from '../common/NetworkHeader';
const style = StyleSheet.create({
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
          headerTitle:"6DOW",
          headerBackground: (
            <NetworkHeader/>
          ),
          headerTitleStyle: { color: '#4D5F66',fontSize:23 },
          headerLeft: 
           ( <Button
              onPress={()=>navigation.navigate('Profile')}
              style={{backgroundColor:"transparent"}}>
              <Icon style={{color:"black",fontSize:29}}  name="ios-arrow-back" />
            </Button>
           ),
          }
        }
    state={
        backgroundColor:'transparent',
        backgroundColor1:'transparent'
    }
    render(){
        return(
            <View>
                <Text style={{textAlign:'center',marginTop:'5%',fontSize:24}}>Find the shortest paths from</Text>
                <TextInput
                    onBlur = {()=>this.setState({backgroundColor:'transparent'})}
                    onFocus = {()=>this.setState({backgroundColor:'#E2FFF0'})}
                    style={{
                            backgroundColor:this.state.backgroundColor,
                            height:45,
                            borderColor:'grey',
                            borderWidth:1,
                            margin:'4%',
                            padding:10,
                            borderRadius:10,
                            color:'black'
                        }}
                    />

                <Text style={{textAlign:'center',fontSize:24}}>To</Text>

                <TextInput
                    onBlur = {()=>this.setState({backgroundColor1:'transparent'})}
                    onFocus = {()=>this.setState({backgroundColor1:'#E2FFF0'})}
                    style={{
                            backgroundColor:this.state.backgroundColor1,
                            height:45,
                            borderColor:'grey',
                            borderWidth:1,
                            margin:'4%',
                            padding:10,
                            borderRadius:10,
                            color:'black'
                    }}
                />
            </View>
        );
    }
}