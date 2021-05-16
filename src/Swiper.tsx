import React from 'react';
import { isBoolean } from '@liuyunjs/utils/lib/isBoolean';
import { SwiperBase, SwiperBaseProps } from './SwiperBase';
import { renderIndicator, SwiperIndicatorProps } from './SwiperIndicator';
import { SwiperRef } from './SwiperPager';

export type SwiperProps = Omit<SwiperBaseProps, 'children'> & {
  indicator?: boolean | SwiperIndicatorProps;
};

export const Swiper = React.forwardRef<SwiperRef, SwiperProps>((props, ref) => {
  const { indicator = true } = props;
  delete props.indicator;
  return (
    <SwiperBase {...props} ref={ref}>
      {indicator
        ? isBoolean(indicator)
          ? renderIndicator
          : (p) => renderIndicator(Object.assign({}, indicator, p))
        : undefined}
    </SwiperBase>
  );
});
