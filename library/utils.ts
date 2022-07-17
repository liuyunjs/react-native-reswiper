import { Extrapolate, interpolate } from 'react-native-reanimated';
import { I18nManager } from 'react-native';

export const clamp = (val: number, minVal: number, maxVal: number) => {
  'worklet';
  return Math.min(Math.max(minVal, val), maxVal);
};

export const modulo = (a: number, b: number) => {
  'worklet';
  if (b === 0) return 0;
  return ((a % b) + b) % b;
};

export enum SwipeAnimationStatus {
  idle,
  animating,
  finished,
  canceled,
}

export const getDirection = (horizontal: boolean) => {
  'worklet';
  return horizontal && I18nManager.isRTL ? -1 : 1;
};

export const getRelativeProgress = ({
  loop,
  progress,
  itemCount,
  horizontal,
  index,
}: {
  loop: boolean;
  itemCount: number;
  index: number;
  progress: number;
  horizontal: boolean;
}) => {
  'worklet';
  if (loop) {
    const viewCount = Math.floor((itemCount - 1) / 2);
    const currPos = index > viewCount ? index - itemCount : index;

    return interpolate(
      modulo(progress, itemCount),
      [0, viewCount + 0.5 - currPos, viewCount + 0.5 - currPos, itemCount],
      [
        currPos,
        viewCount + 0.5,
        -(itemCount - 1 - viewCount) - 0.5,
        currPos,
      ].map((i) => i * getDirection(horizontal)),
      Extrapolate.CLAMP,
    );
  }
  return progress + index;
};
