import * as React from 'react';
import Animated from 'react-native-reanimated';
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
    throw new Error(
      '[react-native-reswiper]: ReactiveIndicator 组件应该作为 Swiper 组件的子组件',
    );

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

  return (
    <IndicatorContainer
      verticalLayout={verticalLayout}
      horizontalLayout={horizontalLayout}
      inset={inset}
      style={style}
      position={position}
      horizontal={rest.horizontal}>
      {items}
    </IndicatorContainer>
  );
};

ReactiveIndicator.defaultProps = {
  itemStyleInterpolator: interpolators.dot,
};
