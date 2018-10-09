import {Navigation} from 'react-native-navigation';
import {SCREEN} from '../routNames';
import Icon from 'react-native-vector-icons/Ionicons';

let settingsIcon;
let settingsOutlineIcon;
let peopleIcon;
let iosNavigateOutline;
let iosNavigate;

function initIcons() {
    return new Promise(function (resolve, reject) {
        Promise.all(
            [
                Icon.getImageSource('md-home', 30),
                Icon.getImageSource('md-search', 30),
                Icon.getImageSource('md-grid', 30),
                Icon.getImageSource('md-contact', 30),
                Icon.getImageSource('md-settings', 30)
            ]
        ).then((values) => {
            settingsIcon = values[0];
            settingsOutlineIcon = values[1];
            peopleIcon = values[2];
            iosNavigateOutline = values[3];
            iosNavigate = values[4];
            resolve(true);
        }).catch((error) => {
            reject(error);
        }).done();
    });
}


initIcons();

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
                                icon: peopleIcon

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
                                text: 'Tab2',
                                icon: settingsOutlineIcon


                            }
                        }
                    },
                },
                {
                    component: {
                        name: SCREEN.HOME_TAB,
                        options: {
                            bottomTab: {
                                fontSize: 12,
                                text: 'Tab3',
                                icon: iosNavigateOutline

                            }
                        }
                    },
                },
                {
                    component: {
                        name: SCREEN.HOME_TAB,
                        options: {
                            bottomTab: {
                                fontSize: 12,
                                text: 'Tab4',
                                icon: iosNavigate

                            }
                        }
                    },
                },
                {
                    component: {
                        name: SCREEN.HOME_TAB,
                        options: {
                            bottomTab: {
                                fontSize: 12,
                                text: 'Tab5',
                                icon: settingsIcon

                            }
                        }
                    },
                },
            ],
        }
    }
});

export const goSignUp = () => Navigation.setRoot({
    root: {
        stack: {
            options: {
                topBar: {
                    visible: true
                }
            },
            children: [
                {
                    component: {
                        name: SCREEN.HOME_TAB,
                        passProps: {
                            text: 'This is ' + SCREEN.HOME_TAB,
                        }
                    },
                    topBar: {
                        leftButtons: [
                            {
                                id: 'buttonOne',
                                icon: require('../assets/img/home.png')
                            }
                        ],
                    }

                },

            ]
        }
    }
});
