import PropTypes from 'prop-types';
import React from 'react';
import {Platform, StyleSheet, Text} from 'react-native';
import {normalize} from '../_globals/screen';
import fonts from './fonts';

const styles = StyleSheet.create({
    text: {
        ...Platform.select({
            android: {
                ...fonts.android.regular,
            },
            ios: {
                ...fonts.android.regular,
            },
        }),
    },
    bold: {
        ...Platform.select({
            android: {
                ...fonts.android.bold,
            },
            ios: {
                ...fonts.android.regular,
            },
        }),
    },
});

const TextView = props => {
    const {style, children, h1, h2, h3, h4, h5, fontFamily, ...rest} = props;

    return (
        <Text
            style={[
                styles.text,
                h1 && {fontSize: normalize(40)},
                h2 && {fontSize: normalize(34)},
                h3 && {fontSize: normalize(28)},
                h4 && {fontSize: normalize(22)},
                h5 && {fontSize: normalize(16)},

                h1 && styles.bold,
                h2 && styles.bold,
                h3 && styles.bold,
                h4 && styles.bold,
                h5 && styles.bold,
                fontFamily && {fontFamily},
                style && style,
            ]}
            {...rest}
        >
            {children}
        </Text>
    );
};

TextView.propTypes = {
    style: PropTypes.any,
    h1: PropTypes.bool,
    h2: PropTypes.bool,
    h3: PropTypes.bool,
    h4: PropTypes.bool,
    h5: PropTypes.bool,
    fontFamily: PropTypes.string,
    children: PropTypes.any,
};

export default TextView;
