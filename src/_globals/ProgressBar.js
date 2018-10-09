import React from 'react';
import {ActivityIndicator, Platform, StyleSheet, View} from 'react-native';
import {colors} from './colorPalette';
import TextView from '../_Theme/TextView';

const ProgressBar = () => (
    <View style={styles.progressBar}>
        <ActivityIndicator size="large" color={Platform.OS === 'ios' ? colors.grey : colors.grey}/>
        <TextView h6>Loading...</TextView>
    </View>
);

const styles = StyleSheet.create({
    progressBar: {
        flex: 1,
        justifyContent: 'center',
        alignSelf: 'center',
        alignContent: 'center'
    }
});

export default ProgressBar;
