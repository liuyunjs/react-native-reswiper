import * as React from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';
import { isNumber } from '@liuyunjs/utils/lib/isNumber';

export type VerticalLayout = 'middle' | 'top' | 'bottom';

export type HorizontalLayout = 'center' | 'start' | 'end';

export interface IndicatorContainerProps {
  position?: 'top' | 'start' | 'end' | 'bottom';
  style?: StyleProp<ViewStyle>;
  horizontal?: boolean;
  inset?:
    | number
    | { top?: number; start?: number; end?: number; bottom?: number };
  horizontalLayout?: HorizontalLayout;
  verticalLayout?: VerticalLayout;
}

/**
 * 解析模态框中的内容的位置设置成所对应的样式
 * @param layout
 */
export function getLayout(
  layout?: HorizontalLayout | VerticalLayout,
): 'flex-end' | 'flex-start' | 'center' | undefined {
  switch (layout) {
    case 'start':
    case 'top':
      return 'flex-start';
    case 'end':
    case 'bottom':
      return 'flex-end';
    default:
      return 'center';
  }
}

export const IndicatorContainer: React.FC<
  React.PropsWithChildren<IndicatorContainerProps>
> = ({
  position,
  style,
  children,
  horizontal,
  inset: insetProp,
  verticalLayout,
  horizontalLayout,
}) => {
  const containerStyle: StyleProp<ViewStyle> = {
    position: 'absolute',
  };

  const inset = isNumber(insetProp)
    ? { top: insetProp, bottom: insetProp, start: insetProp, end: insetProp }
    : insetProp!;

  if (horizontal) {
    containerStyle.start = inset.start || 0;
    containerStyle.end = inset.end || 0;
    if (position === 'top') {
      containerStyle.top = inset.top || 0;
    } else {
      containerStyle.bottom = inset.bottom || 0;
    }
    containerStyle.flexDirection = 'row';
    containerStyle.alignItems = getLayout(horizontalLayout);
    containerStyle.justifyContent = getLayout(verticalLayout);
  } else {
    containerStyle.top = inset.top || 0;
    containerStyle.bottom = inset.bottom || 0;
    if (position === 'start') {
      containerStyle.start = inset.start || 0;
    } else {
      containerStyle.end = inset.end || 0;
    }
    containerStyle.flexDirection = 'column';
    containerStyle.alignItems = getLayout(verticalLayout);
    containerStyle.justifyContent = getLayout(horizontalLayout);
  }

  return (
    <View pointerEvents="none" style={[style, containerStyle]}>
      {children}
    </View>
  );
};

IndicatorContainer.defaultProps = {
  inset: 0,
};
