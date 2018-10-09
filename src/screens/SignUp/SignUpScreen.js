import React, {PureComponent} from 'react';
import {StyleSheet, View} from 'react-native';
import TextView from '../../_Theme/TextView';
import {colors} from '../../_globals/colorPalette';

class SignUpScreen extends PureComponent {

    render() {
        return (
            <View flex center style={styles.container}>
                <TextView>{this.props.text}</TextView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
    }
});

export default SignUpScreen;
