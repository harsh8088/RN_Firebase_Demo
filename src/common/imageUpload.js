import React, { Component } from 'react';
import {
    View, Text, StyleSheet, Image, TouchableOpacity, Dimensions,
    ScrollView, Button, ListView, Platform,
    ActivityIndicator, RefreshControl, Alert, NetInfo
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import * as Firebase from 'firebase';
import ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'react-native-fetch-blob';
import MyComponent from '../myComponents';
import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker';
import Toast from 'react-native-simple-toast';

const Blob = RNFetchBlob.polyfill.Blob;
const fs = RNFetchBlob.fs;
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
window.Blob = Blob;

const uploadImage = (uri, mime = 'image/jpeg') => {
    return new Promise((resolve, reject) => {
        const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri
        const sessionId = new Date().getTime()
        let uploadBlob = null
        const imageRef = Firebase.storage().ref('images').child(`${sessionId}`)

        fs.readFile(uploadUri, 'base64')
            .then((data) => {
                return Blob.build(data, { type: `${mime};BASE64` })
            })
            .then((blob) => {
                uploadBlob = blob;
                return imageRef.put(blob, { contentType: mime })
            })
            .then(() => {
                uploadBlob.close();
                return imageRef.getDownloadURL()
            })
            .then((url) => {
               
                resolve(url)
            })
            .catch((error) => {
              
                reject(error)
            })
    })
}

export class ImageUpload extends Component {

    constructor(props) {
        console.log("ImageUpload constructor started.");
        super(props);
    }

    componentWillMount() {

    }

    render() {
        return (
            <View style={styles.container}>
                <TouchableOpacity onPress={() => this.pickImage()}>
                    <Icon
                        name='cloud-upload'
                        size={30}
                    >
                    </Icon>
                </TouchableOpacity>
            </View>
        )
    }

    componentDidMount() {

    }


    pickDocument = () => {
        DocumentPicker.show({
            filetype: [DocumentPickerUtil.images()],
        }, (error, res) => {
            // Android
            console.log(
                res.uri,
                res.type, // mime type
                res.fileName,
                res.fileSize
            );
        });
    }


    async pickImage() {

        NetInfo.isConnected.fetch().then(async (isConnected) => {
            console.log('First, is ' + (isConnected ? 'online' : 'offline'));

            if (isConnected) {
                ImagePicker.launchImageLibrary({}, response => {
                    this.props.isLoading();
                    uploadImage(response.uri)
                        .then((url) => {
                            this.props.isLoaded();
                            //    this.setState({ uploadURL: url })
                            Toast.show("Image uploaded successfully", Toast.SHORT);
                            MyComponent.dialog(url,
                                (bookName, bookUrl, bookAuthor, bookPrice, bookPublishYear) => {
                                    console.log('Result book ', bookName, bookUrl,
                                        bookAuthor, bookPrice, bookPublishYear);
                                    Firebase.database().ref('books/').push()
                                        .set({
                                            "author": bookAuthor, "id": "", "price": bookPrice,
                                            "name": bookName, "thumbnail": bookUrl, "download_url": bookUrl,
                                            "publish_year": bookPublishYear
                                        })
                                        .catch(error => {
                                            Alert.alert(
                                                'Database Unreached',
                                                'My Alert Msg',
                                                [
                                                    {
                                                        text: 'Ask me later',
                                                        onPress: () => console.log('Ask me later pressed')
                                                    },
                                                    {
                                                        text: 'Cancel',
                                                        onPress: () => console.log('Cancel Pressed'),
                                                        style: 'cancel'
                                                    },
                                                    {
                                                        text: 'OK',
                                                        onPress: () => console.log('OK Pressed')
                                                    },
                                                ],
                                                { cancelable: false }
                                            )
                                        });
                                });

                        })
                        .catch((error) => {
                            this.props.isLoaded();
                            console.log(error);
                        })
                })
            }
            else {
                Toast.show("No Internet Connection Available.");
            }
        });
    }

}

const styles = StyleSheet.create({
    container: {
    },




});