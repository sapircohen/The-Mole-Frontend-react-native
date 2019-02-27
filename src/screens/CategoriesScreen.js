import { Col, Row, Grid } from "react-native-easy-grid";
import React,{Component} from 'react';
import {Text} from 'react-native';


export default class Categories extends Component{
    render(){
        return(
            <Grid>
                <Col style={{backgroundColor:"blue"}}>
                    <Text>1</Text>
                    <Row></Row>
                    <Row></Row>
                    <Row></Row>
                    <Row></Row>
                </Col>
                <Col >
                    <Row style={{backgroundColor:"green"}}>
                        <Text>2</Text>
                    </Row>
                    <Row style={{backgroundColor:"yellow"}}>
                        <Text>3</Text>
                    </Row>
                    <Row></Row>
                    <Row></Row>
                </Col>
                
            </Grid>
        );
    }
}