import React, { Component } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import CardView from 'react-native-cardview'

export default class Detail extends Component {


    constructor(props) {
        console.log("Detail constructor started.");
        super(props);

    }
    render() {
        var icon = this.props.book.thumbnail == "" ? require('./images/user_place_holder.png') :
            { uri: this.props.book.thumbnail };

        return (
            <View style={styles.container}>
                <View style={styles.imageThumbnail} >
                    <Image
                        source={icon}
                        style={styles.imageSize}
                    />
                </View>

                <CardView
                    cardElevation={2}
                    cardMaxElevation={2}
                    cornerRadius={5}>
                    <View style={styles.detailContainer}>

                        <View style={styles.detailRow}>
                            <Text style={styles.detail}> ID</Text>
                            <Text> {this.props.book.book_id}</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={styles.detail}> NAME</Text>
                            <Text> {this.props.book.name}</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={styles.detail}> AUTHOR </Text>
                            <Text> {this.props.book.author}</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={styles.detail}> PRICE</Text>
                            <Text> {this.props.book.price}</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={styles.detail}> PUBLISH YEAR </Text>
                            <Text > {this.props.book.publish_year}</Text>
                        </View>
                    </View>
                </CardView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#00BF9A'
    },
    imageThumbnail: {
        flex: 1,
        justifyContent: 'center', alignItems: 'center',
    },
    imageSize: {
        width: 200, height: 200, borderRadius: 100, flexDirection: 'row', flexWrap: 'wrap'
    },
    detailContainer: {
        backgroundColor: '#e5deb3',
        padding: 10
    },
    detailRow: {
        padding: 10, justifyContent: 'space-between', flexDirection: 'row'
    },
    detail: {
        fontWeight: 'bold',
    }


});