import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import {colors} from '../_globals/colorPalette';
import TextView from '../_Theme/TextView';

class Search extends Component {
    render() {
        return (
            <View style={styles.container}>
                <TextView h5>Search</TextView>
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
export default Search;
