import React, {PureComponent} from 'react';
import {StyleSheet, View} from 'react-native';
import ProgressBar from './_globals/ProgressBar';
import {colors} from './_globals/colorPalette';
import TextView from './_Theme/TextView';

class AuthLoading extends PureComponent {

    render() {
        return (
            <View flex center style={styles.container}>
                <ProgressBar/>
                <TextView h1>Hi</TextView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
    }
});

export default AuthLoading;
