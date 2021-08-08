import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { modulo } from '@liuyunjs/utils/lib/modulo';
import { darkly } from 'rn-darkly';
import { SwiperContext } from '../withSwiper';

const { interpolateColors } = Animated;

const DotIndicatorItem = React.memo<{
  index: number;
  sideCount: number;
  current: Animated.Node<number>;
  color?: string;
  activeColor?: string;
  size?: number;
  total: number;
  itemCount: number;
}>(function DotIndicatorItem({
  itemCount,
  sideCount,
  color,
  activeColor,
  current,
  index,
  size,
  total,
}) {
  const outputColorRange: string[] = [];

  const inputRange = new Array(total).fill(0).map((v, i) => {
    if (modulo(i - sideCount, itemCount) === index) {
      outputColorRange.push(activeColor!);
    } else {
      outputColorRange.push(color!);
    }

    return i;
  });

  const bgColor: Animated.Node<any> = interpolateColors(current, {
    inputRange,
    outputColorRange,
  });

  const borderRadius = size! / 2;

  return (
    <Animated.View
      style={{
        width: size,
        height: size,
        margin: borderRadius,
        borderRadius,
        backgroundColor: bgColor,
      }}
    />
  );
});

const DotIndicator: React.FC<{
  color?: string;
  activeColor?: string;
  position?: 'top' | 'right' | 'bottom' | 'left';
  size?: number;
}> = ({ color, activeColor, position, size }) => {
  let { current, sideCount, total, itemCount, horizontal } =
    React.useContext(SwiperContext);

  position = position || (horizontal ? 'bottom' : 'right');
  horizontal = position === 'top' || position === 'bottom';

  const items: React.ReactNode[] = [];

  for (let i = 0; i < itemCount; i++) {
    items.push(
      <DotIndicatorItem
        total={total}
        itemCount={itemCount}
        sideCount={sideCount}
        color={color}
        activeColor={activeColor}
        key={i}
        index={i}
        size={size}
        current={current}
      />,
    );
  }

  return (
    <View
      style={[
        styles.container,
        horizontal ? styles.h : styles.v,
        { [position]: 0 },
      ]}>
      {items}
    </View>
  );
};

const DarklyDotIndicator = darkly<
  typeof DotIndicator,
  {
    darkColor?: string;
    darkActiveColor?: string;
  }
>(DotIndicator, [], ['color', 'activeColor']);

DarklyDotIndicator.defaultProps = {
  color: '#ccc',
  activeColor: '#999',
  size: 10,
  darkColor: '#666',
  darkActiveColor: '#ddd',
};

const MemoDotIndicator = React.memo(DarklyDotIndicator);

export { MemoDotIndicator as DotIndicator };

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  h: {
    left: 0,
    right: 0,
    height: 40,
    flexDirection: 'row',
  },
  v: {
    top: 0,
    bottom: 0,
    width: 40,
  },
});
