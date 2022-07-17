import * as React from 'react';
import Animated, {
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { StyleProp, ViewStyle } from 'react-native';
import { SwiperIndicatorContext } from '../SwiperIndicator';
import {
  Interpolator,
  InterpolatorConfig,
  interpolators,
  Dot,
} from './Interpolator';
import {
  HorizontalLayout,
  IndicatorContainer,
  VerticalLayout,
} from './IndicatorContainer';
import { getRelativeProgress } from '../utils';

export interface ReactiveIndicatorProps<T extends Interpolator> {
  position?: 'top' | 'start' | 'end' | 'bottom';
  itemStyleInterpolator?: T;
  style?: StyleProp<ViewStyle>;
  inset?:
    | number
    | { top?: number; start?: number; end?: number; bottom?: number };
  horizontalLayout?: HorizontalLayout;
  verticalLayout?: VerticalLayout;
}

const ReactiveIndicatorItem = <T extends Interpolator>({
  progress,
  styleInterpolator,
  loop,
  horizontal,
  itemCount,
  containerSize,
  index,
  ...config
}: {
  horizontal: boolean;
  loop: boolean;
  itemCount: number;
  size: number;
  styleInterpolator: T;
  progress: SharedValue<number>;
  index: number;
} & InterpolatorConfig<T>) => {
  const style = useAnimatedStyle(() => {
    return styleInterpolator({
      horizontal,
      progress: getRelativeProgress({
        loop,
        progress: progress.value,
        horizontal,
        itemCount,
        index,
      }),
      containerSize,
      config,
      itemCount,
      loop,
    });
  });

  return <Animated.View style={style} />;
};

export const ReactiveIndicator = <T extends Interpolator = Interpolator<Dot>>({
  position,
  itemStyleInterpolator,
  style,
  inset,
  verticalLayout,
  horizontalLayout,
  ...interpolatorConfig
}: ReactiveIndicatorProps<T> & InterpolatorConfig<T>) => {
  const context = React.useContext(SwiperIndicatorContext);
  if (context == null)
    throw new Error('ReactiveIndicator 组件应该作为 Swiper 组件的子组件');

  const items: React.ReactNode[] = [];

  for (let i = 0; i < context.itemCount; i++) {
    items.push(
      <ReactiveIndicatorItem
        {...context}
        {...(interpolatorConfig as any)}
        index={i}
        styleInterpolator={itemStyleInterpolator!}
        key={i}
      />,
    );
  }

  return (
    <IndicatorContainer
      verticalLayout={verticalLayout}
      horizontalLayout={horizontalLayout}
      inset={inset}
      style={style}
      position={position}
      horizontal={context.horizontal}>
      {items}
    </IndicatorContainer>
  );
};

ReactiveIndicator.defaultProps = {
  itemStyleInterpolator: interpolators.dot,
};
