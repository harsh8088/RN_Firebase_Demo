import React, { Component } from 'react';
import {
    View, Text, StyleSheet, Image,
    TouchableOpacity, Dimensions, AsyncStorage, Alert
} from 'react-native';

import * as ImageUploadObj from './imageUpload';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Actions } from "react-native-router-flux";

export class Toolbar extends Component {

    constructor(props) {
        console.log("toolbar constructor started.");
        super(props);
    }

    componentWillMount() {

    }

    render() {
        return (
            <View style={styles.container}>
                <TouchableOpacity style={[styles.container, { padding: 15 }]}
                    onPress={() => { this.props.openControlPanel() }} >
                    <Icon name='bars'
                        size={25}
                        color='#424242' />
                </TouchableOpacity>
                <View style={styles.centerContainer} >
                    <Text style={{ fontWeight: 'bold', fontSize: 18, color: '#424242', marginLeft: 5 }}>
                        Home
                       </Text>
                </View>
                <View style={styles.rightContainer}>
                    <ImageUploadObj.ImageUpload style={{ padding: 5 }} isLoading={() => { this.props.isLoading() }}
                        isLoaded={() => { this.props.isLoaded() }} />
                    <View
                        style={{ marginLeft: 5 }} />
                    <TouchableOpacity style={[styles.container, { padding: 10 }]} onPress={() => this.logout()}>
                        <Icon
                            name='ellipsis-v'
                            size={30}
                            color='#424242'
                        >
                        </Icon>
                    </TouchableOpacity>
                </View>
            </View>
        )
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
                        // Actions.home({ type: "replace" })
                        Actions.signIn();
                    }
                },
            ],
            { cancelable: false }
        )


    }

    componentDidMount() {
    }

}

const styles = StyleSheet.create({
    container: {
        height: 56,
        flexDirection: 'row',
        backgroundColor: 'white',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    leftContainer: {
        paddingLeft: 15,
        flex: 1
    },

    centerContainer: {
        paddingLeft: 10,
        flex: 1
    },
    rightContainer: {
        padding: 5,
        marginRight: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    }



});