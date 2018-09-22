/* eslint-disable react-native/no-color-literals */
import React, {PureComponent} from 'react';
import {ActivityIndicator, StyleSheet} from 'react-native';
import {View} from 'react-native-ui-lib';

class AuthLoading extends PureComponent {

    render() {
        return (
            <View flex center style={styles.container}>
                <ActivityIndicator size={1}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F5FCFF',
    }
});

export default AuthLoading;
