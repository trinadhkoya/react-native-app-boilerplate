import React, {PureComponent} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {screenWidth} from './_globals/screen';
import appStyles from './_globals/styles';
import Button from './components/Button/button';
import TextView from './_Theme/TextView';

class WelcomeScreen extends PureComponent {

    render() {
        return (
            <View style={[appStyles.container, styles.addContainer]}>
                <View style={styles.topView}>

                    <TextView h4 style={styles.introText}>Welcome,Github</TextView>

                    <Image style={styles.img}
                        source={require('./assets/img/brand_logo.png')}/>

                    <View style={styles.row}>
                        <Button title={'Login'} style={styles.btn} onPress={() => {
                        }}/>
                        <Button title={'Sign Up'} style={styles.btn} onPress={() => {
                        }}/>
                    </View>
                    <TextView h5 style={appStyles.footerText}>Forgot password?</TextView>

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
        alignItems: 'center'
    },
    introText: {
        marginBottom: 20,
    }


});

export default WelcomeScreen;
