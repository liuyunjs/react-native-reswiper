import React from 'react';
import Animated from 'react-native-reanimated';
import { View, ViewStyle } from 'react-native';
import { SwiperChildProps } from './SwiperPager';
import { styles } from './styles';

type IndicatorInterpolateStyle = (
  current: Animated.Node<number>,
  inputRange: number[],
  isCurrent: (index: number) => boolean,
  isActive?: boolean,
) => Animated.AnimateStyle<ViewStyle>;

export type SwiperIndicatorProps = {
  indicatorPosition?: 'top' | 'right' | 'bottom' | 'left';
  useIndicatorInterpolateStyle?: IndicatorInterpolateStyle;
};

type SwiperIndicatorItemProps = {
  index: number;
  current: Animated.Node<number>;
  inputRange: number[];
  relative: (index: number) => number;
  useInterpolateStyle: IndicatorInterpolateStyle;
};

const { interpolate } = Animated;

export const getInterpolate = (
  current: Animated.Node<number>,
  inputRange: number[],
  isCurrent: (index: number) => boolean,
  active: number,
  inactive: number,
) => {
  return interpolate(current, {
    inputRange,
    outputRange: inputRange.map((index) =>
      isCurrent(index) ? active : inactive,
    ),
  });
};

const useDefaultInterpolateStyle: IndicatorInterpolateStyle = (
  current,
  inputRange,
  isCurrent,
  isActive,
) => {
  return {
    opacity: getInterpolate(
      current,
      inputRange,
      isCurrent,
      +!!isActive,
      +!isActive,
    ),
    backgroundColor: isActive ? '#999' : '#ccc',
    width: 10,
    height: 10,
    borderRadius: 5,
    margin: 5,
  };
};

const useItems = ({
  total,
  itemCount,
  current,
  relative,
  useIndicatorInterpolateStyle = useDefaultInterpolateStyle,
}: SwiperChildProps) => {
  const inputRange = React.useMemo(
    () => new Array(total).fill(0).map((v, i) => i),
    [total],
  );

  return React.useMemo(() => {
    const items: React.ReactNode[] = [];

    for (let i = 0; i < itemCount; i++) {
      items.push(
        <SwiperIndicatorItem
          useInterpolateStyle={useIndicatorInterpolateStyle}
          index={i}
          inputRange={inputRange}
          current={current}
          relative={relative}
          key={i}
        />,
      );
    }
    return items;
  }, [current, inputRange, itemCount, relative, useIndicatorInterpolateStyle]);
};

const SwiperIndicator: React.FC<SwiperChildProps> = (props) => {
  const { horizontal, indicatorPosition = horizontal ? 'bottom' : 'right' } =
    props;
  return (
    <View
      style={[
        horizontal ? styles.hIndicator : styles.vIndicator,
        { [indicatorPosition]: 0 },
      ]}>
      {useItems(props)}
    </View>
  );
};

const SwiperIndicatorItem: React.FC<SwiperIndicatorItemProps> = ({
  relative,
  index,
  inputRange,
  useInterpolateStyle,
  current,
}) => {
  const isCurrent = React.useCallback(
    (i: number) => relative(i) === index,
    [relative, index],
  );
  return (
    <View>
      <Animated.View
        style={useInterpolateStyle(current, inputRange, isCurrent)}
      />
      <Animated.View
        style={[
          styles.activeIndicatorItem,
          useInterpolateStyle(current, inputRange, isCurrent, true),
        ]}
      />
    </View>
  );
};

export const renderIndicator = (props: SwiperChildProps) =>
  React.createElement(SwiperIndicator, props);
