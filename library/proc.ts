import { I18nManager } from 'react-native';
import Animated from 'react-native-reanimated';

const { proc, set, neq, cond, lessThan, add, greaterThan, sub, divide } =
  Animated;

export const maybeDivide = proc(
  (a: Animated.Adaptable<number>, b: Animated.Adaptable<number>) => {
    return cond(b, divide(a, b));
  },
);

export const maybeSet = proc(
  (value: Animated.Value<number>, next: Animated.Adaptable<number>) => {
    return cond(neq(value, next), set(value, next), value);
  },
);

// export const addTo = proc(
//   (a: Animated.Value<number>, b: Animated.Adaptable<number>) => {
//     return maybeSet(a, add(a, b));
//   },
// );
//
// export const scaleVelocityTo = proc((velocity: Animated.Value<number>) => {
//   return set(
//     velocity,
//     multiply(pow(abs(velocity), 0.7), cond(lessThan(velocity, 0), -1, 1)),
//   );
// });

export const maybeLessThan = proc(
  (
    left: Animated.Adaptable<number>,
    right: Animated.Adaptable<number>,
    horizontal: boolean,
  ) => {
    // if (I18nManager.isRTL) {
    //   return cond(horizontal, greaterThan(left, right), lessThan(left, right));
    // }
    //
    // return lessThan(left, right);
    const fn = I18nManager.isRTL && horizontal ? greaterThan : lessThan;
    return fn(left, right);
  },
);

export const maybeGreaterThen = proc(
  (
    left: Animated.Adaptable<number>,
    right: Animated.Adaptable<number>,
    horizontal: boolean,
  ) => {
    // if (I18nManager.isRTL) {
    //   return cond(horizontal, lessThan(left, right), greaterThan(left, right));
    // }
    //
    // return greaterThan(left, right);
    const fn = I18nManager.isRTL && horizontal ? lessThan : greaterThan;
    return fn(left, right);
  },
);

export const maybeAdd = proc(
  (
    left: Animated.Adaptable<number>,
    right: Animated.Adaptable<number>,
    horizontal: boolean,
  ) => {
    if (I18nManager.isRTL && horizontal) return add(left, right);

    return sub(left, right);
  },
);
