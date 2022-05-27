import Animated, { Extrapolate, multiply } from 'react-native-reanimated';
import { ViewStyle } from 'react-native';
import { interpolate } from './utils';

export interface Interpolator<T extends any = any> {
  (props: {
    horizontal: boolean;
    containerSize: number;
    progress: Animated.Adaptable<number>;
    config: T;
    itemCount: number;
    loop: boolean;
  }): Animated.AnimateStyle<ViewStyle>;
  defaultConfig: Partial<T>;
}

export type InterpolatorConfig<T extends Interpolator> = T extends Interpolator<
  infer C
>
  ? Partial<C>
  : never;

const slide: Interpolator<{}> = ({ horizontal, progress, containerSize }) => ({
  transform: [
    horizontal
      ? {
          translateX: multiply(progress, containerSize),
        }
      : {
          translateY: multiply(progress, containerSize),
        },
  ],
});

slide.defaultConfig = {};

const slideScale: Interpolator<{
  activeScale: number;
  inactiveScale: number;
}> = (props) => {
  const slideInterpolator = slide(props as any);
  let { progress, config } = props;

  config = { ...slideScale.defaultConfig, ...config };

  slideInterpolator.transform![1] = {
    scale: interpolate(progress, {
      inputRange: [-1, 0, 1],
      outputRange: [
        config.inactiveScale,
        config.activeScale,
        config.inactiveScale,
      ],
      extrapolate: Extrapolate.CLAMP,
    }),
  };

  return slideInterpolator;
};

slideScale.defaultConfig = {
  activeScale: 1,
  inactiveScale: 0.85,
};

export const interpolators = {
  slide,
  slideScale,
};
