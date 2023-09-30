import { View, Text, SafeAreaView } from "react-native";
import React, { useEffect, useRef } from "react";
import { useNavigation } from "@react-navigation/core";
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';

const StartUpScreen = () => {
  const navigation = useNavigation();
  const textRef = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      navigation.navigate('Home'); // Navigate to your main app screen
    }, 3000); // Display the logo for 4 seconds
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-green-500">
      <View className=" flex-1 items-center justify-center">
      {/* makes an animated bounce for 3secs */}
      <Animatable.View animation="bounce" duration={2000} >
           <Ionicons name="ios-chatbubbles" size={94} color="white" />
           <Text className="text-lg font-bold text-white">MeetPeople</Text> 
      </Animatable.View>
       
      </View>
    </SafeAreaView>
  );
};

export default StartUpScreen;
