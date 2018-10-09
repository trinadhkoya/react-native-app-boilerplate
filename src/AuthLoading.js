import React, {PureComponent} from 'react';
import {StyleSheet, View} from 'react-native';
import ProgressBar from './_globals/ProgressBar';
import {colors} from './_globals/colorPalette';

class AuthLoading extends PureComponent {

    render() {
        return (
            <View style={styles.container}>
                <ProgressBar/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
        flex: 1
    }
});

export default AuthLoading;
