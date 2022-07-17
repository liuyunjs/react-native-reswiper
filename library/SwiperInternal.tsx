import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import {
  PanGestureHandler,
  PanGestureHandlerProps,
} from 'react-native-gesture-handler';
import Animated, {
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import type { Interpolator, InterpolatorConfig } from './Interpolator';
import { useLazyBuilder } from './useLazyBuilder';
import { modulo, getRelativeProgress } from './utils';

export type SwiperInternalProps<T extends Interpolator> = {
  itemCount: number;
  itemBuilder: (i: number) => React.ReactNode;
  size: number;
  horizontal: boolean;
  onGestureEvent: () => void;
  enabled: boolean;
  itemStyleInterpolator: T;
  loop: boolean;
  slideSize: number;
  trackOffset: number;
  activeOffset?: number | number[];
  failOffset?: number | number[];
  panProps?: Omit<
    PanGestureHandlerProps,
    'enabled' | 'onGestureEvent' | 'onHandlerStateChange'
  >;
  activeIndex: number;
  maxRenderCount: number;
  lazy: boolean;
  lazyPlaceholder: React.ReactNode;
  progress: SharedValue<number>;
} & InterpolatorConfig<T>;

const SwiperItem = <T extends Interpolator>({
  children,
  horizontal,
  loop,
  itemCount,
  size,
  styleInterpolator,
  index,
  progress,
  ...config
}: {
  horizontal: boolean;
  children: React.ReactNode;
  loop: boolean;
  itemCount: number;
  size: number;
  styleInterpolator: T;
  index: number;
  progress: SharedValue<number>;
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
      containerSize: size,
      config,
      itemCount,
      loop,
    });
  });

  return (
    <Animated.View style={[StyleSheet.absoluteFill, style]}>
      {children}
    </Animated.View>
  );
};

const percentNum = (size: number, num: number) => {
  return Math.round(Math.abs(num) <= 1 ? size * num : num);
};

export const SwiperInternal = <T extends Interpolator>({
  size,
  horizontal,
  itemBuilder,
  itemCount,
  onGestureEvent,
  enabled,
  itemStyleInterpolator,
  loop,
  trackOffset,
  slideSize,
  panProps,
  lazy,
  lazyPlaceholder,
  activeIndex,
  maxRenderCount,
  progress,
  ...interpolatorConfig
}: SwiperInternalProps<T>) => {
  const nodes: React.ReactNode[] = [];
  trackOffset = percentNum(size, trackOffset);
  slideSize = percentNum(size, slideSize);

  const max = Math.min(itemCount, maxRenderCount!);
  const builder = useLazyBuilder({
    itemBuilder,
    lazy,
    lazyPlaceholder,
    activeIndex,
    itemCount,
  });

  const getSwipeIndex = (i: number) => {
    if (itemCount < maxRenderCount!) return i;
    const relativeIndex = activeIndex + i - Math.floor(maxRenderCount! / 2);
    if (loop) return modulo(relativeIndex, itemCount);
    // 要渲染的第一个view已经到了最左边了
    if (activeIndex < maxRenderCount! / 2) return i;
    // 要渲染的第一个view已经到了最右边了
    if (activeIndex > itemCount - maxRenderCount! / 2)
      return itemCount - maxRenderCount! + i;
    return relativeIndex;
  };

  for (let i = 0, len = max; i < len; i++) {
    const swipeIndex = getSwipeIndex(i);
    nodes.push(
      <SwiperItem
        {...(interpolatorConfig as any)}
        progress={progress}
        horizontal={horizontal}
        size={slideSize}
        itemCount={itemCount}
        loop={loop}
        index={swipeIndex}
        styleInterpolator={itemStyleInterpolator}
        key={swipeIndex}>
        {builder(swipeIndex)}
      </SwiperItem>,
    );
  }

  return (
    <PanGestureHandler
      {...panProps}
      enabled={enabled}
      onGestureEvent={onGestureEvent}>
      <Animated.View style={styles.container}>
        <View
          style={[
            styles.container,
            {
              transform: [
                horizontal
                  ? { translateX: trackOffset }
                  : { translateY: trackOffset },
              ],
            },
          ]}>
          <View
            style={[
              styles.container,
              horizontal ? { width: slideSize } : { height: slideSize },
            ]}>
            {nodes}
          </View>
        </View>
      </Animated.View>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
});
