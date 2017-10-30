
import React, { Component } from 'react';
import {
  ScrollView, StyleSheet, Text, View, Image, TouchableOpacity, Button,
  ListView, Platform, ActivityIndicator, RefreshControl, Dimensions, StatusBar,
  NetInfo, Alert, BackHandler
} from 'react-native';

import ForgotPassword from './auth/forgotPassword';
import SignUp from './auth/signUp';
import { Actions } from "react-native-router-flux";

import * as Firebase from 'firebase';
import Spinner from 'react-native-loading-spinner-overlay';
import * as ToolbarObj from './common/toolbar';
import * as DrawerItemObj from './common/drawerItem';
import Drawer from 'react-native-drawer'
import MyComponent from './myComponents';
import Toast from 'react-native-simple-toast';



export default class Home extends Component {

  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      loaded: false,
      //refreshing: false,
      isOpen: false,
      selectedItem: 'Home',
      visible: true,
      uploadURL: '',
      isConnected: true,
    };
    this.openControlPanel = this.openControlPanel.bind(this);
    this.closeControlPanel = this.closeControlPanel.bind(this);
    console.log('home constructor called:');

  }

  closeControlPanel = () => {
    console.log('drawer closed:');
    this._drawer.close();
  };
  openControlPanel = () => {
    console.log('drawer open:');
    this._drawer.open();
  };


  componentWillMount() {
    console.log('home componentWillMount called:')

    if (Platform.OS == "android")
      BackHandler.addEventListener('hardwareBackPress', function () {
        if (Actions.currentScene == 'home') {
          Alert.alert(
            "Exit App",
            "Are you sure you want to exit?",
            [
              { text: 'No', onPress: () => console.log('OK Pressed!') },
              { text: 'Yes', onPress: () => { BackHandler.exitApp() } }
            ]
          );
          // Actions.pop()
          return true;
        }
        else
          return false;
      });

  }

  render() {
    console.log('home render called:')
    return (

      <Drawer
        type="overlay"
        ref={(ref) => this._drawer = ref}
        content={<DrawerItemObj.DrawerItem closeControlPanel={this.closeControlPanel}
          isLoading={() => { this.setState({ visible: true }) }}
          isLoaded={() => { this.setState({ visible: false }) }} />}
        tapToClose={true}
        openDrawerOffset={0.2} // 20% gap on the right side of drawer 
        panCloseMask={0.2}
        closedDrawerOffset={-3}
        styles={drawerStyles}
        tweenHandler={(ratio) => ({
          main: { opacity: (2 - ratio) / 2 }
        })}
      >
        <StatusBar hidden={false} />
        <View>
          <ToolbarObj.Toolbar showLabel={true}
            openControlPanel={this.openControlPanel}
            isLoading={() => { this.setState({ visible: true }) }}
            isLoaded={() => { this.setState({ visible: false }) }} />
          <ScrollView
            style={{ marginBottom: 60 }} >
            <Spinner visible={this.state.visible}
              isLoading={() => { this.setState({ visible: true }) }}
              isLoaded={() => { this.setState({ visible: false }) }}
              textContent={""} textStyle={{ color: '#FFF' }} />
            <ListView
              dataSource={this.state.dataSource}
              renderRow={this.renderBooks}
              renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator} />}
            //  renderHeader={() => <Header />}
            //renderFooter={() => <Footer />}
            //style={styles.listView}
            />
          </ScrollView>
        </View>
      </Drawer>
    );
  }

  componentDidMount() {
    console.log('home componentDidMount called:')

    this.listenForItems();
  }


  componentWillUnmount() {
    console.log('home componentWillUnmount called');
    BackHandler.removeEventListener('hardwareBackPress', () => { });
  }


  renderBooks(books) {
    var icon = books.thumbnail == "" ? require('./images/user_place_holder.png') :
      { uri: books.thumbnail };
    return (
      <TouchableOpacity onPress={() => Actions.detail({ book: books })}
        onLongPress={() => this.listLongPress}>
        <View style={styles.container} >
          <Image
            defaultSource={{ uri: require('./images/user_place_holder.png') }}
            source={icon}
            style={styles.imageThumbnail}
          />
          <View style={styles.rowContent}>
            <Text style={{ fontWeight: 'bold', fontSize: 14 }}>{books.name}</Text>
            <Text >{books.book_id}</Text>
          </View>
        </View>
      </TouchableOpacity>

    );
  }

  renderLoading() {

    return (
      <View style={[{ backgroundColor: 'red', marginTop: 100 }]} >
        {/* <Spinner visible={true} textContent={""} textStyle={{ color: '#FFF' }} /> */}
        <Text style={{ fontSize: 16 }}>
          Loading...
          </Text>
      </View>
    );
  }



  listLongPress() {
    Toast.show('this is', Toast.SHORT);
  }

  async listenForItems() {
    this.setState({ visible: true });

    //  await Firebase.database().ref(".info/connected")
    // .on("value",await function(snap) {
    //   if (snap.val() === true) {
    //     Toast.show("Firebase connected");
    //   } else {
    //     Toast.show("Firebase not connected");
    //   }
    // });


    console.log('listening for items');
    NetInfo.isConnected.fetch().then(async (isConnected) => {

      console.log('First, is ' + (isConnected ? 'online' : 'offline'));
      if (isConnected) {

        // setTimeout(() => {
        //   if(!this.state.loaded){
        //   this.setState({visible:false})
        //  this.showUnreachableDialog()
        // }
        // }, 10000)

        var itemsRef = await Firebase.database().ref().child('books');
        itemsRef.on('value', (snap) => {
          var items = [];
          snap.forEach((child) => {
            items.push({
              name: child.val().name,
              book_id: child.val().id,
              author: child.val().author,
              price: child.val().price,
              thumbnail: child.val().thumbnail,
              inStock: child.val().inStock,
              publish_year: child.val().publish_year,
            });

          });
          console.log('data is loaded');
          this.setState({
            visible: false,
            dataSource: this.state.dataSource.cloneWithRows(items),
            loaded: true,
            refreshing: false,

          });
        });


      }
      else {
        this.setState({
          visible: false,
        });
        Toast.show("No Internet Connection Available.");

        this.showUnreachableDialog()

        // Alert.alert(
        //   'Unreachable',
        //   'Do you want to reload',
        //   [
        //     //    {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
        //     { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
        //     { text: 'Reload', onPress: () => this.listenForItems() },
        //   ],
        //   { cancelable: false }
        // )

      }
    });
  }

  showUnreachableDialog() {

    Alert.alert(
      'Unreachable',
      'Do you want to reload',
      [
        //    {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
        { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
        { text: 'Reload', onPress: () => this.listenForItems() },
      ],
      { cancelable: false }
    )

  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1, flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', margin: 6
  },
  imageThumbnail: {
    margin: 4, height: 60, width: 60, borderRadius: 30,
  },
  separator: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#8E8E8E',
  },
  rowContent: {
    flex: 1,
    alignItems: 'flex-end',
    padding: 5
  }

});

const drawerStyles = {
  drawer: { shadowColor: '#000000', shadowOpacity: 0.8, shadowRadius: 3 },
  main: { paddingLeft: 3 },
}



export function listenForItems() {
  console.log('listening for items');
  return new Promise((resolve, reject) => {
    NetInfo.isConnected.fetch().then(async (isConnected) => {
      console.log('First, is ' + (isConnected ? 'online' : 'offline'));
      if (isConnected) {
        var itemsRef = await Firebase.database().ref().child('books');
        itemsRef.on('value', (snap) => {
          var items = [];
          snap.forEach((child) => {
            items.push({
              name: child.val().name,
              book_id: child.val().id,
              author: child.val().author,
              price: child.val().price,
              thumbnail: child.val().thumbnail,
              inStock: child.val().inStock,
              publish_year: child.val().publish_year,
            });
          });
          console.log('data is loaded');
          // this.setState({
          //   dataSource: this.state.dataSource.cloneWithRows(items),
          //   items: items,
          //   loaded: true,
          //   refreshing: false,
          //   visible: false
          // });
        });
        return resolve(items);
      }
      else {
        return reject();
        Toast.show("No Internet Connection Available.");
      }
    });
  })

}

