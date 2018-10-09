import React, {PureComponent} from 'react';
import {StyleSheet, View} from 'react-native';
import {colors} from './_globals/colorPalette';
import TextView from './_Theme/TextView';

class Test extends PureComponent {

    render() {
        return (
            <View style={styles.container}>
                <TextView>Screen1</TextView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
    }
});

export default Test;
