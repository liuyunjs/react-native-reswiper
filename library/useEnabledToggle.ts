import { useReactionState } from '@liuyunjs/hooks/lib/useReactionState';
import useUpdateEffect from 'react-use/esm/useUpdateEffect';

export const useEnabledToggle = (gestureEnabled?: boolean) => {
  gestureEnabled = gestureEnabled !== false;
  const [gestureEnabledState, setGestureEnabledState] =
    useReactionState(gestureEnabled);

  useUpdateEffect(() => {
    if (!gestureEnabled) {
      return;
    }
    if (!gestureEnabledState) {
      setGestureEnabledState(true);
    }
  }, [gestureEnabledState]);

  return [gestureEnabledState, setGestureEnabledState] as const;
};
