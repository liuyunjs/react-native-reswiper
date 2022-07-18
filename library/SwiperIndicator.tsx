import * as React from 'react';
import Animated from 'react-native-reanimated';

export interface ISwiperIndicatorContext {
  horizontal: boolean;
  getRelativeProgress: (index: number) => Animated.Node<number>;
  itemCount: number;
  loop: boolean;
  containerSize: number;
  activeIndex: number;
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
  activeIndex,
}) => {
  return (
    <SwiperIndicatorContext.Provider
      value={{
        getRelativeProgress,
        horizontal,
        itemCount,
        containerSize,
        loop,
        activeIndex,
      }}>
      {children}
    </SwiperIndicatorContext.Provider>
  );
};
