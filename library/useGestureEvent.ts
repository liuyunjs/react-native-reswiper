import * as React from 'react';
import {
  cancelAnimation,
  runOnJS,
  SharedValue,
  useAnimatedGestureHandler,
} from 'react-native-reanimated';
import { PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import { clamp, getDirection } from './utils';

export const useGestureEvent = ({
  horizontal,
  itemCount,
  activeIndex,
  timingTo,
  progress,
  loop,
  toggleEnabled,
  size,
}: {
  horizontal: boolean;
  itemCount: number;
  loop: boolean;
  progress: SharedValue<number>;
  activeIndex: number;
  toggleEnabled: (nextEnabled: boolean) => void;
  timingTo: (to: number) => number;
  size: number;
}) => {
  const maybeClampProgress = React.useCallback(
    (next: number) => {
      'worklet';
      return loop ? next : clamp(next, 1 - itemCount, 0);
    },
    [loop, itemCount],
  );

  return useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    {
      offset: number;
      enabled: boolean;
    }
  >({
    onStart(evt, _) {
      cancelAnimation(progress);
      _.offset = progress.value;
      _.enabled = true;
    },
    onActive({ translationY, translationX }, _) {
      cancelAnimation(progress);
      const gesture = horizontal ? translationX : translationY;
      if (!loop) {
        if (
          _.enabled &&
          ((activeIndex === 1 - itemCount && gesture < 0) ||
            (activeIndex === 0 && gesture > 0))
        ) {
          runOnJS(toggleEnabled)((_.enabled = false));
        }
      }
      progress.value = maybeClampProgress(
        _.offset + (gesture / size) * getDirection(horizontal),
      );
    },
    onEnd({ translationX, translationY, velocityY, velocityX }, _) {
      const velocity = horizontal ? velocityX : velocityY;
      const gesture = horizontal ? translationX : translationY;
      const extrapolatedPosition = gesture + velocity * 0.3;
      const toIndex =
        Math.abs(gesture) > 20 && Math.abs(extrapolatedPosition) > size * 0.5
          ? maybeClampProgress(
              activeIndex +
                Math.sign(extrapolatedPosition) * getDirection(horizontal),
            )
          : activeIndex;

      progress.value = timingTo(toIndex);
    },
  });
};
