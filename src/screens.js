import {Navigation} from 'react-native-navigation';
import {SCREEN} from './routNames';
import WelcomeScreen from './WelcomeScreen';
import AuthLoading from './AuthLoading';
import Explore from './Explore';

export function registerScreens() {
    Navigation.registerComponent(SCREEN.AUTH_LOADING, () => AuthLoading);
    Navigation.registerComponent(SCREEN.LOGIN, () => AuthLoading);
    Navigation.registerComponent(SCREEN.SIGN_UP, () => AuthLoading);
    Navigation.registerComponent(SCREEN.FORGOT_PASSWORD, () => AuthLoading);
    Navigation.registerComponent(SCREEN.HOME_TAB, () => AuthLoading);
    Navigation.registerComponent(SCREEN.SEARCH_TAB, () => AuthLoading);
    Navigation.registerComponent(SCREEN.ACCOUNT_TAB, () => AuthLoading);
    Navigation.registerComponent(SCREEN.SETTINGS_TAB, () => AuthLoading);
    Navigation.registerComponent(SCREEN.EXPLORE_TAB, () => Explore);
    Navigation.registerComponent(SCREEN.WELCOME_SCREEN, () => WelcomeScreen);
    //only when you deal with Redux
    // Navigation.registerComponentWithRedux(SCREEN.AUTH_LOADING, () => AuthLoading,Provider,store);


}
