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
import { View, Text, I18nManager, SafeAreaView } from 'react-native';
import { Swiper } from './library/main';
import { DotIndicator } from './library/indicators/DotIndicator';

I18nManager.forceRTL(false);

const App = () => {
  const [index, setIndex] = React.useState(0);

  console.log(index);

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <Swiper
          // horizontal={false}
          // loop={false}
          index={index}
          onChange={setIndex}
          itemBuilder={(index) => {
            return (
              <View
                // ref={console.log}
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text style={{ fontSize: 30 }}>{index}</Text>
              </View>
            );
          }}
          itemCount={10}>
          <SafeAreaView style={{ marginTop: 200 }}>
            <DotIndicator position="top" />
          </SafeAreaView>
        </Swiper>
      </View>
      <Text
        style={{ fontSize: 30, marginBottom: 34 }}
        onPress={() => {
          setIndex(Math.floor(Math.random() * 10));
        }}>
        Change
      </Text>
    </View>
  );
};

export default App;
