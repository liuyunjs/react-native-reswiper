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
import { View, Text, Dimensions, SafeAreaView, StyleSheet } from 'react-native';
import { Swiper, Indicator } from './library/main';

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
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <Swiper
          width={Dimensions.get('window').width}
          height={Dimensions.get('window').height}
          index={index}
          onChange={setIndex}
          itemBuilder={itemBuilder}
          itemCount={8}>
          <SafeAreaView style={StyleSheet.absoluteFill} pointerEvents="none">
            <View style={{ flex: 1 }}>
              <Indicator activeColor="orange" gap={2} size={12} />
            </View>
          </SafeAreaView>
        </Swiper>
      </View>
    </View>
  );
};

export default App;
