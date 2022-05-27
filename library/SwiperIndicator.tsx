import * as React from 'react';
import Animated from 'react-native-reanimated';

export interface ISwiperIndicatorContext {
  horizontal: boolean;
  getRelativeProgress: (index: number) => Animated.Node<number>;
  itemCount: number;
  loop: boolean;
  containerSize: number;
}

export const SwiperIndicatorContext =
  React.createContext<ISwiperIndicatorContext | null>(null);

export const SwiperIndicator: React.FC<ISwiperIndicatorContext> = ({
  children,
  horizontal,
  getRelativeProgress,
  itemCount,
  containerSize,
  loop,
}) => {
  const context: ISwiperIndicatorContext = React.useMemo(
    () => ({ getRelativeProgress, horizontal, itemCount, containerSize, loop }),
    [horizontal, getRelativeProgress, itemCount, containerSize, loop],
  );

  return (
    <SwiperIndicatorContext.Provider value={context}>
      {children}
    </SwiperIndicatorContext.Provider>
  );
};
