import React, {PureComponent} from 'react';
import {StyleSheet} from 'react-native';
import {Text, View} from 'react-native-ui-lib';
import {colors} from './_globals/colorPalette';

class Test extends PureComponent {

    render() {
        return (
            <View flex center style={styles.container}>
                <Text>Screen1</Text>
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
