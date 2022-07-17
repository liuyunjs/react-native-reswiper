import {
  Extrapolate,
  interpolateColor,
  interpolate,
} from 'react-native-reanimated';
import { Interpolator, InterpolatorConfig } from '../Interpolator';

export type { Interpolator, InterpolatorConfig };

export type Dot = {
  size: number;
  gap: number;
  activeColor: string;
  color: string;
};

const dot: Interpolator<Dot> = (options) => {
  'worklet';
  const config = Object.assign(
    {
      size: 8,
      gap: 4,
      activeColor: '#999',
      color: '#ccc',
    },
    options.config,
  );

  return {
    width: config.size,
    height: config.size,
    margin: config.gap,
    borderRadius: config.size / 2,
    backgroundColor: interpolateColor(
      options.progress,
      [-1, 0, 1],
      [config.color, config.activeColor, config.color],
    ),
  };
};

const strip: Interpolator<{
  activeSize: number;
  inactiveSize: number;
  size: number;
  gap: number;
  color: string;
}> = (options) => {
  'worklet';
  const config = Object.assign(
    {
      activeSize: 24,
      inactiveSize: 10,
      size: 4,
      gap: 2,
      color: '#ccc',
    },
    options.config,
  );

  const interpolateSize = interpolate(
    options.progress,
    [-1, 0, 1],
    [config.inactiveSize, config.activeSize, config.inactiveSize],
    Extrapolate.CLAMP,
  );

  return {
    width: options.horizontal ? interpolateSize : config.size,
    height: !options.horizontal ? interpolateSize : config.size,
    margin: config.gap / 2,
    borderRadius: config.size / 2,
    backgroundColor: config.color,
  };
};

export const interpolators = {
  dot,
  strip,
};
