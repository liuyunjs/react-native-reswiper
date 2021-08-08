import React from 'react';
import { View } from 'react-native';

export const SwiperItem: React.FC<{ width: number; height: number }> = ({
  children,
  width,
  height,
}) => {
  return <View style={{ width, height }}>{children}</View>;
};
