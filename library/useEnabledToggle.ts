import * as React from 'react';

export const useEnabledToggle = ({ enabled }: { enabled?: boolean }) => {
  const [gestureEnabled, setGestureEnabled] = React.useState(enabled!);

  React.useEffect(() => {
    if (!enabled) {
      return;
    }
    if (!gestureEnabled) {
      setGestureEnabled(true);
    }
  }, [gestureEnabled]);

  return [gestureEnabled, setGestureEnabled] as const;
};
