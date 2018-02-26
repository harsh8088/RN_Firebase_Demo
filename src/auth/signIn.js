
import * as Firebase from 'firebase';
import React, { Component } from 'react';

import {
    ScrollView, Text, StyleSheet, View, TextInput, Image, KeyboardAvoidingView, Keyboard,
    TouchableWithoutFeedback, TouchableOpacity, Button, AsyncStorage, NetInfo, BackHandler,
    Platform
} from 'react-native';
import { Actions } from "react-native-router-flux";

import SignUp from './signUp';
import Home from '../home';
import Icon from 'react-native-vector-icons/FontAwesome';
import Spinner from 'react-native-loading-spinner-overlay';
import * as GPlusObj from '../social/GPlus';
import * as FBObj from '../social/Facebook';
import Toast from 'react-native-simple-toast';


export default class SignIn extends Component {

    constructor(props) {
        super(props)
        this.state = {
            username: '',
            password: '',
            visible: false
        }
        console.log('signIn constructor called:');
    }

    componentWillMount() {
        console.log('signIn componentWillMount called:');

        if (Platform.OS == "android")
            BackHandler.addEventListener('hardwareBackPress', function () {
                if (Actions.currentScene == 'signIn') {
                    BackHandler.exitApp()
                    // Actions.pop()
                    // Actions.signIn({ type: "replace" })
                    return true;
                }
                else
                    return false;
            });
    }

    render() {
        console.log('signIn render called:');

        return (
            <ScrollView contentContainerStyle={{ flex: 1 }} >
                <View style={styles.wrapper}>
                    <View style={{ flex: 1 }}>
                        <Spinner visible={this.state.visible} textContent={""}
                            textStyle={{ color: '#FFF' }} />
                    </View>
                    <View style={[styles.upperBody, styles.upperBodyColor]}>
                        <Image
                            source={require('../images/firebase.png')}
                            style={{ width: 150, height: 150 }}
                        />
                    </View>
                    <View style={[styles.bodyMiddle]}>
                        <View style={[styles.bodyMiddleInner]}>
                        </View>
                        <View style={[styles.bodyMiddleInner, styles.flexDirectionRow]}>
                            <View style={[styles.circleButtonLeft]}>
                                {/*left view*/}
                            </View>
                            <View style={[styles.circleButtons, styles.circleButtonMiddle]}>
                                <FBObj.Facebook openHome={() => { Actions.home() }} showLabel={true} />
                                <GPlusObj.GPlus openHome={() => { Actions.home() }} showLabel={true} />
                            </View>
                            <View style={[styles.circleButtonLeft]}>
                                {/*right view*/}
                            </View>
                        </View>

                    </View>

                    <View style={[styles.lowerBody, styles.lowerBodyColor]}>
                        <TextInput
                            placeholder='Username'
                            placeholderTextColor='green'
                            returnKeyType='next'
                            onSubmitEditing={() => this.refs.passwordInput.focus()}
                            value={this.state.username}
                            onChangeText={username => this.setState({ username: username })}
                            style={styles.textBox}
                            underlineColorAndroid='transparent'
                            selectionColor='black'
                        >
                        </TextInput>

                        <TextInput
                            placeholder='Password'
                            placeholderTextColor='green'
                            secureTextEntry
                            returnKeyType='go'
                            title='Password'
                            ref='passwordInput'
                            underlineColorAndroid='transparent'
                            value={this.state.password}
                            onChangeText={password => this.setState({ password: password })}
                            onSubmitEditing={() => this.onSignInPress()}
                            style={styles.textBox}
                            selectionColor='black'>
                        </TextInput>

                        <TouchableOpacity style={styles.buttonContainer}
                            onPress={this.onSignInPress.bind(this)}>
                            <Text style={{ color: 'white', fontSize: 16 }}>Sign In</Text>

                        </TouchableOpacity>
                        <View style={styles.bottomLinksContainer}>
                            <TouchableOpacity
                                onPress={() => Actions.signUp()}>
                                <Text style={{ color: 'green' }} >
                                    Sign Up
                                      </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => Actions.forgotPassword}>
                                <Text style={{ color: 'green' }} >
                                    Forgot Password?
                                    </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
        );
    }

    componentDidMount() {
        console.log('SignIN componentDidMount called');
    }


    componentWillUnmount() {
        console.log('SignIN componentWillUnmount called');
        // BackHandler.removeEventListener('hardwareBackPress', () => { });
    }

    // async checkAuthStateChanged() {
    //     try {
    //         await Firebase.auth().onAuthStateChanged((user) => {
    //             if (user) {
    //                 // User is signed in.
    //                 console.log(' User is signed in');
    //                 var displayName = user.displayName;
    //                 var email = user.email;
    //                 var emailVerified = user.emailVerified;
    //                 var photoURL = user.photoURL;
    //                 var isAnonymous = user.isAnonymous;
    //                 var uid = user.uid;
    //                 var providerData = user.providerData;
    //                 Actions.home();
    //             }
    //             else {
    //                 // User is signed out.
    //                 console.log(' User is signed out');
    //             }
    //         });

    //     }
    //     catch (error) {
    //         console.log(error.toString())

    //     }
    // }



    async onSignInPress() {

        NetInfo.isConnected.fetch().then(async (isConnected) => {
            console.log('First, is ' + (isConnected ? 'online' : 'offline'));

            if (isConnected) {
                this.setState({ visible: true });
                console.log('sign in started');
                await Firebase.auth().signInWithEmailAndPassword(this.state.username,
                    this.state.password)
                    .then((user) => {
                        this.setState({ visible: false });
                        Toast.show('Successfully logged in: Welcome ' + user.email);
                        let userData = {
                            name: user.name,
                            email: user.email,
                            profilePic: user.photo
                        }

                        AsyncStorage.setItem('@user_data:key', JSON.stringify(userData),
                            (error) => {
                                console.log("AsyncError: ", error)
                            });

                        Actions.home();
                    })
                    .catch((err) => {
                        this.setState({ visible: false });
                        Toast.show("" + err);
                        //    console.error('User signin error', err);
                    });

            }
            else {
                Toast.show("No Internet Connection Available.");
            }
        });
    }
}

var styles = StyleSheet.create({
    wrapper: {
        flex: 1
        , flexDirection: 'column'
        , backgroundColor: 'white',
    },
    upperBody: {
        flex: 1,
        justifyContent: 'center'
        , alignItems: 'center'
    },
    upperBodyColor: {
        flex: 2,
    },
    lowerBodyColor: {
        flex: 4,
        padding: 10,
    },
    lowerBody: {
        flex: 1,
        alignItems: 'center'
    },
    bodyMiddle: {
        flex: 1,
        justifyContent: 'space-between'
    },
    bodyMiddleInner: {
        flex: 1,
    },
    circleButtons: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center'

    },
    circleButtonLeft: {
        flex: 1,
        alignItems: 'center'
    },
    circleButtonMiddle: {
        flex: 2,
        justifyContent: 'space-between'
    },
    flexDirectionRow: {
        flexDirection: 'row'
    },
    textBox: {
        width: 250,
        borderWidth: 2,
        borderRadius: 20,
        borderColor: 'green',
        marginTop: 10,
        padding: 10,
        paddingLeft: 15,
        fontSize: 18
    },
    bottomLinksContainer: {
        width: 250,
        height: null,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20
    },
    buttonContainer: {
        width: 250,
        height: null,
        borderWidth: 2,
        borderRadius: 20,
        backgroundColor: 'green',
        marginTop: 10,
        padding: 12,
        alignItems: 'center'
    }
});

