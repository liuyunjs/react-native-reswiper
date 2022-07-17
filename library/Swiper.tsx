import * as React from 'react';
import {
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
  ActivityIndicator,
} from 'react-native';
import { Easing, useSharedValue } from 'react-native-reanimated';
import { PanGestureHandlerProps } from 'react-native-gesture-handler';
import { SwiperInternal } from './SwiperInternal';
import { SwiperIndicator } from './SwiperIndicator';
import {
  Interpolator,
  interpolators,
  InterpolatorConfig,
} from './Interpolator';
import { modulo } from './utils';
import { useEnabledToggle } from './useEnabledToggle';
import { useAutoPlay } from './useAutoPlay';
import { useReactiveIndex } from './useReactiveIndex';
import { useActionIndexRef } from './useActionIndexRef';
import { useGestureEvent } from './useGestureEvent';
import { useTimingTo } from './useTimingTo';

interface HorizontalProps {
  horizontal?: true;
  width: number;
  height?: number;
}

interface VerticalProps {
  horizontal: false;
  height: number;
  width?: number;
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
  easing?: (v: number) => number;
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

export const Swiper = <T extends Interpolator>({
  children,
  enabled,
  style,
  activeIndex: activeIndexProp,
  onChange,
  autoplay,
  duration,
  easing,
  autoplayInterval,
  width,
  height,

  ...rest
}: SwiperProps<T>) => {
  const { horizontal, itemCount, loop } = rest;

  const size = horizontal ? width! : height!;

  const progress = useSharedValue(activeIndexProp!);
  const [gestureEnabled, toggleEnabled] = useEnabledToggle({ enabled });

  const [activeIndexRef, setActiveIndex] = useActionIndexRef({
    activeIndex: activeIndexProp!,
    onChange: onChange!,
    itemCount,
  });

  const { timingTo, status } = useTimingTo({
    duration: duration!,
    easing: easing!,
    setActiveIndex,
  });

  useReactiveIndex({
    activeIndexRef,
    activeIndex: activeIndexProp!,
    loop,
    itemCount,
    timingTo,
    progress,
  });

  // 这行代码位置不能随便改
  const activeIndex = activeIndexRef.current;

  useAutoPlay({
    activeIndex,
    autoplay: autoplay!,
    animationStatus: status,
    autoplayInterval: autoplayInterval!,
    progress,
    loop,
    itemCount,
    timingTo,
  });

  const onGestureEvent = useGestureEvent({
    horizontal,
    loop,
    toggleEnabled,
    timingTo,
    itemCount,
    size,
    progress,
    activeIndex,
  });

  const realActiveIndex = modulo(-activeIndex, itemCount);

  return (
    <View style={[styles.container, style]}>
      <SwiperInternal
        {...(rest as any)}
        progress={progress}
        activeIndex={realActiveIndex}
        enabled={gestureEnabled && enabled && !!size}
        size={size}
        onGestureEvent={onGestureEvent}
      />
      {!!children && (
        <SwiperIndicator
          progress={progress}
          activeIndex={realActiveIndex}
          containerSize={size}
          loop={loop!}
          itemCount={itemCount}
          horizontal={horizontal!}>
          {children}
        </SwiperIndicator>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

Swiper.defaultProps = {
  activeIndex: 0,
  horizontal: true,
  loop: true,
  duration: 300,
  easing: Easing.out(Easing.cubic),
  autoplayInterval: 3000,
  autoplay: true,
  enabled: true,
  itemStyleInterpolator: interpolators.slide,
  slideSize: 1,
  trackOffset: 0,
  maxRenderCount: 5,
  onChange: () => {},
  lazyPlaceholder: (
    <View style={styles.placeholder}>
      <ActivityIndicator size="large" />
    </View>
  ),
};
