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

    return {
      values,
      index: initialIndex,
    };
  });
};
