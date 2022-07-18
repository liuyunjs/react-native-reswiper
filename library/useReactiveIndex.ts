import * as React from 'react';
import { clamp } from '@liuyunjs/utils/lib/clamp';
import type { SwiperProps, Context } from './Swiper';
import type { Interpolator } from './Interpolator';

export const useReactiveIndex = <T extends Interpolator = Interpolator>(
  { index, itemCount, loop }: SwiperProps<T>,
  ctx: Context,
) => {
  const resetIndex = (force?: boolean) => {
    if (index != null && itemCount > 0) {
      index = clamp(0, index, itemCount - 1);

      const nextIndex = loop
        ? -(Math.floor(-ctx.indexJs / itemCount) * itemCount + index)
        : -index;

      if (nextIndex !== ctx.indexJs) {
        if (force) {
          ctx.progress.setValue(nextIndex);
        }
        ctx.index.setValue(nextIndex);
      }
    }
  };

  React.useLayoutEffect(() => {
    resetIndex(true);
  }, [itemCount]);

  React.useLayoutEffect(() => {
    resetIndex(false);
  }, [index]);
};
