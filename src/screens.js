import {Navigation} from 'react-native-navigation';

import App from './App';
import Screen1 from './Screen1';
import {AUTH_LOADING, SCREEN_1, SCREEN_APP} from './routNames';
import AuthLoading from './AuthLoading';

export function registerScreens() {

    Navigation.registerComponent(SCREEN_APP, () => App);
    Navigation.registerComponent(SCREEN_1, () => Screen1);
    Navigation.registerComponent(AUTH_LOADING, () => AuthLoading);


}
