import React from 'react';
import Animated from 'react-native-reanimated';
import { useSpring } from '@liuyunjs/hooks/lib/react-native-reanimated/useSpring';
import { useConst } from '@liuyunjs/hooks/lib/useConst';
import { useReactCallback } from '@liuyunjs/hooks/lib/useReactCallback';
import { useInitializer } from './useInitializer';
import { useLoopControl } from './useLoopControl';
import { useAnimate } from './useAnimate';

type UseSpringAnimProps = {
  index?: number;
  onChange?: (index: number) => void;
  ctx: ReturnType<typeof useInitializer>;
  itemCount: number;
  loopControl: ReturnType<typeof useLoopControl>;
  anim: ReturnType<typeof useAnimate>;
};

const { cond, set, eq, block, modulo, call } = Animated;

export const useSpringAnim = ({
  ctx,
  loopControl,
  index,
  onChange: onIndexChange,
  itemCount,
  anim,
}: UseSpringAnimProps) => {
  const { values } = ctx;

  const onChangeCallback = useReactCallback(([index]: readonly number[]) => {
    if (ctx.index === index) return;
    ctx.index = index;
    onIndexChange?.(index);
  });

  const spring = useSpring({
    toValue: values.nextIndex,
    velocity: values.velocity,
    position: values.position,
    onStart: useConst(loopControl.stop),
    onEnd: React.useCallback(
      (state) => {
        return block([
          cond(
            eq(state.position, values.nextIndex),
            block([
              set(values.index, values.nextIndex),
              call([modulo(values.index, itemCount)], onChangeCallback),
            ]),
          ),
          loopControl.start(),
        ]);
      },
      [itemCount],
    ),
  });

  React.useEffect(() => {
    if (index == null || index === ctx.index) return;
    ctx.index = index;
    ctx.values.nextIndex.setValue(anim.animateTo(index));
  }, [index]);

  return spring;
};
