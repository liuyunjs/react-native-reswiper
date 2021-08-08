import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { modulo } from '@liuyunjs/utils/lib/modulo';
import { darkly } from 'rn-darkly';
import { SwiperContext } from '../withSwiper';

const { interpolate } = Animated;

const DotIndicatorItemAnim: React.FC<{
  color: string;
  active: 0 | 1;
  inputRange: number[];
  index: number;
  sideCount: number;
  size: number;
  current: Animated.Node<number>;
  itemCount: number;
}> = ({
  color,
  itemCount,
  sideCount,
  size,
  current,
  active,
  inputRange,
  index,
}) => {
  const opacity = React.useMemo(() => {
    return interpolate(current, {
      inputRange,
      outputRange: inputRange.map((i) => {
        if (modulo(i - sideCount, itemCount) === index) return active;
        return +!active;
      }),
    });
  }, [inputRange, sideCount, itemCount, active, current]);

  return (
    <Animated.View
      style={[
        StyleSheet.absoluteFill,
        {
          backgroundColor: color,
          opacity,
          borderRadius: size / 2,
        },
      ]}
    />
  );
};

const DotIndicatorItem: React.FC<{
  index: number;
  sideCount: number;
  current: Animated.Node<number>;
  color?: string;
  activeColor?: string;
  size?: number;
  inputRange: number[];
  total: number;
  itemCount: number;
}> = ({
  inputRange,
  itemCount,
  sideCount,
  color,
  activeColor,
  current,
  index,
  size,
}) => {
  return (
    <View
      style={{
        width: size,
        height: size,
        margin: size! / 2,
      }}>
      <DotIndicatorItemAnim
        itemCount={itemCount}
        sideCount={sideCount}
        current={current}
        size={size!}
        index={index}
        inputRange={inputRange}
        color={color!}
        active={0}
      />
      <DotIndicatorItemAnim
        itemCount={itemCount}
        sideCount={sideCount}
        current={current}
        size={size!}
        index={index}
        inputRange={inputRange}
        color={activeColor!}
        active={1}
      />
    </View>
  );
};

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

  const inputRange = React.useMemo(
    () => new Array(total).fill(0).map((v, i) => i),
    [total],
  );

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
        inputRange={inputRange}
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
