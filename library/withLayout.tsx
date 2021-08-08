import React from 'react';
import { View, StyleSheet, LayoutChangeEvent } from 'react-native';
import { useConst } from '@liuyunjs/hooks/lib/useConst';

type SwiperLayoutProps = {
  width?: number;
  height?: number;
  horizontal?: boolean;
};

export function withLayout<T extends React.ComponentType<any>>(Component: T) {
  const SwiperLayout: React.FC<
    SwiperLayoutProps &
      Omit<
        React.ComponentProps<T>,
        'width' | 'height' | 'horizontal' | 'forwardRef'
      >
  > = ({ width: widthInput, height: heightInput, ...rest }) => {
    const horizontal = rest.horizontal !== false;

    const [layout, setLayout] = React.useState([
      heightInput || -1,
      widthInput || -1,
    ]);

    const onLayout = useConst((e: LayoutChangeEvent) => {
      const { layout } = e.nativeEvent;
      setLayout([layout.height, layout.width]);
    });

    return (
      <View style={styles.container} onLayout={onLayout}>
        {layout[+horizontal] !== -1 && (
          // @ts-ignore
          <Component
            {...rest}
            horizontal={horizontal}
            width={layout[1]}
            height={layout[0]}
          />
        )}
      </View>
    );
  };

  return SwiperLayout;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // width: '100%',
    // height: '100%',
  },
});
