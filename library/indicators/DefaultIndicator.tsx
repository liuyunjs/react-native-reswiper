import * as React from 'react';
import { StyleProp, ViewStyle, View } from 'react-native';
import { SwiperIndicatorContext } from '../SwiperIndicator';

import {
  HorizontalLayout,
  IndicatorContainer,
  VerticalLayout,
} from './IndicatorContainer';

type DotIndicatorProps = {
  type: 'dot';
  size?: number;
  gap?: number;
  activeColor?: string;
  color?: string;
};

type StripIndicatorProps = {
  type: 'strip';
  activeSize?: number;
  size?: number;
  gap?: number;
  color?: string;
  activeColor?: string;
};

type BaseIndicatorProps = {
  type?: undefined;
  inactiveItemStyle: StyleProp<ViewStyle>;
  activeItemStyle: StyleProp<ViewStyle>;
};

export type DefaultIndicatorProps = {
  position?: 'top' | 'start' | 'end' | 'bottom';
  style?: StyleProp<ViewStyle>;
  inset?:
    | number
    | { top?: number; start?: number; end?: number; bottom?: number };
  horizontalLayout?: HorizontalLayout;
  verticalLayout?: VerticalLayout;
} & (BaseIndicatorProps | DotIndicatorProps | StripIndicatorProps);

const DefaultIndicatorItem = React.memo<
  {
    active: boolean;
    horizontal: boolean;
  } & (BaseIndicatorProps | DotIndicatorProps | StripIndicatorProps)
>(function DefaultIndicatorItem(props) {
  const { active, horizontal } = props;

  let inactiveStyle: StyleProp<ViewStyle>;
  let activeStyle: StyleProp<ViewStyle>;

  if (props.type === 'dot') {
    const config = Object.assign(
      {
        size: 8,
        gap: 4,
        activeColor: '#999',
        color: '#ccc',
      },
      props,
    );

    inactiveStyle = {
      width: config.size,
      height: config.size,
      margin: config.gap,
      borderRadius: config.size / 2,
      backgroundColor: config.color,
    };

    activeStyle = {
      backgroundColor: config.activeColor,
    };
  } else if (props.type === 'strip') {
    const config = Object.assign(
      {
        activeSize: 24,
        size: 4,
        gap: 2,
        color: '#ccc',
        activeColor: '#ccc',
      },
      props,
    );

    inactiveStyle = {
      width: config.size,
      height: config.size,
      margin: config.gap / 2,
      borderRadius: config.size / 2,
      backgroundColor: config.color,
    };

    activeStyle = {
      width: horizontal ? config.activeSize : config.size,
      height: !horizontal ? config.activeSize : config.size,
      backgroundColor: config.activeColor,
    };
  } else {
    inactiveStyle = props.inactiveItemStyle;
    activeStyle = props.activeItemStyle;
  }

  return <View style={[inactiveStyle, active && activeStyle]} />;
});

export const DefaultIndicator = (props: DefaultIndicatorProps) => {
  const context = React.useContext(SwiperIndicatorContext);
  if (context == null)
    throw new Error(
      '[react-native-reswiper]: DefaultIndicator 组件应该作为 Swiper 组件的子组件',
    );
  const { horizontal, activeIndex, itemCount } = context;
  const items: React.ReactNode[] = [];

  const { horizontalLayout, verticalLayout, inset, style, position, ...rest } =
    props;

  for (let i = 0; i < itemCount; i++) {
    items.push(
      <DefaultIndicatorItem
        {...rest}
        horizontal={horizontal}
        active={i === activeIndex}
        key={i}
      />,
    );
  }

  return (
    <IndicatorContainer
      verticalLayout={verticalLayout}
      horizontalLayout={horizontalLayout}
      inset={inset}
      style={style}
      position={position}
      horizontal={horizontal}>
      {items}
    </IndicatorContainer>
  );
};
