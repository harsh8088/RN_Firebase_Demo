import React, { Component } from 'react';
import {
    ScrollView,
    Text,
    StyleSheet,
    View,
    TextInput,
    Image,
    KeyboardAvoidingView,
    Keyboard,
    TouchableWithoutFeedback,
    TouchableOpacity,
    Button,
    AsyncStorage, NetInfo
} from 'react-native';
import { Actions } from "react-native-router-flux";

import SignIn from './signIn'
import Icon from 'react-native-vector-icons/FontAwesome';
import * as Firebase from 'firebase';
import Spinner from 'react-native-loading-spinner-overlay';
import Toast from 'react-native-simple-toast';

function abc() {

}
export default class SignUp extends Component {

    constructor(props) {
        super(props)
        this.state = {
            email: '',
            password: '',
            repassword: '',
            visible: false
        }
    }

    componentWillUnmount() {

    }

    render() {
        return (
            <ScrollView style={styles.wrapper}>
                <View style={{ flex: 1 }}>
                    <Spinner visible={this.state.visible} textContent={""}
                        textStyle={{ color: '#FFF' }} />
                </View>
                <View style={[styles.upperBody]}>
                    <Image
                        style={{ width: 130, height: 130 }}
                        source={require('../images/firebase-authentication.png')}
                    />
                </View>


                <View style={[styles.lowerBody, styles.lowerBodyColor]}>
                    <TextInput
                        placeholder='Email'
                        placeholderTextColor='green'
                        returnKeyType='next'
                        onSubmitEditing={() => { this.refs.password.focus(); }}
                        value={this.state.email}
                        onChangeText={email => this.setState({ email: email })}
                        style={styles.textBox}
                        underlineColorAndroid='transparent'
                        selectionColor='black'
                    >
                    </TextInput>

                    <TextInput
                        ref="password"
                        placeholder='Password'
                        placeholderTextColor='green'
                        secureTextEntry
                        returnKeyType='go'
                        title='Password'
                        onSubmitEditing={() => { this.refs.repassword.focus(); }}
                        onChangeText={(text) => this.setState({ password: text })}
                        style={styles.textBox}
                        underlineColorAndroid='transparent'
                        selectionColor='black'>

                    </TextInput>

                    <TextInput
                        ref="repassword"
                        placeholder='Re-enter password'
                        placeholderTextColor='green'
                        secureTextEntry
                        returnKeyType='go'
                        title='Re-enter Password'
                        onChangeText={(text) => this.setState({ repassword: text })}
                        onSubmitEditing={() => this.validate()}
                        style={styles.textBox}
                        underlineColorAndroid='transparent'
                        selectionColor='black'>
                    </TextInput>

                    <TouchableOpacity style={[styles.buttonContainer,]}
                        onPress={this.validate.bind(this)}>
                        <Text style={{ color: 'white', fontSize: 16 }}>Sign Up</Text>

                    </TouchableOpacity>

                </View>
            </ScrollView>
        );
    }


    componentDidMount() {

    }

    async validate() {
        const email = this.state.email;
        const pass = this.state.password;
        const repass = this.state.repassword;
        if (this.state.email == "" | this.state.password == "" | this.state.repassword == "") {
            Toast.show("Can't accept empty values");
        }
        else if (this.state.password != this.state.repassword) {
            Toast.show("Passwords didn't match");
        }
        else {

            NetInfo.isConnected.fetch().then(async (isConnected) => {
                console.log('First, is ' + (isConnected ? 'online' : 'offline'));

                if (isConnected) {
                    this.setState({ visible: true });
                    Firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
                        .then((user) => {
                            var token = Firebase.auth().currentUser.getIdToken();
                            // Optional
                            let userData = {
                                email: this.state.email,
                                access_token: token,
                            };
                            this.setState({ visible: false });
                            AsyncStorage.setItem('user_data:key', JSON.stringify(userData),
                                (err) => { console.log("AsyncError: ", err) });
                            Actions.home();
                        }).catch((error) => {
                            // Handle Errors here.
                            this.setState({ visible: false });
                            var errorCode = error.code;
                            var errorMessage = error.message;
                            Toast.show(""+errorMessage);
                            console.log("SignUp error code", errorCode);
                            console.log("SignUp error message", errorMessage);
                        });
                }
                else {
                    Toast.show("No Internet Connection Available.");
                }
            }
            );
        }
    }

}

var styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'white'
    },
    upperBody: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 5
    },
    upperBodyColor: {
        flex: 2,
    },
    lowerBodyColor: {
        flex: 3,
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
        , backgroundColor: 'red'
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
        paddingLeft: 15,
        fontSize: 18
    },
    bottomLinksContainer: {
        width: 250,
        height: 40,
        flexWrap: 'nowrap',
        flexDirection: 'row',
        justifyContent: 'space-between'
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

