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
import { View, Text, Dimensions, Button, StyleSheet } from 'react-native';
import {
  Swiper,
  IndexIndicator,
  interpolators,
  ReactiveIndicator,
  DefaultIndicator,
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

  // console.log(index);

  return (
    <>
      <View style={{ marginTop: 44 }}>
        <Button onPress={() => setIndex(index + 1)} title="change index" />
      </View>
      <Swiper<typeof interpolators.slideScale>
        style={{ height: 200 }}
        itemStyleInterpolator={interpolators.slideScale}
        lazy={false}
        inactiveScale={0.9}
        activeScale={1}
        trackOffset={0.08}
        slideSize={0.84}
        // horizontal={false}
        width={Dimensions.get('window').width}
        // height={Dimensions.get('window').height}
        activeIndex={index}
        // loop={false}
        autoplay={false}
        onChange={setIndex}
        itemBuilder={itemBuilder}
        // maxRenderCount={4}
        itemCount={8}>
        <DefaultIndicator activeColor="#000" type="dot" inset={8} />
        {/*<ReactiveIndicator activeColor="#f00" inset={8} />*/}
        {/*<IndexIndicator*/}
        {/*  verticalLayout="top"*/}
        {/*  inset={8}*/}
        {/*  // inset={{ bottom: 44, top: 64, end: 20, start: 20 }}*/}
        {/*  position="start"*/}
        {/*/>*/}
      </Swiper>
    </>
  );
};

export default App;
