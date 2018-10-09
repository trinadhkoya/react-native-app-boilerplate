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
                                icon: require('../assets/img/home.png')

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
                                icon: require('../assets/img/menu.png')


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
                                icon: require('../assets/img/search.png')

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
                                icon: require('../assets/img/settings.png')

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
                                icon: require('../assets/img/user.png')

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
