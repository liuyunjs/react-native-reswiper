# react-native-reswiper

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
```javascript
import React from 'react';
import { View, Text, I18nManager, SafeAreaView } from 'react-native';
import { Swiper } from 'react-native-reswiper';
import { DotIndicator } from 'react-native-reswiper/dist/indicators/DotIndicator';


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
```
