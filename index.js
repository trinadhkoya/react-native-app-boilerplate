import {Navigation} from 'react-native-navigation';
import {registerScreens} from './src/screens';
import {AUTH_LOADING} from './src/routNames';

registerScreens();

Navigation.events().registerAppLaunchedListener(() => {
    Navigation.setRoot({
        root: {
            component: {
                name: AUTH_LOADING
            }
        }
    });
});

