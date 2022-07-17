# react-native-reswiper

基于 react-native-reanimated v2 react-native-gesture-handler 实现的一套轮播图组件，可自定义动画

## 安装

### yarn

```shell
yarn add react-native-reswiper react-native-reanimated react-native-gesture-handler
```

### npm

```shell
npm install react-native-reswiper react-native-reanimated react-native-gesture-handler --save
```

## 示例

```typescript jsx
import React from 'react';
import {
  View,
  Text,
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Button,
} from 'react-native';
import { Swiper, IndexIndicator } from 'react-native-reswiper';

const itemBuilder = (index: number) => {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: ['red', 'blue', 'green', 'pink', 'yellow'][index % 5],
      }}>
      <Text style={{ fontSize: 30 }}>{index}</Text>
    </View>
  );
};

const App = () => {
  const [index, setIndex] = React.useState(0);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <Button title="change" onPress={() => setIndex(index + 1)} />
        <Swiper
          lazy
          // horizontal={false}
          width={Dimensions.get('window').width}
          height={Dimensions.get('window').height}
          index={index}
          autoplay={false}
          onChange={setIndex}
          itemBuilder={itemBuilder}
          itemCount={800}>
          <SafeAreaView style={StyleSheet.absoluteFill} pointerEvents="none">
            <View style={{ flex: 1 }}>
              <IndexIndicator inset={-40} position="top" />
            </View>
          </SafeAreaView>
        </Swiper>
      </View>
    </SafeAreaView>
  );
};
```

## Props

### Swiper

#### horizontal?: boolean;

是否横向滚动，默认为 true

#### width?: number

轮播图的宽度 _horizontal 不是 false 时必传_

#### height?: number

轮播图的高度 _horizontal 是 false 时必传_

#### itemCount: number

_【必传】_ 轮播图的数量

#### itemBuilder: (index: number) => React.ReactNode;

_【必传】_ 一个函数，根据 index 返回每个轮播图

#### activeIndex?: number

处于活动状态的轮播图的下标，设置一个新的 activeIndex 会切换轮播图，默认为 0

#### onChange?: (nextIndex: number) => void;

切换轮播图时调用的回调

#### autoplay?: boolean;

是否自动轮播, 默认为 true

#### autoplayInterval?: number

自动轮播的间隔时间，默认 3000

#### loop?: boolean;

是否循环轮播，默认为 true

#### duration?: number

轮播动画时间，默认 300

#### easing?: Animated.EasingFunction

缓动函数，默认 cubicOut

#### enabled?: boolean;

是否开启手指滑动响应，默认为 true

#### slideSize?: number;

内侧轮播的宽度或者高度，当 slideSize 小于等于 1 的时候视为百分比，会乘上对应的宽度或者高度，大于 1 的时候直接使用设定的值

#### trackOffset?: number

内侧轮播的偏移量，当 trackOffset 小于等于 1 的时候视为百分比，会乘上对应的宽度或者高度，大于 1 的时候直接使用设定的值

#### maxRenderCount?: number (v1.2.0)
最多渲染几页，默认为5

#### lazy?: boolean (v1.3.0)
是否启用懒加载，默认不启用

#### lazyPlaceholder?: React.ReactNode (v1.3.0)
启用懒加载时的占位View

#### style?: StyleProp<ViewStyle>;


最外层 View 的样式

#### itemStyleInterpolator?: Interpolator

定义轮播的动画，默认为 interpolators.slide
可以通过传入此 prop 自定义动画

#### panProps?: PanGestureHandlerProps

传递给 PanGestureHandler 的 props， enabled onGestureEvent onHandlerStateChange 除外

##### 再加上 itemStyleInterpolator 自定义动画接收的配置

### ReactiveIndicator 
实时响应的一个指示器，在轮播图很多时不建议使用，会很卡

#### position?: 'top' | 'bottom' | 'start' | 'end';

指示器的位置，横向时默认是 bottom,竖向时默认是 end

#### style?: StyleProp<ViewStyle>;

最外层 View 的样式

#### itemStyleInterpolator?: Interpolator

定义指示器的动画，默认为 indicatorInterpolators.dot
可以通过传入此 prop 自定义动画

#### inset?: number | { top?: number; start?: number; end?: number; bottom?: number };  (v1.3.0)
指示器相对于容器得偏移量

#### horizontalLayout?: 'center' | 'start' | 'end';  (v1.3.0)
horizontal 为 true 时相当于设置 alignItems，为 false 时相当于设置 justifyContent

#### verticalLayout?: 'middle' | 'top' | 'bottom';  (v1.3.0)
horizontal 为 true 时相当于设置 justifyContent，为 false 时相当于设置 alignItems

##### 再加上 itemStyleInterpolator 自定义动画接收的配置



### IndexIndicator (v1.3.0)
一个文字指示器，在轮播图很多时建议使用

#### position?: 'top' | 'bottom' | 'start' | 'end';

指示器的位置，横向时默认是 bottom,竖向时默认是 end

#### style?: StyleProp<ViewStyle>;

最外层 View 的样式


#### inset?: number | { top?: number; start?: number; end?: number; bottom?: number };
指示器相对于容器得偏移量

#### horizontalLayout?: 'center' | 'start' | 'end';
horizontal 为 true 时相当于设置 alignItems，为 false 时相当于设置 justifyContent

#### verticalLayout?: 'middle' | 'top' | 'bottom'; 
horizontal 为 true 时相当于设置 justifyContent，为 false 时相当于设置 alignItems

#### indicatorStyle?: StyleProp<TextStyle>
指示器文字的样式
