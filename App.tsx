/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import {
  Swiper,
  IndexIndicator,
  DefaultIndicator,
  ReactiveIndicator,
} from './library/main';

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
    <Swiper
      // lazy
      // horizontal={false}
      width={300}
      // width={Dimensions.get('window').width}
      // height={Dimensions.get('window').height}
      activeIndex={index}
      // loop={false}
      // autoplay={false}
      onChange={setIndex}
      itemBuilder={itemBuilder}
      maxRenderCount={4}
      itemCount={3}>
      <DefaultIndicator
        type="dot"
        // verticalLayout="middle"
        inset={{ bottom: 44, top: 64, end: 20, start: 20 }}
        position="start"
      />
    </Swiper>
  );
};

export default App;
