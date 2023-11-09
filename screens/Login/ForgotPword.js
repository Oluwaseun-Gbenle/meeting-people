import { View, Text, TextInput, TouchableOpacity, SafeAreaView } from "react-native";
import React from "react";
import BackBtn from "../../utils/BackBtn";

const ForgotPword = ({ navigation }) => {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <Text className="mx-3 mt-3">
        <BackBtn
          onPress={() => {
            navigation.goBack();
          }}
        />
      </Text>
      <View className="flex-1 justify-center items-center bg-white px-10">
        <Text className="text-2xl font-bold mb-1 text-center">Forgot Password</Text>
        <Text className="text-center mb-8">Reset instructions will be sent to your mailbox</Text>
        <TextInput placeholder="Email" keyboardType="email-address" className=" border rounded-3xl w-full py-4 mb-5 border-gray-400 px-4 " />

        <TouchableOpacity
          className="bg-green-600 w-full py-4 rounded-3xl mb-5"
          onPress={() => {
            navigation.navigate("PasswordResetPrompt");
          }}
        >
          <Text className="text-white font-medium text-center">Reset</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ForgotPword;
