import React from 'react';
import Animated from 'react-native-reanimated';
import { I18nManager } from 'react-native';
import { SwiperItems } from './SwiperItems';

const { multiply } = Animated;

type Props = {
  current: Animated.Node<number>;
  width: number;
  height: number;
  horizontal: boolean;
  total: number;
  itemBuilder: (index: number) => React.ReactNode;
  sideCount: number;
  itemCount: number;
};

export const SwiperTrans = React.memo<Props>(function SwiperTrans({
  width,
  horizontal,
  current,
  sideCount,
  total,
  itemCount,
  itemBuilder,
  height,
}) {
  const layout = horizontal ? width : height;

  const translate = multiply(current, layout);
  const trans =
    I18nManager.isRTL && horizontal ? translate : multiply(translate, -1);

  return (
    <Animated.View
      style={
        horizontal
          ? {
              width: width * total,
              height,
              flexDirection: 'row',
              transform: [{ translateX: trans }],
            }
          : {
              height: height * total,
              width,
              transform: [{ translateY: trans }],
            }
      }>
      <SwiperItems
        total={total}
        width={width}
        height={height}
        itemBuilder={itemBuilder}
        itemCount={itemCount}
        sideCount={sideCount}
      />
    </Animated.View>
  );
});
