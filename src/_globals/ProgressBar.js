import React from 'react';
import {ActivityIndicator, Platform, StyleSheet, View} from 'react-native';
import {colors} from './colorPalette';

const ProgressBar = () => (
    <View style={styles.progressBar}>
        <ActivityIndicator size="large" color={Platform.OS === 'ios' ? colors.grey : colors.red}/>
    </View>
);

const styles = StyleSheet.create({
    progressBar: {
        flex: 1,
        justifyContent: 'center'
    }
});

export default ProgressBar;
