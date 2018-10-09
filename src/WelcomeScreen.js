import React, {PureComponent} from 'react';
import {StyleSheet, View} from 'react-native';
import {screenWidth} from './_globals/screen';
import appStyles from './_globals/styles';
import TextView from './_Theme/TextView';
import Button from './components/Button';
import {colors} from './_globals/colorPalette';
import {goSignUp, goToAuth} from './navigation';

class WelcomeScreen extends PureComponent {

    constructor(props) {
        super(props);
        this.openLoginScreen = this.openLoginScreen.bind(this);
        this.openSignUpScreen = this.openSignUpScreen.bind(this);
        this.openForgotPasswordScreen = this.openForgotPasswordScreen.bind(this);

    }

    openLoginScreen() {
        goToAuth();
    }

    openSignUpScreen() {
        goSignUp();
    }

    openForgotPasswordScreen() {
        goSignUp();
    }

    render() {
        return (
            <View style={[appStyles.container, styles.addContainer]}>
                <View style={styles.topView}>

                    <TextView h3 style={styles.introText}>Welcome,</TextView>


                    <View style={styles.row}>
                        <Button title={'Login'} style={styles.btn} onPress={this.openLoginScreen}/>
                        <Button title={'Sign Up'} style={styles.btn} onPress={this.openSignUpScreen}/>
                    </View>

                    <TextView h5 style={appStyles.footerText} onPress={this.openForgotPasswordScreen}>Forgot
                        password?</TextView>

                </View>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    img: {
        height: screenWidth / 3,
        width: screenWidth / 3,
    },
    row: {
        flexDirection: 'row',
        alignContent: 'center'
    },
    topView: {
        alignContent: 'center',
        alignItems: 'center',
        alignSelf: 'center'
    },
    btn: {
        width: screenWidth / 3,
        marginHorizontal: 5,
        marginTop: 20
    },
    addContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.whitesmoke
    },
    introText: {
        marginBottom: 20,

    }


});

export default WelcomeScreen;
