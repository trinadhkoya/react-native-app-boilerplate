import React, {PureComponent} from 'react';
import {StyleSheet, View} from 'react-native';
import {colors} from './_globals/colorPalette';
import TextView from './_Theme/TextView';

class Test2 extends PureComponent {

    render() {
        return (
            <View flex center style={styles.container}>
                <TextView>Screen2</TextView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
    }
});

export default Test2;
