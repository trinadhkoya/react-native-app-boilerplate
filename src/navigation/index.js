import {Navigation} from 'react-native-navigation';
import {SCREEN} from '../routNames';

export const goToAuth = () => Navigation.setRoot({
    root: {
        bottomTabs: {
            id: 'BottomTabsId',
            children: [
                {
                    component: {
                        name: SCREEN.HOME_TAB,
                        options: {
                            bottomTab: {
                                fontSize: 12,
                                text: 'Tab1',
                            }
                        }
                    },
                },
                {
                    component: {
                        name: SCREEN.SEARCH_TAB,
                        options: {
                            bottomTab: {
                                fontSize: 12,
                                text:'Tab2',

                            }
                        }
                    },
                },
            ],
        }
    }
});

export const goHome = () => Navigation.setRoot({
    root: {
        stack: {
            id: 'App',
            children: [
                {
                    component: {
                        name: SCREEN.SEARCH_TAB,
                    }
                }
            ],
        }
    }
});
