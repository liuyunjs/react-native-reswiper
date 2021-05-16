import React from 'react';
import Animated from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { WIDTH } from '@liuyunjs/hooks/lib/react-native-reanimated/constant';
import { useSwiper, SwiperContext, UseSwiperProps } from './useSwiper';
import { styles } from './styles';
import { SwiperIndicatorProps } from './SwiperIndicator';

export type SwiperChildProps = SwiperPagerProps & {
  total: number;
  ctx: SwiperContext;
  current: Animated.Node<number>;
  relative: (index: number) => number;
};

export type SwiperPagerProps = UseSwiperProps &
  SwiperIndicatorProps & {
    itemBuilder: (index: number) => React.ReactNode;
    children: (props: SwiperChildProps) => React.ReactNode;
    gestureEnabled?: boolean;
  };

export type SwiperRef = {
  setIndex: (index: number, animated?: boolean) => void;
  setBy: (index: number, animated?: boolean) => void;
};

const { sub } = Animated;

export const SwiperPager = React.forwardRef<SwiperRef, SwiperPagerProps>(
  (props, ref) => {
    const { children, gestureEnabled } = props;

    const [gestureProps, swiper] = useSwiper(props);
    const { setBy, clamp, index } = swiper.ctx;

    React.useImperativeHandle(
      ref,
      () => ({
        setBy,
        setIndex(nextIndex: number, animated?: boolean) {
          setBy(sub(clamp(nextIndex), clamp(index)), animated);
        },
      }),
      [clamp, index, setBy],
    );

    return (
      <PanGestureHandler {...gestureProps} enabled={gestureEnabled}>
        <Animated.View style={styles.container}>
          {children(Object.assign({}, props, swiper))}
        </Animated.View>
      </PanGestureHandler>
    );
  },
);

SwiperPager.defaultProps = {
  autoplay: true,
  horizontal: true,
  layout: WIDTH,
};
