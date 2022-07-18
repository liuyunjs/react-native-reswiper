import * as React from 'react';
import {
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
  ActivityIndicator,
} from 'react-native';
import Animated, {
  Easing,
  // @ts-ignore
  EasingNode,
} from 'react-native-reanimated';
import { clamp } from '@liuyunjs/utils/lib/clamp';
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
import { getSize } from './utils';

interface HorizontalProps {
  horizontal?: true;
  width: number;
  height?: number;
}

interface VerticalProps {
  horizontal: false;
  width?: number;
  height: number;
}

export type SwiperProps<T extends Interpolator> = (
  | VerticalProps
  | HorizontalProps
) & {
  itemCount: number;
  itemBuilder: (i: number) => React.ReactNode;
  activeIndex?: number;
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
  lazy?: boolean;
  lazyPlaceholder?: React.ReactNode;
} & InterpolatorConfig<T>;

export type Context = ReturnType<typeof useInitializer>;

export type Animate = ReturnType<typeof useAnimate>;

const E = EasingNode || Easing;

export const Swiper = <T extends Interpolator>(props: SwiperProps<T>) => {
  const { children, enabled, style, ...rest } = props;
  const { horizontal, itemCount } = rest;

  if (__DEV__) {
    if (rest.activeIndex == null && typeof (rest as any).index === 'number') {
      console.error(
        '[react-native-reswiper]: please use "activeIndex" instead of "index"',
      );
    }
  }

  const [activeIndex, setActiveIndex] = useReactionState<number>(
    clamp(0, rest.activeIndex! ?? (rest as any).index ?? 0, itemCount - 1),
  );
  const size = getSize(props);

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
    setActiveIndex,
  );

  const getRelativeProgress = useRelativeProgress(props, progress);

  return (
    <View style={[styles.container, style]}>
      <SwiperInternal
        {...(rest as any)}
        activeIndex={activeIndex}
        enabled={gestureEnabled && enabled && !!size && itemCount > 1}
        getRelativeProgress={getRelativeProgress}
        size={size}
        onGestureEvent={onGestureEvent}
      />
      {!!children && (
        <SwiperIndicator
          activeIndex={activeIndex}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

Swiper.defaultProps = {
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
  lazyPlaceholder: (
    <View style={styles.placeholder}>
      <ActivityIndicator size="large" />
    </View>
  ),
};
