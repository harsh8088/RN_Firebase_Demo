import React, { Component } from 'react';
import {   
  Text,
  StyleSheet,
  View,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback
  ,TouchableOpacity,
  Button
} from 'react-native';
import {Actions} from "react-native-router-flux";

import SignIn from './signIn';
import Icon from 'react-native-vector-icons/FontAwesome';

function abc(){

}
export default class ForgotPassword extends Component {

render() {
    return (
        <View style={styles.wrapper}>
            <View style={[styles.upperBody, styles.upperBodyColor]}>
                <Image
                    source={require('../images/logoImage.jpg')}
                />                
            </View>
           
                
             <View style={[styles.lowerBody, styles.lowerBodyColor]}>
                <TextInput 
                placeholder='Username' 
                placeholderTextColor='green'
                returnKeyType='next'
              
                onSubmitEditing={() => passwordInput.focus()}
                style={styles.textBox}
                >
                </TextInput> 

                 <TouchableOpacity style={styles.buttonContainer}
                     onPress={Actions.signUp}>
                     <Text style={{color:'white'}}>Submit</Text>
                    
                 </TouchableOpacity>
                 <View style={styles.bottomLinksContainer}>
                    <Button
                     onPress={Actions.signUp}
                        title="Sign Up "
                        color="#841584"
                        accessibilityLabel="Learn more about this purple button"
                    />
                    <Text style={{color:"#841584", marginTop: 10,fontWeight:'bold' }}> | </Text>
                    <Button
                        onPress={Actions.signUp}
                        title="Sign In"
                        color="#841584"
                        accessibilityLabel="Learn more about this purple button"
                    />
                 </View>
            </View>
        </View>
    );
  }
}

var styles = StyleSheet.create({
    wrapper:{
        flex: 1
        ,flexDirection: 'column'
        ,backgroundColor: 'white'
    },
    upperBody:{   
        flex: 1,
        justifyContent: 'center'
        ,alignItems: 'center'
    },
    upperBodyColor:{
        flex: 2, 
    },
    lowerBodyColor:{
        flex: 3, 
        padding: 10 ,  
    }, 
    lowerBody:{
        flex: 1,
        alignItems:'center' 
    },
    bodyMiddle:{
        flex : 1, 
        justifyContent: 'space-between'
    },
       bodyMiddleInner:{
        flex : 1, 
    },
     circleButtons:{
        flex: 1,     
        flexDirection:'row',
        justifyContent:'center'
        
    },
    circleButtonLeft:{
        flex: 1, 
         alignItems:'center'
    },
    circleButtonMiddle:{
        flex: 2, 
        justifyContent: 'space-between' 
    },
    flexDirectionRow:{
        flexDirection: 'row'
    },
    textBox:{
         width:250, 
        borderWidth:2,
        borderRadius: 20
        ,borderColor:'green',
        marginTop:10,
       padding:10,
    },
    bottomLinksContainer:{
      width: 250,
      height: 40,
      flexWrap: 'nowrap',
      flexDirection:'row', 
       justifyContent: 'space-between'
    },
    buttonContainer:{
        width:250,
        height:40,
        borderWidth:2,
        borderRadius: 20,
        backgroundColor: 'green'
        ,marginTop:10
        ,padding:10,
        alignItems:'center'
    } 
});

