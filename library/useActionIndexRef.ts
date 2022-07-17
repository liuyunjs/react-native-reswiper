import { useForceUpdate } from '@liuyunjs/hooks/lib/useForceUpdate';
import * as React from 'react';
import { unstable_batchedUpdates } from 'react-native';
import { modulo } from './utils';

export const useActionIndexRef = ({
  activeIndex,
  itemCount,
  onChange,
}: {
  activeIndex: number;
  itemCount: number;
  onChange: (nextIndex: number) => void;
}) => {
  const forceUpdate = useForceUpdate();
  const activeIndexRef = React.useRef<number>(activeIndex);

  const setActiveIndex = (nextIndex: number) => {
    if (nextIndex === activeIndexRef.current) return;
    activeIndexRef.current = nextIndex;
    unstable_batchedUpdates(() => {
      onChange(modulo(-nextIndex, itemCount));
      forceUpdate();
    });
  };

  return [activeIndexRef, setActiveIndex] as const;
};
