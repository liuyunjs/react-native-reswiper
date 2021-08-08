import React from 'react';
import { modulo } from '@liuyunjs/utils/lib/modulo';
import { SwiperItem } from './SwiperItem';

type Props = {
  itemBuilder: (index: number) => React.ReactNode;
  sideCount: number;
  itemCount: number;
  total: number;
  width: number;
  height: number;
};

export const SwiperItems = React.memo<Props>(function SwiperItems({
  itemBuilder,
  sideCount,
  itemCount,
  total,
  width,
  height,
}) {
  const items: React.ReactNode[] = [];

  for (let i = 0; i < total; i++) {
    items.push(
      <SwiperItem key={i} width={width} height={height}>
        {itemBuilder(modulo(i - sideCount!, itemCount))}
      </SwiperItem>,
    );
  }

  return <>{items}</>;
});
