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

export const interpolate = interpolateNode || _interpolate;
