import * as React from 'react';
import { I18nManager } from 'react-native';
import Animated, { Extrapolate, modulo, add } from 'react-native-reanimated';
import type { SwiperProps } from './Swiper';
import type { Interpolator } from './Interpolator';
import { interpolate } from './utils';

export const useRelativeProgress = <T extends Interpolator = Interpolator>(
  { itemCount, loop, horizontal }: SwiperProps<T>,
  progress: Animated.Node<number>,
) => {
  const result = React.useMemo<Animated.Node<number>[]>(
    () => new Array(itemCount),
    [horizontal, itemCount, loop, progress],
  );

  const viewCount = Math.floor((itemCount - 1) / 2);

  return React.useCallback(
    (index: number) => {
      if (!result[index]) {
        if (loop) {
          const currPos = index > viewCount ? index - itemCount : index;

          result[index] = interpolate(modulo(progress, itemCount), {
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
            ].map((i) => i * (horizontal && I18nManager.isRTL ? -1 : 1)),
            extrapolate: Extrapolate.CLAMP,
          });
        } else {
          result[index] = add(progress, index);
        }
      }

      return result[index];
    },
    [result, itemCount, loop, progress],
  );
};
