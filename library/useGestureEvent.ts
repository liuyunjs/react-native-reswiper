import { useWillMount } from '@liuyunjs/hooks/lib/useWillMount';
import { block, event, set, Value } from 'react-native-reanimated';
import { useCodeExec } from '@liuyunjs/hooks/lib/react-native-reanimated/useCodeExec';
import type { Context } from './Swiper';

export const useGestureEvent = (ctx: Context, horizontal?: boolean) => {
  const values = useWillMount(() => {
    return {
      gx: new Value<number>(0),
      gy: new Value<number>(0),
      vx: new Value<number>(0),
      vy: new Value<number>(0),
    };
  });

  useCodeExec(() => {
    return block([
      set(ctx.gesture, horizontal ? values.gx : values.gy),
      set(ctx.velocity, horizontal ? values.vx : values.vy),
    ]);
  }, [horizontal]);

  return useWillMount(() =>
    event([
      {
        nativeEvent: {
          translationX: values.gx,
          state: ctx.gestureState,
          velocityX: values.vx,
          velocityY: values.vy,
          translationY: values.gy,
        },
      },
    ]),
  );
};
