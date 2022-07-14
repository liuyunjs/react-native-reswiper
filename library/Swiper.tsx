import * as React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import Animated, {
  Easing,
  // @ts-ignore
  EasingNode,
} from 'react-native-reanimated';
import { PanGestureHandlerProps } from 'react-native-gesture-handler';
import { useReactionState } from '@liuyunjs/hooks/lib/useReactionState';
import { useInitializer } from './useInitializer';
import { useGestureEvent } from './useGestureEvent';
import { useAnimate } from './useAnimate';
import { useReactiveIndex } from './useReactiveIndex';
import { useProgress } from './useProgress';
import { useRelativeProgress } from './useRelativeProgress';
import { useEnabledToggle } from './useEnabledToggle';
import { SwiperInternal } from './SwiperInternal';
import { SwiperIndicator } from './SwiperIndicator';
import {
  Interpolator,
  interpolators,
  InterpolatorConfig,
} from './Interpolator';
import { clamp } from '@liuyunjs/utils/lib/clamp';

interface HorizontalProps {
  horizontal?: true;
  width: number;
}

interface VerticalProps {
  horizontal: false;
  height: number;
}

export type SwiperProps<T extends Interpolator> = (
  | VerticalProps
  | HorizontalProps
) & {
  itemCount: number;
  itemBuilder: (i: number) => React.ReactNode;
  index?: number;
  loop?: boolean;
  autoplay?: boolean;
  autoplayInterval?: number;
  onChange?: (index: number) => void;
  duration?: number;
  easing?: (v: Animated.Adaptable<number>) => Animated.Node<number>;
  enabled?: boolean;
  itemStyleInterpolator?: T;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  slideSize?: number;
  trackOffset?: number;
  panProps?: Omit<
    PanGestureHandlerProps,
    'enabled' | 'onGestureEvent' | 'onHandlerStateChange'
  >;
  maxRenderCount?: number;
};

export type Context = ReturnType<typeof useInitializer>;

export type Animate = ReturnType<typeof useAnimate>;

const E = EasingNode || Easing;

export const Swiper = <T extends Interpolator>(
  props: SwiperProps<T> & InterpolatorConfig<T>,
) => {
  const { children, enabled, ...rest } = props;
  const { horizontal, itemCount } = rest;
  const [index, setIndex] = useReactionState<number>(
    clamp(0, rest.index!, itemCount - 1),
  );

  const size = horizontal
    ? (props as HorizontalProps).width
    : (props as VerticalProps).height;

  const [gestureEnabled, toggleEnabled] = useEnabledToggle(props);

  const ctx = useInitializer<T>(props);

  const onGestureEvent = useGestureEvent(ctx, horizontal);

  useReactiveIndex(props, ctx);

  const animate = useAnimate(props, ctx);

  const progress = useProgress(
    props,
    ctx,
    animate,
    size,
    toggleEnabled,
    setIndex,
  );

  const getRelativeProgress = useRelativeProgress(props, progress);

  return (
    <View style={[styles.container, props.style]}>
      <SwiperInternal
        {...(rest as any)}
        index={index}
        enabled={gestureEnabled && enabled && !!size}
        getRelativeProgress={getRelativeProgress}
        size={size}
        onGestureEvent={onGestureEvent}
      />
      {!!children && (
        <SwiperIndicator
          containerSize={size}
          loop={props.loop!}
          itemCount={itemCount}
          horizontal={horizontal!}
          getRelativeProgress={getRelativeProgress}>
          {children}
        </SwiperIndicator>
      )}
    </View>
  );
};

Swiper.defaultProps = {
  index: 0,
  horizontal: true,
  loop: true,
  duration: 300,
  easing: E.out(E.cubic),
  autoplayInterval: 3000,
  autoplay: true,
  enabled: true,
  itemStyleInterpolator: interpolators.slide,
  slideSize: 1,
  trackOffset: 0,
  maxRenderCount: 5,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
