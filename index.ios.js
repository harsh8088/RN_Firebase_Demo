/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */


import React, { Component } from 'react';
import {
  View,
  Text,
  AppRegistry
} from 'react-native';

import {
  Scene,
  Router,
  Actions,
  Reducer,
  ActionConst,
} from 'react-native-router-flux';


import SignIn from './src/auth/signIn';
import SignUp from './src/auth/signUp';
import ForgotPassword from './src/auth/forgotPassword';
import Home from './src/home';
import * as Firebase from 'firebase';



// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDYVWoQ_fWJ2XuUKjpTWh1eOQarytOA2d8",
  authDomain: "valiant-splicer-172907.firebaseapp.com",
  databaseURL: "https://valiant-splicer-172907.firebaseio.com",
  projectId: "valiant-splicer-172907",
  storageBucket: "valiant-splicer-172907.appspot.com",
  messagingSenderId: "284133569518"
};
const firebaseApp = Firebase.initializeApp(firebaseConfig);

export default class DemoApp extends Component {

  constructor(props) {
    super(props);
    this.unsubscribe = null;
    if (!Firebase.apps.length) {
      Firebase.initializeApp(firebaseConfig);

    }
  }

  render() {
    return (
      //<View></View>
      <Router>
        <Scene key="root">
          <Scene key="signIn" component={SignIn} title="SignIn" initial hideNavBar={true} />
          <Scene key="signUp" component={SignUp} title="SignUp" />
          <Scene key="forgotPassword" component={ForgotPassword} title="ForgotPassword" />
          <Scene key="home" component={Home} title="Home"
            renderRightButton={() =>
              <Text onPress={console.log('right pressed')}> Post</Text>}
          />
          <Scene key="gallery" component={Gallery} title="gallery" />
          <Scene key="detail" component={Detail} title="Detail" />
        </Scene>
      </Router>
    );
  }
}

AppRegistry.registerComponent('DemoApp', () => DemoApp);
