import { Dimensions } from 'react-native';
const { height, width } = Dimensions.get('window');
const SCREEN_WIDTH = 375;
const SCREEN_HEIGHT = 820;

const isTablet = ((height/width) < 1.6); //aspectRatio = height/width;
/**
 * Function to scale a value based on the size of the screen size and the original
 * size used on the design.
 */
export default function (units = 1) {
	return width / SCREEN_WIDTH * units;
}


const verticalScale = size => (height / SCREEN_HEIGHT) * size;

export { verticalScale, isTablet };