import React from 'react';
import Animated from 'react-native-reanimated';
import {
  useSwiper as useSwiperBase,
  UseSwiperProps as UseSwiperBaseProps,
  SwiperContext as SwiperBaseContext,
} from '@liuyunjs/hooks/lib/react-native-reanimated/useSwiper';
import { modulo as moduloNum } from '@liuyunjs/utils/lib/modulo';
import { useReactCallback } from '@liuyunjs/hooks/lib/useReactCallback';

export type UseSwiperProps = Omit<UseSwiperBaseProps, 'minimum' | 'maximum'> & {
  loop?: boolean;
  sideCount?: number;
  itemCount: number;
};

export type SwiperContext = SwiperBaseContext & {};

const { modulo, add, cond, lessThan, greaterThan, sub } = Animated;

const preprocess = (itemCount: number, sideCount: number, loop?: boolean) => {
  loop = !!loop && itemCount > sideCount - 1;
  sideCount = loop ? sideCount : 0;
  return { loop: loop!, sideCount, total: itemCount + sideCount * 2 };
};

const useLoopCurrent = (
  current: Animated.Value<number>,
  sideCount: number,
  itemCount: number,
) => {
  return React.useMemo(() => {
    const target = modulo(add(current, sideCount), itemCount);

    return cond(
      lessThan(target, sideCount),
      add(target, itemCount),
      cond(
        greaterThan(target, add(sideCount, itemCount)),
        sub(target, itemCount),
        target,
      ),
    );
  }, [itemCount, sideCount, current]);
};

export const useSwiper = (props: UseSwiperProps) => {
  const {
    loop: loopInput,
    sideCount: sideCountInput = 1,
    itemCount,
    autoplay,
    onChange,
  } = props;
  const { total, sideCount, loop } = preprocess(
    itemCount,
    sideCountInput,
    loopInput,
  );

  const relative = useReactCallback((idx: number) => {
    return moduloNum(idx - sideCount!, itemCount);
  });

  const [gestureProps, ctx] = useSwiperBase(
    Object.assign(
      {},
      props,
      {
        autoplay: loop && autoplay,
        onChange: useReactCallback((idx: number) => {
          onChange?.(relative(idx));
        }),
      },
      loop ? undefined : { minimum: 0, maximum: itemCount - 1 },
    ),
  );

  const current = useLoopCurrent(ctx.current, sideCount, itemCount);

  return [
    gestureProps,
    { ctx, current, total, relative, sideCount, loop },
  ] as const;
};
