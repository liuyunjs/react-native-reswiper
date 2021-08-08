import Animated from 'react-native-reanimated';
import * as React from 'react';

type Props = {
  position: Animated.Value<number>;
  sideCount: number;
  itemCount: number;
  loop: boolean;
};

const { add, modulo, cond, lessThan, greaterThan, sub } = Animated;

export const useLoopCurrent = ({
  position,
  loop,
  itemCount,
  sideCount,
}: Props) =>
  React.useMemo(() => {
    if (!loop) return position;
    const target = modulo(add(position, sideCount), itemCount);

    return cond(
      lessThan(target, sideCount),
      add(target, itemCount),
      cond(
        greaterThan(target, add(sideCount, itemCount)),
        sub(target, itemCount),
        target,
      ),
    );
  }, [itemCount, sideCount, position, loop]);
