/* eslint-disable eslint-comments/no-unused-disable */
/* eslint-disable eslint-comments/no-unused-disable */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/self-closing-comp */
/* eslint-disable @typescript-eslint/no-unused-vars */

import {View, Text, FlatList} from 'react-native';
import React from 'react';
import {ScrollView} from 'react-native-gesture-handler';
import {IOScrollView, InView} from 'react-native-intersection-observer';
export default function App() {
  const [state, setState] = React.useState(false);
  const [todos, setTodos] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  React.useEffect(() => {
    if (state) {
      fetch('https://jsonplaceholder.typicode.com/todos', {
        method: 'get',
      })
        .then(results => results.json())
        .then(setTodos);
    }
  }, [state]);
  function Item(props: {value: string}) {
    return (
      <View
        style={{
          width: '100%',
          marginVertical: 8,
          backgroundColor: '#e2c8d4',
          alignSelf: 'center',
        }}>
        <Text style={{textAlign: 'center', fontStyle: 'italic', fontSize: 18}}>
          {props?.value}
        </Text>
      </View>
    );
  }
  return (
    <View style={{flex: 1, backgroundColor: 'orange'}}>
      <IOScrollView>
        {new Array(100).fill('').map((item, index) => (
          <Item key={index} value={`Value is ${index + 1}`} />
        ))}
        <InView
          onChange={inView => setState(inView)}
          children={() => {
            // if (state) {
            //   return <View style={{width: '100%', height: 60}}></View>;
            // }
            return (
              <View
                style={{
                  width: '100%',
                  height: 60,
                  backgroundColor: state ? 'red' : 'green',
                  bottom: 0,
                  position: !state ? 'absolute' : undefined,
                  zIndex: 10,
                }}>
                <Text>H</Text>
              </View>
            );
          }}
        />

        <FlatList
          data={todos}
          horizontal
          ItemSeparatorComponent={() => (
            <View style={{width: 10, backgroundColor: '#FFF'}} />
          )}
          renderItem={() => {
            return (
              <View
                style={{
                  height: 200,
                  width: 200,
                  backgroundColor: 'orange',
                }}></View>
            );
          }}
        />
      </IOScrollView>
      {state || (
        <InView
          as={View}
          style={{
            width: '100%',
            height: 60,
            backgroundColor: 'green',
            bottom: 0,
            position: 'absolute',
            zIndex: 10,
          }}>
          <Text>H</Text>
        </InView>
      )}
    </View>
  );
}
