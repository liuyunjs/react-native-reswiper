import React from 'react';
import Animated from 'react-native-reanimated';
import { I18nManager } from 'react-native';
import {
  GestureContext,
  useGesture,
} from '@liuyunjs/hooks/lib/react-native-reanimated/useGesture';
import { useSpring } from '@liuyunjs/hooks/lib/react-native-reanimated/useSpring';
import { useConst } from '@liuyunjs/hooks/lib/useConst';
import { useInitializer } from './useInitializer';
import { useAnimate } from './useAnimate';

type PanGestureProps = {
  width: number;
  height: number;
  horizontal: boolean;
  total: number;
  loop: boolean;
  spring: ReturnType<typeof useSpring>;
  disable: (enabled: boolean) => void;
  ctx: ReturnType<typeof useInitializer>;
  anim: ReturnType<typeof useAnimate>;
};

const {
  add,
  cond,
  call,
  sub,
  multiply,
  abs,
  greaterThan,
  set,
  greaterOrEq,
  and,
  divide,
  lessThan,
  block,
} = Animated;

export const usePanGesture = ({
  horizontal,
  width,
  height,
  loop,
  total,
  disable,
  anim,
  ctx: {
    values: { startPosition, position },
  },
  spring,
}: PanGestureProps) => {
  const layout = horizontal ? width : height;
  const rtl = I18nManager.isRTL && horizontal;

  return useGesture({
    onStart: useConst(() =>
      block([set(startPosition, position), spring.stop()]),
    ),

    onActive: React.useCallback(
      (_: GestureContext) => {
        const gesture = horizontal ? _.gestureX : _.gestureY;
        const distance = cond(layout, divide(gesture, layout));

        const next = rtl
          ? add(startPosition, distance)
          : sub(startPosition, distance);

        if (loop) {
          return set(position, next);
        }
        const max = total - 1;
        const disableGesture = call([_.isSwiping], () => disable(false));

        return cond(
          lessThan(next, 0),
          [set(position, 0), disableGesture],
          cond(
            greaterThan(next, max),
            [set(position, max), disableGesture],
            set(position, next),
          ),
        );
      },
      [horizontal, rtl, loop, total, layout],
    ),

    onEnd: React.useCallback(
      (_: GestureContext) => {
        const gesture = horizontal ? _.gestureX : _.gestureY;
        const velocity = horizontal ? _.velocityX : _.velocityY;
        const extrapolatedPosition = add(gesture, multiply(velocity, 0.3));
        return cond(
          and(
            greaterOrEq(abs(gesture), 20),
            greaterOrEq(abs(extrapolatedPosition), multiply(layout, 0.5)),
          ),
          anim.animateBy(
            cond(
              greaterThan(extrapolatedPosition, 0),
              rtl ? 1 : -1,
              rtl ? -1 : 1,
            ),
          ),
          spring.start(),
        );
      },
      [horizontal, layout],
    ),
  })[0];
};
