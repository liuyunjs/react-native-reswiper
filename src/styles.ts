import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  item: {
    width: '100%',
    height: '100%',
    flexShrink: 0,
  },

  hIndicator: {
    height: 30,
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },

  vIndicator: {
    width: 30,
    position: 'absolute',
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },

  activeIndicatorItem: {
    position: 'absolute',
  },
});
