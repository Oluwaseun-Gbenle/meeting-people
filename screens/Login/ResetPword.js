import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, SafeAreaView } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { Feather } from "@expo/vector-icons";
import BackBtn from "../../utils/BackBtn";

const ResetPassword = ({ navigation }) => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Text className="mx-3 mt-3">
        <BackBtn
          onPress={() => {
            navigation.goBack();
          }}
        />
      </Text>
      <View className="flex-1 bg-white justify-center p-4">
        <Text className="text-xl font-bold mb-4 text-center">Set New Password</Text>

        <View className="p-2 flex-row items-center border rounded-3xl w-full py-4 mb-5 border-gray-400 px-4 ">
          <TextInput className="flex-1" placeholder="Password" secureTextEntry={!passwordVisible} />
          <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
            <FontAwesome name={passwordVisible ? "eye" : "eye-slash"} size={20} />
          </TouchableOpacity>
        </View>

        <View className="p-2 flex-row items-center border rounded-3xl w-full py-4 mb-5 border-gray-400 px-4 ">
          <TextInput className="flex-1" placeholder="Confirm Password" secureTextEntry={!confirmPasswordVisible} />
          <TouchableOpacity onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}>
            <FontAwesome name={confirmPasswordVisible ? "eye" : "eye-slash"} size={20} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity className="bg-green-600 w-full py-4 rounded-3xl mb-5">
          <Text className="text-white font-medium text-center">Submit</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text className="text-center text-green-600">Return to Sign In</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ResetPassword;
