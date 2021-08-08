import React from 'react';
import {
  PanGestureHandler,
  TapGestureHandler,
} from 'react-native-gesture-handler';
import { isArray } from '@liuyunjs/utils/lib/isArray';

export type SimultaneousProps = {
  panRef?: React.Ref<PanGestureHandler>;
  tapRef?: React.Ref<TapGestureHandler>;
  simultaneousHandlers?: React.Ref<unknown> | React.Ref<unknown>[];
};

export const useSimultaneous = ({
  panRef,
  tapRef,
  simultaneousHandlers,
}: SimultaneousProps) => {
  const panGestureHandlerRef = React.useRef<PanGestureHandler>(null);
  const tapGestureHandlerRef = React.useRef<TapGestureHandler>(null);

  React.useImperativeHandle(tapRef, () => tapGestureHandlerRef.current!);
  React.useImperativeHandle(panRef, () => panGestureHandlerRef.current!);

  if (simultaneousHandlers != null) {
    if (!isArray(simultaneousHandlers)) {
      simultaneousHandlers = [simultaneousHandlers];
    }
  } else {
    simultaneousHandlers = [];
  }

  return {
    panRef: panGestureHandlerRef,
    tapRef: tapGestureHandlerRef,
    panSimultaneous: simultaneousHandlers.concat(tapGestureHandlerRef),
    tapSimultaneous: simultaneousHandlers.concat(panGestureHandlerRef),
  };
};
