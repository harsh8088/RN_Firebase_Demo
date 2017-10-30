import React, { Component } from 'react';
import {
    View, Text, StyleSheet, Image, TouchableOpacity, Dimensions,
    ScrollView, Button, ListView, Platform,
    ActivityIndicator, RefreshControl, Alert, AsyncStorage
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import * as Firebase from 'firebase';
import * as ImageUploadObj from '../common/imageUpload';
import { Actions } from "react-native-router-flux";

import MyComponent from '../myComponents';


export class DrawerItem extends Component {

    constructor(props) {
        console.log("drawerItem constructor started.");
        super(props);
        this.state = {
            email: 'Username',
            name: 'abc@xyz.com',
        }

    }

    componentWillMount() {


    }

    render() {
        let username = this.state.name ? this.state.name : 'Username';
        let userEmail = this.state.email ? this.props.text : 'abc@xyz.com';
        return (
            <View style={styles.container}>

                <View>
                    <View style={styles.topContainer}
                        backgroundColor='#00BF9A'
                        style={{ paddingLeft: 20, paddingBottom: 5 }}>
                        <Image
                            source={require('../images/user_place_holder.png')}
                            style={styles.imageThumbnail} />
                        <Text style={[styles.text, { fontWeight: 'bold' }]}>
                            {this.state.name}
                        </Text>
                        <Text style={styles.email}>
                            {this.state.email}
                        </Text>
                    </View>


                    <TouchableOpacity style={styles.itemContainer}
                        onPress={() => this.props.closeControlPanel()}
                    >
                        <Icon
                            name='home'
                            size={30}>
                        </Icon>
                        <Text style={styles.itemText}>
                            Home</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.itemContainer}
                        onPress={() => Actions.fcm}
                    >
                        <Icon
                            name='commenting'
                            size={30}>
                        </Icon>
                        <Text style={styles.itemText}>
                            FCM</Text>
                    </TouchableOpacity>
                </View>



                <View>
                    <View style={{ backgroundColor: '#797C77', height: 1 }}>
                    </View>
                    <TouchableOpacity style={styles.itemContainer}
                        onPress={() => this.props.closeControlPanel()}
                    >
                        <ImageUploadObj.ImageUpload isLoading={() => { this.props.isLoading() }}
                            isLoaded={() => { this.props.isLoaded() }} />
                        <Text style={styles.itemText}>
                            Upload</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.itemContainer}
                        onPress={() => this.logout()}>
                        <Icon
                            name='sign-out'
                            size={30}
                        >
                        </Icon>
                        <Text style={styles.itemText}>
                            {' '}Logout</Text>
                    </TouchableOpacity>
                </View>


                <View >
                    <View style={{ backgroundColor: '#797C77', height: 1 }}>
                    </View>
                    <TouchableOpacity style={styles.itemContainer}
                        onPress={() => this.showSettingDialog()}
                    >
                        <Icon
                            name='cog'
                            size={30}
                        >
                        </Icon>
                        <Text style={styles.itemText}>
                            Settings</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.itemContainer, { marginBottom: 10 }]}
                    //onPress={() => this.logout()}
                    >
                        <Icon
                            name='question-circle'
                            size={30}
                        >
                        </Icon>
                        <Text style={styles.itemText}>
                            Help & feedback</Text>
                    </TouchableOpacity>
                </View>
            </View>

        )
    }

    componentDidMount() {
        console.log("fetching user details");
        this.getUserDetails.bind(this);

    }


    async getUserDetails() {
        try {
            const userData = await AsyncStorage.getItem('@user_data:key');
            if (userData !== null) {
                // We have data!!
                const user = JSON.stringify(userData);
                this.setState({ name: user.name, email: user.email });
                console.log("user_details", user);
            }
        } catch (error) {
            // Error retrieving data
            console.log("Error retrieving user data");
        }

    }



    logout() {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                {
                    text: 'OK', onPress: () => {
                        AsyncStorage.removeItem('user_data:key',
                            (error) => { console.log("AsyncError: ", error) });
                        //Try Actions.ROUTE_NAME({type: 'replace'}) where ROUTE_NAME is name of current route.
                        // Actions.signIn({ type: 'replace' })
                        Actions.signIn();
                    }
                },
            ],
            { cancelable: false }
        )
    }


    showSettingDialog() {

        MyComponent.settingsDialog((theme) => {
            switch (theme) {
                case 'blue_grey':
                    break;
                case 'deep_orange':
                    break;
                case 'deep_purple':
                    break;
                case 'green':
                    break;
                case 'teal':
                    break;
                case 'default':
                    break;
                default:
                    break;

            }
        })
    }






}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF',

    },
    itemContainer: {
        flexDirection: 'row', padding: 5, marginLeft: 10,
        alignItems: 'center', alignContent: 'center',

    },
    itemText: {
        fontSize: 14, fontWeight: 'bold', color: 'black', marginLeft: 40
    },
    imageThumbnail: {
        margin: 4, height: 60, width: 60, borderRadius: 30, marginTop: 20,
    },
    text: {
        fontSize: 15, color: '#424242',
    },
    email: {
        fontSize: 14, color: '#424242'
    },


});