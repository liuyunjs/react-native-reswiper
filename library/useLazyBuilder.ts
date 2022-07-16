import * as React from 'react';

export const useLazyBuilder = ({
  itemBuilder,
  lazy,
  lazyPlaceholder,
  index,
  itemCount,
}: {
  itemBuilder: (index: number) => React.ReactNode;
  lazy?: boolean;
  lazyPlaceholder?: React.ReactNode;
  index: number;
  itemCount: number;
}) => {
  const mounted = React.useRef<number[]>([]).current;

  if (!lazy) return itemBuilder;

  mounted.length = itemCount;

  return (idx: number) => {
    if (index === idx) mounted[idx] = 1;
    if (mounted[idx]) return itemBuilder(idx);
    return lazyPlaceholder || null;
  };
};
