import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, SafeAreaView } from "react-native";
import { Entypo } from "@expo/vector-icons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import BackBtn from "../../utils/BackBtn";
import { signUpUser } from "./firebaseFunc";
import { Formik } from "formik";
import * as Yup from "yup";
import { ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SignupWithEmail = ({ navigation }) => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const validationSchema = Yup.object().shape({
    userName: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .required("Password is required")
      .matches(/^(?=.*\d)[A-Za-z\d]{8,}$/, "Password must be at least 8 characters long and include at least one number."),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm password is required"),
    agreement: Yup.boolean().oneOf([true], "To continue please agree to the terms and conditions"),
  });
  AsyncStorage.removeItem("user");

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Text className="mx-3 mt-3">
        <BackBtn
          onPress={() => {
            navigation.goBack();
          }}
        />
      </Text>

      {isLoading ? (
        <ActivityIndicator size="large" color="#2ace06" className="flex-1 justify-center" />
      ) : (
        <Formik
          initialValues={{ userName: "", email: "", password: "", confirmPassword: "", agreement: false }}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            signUpUser(values.userName, values.email, values.password, navigation, setIsLoading);
          }}
        >
          {({ handleSubmit, values, errors, touched, setFieldValue }) => (
            <View className="flex-1 bg-white p-6 justify-center">
              <Text className="text-2xl font-bold text-center mb-8">Sign Up</Text>
              {touched.userName && errors.userName && <Text className="text-red-500 pb-2">{errors.userName}</Text>}

              {/* Name Input */}
              <TextInput placeholder="Username" value={values.userName} onChangeText={(text) => setFieldValue("userName", text)} className="border border-gray-400 rounded-3xl p-4 mb-4" />

              {/* Email Address Input */}
              {touched.email && errors.email && <Text className="text-red-500 pb-2">{errors.email}</Text>}
              <TextInput placeholder="Email Address" value={values.email} onChangeText={(text) => setFieldValue("email", text)} className="border border-gray-400 rounded-3xl p-4 mb-4" />

              {/* Password Input */}
              {touched.password && errors.password && <Text className="text-red-500 pb-2">{errors.password}</Text>}
              <View className="p-2 flex-row items-center border rounded-3xl w-full py-4 mb-5 border-gray-400 px-4 ">
                <TextInput className="flex-1" placeholder="Password" value={values.password} onChangeText={(text) => setFieldValue("password", text)} secureTextEntry={!passwordVisible} />
                <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
                  <FontAwesome name={passwordVisible ? "eye" : "eye-slash"} size={20} />
                </TouchableOpacity>
              </View>

              {touched.confirmPassword && errors.confirmPassword && <Text className="text-red-500 pb-2">{errors.confirmPassword}</Text>}
              <View className="p-2 flex-row items-center border rounded-3xl w-full py-4 mb-5 border-gray-400 px-4 ">
                <TextInput
                  className="flex-1"
                  placeholder="Confirm Password"
                  value={values.confirmPassword}
                  onChangeText={(text) => setFieldValue("confirmPassword", text)}
                  secureTextEntry={!confirmPasswordVisible}
                />
                <TouchableOpacity onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}>
                  <FontAwesome name={confirmPasswordVisible ? "eye" : "eye-slash"} size={20} />
                </TouchableOpacity>
              </View>

              {/* Agreement Policy Checkbox */}
              {touched.agreement && errors.agreement && <Text className="text-red-500 pb-2">{errors.agreement}</Text>}
              <TouchableOpacity className="flex-row items-center mb-4 ml-2" onPress={() => setFieldValue("agreement", !values.agreement)}>
                <View className={`w-4 h-4 border rounded ${values.agreement ? "bg-green-500" : "bg-white"}`}>{values.agreement && <Entypo name="check" size={14} color="white" />}</View>
                <Text className="ml-2 text-xs">
                  I agree to the
                  <Text className="text-green-600"> Terms & Conditions</Text> and
                  <Text className="text-green-600"> Privacy Policy</Text>
                </Text>
              </TouchableOpacity>

              {/* Sign Up Button */}
              <TouchableOpacity className="bg-green-500 py-4 rounded-3xl mb-4" onPress={() => handleSubmit()}>
                <Text className="text-white text-center font-bold">Sign Up</Text>
              </TouchableOpacity>

              {/* Navigation to Sign In Page */}
              <View className="flex-row justify-center items-center">
                <Text>Already have an account?</Text>
                <TouchableOpacity onPress={() => navigation.navigate("LoginWithEmail")}>
                  <Text className="text-green-500 ml-2">Sign In</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </Formik>
      )}
    </SafeAreaView>
  );
};

export default SignupWithEmail;
