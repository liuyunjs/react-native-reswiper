import Animated from 'react-native-reanimated';
import { useWillMount } from '@liuyunjs/hooks/lib/useWillMount';

const { Value } = Animated;

const createValues = (initialOffset: number) => {
  return {
    position: new Value<number>(initialOffset),
    startPosition: new Value<number>(initialOffset),
    nextIndex: new Value<number>(initialOffset),
    index: new Value<number>(initialOffset),
    velocity: new Value<number>(0),
  };
};

export const useInitializer = (initialIndex: number) => {
  return useWillMount(() => {
    const values = createValues(initialIndex);

    // const animateTo = (
    //   toIndex: Animated.Adaptable<number>,
    //   animated?: boolean,
    // ) => {
    //   if (animated !== false) {
    //     return block([set(values.nextIndex, toIndex), anim.start(), toIndex]);
    //   }
    //   return block([
    //     set(values.index, toIndex),
    //     set(values.nextIndex, toIndex),
    //     set(values.position, toIndex),
    //   ]);
    // };

    return {
      values,
      // animateTo,
      // stop: () => anim.stop(),
      // start: () => anim.start(),
      index: initialIndex,
    };
  });

  // const { values } = ctx;
  //
  // const anim = useSpring({
  //   toValue: values.nextIndex,
  //   velocity: values.velocity,
  //   position: values.position,
  //   onEnd: useConst((state) => {
  //     return cond(
  //       eq(state.position, values.nextIndex),
  //       set(values.index, values.nextIndex),
  //     );
  //   }),
  // });
  //
  // return ctx;
};
