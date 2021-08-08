import React from 'react';
import Animated, {
  Easing,
  // @ts-ignore
  EasingNode,
} from 'react-native-reanimated';
import { useCodeExec } from '@liuyunjs/hooks/lib/react-native-reanimated/useCodeExec';
import { useSwitch } from '@liuyunjs/hooks/lib/react-native-reanimated/useSwitch';
import { useClock } from '@liuyunjs/hooks/lib/react-native-reanimated';
import { useConst } from '@liuyunjs/hooks/lib/useConst';
import { useAnimate } from './useAnimate';

type UseLoopControlProps = {
  autoplay: boolean;
  loop: boolean;
  autoplayInterval: number;
  anim: ReturnType<typeof useAnimate>;
  total: number;
  index: Animated.Node<number>;
};

const {
  Value,
  block,
  cond,
  set,
  timing,
  clockRunning,
  startClock,
  stopClock,
  not,
  eq,
} = Animated;

export const useLoopControl = ({
  autoplay,
  anim,
  autoplayInterval,
  loop,
  total,
  index,
}: UseLoopControlProps) => {
  const clock = useClock();

  const control = useSwitch({
    onFalseAlways: useConst(() => stopClock(clock)),
    onTrueAlways: React.useCallback(() => {
      const state: Animated.TimingState = {
        finished: new Value<number>(0),
        time: new Value<number>(0),
        position: new Value<number>(0),
        frameTime: new Value<number>(0),
      };
      const config = {
        duration: autoplayInterval,
        easing: (EasingNode || Easing).linear,
      };

      const init = block([
        set(state.finished, 0),
        set(state.time, 0),
        set(state.frameTime, 0),
        set(state.position, 0),
      ]);

      return block([
        cond(not(clockRunning(clock)), [init, startClock(clock)]),
        timing(clock, state, config as Animated.TimingConfig),
        cond(state.finished, [anim.animateBy(1), init]),
      ]);
    }, [autoplayInterval]),
  });

  const { open, close } = control;

  const start = React.useCallback(() => {
    if (!autoplay) return close();
    if (loop) return open();
    return cond(eq(index, total - 1), close(), open());
  }, [autoplay]);

  const stop = close;

  useCodeExec(start, [start]);

  return { start, stop };
};
