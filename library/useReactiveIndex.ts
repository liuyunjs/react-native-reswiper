import { clamp } from './utils';
import * as React from 'react';
import { SharedValue } from 'react-native-reanimated';

export const useReactiveIndex = ({
  itemCount,
  activeIndex,
  activeIndexRef,
  loop,
  progress,
  timingTo,
}: {
  itemCount: number;
  loop: boolean;
  activeIndexRef: React.MutableRefObject<number>;
  progress: SharedValue<number>;
  activeIndex: number;
  timingTo: (to: number) => number;
}) => {
  const resetIndex = (nextIndex: number, force?: boolean) => {
    nextIndex = clamp(0, nextIndex, itemCount - 1);

    const newIndex = loop
      ? -(
          Math.floor(-activeIndexRef.current / itemCount) * itemCount +
          nextIndex
        )
      : -nextIndex;

    if (newIndex !== activeIndexRef.current) {
      if (force) {
        progress.value = activeIndexRef.current = newIndex;
      } else {
        progress.value = timingTo((activeIndexRef.current = newIndex));
      }
    }
  };

  React.useMemo(() => {
    resetIndex(activeIndex, true);
  }, [itemCount]);

  React.useMemo(() => {
    resetIndex(activeIndex);
  }, [activeIndex]);
};
