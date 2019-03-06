import { Col, Row, Grid } from "react-native-easy-grid";
import React,{Component} from 'react';
import {Text,ImageBackground,View} from 'react-native';
import {Button,Icon} from 'native-base';
import NetworkHeader from '../common/NetworkHeader';
import {images} from '../constant/images';

export default class Categories extends Component{
    static navigationOptions = ({ navigation }) =>{
        return{
        headerTitle:"Choose a category",
        headerBackground: (
          <NetworkHeader/>
        ),
        headerTitleStyle: { color: '#000',fontSize:20 },
        headerLeft: 
         ( <Button
            onPress={()=>navigation.navigate('Profile')}
            style={{backgroundColor:"transparent"}}>
              <Icon style={{color:"black",fontSize:32}}  name="ios-arrow-round-back" />
          </Button>
         ),
        }
      }
    render(){
        return(
            <Grid>
                  <Col>
                    <ImageBackground resizeMode='cover' style={{ flex: 1 }} source={images.celebrityLogo}>
                        <Row onPress={()=>alert('Celebrity')} style={{backgroundColor:'transparent'}}></Row>
                    </ImageBackground>
                    <ImageBackground resizeMode='cover' style={{ flex: 1 }} source={images.filmLogo}>
                        <Row onPress={()=>alert('Movies')} style={{backgroundColor:'transparent'}}></Row>
                    </ImageBackground>
                    <ImageBackground resizeMode='cover' style={{ flex: 1 }} source={images.generalKnowledgeLogo}>
                        <Row onPress={()=>alert('General knowledge')} style={{backgroundColor:'transparent'}}></Row>
                    </ImageBackground>
                    <Row style={{backgroundColor:"transparent"}}></Row>
                </Col>
                <Col >
                    <ImageBackground resizeMode='cover' style={{ flex: 1 }} source={images.musicLogo}>
                        <Row onPress={()=>alert('Music')} style={{backgroundColor:'transparent'}}></Row>
                    </ImageBackground>
                    <ImageBackground resizeMode='cover' style={{ flex: 1 }} source={images.nbaLogo}>
                        <Row onPress={()=>alert('NBA')} style={{backgroundColor:'transparent'}}></Row>
                    </ImageBackground>
                    <ImageBackground resizeMode='cover' style={{ flex: 1 }} source={images.politicsLogo}>
                        <Row onPress={()=>alert('Politics')} style={{backgroundColor:'transparent'}}></Row>
                    </ImageBackground>
                    <Row style={{backgroundColor:"transparent"}}></Row>
                </Col>
                
            </Grid>
        );
    }
}