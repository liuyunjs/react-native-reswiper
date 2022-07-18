import Animated, {
  greaterThan,
  lessThan,
  cond,
  min,
  max,
  interpolateNode,
  // @ts-ignore
  interpolate as _interpolate,
} from 'react-native-reanimated';

export const sign = (val: Animated.Adaptable<number>) =>
  cond(greaterThan(val, 0), 1, cond(lessThan(val, 0), -1, 0));

export const clamp = (
  val: Animated.Adaptable<number>,
  minVal: Animated.Adaptable<number>,
  maxVal: Animated.Adaptable<number>,
) => {
  return min(max(minVal, val), maxVal);
};

export const getSize = (props: {
  horizontal?: boolean;
  width?: number;
  height?: number;
}) => {
  const size = props.horizontal ? props.width : props.height;
  if (__DEV__) {
    if (typeof size !== 'number') {
      throw new Error(
        '[react-native-reswiper]: ' +
          (props.horizontal ? '"width"' : '"height"') +
          ' must be of type number, and now it is of type ' +
          typeof size,
      );
    }
    if (size <= 0) {
      throw new Error(
        '[react-native-reswiper]: ' +
          (props.horizontal ? '"width"' : '"height"') +
          ' must be greater than 0',
      );
    }
  }
  return size!;
};

export const interpolate = interpolateNode || _interpolate;
