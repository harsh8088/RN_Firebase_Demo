
import * as Firebase from 'firebase';
import React, { Component } from 'react';

import {
    ScrollView, Text, StyleSheet, View, TextInput, Image, KeyboardAvoidingView, Keyboard,
    TouchableWithoutFeedback, TouchableOpacity, Button, Dimensions, AsyncStorage, ImageBackground,
    ActivityIndicator, StatusBar, Animated, Easing
} from 'react-native';
import { Actions } from "react-native-router-flux";

import SignIn from './signIn';
import Home from '../home';
import Icon from 'react-native-vector-icons/FontAwesome';
import Spinner from 'react-native-loading-spinner-overlay';


export default class SplashScreen extends Component {

    constructor(props) {
        super(props);
        console.log('splash constructor');
        this.state = {
            visible: false,
        };

        this.animatedValue = new Animated.Value(0);
    }

    componentWillMount() {
        console.log('splash componentWillMount called:');
        this.setState({ visible: true });
        clearTimeout(this.timeoutHandle);
    }

    render() {
        const marginLeft = this.animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -560]
        })

        console.log('splash render called:');

        var { height, width } = Dimensions.get('window');
        return (
            <View >
                <StatusBar hidden={true} />
                <Animated.Image
                    style={[styles.backgroundImage,
                    { width: 968, height: height },
                    { marginLeft }]}
                    source={require('../images/background.jpg')}>
                </Animated.Image>

                <View style={{
                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                    justifyContent: 'space-between', alignItems: 'center'
                }}>

                    <View>
                    </View>

                    <View style={{ borderColor: '#FFFFFF99', borderWidth: 1, }}>
                        <Text style={{ color: '#FFFFFF99', fontSize: 22, padding: 8 }}>
                            Demo App
                            </Text>
                    </View>

                    <View style={{ marginBottom: 20, }}>
                        <ActivityIndicator animating={this.state.visible} size={45} >
                        </ActivityIndicator>
                    </View>
                </View>

            </View>
        );
    }


    componentDidMount() {
        console.log('splash componentDidMount called:');
        this.animate();

        this.timeoutHandle = setTimeout(() => {
            this.checkUser();
        }, 3000);

    }

    animate() {
        this.animatedValue.setValue(0)
        Animated.timing(
            this.animatedValue,
            {
                toValue: 1,
                duration: 25000,
                easing: Easing.linear
            }
        ).start(() => this.animate())
    }

    async checkUser() {
        try {
            const value = await AsyncStorage.getItem('user_data:key');
            if (value !== null) {
                // We have data!!
                const user = JSON.stringify(value);
                console.log('current user info:', value);
                Actions.home();
            }
            else {
                console.log('user info:', value);
                Actions.signIn();
            }
        } catch (error) {
            // Error retrieving data
            console.log('user error:', error);

        }

    }
}

const styles = StyleSheet.create({

    backgroundImage: {
        resizeMode: 'cover',
    },



});

