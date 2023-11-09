import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { FontAwesome5 } from "@expo/vector-icons";

const Dice = () => {
  const [rotation, setRotation] = useState(new Animated.Value(0));
  const [number, setNumber] = useState(1);

  const RollDice = () => {
    // Generate a random number between 1 and 6
    const newNumber = Math.floor(Math.random() * 6) + 1;
    setNumber(newNumber);

    // Rotate animation
    Animated.timing(rotation, {
      toValue: 180,
      duration: 1000,
      useNativeDriver: true, // for better performance
    }).start(() => {
      // Reset rotation
      setRotation(new Animated.Value(0));
    });
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Animated.View
        style={{
          transform: [{ rotate: rotation.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '306deg'],
          }) }],
        }}
      >
          <FontAwesome5 name="dice" size={28} color="black" onPress={RollDice}/>
      </Animated.View>
    </View>
  );
};

export default Dice;
