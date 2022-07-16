import * as React from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  ViewStyle,
} from 'react-native';
import { SwiperIndicatorContext } from '../SwiperIndicator';
import {
  HorizontalLayout,
  IndicatorContainer,
  VerticalLayout,
} from './IndicatorContainer';

export type IndexIndicatorProps = {
  style?: StyleProp<ViewStyle>;
  position?: 'top' | 'start' | 'end' | 'bottom';
  inset?:
    | number
    | { top?: number; start?: number; end?: number; bottom?: number };
  horizontalLayout?: HorizontalLayout;
  verticalLayout?: VerticalLayout;
  indicatorStyle?: StyleProp<TextStyle>;
};

export const IndexIndicator: React.FC<IndexIndicatorProps> = ({
  position,
  style,
  inset,
  verticalLayout,
  horizontalLayout,
  indicatorStyle,
}) => {
  const context = React.useContext(SwiperIndicatorContext);
  if (context == null)
    throw new Error('IndexIndicator 组件应该作为 Swiper 组件的子组件');

  const { horizontal, index, itemCount } = context;

  return (
    <IndicatorContainer
      horizontal={horizontal}
      position={position}
      inset={inset ?? (horizontal ? 20 : 10)}
      verticalLayout={verticalLayout}
      horizontalLayout={horizontalLayout}
      style={style}>
      <Text style={[styles.indicator, indicatorStyle]}>
        {index + 1} / {itemCount}
      </Text>
    </IndicatorContainer>
  );
};

const styles = StyleSheet.create({
  indicator: {
    color: '#fff',
    backgroundColor: 'rgba(0, 0, 0, .3)',
    padding: 4,
    borderRadius: 3,
    overflow: 'hidden',
    fontSize: 14,
  },
});
