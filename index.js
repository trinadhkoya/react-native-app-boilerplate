import {Navigation} from 'react-native-navigation';
import {registerScreens} from './src/screens';
import {SCREEN} from './src/routNames';
// eslint-disable-next-line no-console
console.disableYellowBox = true;

registerScreens();

Navigation.events().registerAppLaunchedListener(() => {
    Navigation.setRoot({
        root: {
            component: {
                name: SCREEN.AUTH_LOADING
            }
        }
    });
});

