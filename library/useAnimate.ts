import * as React from 'react';
import Animated, {
  block,
  not,
  clockRunning,
  stopClock,
  startClock,
  timing,
  set,
  cond,
  Value,
} from 'react-native-reanimated';
import type { Context, SwiperProps } from './Swiper';
import type { Interpolator } from './Interpolator';

export const useAnimate = <T extends Interpolator = Interpolator>(
  { easing, duration, autoplay }: SwiperProps<T>,
  ctx: Context,
) => {
  const stop = () => stopClock(ctx.clock);

  const start = React.useCallback(
    (to: Animated.Node<number>) => {
      const state = {
        position: ctx.progress,
        time: new Value(0),
        finished: new Value(0),
        frameTime: new Value(0),
      };

      return block([
        cond(not(clockRunning(ctx.clock)), [
          set(state.frameTime, 0),
          set(state.time, 0),
          set(state.finished, 0),
          set(ctx.index, to),
        ]),
        timing(ctx.clock, state, {
          duration: duration!,
          easing: easing!,
          toValue: ctx.index,
        }),

        cond(not(clockRunning(ctx.clock)), startClock(ctx.clock)),

        cond(state.finished, [
          set(ctx.gesture, 0),
          set(ctx.velocity, 0),
          set(ctx.autoplay.isAutoPlay, +autoplay!),
          stop(),
        ]),
      ]);
    },
    [duration, easing, autoplay],
  );

  return { start, stop };
};
