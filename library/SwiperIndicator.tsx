import * as React from 'react';
import { SharedValue } from 'react-native-reanimated';

export interface ISwiperIndicatorContext {
  horizontal: boolean;
  itemCount: number;
  loop: boolean;
  containerSize: number;
  activeIndex: number;
  progress: SharedValue<number>;
}

export const SwiperIndicatorContext =
  React.createContext<ISwiperIndicatorContext | null>(null);

export const SwiperIndicator: React.FC<
  React.PropsWithChildren<ISwiperIndicatorContext>
> = ({ children, ...rest }) => {
  return (
    <SwiperIndicatorContext.Provider value={rest}>
      {children}
    </SwiperIndicatorContext.Provider>
  );
};
