import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import {
  PanGestureHandler,
  TapGestureHandler,
  PanGestureHandlerProps,
} from 'react-native-gesture-handler';
import { useGesture } from '@liuyunjs/hooks/lib/react-native-reanimated/useGesture';
import { useConst } from '@liuyunjs/hooks/lib/useConst';
import { useSimultaneous, SimultaneousProps } from './useSimultaneous';
import { useEnabledToggle } from './useEnabledToggle';
import { withLayout } from './withLayout';
import { useLoopCurrent } from './useLoopCurrent';
import { useInitializer } from './useInitializer';
import { usePanGesture } from './usePanGesture';
import { useAnimate } from './useAnimate';
import { useLoopControl } from './useLoopControl';
import { useSpringAnim } from './useSpringAnim';

type SwiperInternalProps = SimultaneousProps & {
  horizontal: boolean;
  width: number;
  height: number;
  waitFor?: PanGestureHandlerProps['waitFor'];
  shouldCancelWhenOutside?: boolean;
  hitSlop?: PanGestureHandlerProps['hitSlop'];
  itemCount: number;
  itemBuilder: (index: number) => React.ReactNode;
  enabled?: boolean;
  loop?: boolean;
  sideCount?: number;
  autoplay?: boolean;
  autoplayInterval?: number;
  index?: number;
  onChange?: (index: number) => void;
};

export const SwiperContext = React.createContext<{
  ctx: ReturnType<typeof useInitializer>;
  sideCount: number;
  total: number;
  itemCount: number;
  horizontal: boolean;
  current: Animated.Node<number>;
}>(
  // @ts-ignore
  null,
);

const preparse = (itemCount: number, sideCount: number, loop: boolean) => {
  loop = loop && itemCount > sideCount - 1;
  sideCount = loop ? sideCount : 0;
  return { loop: loop!, sideCount, total: itemCount + sideCount * 2 };
};

export function withSwiper<T extends React.ComponentType<any>>(Component: T) {
  const Swiper: React.FC<SwiperInternalProps> = ({
    horizontal,
    width,
    height,
    panRef,
    waitFor,
    tapRef,
    simultaneousHandlers,
    shouldCancelWhenOutside,
    hitSlop,
    enabled: enabledInput,
    itemCount,
    itemBuilder,
    sideCount: sideCountInput = 2,
    loop: loopInput,
    children,
    autoplay,
    autoplayInterval,
    index,
    onChange,
  }) => {
    const { total, loop, sideCount } = preparse(
      itemCount,
      sideCountInput,
      loopInput !== false,
    );
    const [enabled, setEnabled] = useEnabledToggle(enabledInput);
    const ctx = useInitializer(Math.max(index || 0, 0));

    const { values } = ctx;

    const simultaneous = useSimultaneous({
      panRef,
      tapRef,
      simultaneousHandlers,
    });

    const anim = useAnimate({
      loop,
      total,
      start: () => spring.start(),
      ctx,
    });

    const loopControl = useLoopControl({
      autoplay: autoplay !== false,
      autoplayInterval: autoplayInterval || 3000,
      loop,
      total,
      index: values.nextIndex,
      anim,
    });

    const spring = useSpringAnim({
      ctx,
      loopControl,
      anim,
      onChange,
      index,
      itemCount,
    });

    const [tap] = useGesture({
      onStart: useConst(spring.stop),
      onEnd: useConst(spring.start),
    });

    const pan = usePanGesture({
      horizontal,
      width,
      height,
      total,
      spring,
      disable: setEnabled,
      ctx,
      anim,
      loop,
    });

    const current = useLoopCurrent({
      position: values.position,
      loop,
      sideCount,
      itemCount,
    });

    const elem = (
      // @ts-ignore
      <Component
        total={total}
        width={width}
        height={height}
        itemBuilder={itemBuilder}
        itemCount={itemCount}
        sideCount={sideCount}
        horizontal={horizontal}
        current={current}
      />
    );

    const swiperCtx = React.useMemo(
      () => ({
        ctx,
        horizontal,
        current,
        sideCount,
        itemCount,
        total,
      }),
      [horizontal, total, sideCount, current, itemCount],
    );

    return (
      <>
        <PanGestureHandler
          enableTrackpadTwoFingerGesture
          enabled={enabled}
          onHandlerStateChange={pan}
          onGestureEvent={pan}
          hitSlop={hitSlop}
          waitFor={waitFor}
          ref={simultaneous.panRef}
          shouldCancelWhenOutside={shouldCancelWhenOutside}
          simultaneousHandlers={simultaneous.panSimultaneous}>
          <Animated.View style={styles.container}>
            <TapGestureHandler
              enabled={enabled}
              onHandlerStateChange={tap}
              hitSlop={hitSlop}
              waitFor={waitFor}
              ref={simultaneous.tapRef}
              simultaneousHandlers={simultaneous.tapSimultaneous}>
              <Animated.View style={styles.container}>{elem}</Animated.View>
            </TapGestureHandler>
          </Animated.View>
        </PanGestureHandler>
        <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
          <SwiperContext.Provider value={swiperCtx}>
            {children}
          </SwiperContext.Provider>
        </View>
      </>
    );
  };

  return withLayout(Swiper);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
