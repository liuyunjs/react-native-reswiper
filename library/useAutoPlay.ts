import {
  cancelAnimation,
  SharedValue,
  useAnimatedReaction,
  withDelay,
} from 'react-native-reanimated';
import * as React from 'react';
import { SwipeAnimationStatus } from './utils';

export const useAutoPlay = ({
  autoplay,
  autoplayInterval,
  progress,
  animationStatus,
  activeIndex,
  timingTo,
  itemCount,
  loop,
}: {
  autoplay: boolean;
  loop: boolean;
  activeIndex: number;
  itemCount: number;
  autoplayInterval: number;
  progress: SharedValue<number>;
  timingTo: (to: number) => number;
  animationStatus: SharedValue<SwipeAnimationStatus>;
}) => {
  const autoPlayAnimate = () => {
    'worklet';
    if (!autoplay) return;
    if (!loop && activeIndex <= 1 - itemCount) return;
    progress.value = withDelay(autoplayInterval, timingTo(activeIndex - 1));
  };

  useAnimatedReaction(
    () => animationStatus.value,
    (prepareResult) => {
      if (prepareResult === SwipeAnimationStatus.finished) autoPlayAnimate();
    },
  );

  React.useEffect(() => {
    if (animationStatus.value === SwipeAnimationStatus.animating) return;
    if (autoplay) {
      autoPlayAnimate();
    } else {
      cancelAnimation(progress);
    }
  }, [autoplay]);
};
