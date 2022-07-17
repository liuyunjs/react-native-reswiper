import { runOnJS, useSharedValue } from 'react-native-reanimated';
import { SwipeAnimationStatus } from './utils';
import { withTiming } from './timing';

export const useTimingTo = ({
  duration,
  setActiveIndex,
  easing,
}: {
  duration: number;
  easing: (t: number) => number;
  setActiveIndex: (nextIndex: number) => void;
}) => {
  const animationStatus = useSharedValue(SwipeAnimationStatus.idle);
  const timingTo = (toIndex: number) => {
    'worklet';

    return withTiming(
      toIndex,
      {
        duration,
        easing,
      },
      (type, finished) => {
        if (type === 'start') {
          animationStatus.value = SwipeAnimationStatus.animating;
          runOnJS(setActiveIndex)(toIndex);
        } else {
          animationStatus.value = finished
            ? SwipeAnimationStatus.finished
            : SwipeAnimationStatus.canceled;
        }
      },
    );
  };

  return {
    status: animationStatus,
    timingTo,
  };
};
