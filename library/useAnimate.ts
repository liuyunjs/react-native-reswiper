import Animated from 'react-native-reanimated';
import { useInitializer } from './useInitializer';

type AnimateProps = {
  loop: boolean;
  total: number;
  start: () => Animated.Node<number>;
  ctx: ReturnType<typeof useInitializer>;
};

const { max, min, add, block, set } = Animated;

export const useAnimate = ({
  loop,
  total,
  start,
  ctx: { values },
}: AnimateProps) => {
  const animateTo = (
    toIndex: Animated.Adaptable<number>,
    animated?: boolean,
  ) => {
    if (animated !== false) {
      return block([set(values.nextIndex, toIndex), start(), toIndex]);
    }
    return block([
      set(values.index, toIndex),
      set(values.nextIndex, toIndex),
      set(values.position, toIndex),
    ]);
  };

  const clamp = (num: Animated.Adaptable<number>) => {
    if (loop) return num;
    return min(total - 1, max(0, num));
  };

  const animateBy = (num: Animated.Adaptable<number>, animated?: boolean) => {
    const next = clamp(add(values.nextIndex, num));
    return animateTo(next, animated);
  };

  return {
    animateBy,
    animateTo,
  };
};
