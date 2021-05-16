import React from 'react';
import { View } from 'react-native';
import Animated, { multiply } from 'react-native-reanimated';
import { modulo } from '@liuyunjs/utils/lib/modulo';
import {
  SwiperPager,
  SwiperPagerProps,
  SwiperChildProps,
  SwiperRef,
} from './SwiperPager';
import { styles } from './styles';

export type SwiperBaseProps = Omit<SwiperPagerProps, 'children'> & {
  children?: (props: SwiperChildProps) => React.ReactNode;
};

const getItems = ({
  total,
  horizontal,
  layout,
  itemCount,
  itemBuilder,
  sideCount,
}: SwiperChildProps): React.ReactNode => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return React.useMemo(() => {
    const items: React.ReactNode[] = [];

    for (let i = 0; i < total; i++) {
      items.push(
        <View
          key={i}
          style={
            horizontal
              ? { width: layout, height: '100%' }
              : { height: layout, width: '100%' }
          }>
          {itemBuilder(modulo(i - sideCount!, itemCount))}
        </View>,
      );
    }
    return items;
  }, [horizontal, itemBuilder, itemCount, layout, sideCount, total]);
};

const getTrans = ({ current, ctx, layout }: SwiperChildProps) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return React.useMemo(() => {
    return multiply(multiply(ctx.direction, current), layout!);
  }, [ctx.direction, current, layout]);
};

export const SwiperBase = React.forwardRef<SwiperRef, SwiperBaseProps>(
  (props, ref) => {
    return (
      <SwiperPager {...props} ref={ref}>
        {(childProps) => {
          const { total, horizontal, layout } = childProps;
          const trans = getTrans(childProps);
          return (
            <>
              <View style={styles.container}>
                <Animated.View
                  style={
                    horizontal
                      ? {
                          width: layout! * total,
                          height: '100%',
                          flexDirection: 'row',
                          transform: [{ translateX: trans }],
                        }
                      : {
                          height: layout! * total,
                          width: '100%',
                          transform: [{ translateY: trans }],
                        }
                  }>
                  {getItems(childProps)}
                </Animated.View>
              </View>
              {props.children?.(childProps)}
            </>
          );
        }}
      </SwiperPager>
    );
  },
);
