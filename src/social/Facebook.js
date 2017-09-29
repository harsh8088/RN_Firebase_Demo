import React, { Component } from 'react';
import {
  StyleSheet, View, TouchableOpacity, AsyncStorage, NetInfo,
} from 'react-native';
import FBSDK, {
  LoginManager, AccessToken, GraphRequest,
  GraphRequestManager, ShareDialog
} from 'react-native-fbsdk'
import Icon from 'react-native-vector-icons/FontAwesome';
import Toast from 'react-native-simple-toast';

// var provider = new firebase.auth.FacebookAuthProvider();


class Facebook extends Component {
  constructor(props) {
    console.log('facebook constructor');
    super(props);
  }

  // shareLinkWithShareDialog() {
  //   var tmp = this;
  //   ShareDialog.canShow(this.state.shareLinkContent).then(
  //     function (canShow) {
  //       if (canShow) {
  //         return ShareDialog.show(tmp.state.shareLinkContent);
  //       }
  //     }
  //   ).then(
  //     function (result) {
  //       if (result.isCancelled) {
  //         alert('Share cancelled');
  //       } else {
  //         tmp.props.dismiss()
  //       }
  //     },
  //     function (error) {
  //       alert('Share fail with error: ' + error);
  //     }
  //     );
  // }


  // firebase_fb_SignIn() {
  //   NetInfo.isConnected.fetch().then(async (isConnected) => {
  //     console.log('First, is ' + (isConnected ? 'online' : 'offline'));

  //     if (isConnected) {
  //       console.log('fb auth');
  //       AccessToken.getCurrentAccessToken().then(
  //         (data) => {
  //           if (data !== null && data !== 'undefind') {
  //             //Already Login
  //             this.props.openHome();
  //             //  this.loginWithFacebook(false);
  //             // this.shareLinkWithShareDialog();
  //           } else {
  //             firebase.auth().signInWithPopup(provider).then((result) => {
  //               // This gives you a Facebook Access Token. You can use it to access the Facebook API.
  //               var token = result.credential.accessToken;
  //               // The signed-in user info.
  //               var user = result.user;

  //               let userData = {
  //                 name: user.name,
  //                 email: user.email,
  //                 profilePic: user.picture.data.url
  //               }
  //               AsyncStorage.setItem('user_data:key', JSON.stringify(userData),
  //                 (error) => { console.log("AsyncError: ", error) });
  //               this.props.openHome();
  //               // ...
  //             }).catch((error) => {
  //               // Handle Errors here.
  //               var errorCode = error.code;
  //               var errorMessage = error.message;
  //               // The email of the user's account used.
  //               var email = error.email;
  //               // The firebase.auth.AuthCredential type that was used.
  //               var credential = error.credential;
  //               // ...
  //             });
  //           }
  //         }
  //       );
  //     }
  //     else {
  //       Toast.show("No Internet Connection Available.");
  //     }
  //   });

  // }



  fbAuth() {
    NetInfo.isConnected.fetch().then(async (isConnected) => {
      console.log('First, is ' + (isConnected ? 'online' : 'offline'));

      if (isConnected) {
        console.log('fb auth');
        AccessToken.getCurrentAccessToken().then(
          (data) => {
            if (data !== null && data !== 'undefind') {
              //Already Login
              this.props.openHome();
              //  this.loginWithFacebook(false);
              // this.shareLinkWithShareDialog();
            } else {
              this.loginWithFacebook(false);
            }
          }
        );
      }
      else {
        Toast.show("No Internet Connection Available.");
      }
    });

  }

  loginWithFacebook(isShareRequired) {
    const that = this;
    LoginManager.logInWithReadPermissions(['public_profile', 'email']).then(
      function (result) {
        if (result.isCancelled) {
          console.log('Login cancelled')
        } else if (result.declinedPermissions) {
          // that.props.showSpinner(true);
          AccessToken.getCurrentAccessToken().then(
            (data) => {
              that._accessTokenWithAPIsCall(data)
            }
          )
          console.log('declinedPermissions')
        } else {
          AccessToken.getCurrentAccessToken().then(
            (data) => {
              that._accessTokenWithAPIsCall(data)
            }
          )
          console.log('Login success with permissions: ' + result.grantedPermissions)
        }
      })
      .catch(error => console.log(error));
  }

  _accessTokenWithAPIsCall(data) {
    const responseInfoCallback = (error, data) => {
      if (error) {
        console.log(error)
      } else {
        console.log("Facebook user: ", data);
        let userData = {
          name: data.name,
          email: data.email,
          profilePic: data.picture.data.url
        }
        AsyncStorage.setItem('user_data:key', JSON.stringify(userData),
          (error) => { console.log("AsyncError: ", error) });
        this.props.openHome();
      }
    }

    const infoRequest = new GraphRequest(
      '/me',
      {
        accessToken: data.accessToken,
        parameters: {
          fields: {
            string: 'email,name,first_name,middle_name,last_name,picture'
          }
        }
      },
      responseInfoCallback
    );

    // Start the graph request.
    new GraphRequestManager().addRequest(infoRequest).start()

  }

  render() {
    return (
      <TouchableOpacity style={styles.socialImageOpacity} onPress={() => this.fbAuth()}>
        <View style={{ flexDirection: 'row' }}>
          {/*<Image source={require('../images/penguin.png')} style={styles.socialImage} />*/}
          <Icon name='facebook-square'
            size={35}
            color='#3b5998'>
          </Icon>
        </View>
      </TouchableOpacity>

    );
  }
};

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
    color: '#3B5998',
    textAlignVertical: 'center',
    marginLeft: 10,
    marginTop: 8,
  }
});

function logout() {
  LoginManager.logOut(function (response) {
    console.log('Facebook user logged out: ', response)
  });
};

export { Facebook, logout };