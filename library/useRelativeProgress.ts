import * as React from 'react';
import Animated, { Extrapolate, modulo, add } from 'react-native-reanimated';
import type { SwiperProps } from './Swiper';
import type { Interpolator } from './Interpolator';
import { interpolate } from './utils';

export const useRelativeProgress = <T extends Interpolator = Interpolator>(
  { itemCount, loop }: SwiperProps<T>,
  progress: Animated.Node<number>,
  directionLeftOrRight: number,
) => {
  const result = React.useMemo<Animated.Node<number>[]>(
    () => new Array(itemCount),
    [directionLeftOrRight, itemCount, loop, progress],
  );

  const viewCount = Math.floor((itemCount - 1) / 2);

  const loopProgress = React.useMemo(() => {
    return loop ? modulo(progress, itemCount) : progress;
  }, [loop, itemCount, progress]);

  return React.useCallback(
    (index: number) => {
      if (!result[index]) {
        if (loop) {
          const currPos = index > viewCount ? index - itemCount : index;

          result[index] = interpolate(loopProgress, {
            inputRange: [
              0,
              viewCount + 0.5 - currPos,
              viewCount + 0.5 - currPos,
              itemCount,
            ],
            outputRange: [
              currPos,
              viewCount + 0.5,
              -(itemCount - 1 - viewCount) - 0.5,
              currPos,
            ].map((i) => i * directionLeftOrRight),
            extrapolate: Extrapolate.CLAMP,
          });
        } else {
          result[index] = add(loopProgress, index);
        }
      }

      return result[index];
    },
    [result, loopProgress],
  );
};
