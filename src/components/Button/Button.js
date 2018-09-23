import React, {PureComponent} from 'react';

import {StyleSheet, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import TextView from '../../_Theme/TextView';
import {colors} from '../../_globals/colorPalette';
import isIphoneX from '../../_globals/screen';

export default class Button extends PureComponent {
    render() {
        const {loading, style, title} = this.props;
        return (
            <TouchableOpacity disabled={loading} {...this.props} activeOpacity={0.7} underlayColor={colors.grey}
                style={[styles.container, {backgroundColor: loading ? colors.white : colors.nightRider}, style]}>
                {loading === true || title !== undefined ?
                    <TextView h5
                        style={styles.textStyle}>{loading ? 'Loading...' : title}</TextView> : this.props.children}
            </TouchableOpacity>);
    }
}

Button.propTypes = {
    ...TouchableOpacity.propTypes,
    style: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.number,
        PropTypes.array
    ]),
    loading: PropTypes.bool
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        backgroundColor: colors.white,
        borderRadius: 50,
        marginBottom: isIphoneX ? 20 : 0

    },

    textStyle: {
        color: colors.white
    }
});

