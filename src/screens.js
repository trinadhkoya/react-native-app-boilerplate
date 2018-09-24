import {Navigation} from 'react-native-navigation';
import AuthLoading from './AuthLoading';
import {SCREEN} from './routNames';
import Test from './Test';
import WelcomeScreen from './WelcomeScreen';

export function registerScreens() {
    Navigation.registerComponent(SCREEN.AUTH_LOADING, () => AuthLoading);
    Navigation.registerComponent(SCREEN.LOGIN, () => Test);
    Navigation.registerComponent(SCREEN.SIGN_UP, () => Test);
    Navigation.registerComponent(SCREEN.FORGOT_PASSWORD, () => Test);
    Navigation.registerComponent(SCREEN.HOME_TAB, () => Test);
    Navigation.registerComponent(SCREEN.SEARCH_TAB, () => Test);
    Navigation.registerComponent(SCREEN.ACCOUNT_TAB, () => Test);
    Navigation.registerComponent(SCREEN.SETTINGS_TAB, () => Test);
    Navigation.registerComponent(SCREEN.WELCOME_SCREEN, () => WelcomeScreen);
    //only when you deal with Redux
    // Navigation.registerComponentWithRedux(SCREEN.AUTH_LOADING, () => AuthLoading,Provider,store);


}
