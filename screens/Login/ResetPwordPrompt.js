import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

const PasswordResetPrompt = ({ navigation }) => {
  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Text className="text-2xl font-bold mb-1 text-center">
        Password Reset
      </Text>
      <Text className="text-center mb-8">
        Check your email for password reset instructions
      </Text>
      <TouchableOpacity
        onPress={() => navigation.navigate('LoginWithEmail')}
        className="bg-green-600  py-4 rounded-3xl mb-5 w-10/12"
      >
        <Text className="text-white font-medium text-center">
          Back to Sign In
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default PasswordResetPrompt;
