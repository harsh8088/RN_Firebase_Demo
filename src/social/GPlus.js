import React, { Component } from 'react';
import {
    StyleSheet,
    View, TouchableOpacity,
    AsyncStorage, NetInfo,
} from 'react-native';
import * as firebase from "firebase";

import { GoogleSignin } from 'react-native-google-signin';
import Icon from 'react-native-vector-icons/FontAwesome';
import Toast from 'react-native-simple-toast';

// var provider = new firebase.auth.GoogleAuthProvider();

class GPlus extends Component {
    constructor(props) {
        super(props);
        console.log('gplus constructor');
    }


    // processFirebaseGoogleSignin() {
    //     NetInfo.isConnected.fetch().then(async (isConnected) => {
    //         console.log('First, is ' + (isConnected ? 'online' : 'offline'));

    //         if (isConnected) {
    //             console.log('gplus started');
    //             // this.checkPlayServices();


    //             firebase.auth().signInWithPopup(provider).then((result) => {
    //                 // This gives you a Google Access Token. You can use it to access the Google API.
    //                 var token = result.credential.accessToken;
    //                 // The signed-in user info.
    //                 var userData = result.user;

    //                 AsyncStorage.setItem('user_data:key', JSON.stringify(userData),
    //                     (error) => { console.log("AsyncError: ", error) });
    //                 console.log("userdata: ", JSON.stringify(userData));
    //                 this.props.openHome();
    //                 // ...
    //             }).catch((error) => {
    //                 // Handle Errors here.
    //                 var errorCode = error.code;
    //                 var errorMessage = error.message;
    //                 // The email of the user's account used.
    //                 var email = error.email;
    //                 // The firebase.auth.AuthCredential type that was used.
    //                 var credential = error.credential;
    //                 console.log('WRONG SIGNIN :', errorMessage);
    //             });
    //         }
    //         else {
    //             Toast.show("No Internet Connection Available.");
    //         }
    //     });
    // }

    processGoogleSignin() {
        NetInfo.isConnected.fetch().then(async (isConnected) => {
            console.log('First, is ' + (isConnected ? 'online' : 'offline'));

            if (isConnected) {
                console.log('gplus started');
                this.checkPlayServices();
            }
            else {
                Toast.show("No Internet Connection Available.");
            }
        });
    }

    checkPlayServices() {
        GoogleSignin.hasPlayServices({ autoResolve: true }).then(() => {
            // play services are available. can now configure library
            this.configureGoogleSignin()
        }).catch((err) => {
            console.log("Play services error", err.code, err.message);
        })
    }

    configureGoogleSignin() {
        GoogleSignin.configure({
            iosClientId: '1087504787305-cavacc64ekfh7d77nhspgfaks68524jl.apps.googleusercontent.com', // only for iOS
        }).then(() => {
            this.signinWithGoogle();
        });
    }

    signinWithGoogle() {
        //this.props.showSpinner(true);
        console.log('signin with google started:')
        GoogleSignin.signIn()
            .then((user) => {
                console.log("Google SignIn: ", user);
                let userData = {
                    name: user.name,
                    email: user.email,
                    profilePic: user.photo
                }
                AsyncStorage.setItem('user_data:key', JSON.stringify(userData),
                    (error) => { console.log("AsyncError: ", error) });
                console.log("userdata: ", JSON.stringify(userData));
                this.props.openHome();
            })
            .catch((err) => {
                console.log('WRONG SIGNIN', err);
            })
            .done();
    }

    render() {
        return (
            <TouchableOpacity style={styles.socialImageOpacity} onPress={() => this.processGoogleSignin()}>
                <View style={{ flexDirection: 'row' }}>
                    {/*<Image source={require('../images/logoImage.jpg')} style={styles.socialImage} />*/}
                    <Icon name='google-plus-square'
                        size={35}
                        color='#dd4b39'>
                    </Icon>
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    socialImage: {
        height: 35,
        width: 35,
    },
    socialImageOpacity: {
        height: 40,
    },
    label: {
        fontSize: 16,
        color: '#C63D2D',
        textAlignVertical: 'center',
        marginLeft: 10,
        marginTop: 8,
    }
});

function logout() {
    GoogleSignin.hasPlayServices({ autoResolve: true }).then(() => {
        // play services are available. can now configure library
        GoogleSignin.configure({
            iosClientId: '1087504787305-cavacc64ekfh7d77nhspgfaks68524jl.apps.googleusercontent.com', // only for iOS
        }).then(() => {
            GoogleSignin.currentUserAsync().then((user) => {
                if (user != null) {
                    GoogleSignin.revokeAccess().then(() => GoogleSignin.signOut()).then(() => {
                        console.log("Logout GooglePlus");
                    }).done();
                }
            }).done();
        });
    }).catch((err) => {
        console.log("Play services error", err.code, err.message);
    })
}

export { GPlus, logout };