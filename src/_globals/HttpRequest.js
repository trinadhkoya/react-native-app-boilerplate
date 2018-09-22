import {Platform} from 'react-native';
import {API} from './API';

function count(obj) {
    return Object.keys(obj).length;
}

/**
 *
 */
export const GET = (type, api_name, parameters) => {
    let str = '';
    for (let i = 0; i < count(parameters); i++) {
        let theKey = Object.keys(parameters)[i];
        str = `${str}&${theKey}=${parameters[theKey]}`;
    }
    // str = `${str}&app_version=${settings.APP_VERSION}`;
    str = `${str}&platform=${(Platform.OS === 'android') ? 'android' : 'iOS'}`;
    str = str.toString().substr(1);
    let BASE = API.BASE_URL_1;
    switch (type) {
    case 'GDD':
        BASE = API.BASE_URL_1;
        break;
    case 'MOB':
        BASE = API.BASE_URL_2;
        break;
    default:
        break;
    }

    return fetch(BASE + api_name + '?' + str, {method: 'GET'})
        .then((response) => {
            return response.json();
        })
        .then((responseText) => {
            return responseText;
        })
        .catch((error) => {
            return error;
        });

};
