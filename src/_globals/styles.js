import {Platform, StyleSheet} from 'react-native';
import {colors} from './colorPalette';
import {normalize} from './screen';

class UIConstants {
    static AppbarHeight = Platform.OS === 'ios' ? 44 : 56;
    static StatusbarHeight = Platform.OS === 'ios' ? 20 : 0;
    static HeaderHeight = UIConstants.AppbarHeight + UIConstants.StatusbarHeight;
}

const appStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
        marginTop: UIConstants.StatusbarHeight

    },
    footerText: {
        justifyContent: 'flex-end',
        color:colors.steelblue,
        alignSelf: 'flex-end',
        fontSize:normalize(13)
    }


})
;
export default appStyles;
