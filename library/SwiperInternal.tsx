import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import {
  PanGestureHandler,
  PanGestureHandlerProps,
} from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import type { Interpolator, InterpolatorConfig } from './Interpolator';

export type SwiperInternalProps<T extends Interpolator> = {
  itemCount: number;
  itemBuilder: (i: number) => React.ReactNode;
  size: number;
  horizontal: boolean;
  getRelativeProgress: (index: number) => Animated.Node<number>;
  onGestureEvent: () => void;
  enabled?: boolean;
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
} & InterpolatorConfig<T>;

const SwiperItem = <T extends Interpolator>({
  children,
  horizontal,
  loop,
  itemCount,
  size,
  styleInterpolator,
  progress,
  ...config
}: {
  horizontal: boolean;
  children: React.ReactNode;
  loop: boolean;
  itemCount: number;
  size: number;
  styleInterpolator: T;
  progress: Animated.Node<number>;
} & InterpolatorConfig<T>) => {
  return (
    <Animated.View
      style={[
        StyleSheet.absoluteFill,
        styleInterpolator({
          horizontal,
          progress,
          containerSize: size,
          config,
          itemCount,
          loop,
        }),
      ]}>
      {children}
    </Animated.View>
  );
};

const percentNum = (size: number, num: number) => {
  return Math.round(Math.abs(num) <= 1 ? size * num : num);
};

export const SwiperInternal = React.memo(
  <T extends Interpolator>({
    size,
    horizontal,
    getRelativeProgress,
    itemBuilder,
    itemCount,
    onGestureEvent,
    enabled,
    itemStyleInterpolator,
    loop,
    trackOffset,
    slideSize,
    panProps,
    ...interpolatorConfig
  }: SwiperInternalProps<T>) => {
    const nodes: React.ReactNode[] = [];
    trackOffset = percentNum(size, trackOffset);
    slideSize = percentNum(size, slideSize);

    for (let i = 0; i < itemCount; i++) {
      const progress = getRelativeProgress(i);
      nodes.push(
        <SwiperItem
          {...(interpolatorConfig as any)}
          progress={progress}
          horizontal={horizontal}
          size={slideSize}
          itemCount={itemCount}
          loop={loop}
          styleInterpolator={itemStyleInterpolator}
          key={i}>
          {itemBuilder(i)}
        </SwiperItem>,
      );
    }

    return (
      <PanGestureHandler
        {...panProps}
        enabled={enabled}
        onHandlerStateChange={onGestureEvent}
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
  },
);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
});
