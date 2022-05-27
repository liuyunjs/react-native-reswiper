import { Extrapolate, interpolateColors } from 'react-native-reanimated';
import { interpolate } from '../utils';
import { Interpolator, InterpolatorConfig } from '../Interpolator';

export type { Interpolator, InterpolatorConfig };

export type Dot = {
  size: number;
  gap: number;
  activeColor: string;
  color: string;
};

const dot: Interpolator<Dot> = ({ progress, config }) => {
  config = { ...dot.defaultConfig, ...config };

  return {
    width: config.size,
    height: config.size,
    margin: config.gap,
    borderRadius: config.size / 2,
    backgroundColor: interpolateColors(progress, {
      inputRange: [-1, 0, 1],
      outputColorRange: [config.color, config.activeColor, config.color],
    }) as any,
  };
};

dot.defaultConfig = {
  size: 8,
  gap: 4,
  activeColor: '#999',
  color: '#ccc',
};

const strip: Interpolator<{
  activeSize: number;
  inactiveSize: number;
  size: number;
  gap: number;
  // activeColor: string;
  color: string;
}> = ({ progress, config, horizontal }) => {
  config = { ...strip.defaultConfig, ...config };

  const interpolateSize = interpolate(progress, {
    inputRange: [-1, 0, 1],
    outputRange: [config.inactiveSize, config.activeSize, config.inactiveSize],
    extrapolate: Extrapolate.CLAMP,
  });

  return {
    width: horizontal ? interpolateSize : config.size,
    height: !horizontal ? interpolateSize : config.size,
    margin: config.gap / 2,
    borderRadius: config.size / 2,
    backgroundColor: config.color,
    // backgroundColor: interpolateColors(progress, {
    //   inputRange: [-1, 0, 1],
    //   outputColorRange: [config.color, config.activeColor, config.color],
    // }) as any,
  };
};

strip.defaultConfig = {
  activeSize: 24,
  inactiveSize: 10,
  size: 4,
  gap: 2,
  // activeColor: '#999',
  color: '#ccc',
};

export const interpolators = {
  dot,
  strip,
};
