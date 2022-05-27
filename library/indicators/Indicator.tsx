import * as React from 'react';
import Animated from 'react-native-reanimated';
import { View, StyleProp, ViewStyle } from 'react-native';
import { SwiperIndicatorContext } from '../SwiperIndicator';
import {
  Interpolator,
  InterpolatorConfig,
  interpolators,
  Dot,
} from './Interpolator';

export interface IndicatorProps<T extends Interpolator> {
  position?: 'top' | 'start' | 'end' | 'bottom';
  itemStyleInterpolator?: T;
  style?: StyleProp<ViewStyle>;
}

const IndicatorItem = <T extends Interpolator>({
  progress,
  styleInterpolator,
  loop,
  horizontal,
  itemCount,
  containerSize,
  ...config
}: {
  horizontal: boolean;
  loop: boolean;
  itemCount: number;
  size: number;
  styleInterpolator: T;
  progress: Animated.Node<number>;
} & InterpolatorConfig<T>) => {
  return (
    <Animated.View
      // @ts-ignore
      style={styleInterpolator({
        horizontal,
        progress,
        containerSize,
        config,
        itemCount,
        loop,
      })}
    />
  );
};

export const Indicator = <T extends Interpolator = Interpolator<Dot>>({
  position,
  itemStyleInterpolator,
  style,
  ...interpolatorConfig
}: IndicatorProps<T> & InterpolatorConfig<T>) => {
  const context = React.useContext(SwiperIndicatorContext);
  if (context == null)
    throw new Error('Indicator 组件应该作为 Swiper 组件的子组件');

  const { getRelativeProgress, ...rest } = context;

  const items: React.ReactNode[] = [];

  for (let i = 0; i < rest.itemCount; i++) {
    items.push(
      <IndicatorItem
        {...rest}
        {...(interpolatorConfig as any)}
        styleInterpolator={itemStyleInterpolator!}
        progress={getRelativeProgress(i)}
        key={i}
      />,
    );
  }

  const containerStyle: StyleProp<ViewStyle> = {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  };

  if (rest.horizontal) {
    containerStyle.start = 0;
    containerStyle.end = 0;
    if (position === 'top') {
      containerStyle.top = 0;
    } else {
      containerStyle.bottom = 0;
    }
    containerStyle.flexDirection = 'row';
  } else {
    containerStyle.top = 0;
    containerStyle.bottom = 0;
    if (position === 'start') {
      containerStyle.start = 0;
    } else {
      containerStyle.end = 0;
    }
    containerStyle.flexDirection = 'column';
  }

  return (
    <View pointerEvents="none" style={[style, containerStyle]}>
      {items}
    </View>
  );
};

Indicator.defaultProps = {
  itemStyleInterpolator: interpolators.dot,
};
