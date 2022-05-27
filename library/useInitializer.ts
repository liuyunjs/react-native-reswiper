import { useWillMount } from '@liuyunjs/hooks/lib/useWillMount';
import { Value, Clock } from 'react-native-reanimated';
import { State } from 'react-native-gesture-handler';
import type { SwiperProps } from './Swiper';
import type { Interpolator } from './Interpolator';

export const useInitializer = <T extends Interpolator = Interpolator>({
  index,
  enabled,
}: SwiperProps<T>) =>
  useWillMount(() => {
    return {
      enabled: new Value<number>(+enabled!),
      offset: new Value<number>(0),
      gestureState: new Value<State>(State.UNDETERMINED),
      velocity: new Value<number>(0),
      gesture: new Value<number>(0),
      progress: new Value<number>(index),
      index: new Value<number>(index),
      indexJs: index!,
      clock: new Clock(),
      autoplay: {
        startTime: new Value<number>(0),
        isAutoPlay: new Value<number>(0),
        clock: new Clock(),
      },
    };
  });
