// @ts-nocheck

import {
  EasingFn,
  EasingFactoryFn,
} from 'react-native-reanimated/src/reanimated2/Easing';
import { defineAnimation, Easing } from 'react-native-reanimated';
import {
  Animation,
  AnimationCallback,
  Timestamp,
  AnimatableValue,
} from 'react-native-reanimated/src/reanimated2/commonTypes';

interface TimingConfig {
  duration?: number;
  easing?: EasingFn | EasingFactoryFn;
}

export interface TimingAnimation extends Animation<TimingAnimation> {
  type: string;
  easing: EasingFn;
  startValue: AnimatableValue;
  startTime: Timestamp;
  progress: number;
  toValue: AnimatableValue;
  current: AnimatableValue;
}

export interface InnerTimingAnimation
  extends Omit<TimingAnimation, 'toValue' | 'current'> {
  toValue: number;
  current: number;
}

export function withTiming(
  toValue: AnimatableValue,
  userConfig?: TimingConfig,
  onAnimation?: (
    type: 'start' | 'end',
    finished: boolean,
    current: number,
  ) => void,
) {
  'worklet';

  return defineAnimation<TimingAnimation>(toValue, () => {
    'worklet';

    const callback: AnimationCallback = (finished, current) => {
      onAnimation?.('end', finished, current);
    };

    const config: Required<TimingConfig> = {
      duration: 300,
      easing: Easing.inOut(Easing.quad),
    };
    if (userConfig) {
      Object.keys(userConfig).forEach(
        (key) =>
          ((config as any)[key] = userConfig[key as keyof typeof userConfig]),
      );
    }

    function timing(animation: InnerTimingAnimation, now: Timestamp): boolean {
      const { toValue, startTime, startValue } = animation;
      const runtime = now - startTime;

      if (runtime >= config.duration) {
        // reset startTime to avoid reusing finished animation config in `start` method
        animation.startTime = 0;
        animation.current = toValue;
        return true;
      }
      const progress = animation.easing(runtime / config.duration);
      animation.current =
        (startValue as number) + (toValue - (startValue as number)) * progress;
      return false;
    }

    function onStart(
      animation: TimingAnimation,
      value: number,
      now: Timestamp,
      previousAnimation: Animation<TimingAnimation>,
    ): void {
      onAnimation?.('start', false, value);
      if (
        previousAnimation &&
        (previousAnimation as TimingAnimation).type === 'timing' &&
        (previousAnimation as TimingAnimation).toValue === toValue &&
        (previousAnimation as TimingAnimation).startTime
      ) {
        // to maintain continuity of timing animations we check if we are starting
        // new timing over the old one with the same parameters. If so, we want
        // to copy animation timeline properties
        animation.startTime = (previousAnimation as TimingAnimation).startTime;
        animation.startValue = (
          previousAnimation as TimingAnimation
        ).startValue;
      } else {
        animation.startTime = now;
        animation.startValue = value;
      }
      animation.current = value;
      if (typeof config.easing === 'object') {
        animation.easing = config.easing.factory();
      } else {
        animation.easing = config.easing;
      }
    }

    return {
      type: 'timing',
      onFrame: timing,
      onStart: onStart as (animation: TimingAnimation, now: number) => boolean,
      progress: 0,
      toValue,
      startValue: 0,
      startTime: 0,
      easing: () => 0,
      current: toValue,
      callback,
    } as number;
  });
}
