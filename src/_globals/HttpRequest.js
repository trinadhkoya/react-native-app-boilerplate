import {Platform} from 'react-native';
import {API} from './API';
import DeviceInfo from 'react-native-device-info';

function count(obj) {
    return Object.keys(obj).length;
}

/**
  There’s a special syntax to work with promises in a more comfort fashion called “async/await”. It’s surprisingly easy to understand and use.
 * This is to handle GET Requests
 * @param type -> fo instance 'baseURL'.These might change when you are handling with Multiple Base URLS
 * @param api_name -> for instance '/user/'
 * @param parameters
 * @returns {Promise<T | never>}
 * @constructor
 */
export const GET = async (type, api_name, parameters) => {
    let str = '';
    for (let i = 0; i < count(parameters); i++) {
        let theKey = Object.keys(parameters)[i];
        str = `${str}&${theKey}=${parameters[theKey]}`;
    }
    str = `${str}&app_version=${DeviceInfo.getReadableVersion()}`;
    str = `${str}&platform=${(Platform.OS === 'android') ? 'android' : 'iOS'}`;
    str = str.toString().substr(1);
    let BASE_URL = API.BASE_URL_1;
    switch (type) {
    case 'WEB':
        BASE_URL = API.BASE_URL_1;
        break;
    case 'MOBILE':
        BASE_URL = API.BASE_URL_2;
        break;
    default:
        break;
    }
    return await fetch(BASE_URL + api_name + '?' + str, {method: 'GET'})
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

/**
 * This is to handle POST Requests
 * @param type
 * @param api_name
 * @param parameters
 * @returns {Promise<T | never>}
 * @constructor
 */
export const POST = async (type, api_name, parameters) => {

    let newParameters = parameters;
    if (!newParameters.type) {
        let platform = (Platform.OS === 'android') ? 'android' : 'iOS';
        newParameters['platform'] = platform;
        newParameters['app_version'] = DeviceInfo.getReadableVersion();
    }
    let BASE_URL = API.BASE_URL_1;
    switch (type) {
    case 'WEB':
        BASE_URL = API.BASE_URL_1;
        break;
    case 'MOBILE':
        BASE_URL = API.BASE_URL_2;
        break;
    default:
        break;
    }
    return await fetch(BASE_URL + api_name, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newParameters)
    })
        .then((response) => response.text())
        .then((responseText) => {
            return responseText;
        })
        .catch((error) => {
            return error;
        });
};
