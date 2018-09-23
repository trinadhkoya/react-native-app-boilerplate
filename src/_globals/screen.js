// packages
import {Dimensions, PixelRatio, Platform} from 'react-native';

// Retrieve initial screen's width
export let screenWidth = Dimensions.get('window').width;

// Retrieve initial screen's height
export let screenHeight = Dimensions.get('window').height;
let pixelRatio = PixelRatio.get();

/**
 * Converts provided width percentage to independent pixel (dp).
 * @param  {string} widthPercent The percentage of screen's width that UI element should cover
 *                               along with the percentage symbol (%).
 * @return {number}              The calculated dp depending on current device's screen width.
 */
const widthPercentageToDP = widthPercent => {
    // Parse string percentage input and convert it to number.
    const elemWidth = parseFloat(widthPercent);

    // Use PixelRatio.roundToNearestPixel method in order to round the layout
    // size (dp) to the nearest one that correspons to an integer number of pixels.
    return PixelRatio.roundToNearestPixel(screenWidth * elemWidth / 100);
};

/**
 * Converts provided height percentage to independent pixel (dp).
 * @param  {string} heightPercent The percentage of screen's height that UI element should cover
 *                                along with the percentage symbol (%).
 * @return {number}               The calculated dp depending on current device's screen height.
 */
const heightPercentageToDP = heightPercent => {
    // Parse string percentage input and convert it to number.
    const elemHeight = parseFloat(heightPercent);

    // Use PixelRatio.roundToNearestPixel method in order to round the layout
    // size (dp) to the nearest one that correspons to an integer number of pixels.
    return PixelRatio.roundToNearestPixel(screenHeight * elemHeight / 100);
};

/**
 * Event listener function that detects orientation change (every time it occurs) and triggers
 * screen rerendering. It does that, by changing the state of the screen where the function is
 * called. State changing occurs for a new state variable with the name 'orientation' that will
 * always hold the current value of the orientation after the 1st orientation change.
 * Invoke it inside the screen's constructor or in componentDidMount lifecycle method.
 * @param {object} that Screen's class component this variable. The function needs it to
 *                      invoke setState method and trigger screen rerender (this.setState()).
 */
const listenOrientationChange = that => {
    Dimensions.addEventListener('change', newDimensions => {
        // Retrieve and save new dimensions
        screenWidth = newDimensions.window.width;
        screenHeight = newDimensions.window.height;

        // Trigger screen's rerender with a state update of the orientation variable
        that.setState({
            orientation: screenWidth < screenHeight ? 'portrait' : 'landscape'
        });
    });
};

/**
 * Wrapper function that removes orientation change listener and should be invoked in
 * componentWillUnmount lifecycle method of every class component (UI screen) that
 * listenOrientationChange function has been invoked. This should be done in order to
 * avoid adding new listeners every time the same component is re-mounted.
 */
const removeOrientationListener = () => {
    Dimensions.removeEventListener('change', () => {
    });
};

const hexToRGB = (hex) => {
    hex = parseInt(hex.slice(1), 16);
    let r = hex >> 16;
    let g = hex >> 8 & 0xFF;
    let b = hex & 0xFF;
    return `rgb(${r},${g},${b})`;
};

const hexToRgbA = (hex, opacity) => {
    let c;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
        c = hex.substring(1).split('');
        if (c.length === 3) {
            c = [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c = '0x' + c.join('');
        return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',' + opacity + ')';
    }
    throw new Error('Bad Hex');
};

const formatNumber = (num) => {
    return num > 999 ? (num / 1000).toFixed(1) + 'k' : num;
};


const isIphoneX = () => Platform.OS === 'ios' && !Platform.isPad && !Platform.isTVOS && (screenHeight === 812 || screenWidth === 812);

export const normalize = size => {
    if (pixelRatio >= 2 && pixelRatio < 3) {
        // iphone 5s and older Androids
        if (screenWidth < 360) {
            return size * 0.95;
        }
        // iphone 5
        if (screenHeight < 667) {
            return size;
            // iphone 6-6s
        } else if (screenHeight >= 667 && screenHeight <= 735) {
            return size * 1.15;
        }
        // older phablets
        return size * 1.25;
    } else if (pixelRatio >= 3 && pixelRatio < 3.5) {
        // catch Android font scaling on small machines
        // where pixel ratio / font scale ratio => 3:3
        if (screenWidth <= 360) {
            return size;
        }
        // Catch other weird android width sizings
        if (screenHeight < 667) {
            return size * 1.15;
            // catch in-between size Androids and scale font up
            // a tad but not too much
        }
        if (screenHeight >= 667 && screenHeight <= 735) {
            return size * 1.2;
        }
        // catch larger devices
        // ie iphone 6s plus / 7 plus / mi note 等等
        return size * 1.27;
    } else if (pixelRatio >= 3.5) {
        // catch Android font scaling on small machines
        // where pixel ratio / font scale ratio => 3:3
        if (screenWidth <= 360) {
            return size;
            // Catch other smaller android height sizings
        }
        if (screenHeight < 667) {
            return size * 1.2;
            // catch in-between size Androids and scale font up
            // a tad but not too much
        }
        if (screenHeight >= 667 && screenHeight <= 735) {
            return size * 1.25;
        }
        // catch larger phablet devices
        return size * 1.4;
    } else
    // if older device ie pixelRatio !== 2 || 3 || 3.5
        return size;
};
export default {
    widthPercentageToDP,
    heightPercentageToDP,
    listenOrientationChange,
    removeOrientationListener,
    hexToRGB,
    formatNumber,
    hexToRgbA, isIphoneX,
    normalize, screenWidth, screenHeight
};
