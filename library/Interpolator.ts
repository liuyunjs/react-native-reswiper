import { Extrapolate, interpolate } from 'react-native-reanimated';
import { ViewStyle } from 'react-native';

export interface Interpolator<T extends any = any> {
  (props: {
    horizontal: boolean;
    containerSize: number;
    progress: number;
    config: T;
    itemCount: number;
    loop: boolean;
  }): ViewStyle;
}

export type InterpolatorConfig<T extends Interpolator> = T extends Interpolator<
  infer C
>
  ? Partial<C>
  : never;

const slide: Interpolator<{}> = ({ horizontal, progress, containerSize }) => {
  'worklet';
  return {
    transform: [
      horizontal
        ? {
            translateX: progress * containerSize,
          }
        : {
            translateY: progress * containerSize,
          },
    ],
  };
};

const slideScale: Interpolator<{
  activeScale: number;
  inactiveScale: number;
}> = (props) => {
  'worklet';
  const slideInterpolator = slide(props as any);

  const config = Object.assign(
    { activeScale: 1, inactiveScale: 0.85 },
    props.config,
  );

  slideInterpolator.transform![1] = {
    scale: interpolate(
      props.progress,
      [-1, 0, 1],
      [config.inactiveScale, config.activeScale, config.inactiveScale],
      Extrapolate.CLAMP,
    ),
  };

  return slideInterpolator;
};

export const interpolators = {
  slide,
  slideScale,
};
