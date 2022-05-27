import * as React from 'react';
import Animated, {
  block,
  set,
  cond,
  eq,
  add,
  divide,
  multiply,
  call,
  onChange,
  stopClock,
  startClock,
  abs,
  greaterThan,
  greaterOrEq,
  and,
  sub,
  or,
  lessThan,
  not,
} from 'react-native-reanimated';
import { State } from 'react-native-gesture-handler';
import { modulo as moduloJs } from '@liuyunjs/utils/lib/modulo';
import { useReactCallback } from '@liuyunjs/hooks/lib/useReactCallback';
import { clamp, sign } from './utils';
import type { SwiperProps, Context, Animate } from './Swiper';
import type { Interpolator } from './Interpolator';

export const useProgress = <T extends Interpolator = Interpolator>(
  {
    loop,
    autoplay,
    itemCount,
    autoplayInterval,
    onChange: onIndexChange,
  }: SwiperProps<T>,
  ctx: Context,
  animate: Animate,
  size: number,
  directionLeftOrRight: Animated.Adaptable<number>,
  toggleEnabled: (enabled: boolean | ((enabled?: boolean) => boolean)) => void,
) => {
  const onIndexChangeCallback = useReactCallback(
    ([index]: readonly number[]) => {
      ctx.indexJs = index;
      onIndexChange?.(moduloJs(-index, itemCount));
    },
  );

  return React.useMemo(() => {
    const minValue = 1 - itemCount;
    const maxValue = 0;

    const clampProgress = (n: Animated.Adaptable<number>) => {
      return loop ? n : clamp(n, minValue, maxValue);
    };
    const extrapolatedPosition = add(ctx.gesture, multiply(ctx.velocity, 0.3));

    const autoplayNode = cond(
      ctx.autoplay.isAutoPlay,
      [
        startClock(ctx.autoplay.clock),
        cond(
          greaterOrEq(
            sub(ctx.autoplay.clock, ctx.autoplay.startTime),
            autoplayInterval!,
          ),
          [
            animate.stop(),
            set(ctx.autoplay.isAutoPlay, 0),
            set(ctx.index, sub(ctx.index, 1)),
          ],
        ),
      ],
      [
        set(ctx.autoplay.startTime, ctx.autoplay.clock),
        stopClock(ctx.autoplay.clock),
      ],
    );

    return block([
      onChange(
        ctx.enabled,
        cond(
          not(ctx.enabled),
          call([ctx.enabled], () => toggleEnabled(false)),
        ),
      ),
      cond(
        eq(ctx.gestureState, State.ACTIVE),
        [
          loop
            ? 0
            : cond(
                and(
                  ctx.enabled,
                  or(
                    and(eq(ctx.index, minValue), lessThan(ctx.gesture, 0)),
                    and(eq(ctx.index, maxValue), greaterThan(ctx.gesture, 0)),
                  ),
                ),
                set(ctx.enabled, 0),
              ),

          set(ctx.autoplay.isAutoPlay, 0),
          animate.stop(),
          set(
            ctx.progress,
            clampProgress(
              add(
                ctx.offset,
                multiply(divide(ctx.gesture, size), directionLeftOrRight),
              ),
            ),
          ),
        ],
        [
          animate.start(
            cond(
              and(
                greaterThan(abs(ctx.gesture), 20),
                greaterThan(abs(extrapolatedPosition), multiply(0.5, size)),
              ),
              clampProgress(
                add(
                  ctx.index,
                  multiply(sign(extrapolatedPosition), directionLeftOrRight),
                ),
              ),
              ctx.index,
            ),
          ),
          set(ctx.offset, ctx.progress),
          set(ctx.enabled, 1),
        ],
      ),

      onChange(ctx.index, [
        call([ctx.index], onIndexChangeCallback),
        set(ctx.autoplay.isAutoPlay, 0),
      ]),

      autoplay && itemCount > 0
        ? loop
          ? autoplayNode
          : cond(
              greaterThan(ctx.index, minValue),
              autoplayNode,
              set(ctx.autoplay.isAutoPlay, 0),
            )
        : set(ctx.autoplay.isAutoPlay, 0),

      loop ? ctx.progress : set(ctx.progress, clampProgress(ctx.progress)),
      // : cond(
      //     lessThan(ctx.progress, minValue),
      //     [set(ctx.progress, minValue), set(ctx.index, minValue)],
      //     cond(greaterThan(ctx.progress, maxValue), [
      //       set(ctx.progress, maxValue),
      //       set(ctx.index, maxValue),
      //     ]),
      //   ),
      // ctx.progress,
    ]);
  }, [
    autoplay,
    loop,
    itemCount,
    directionLeftOrRight,
    size,
    autoplayInterval,
    animate.start,
  ]);
};
