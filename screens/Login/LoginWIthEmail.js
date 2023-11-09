import { View, Text, TextInput, TouchableOpacity, SafeAreaView } from "react-native";
import React, { useState } from "react";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import BackBtn from "../../utils/BackBtn";
import { Formik } from "formik";
import * as Yup from "yup";
import { LogInUser } from "./firebaseFunc";
import { ActivityIndicator } from "react-native";

const LoginWIthEmail = ({ navigation }) => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .required("Password is required")
      .matches(/^(?=.*\d)[A-Za-z\d]{8,}$/, "Password must be at least 8 characters long and include at least one number."),
  });
  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* header */}
      <Text className="mx-3 mt-3">
        <BackBtn
          onPress={() => {
            navigation.goBack();
          }}
        />
      </Text>

      {/* form */}
      {isLoading ? (
        <ActivityIndicator size="large" color="#2ace06" className="flex-1 justify-center" />
      ) : (
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            LogInUser(values.email, values.password, navigation, setIsLoading);
          }}
        >
          {({ handleSubmit, values, errors, touched, setFieldValue }) => (
            <View className="flex-1 justify-center items-center bg-white px-10">
              <Text className="text-2xl font-bold mb-8 text-center">Sign In</Text>
              {touched.email && errors.email && <Text className="text-red-500 pb-2">{errors.email}</Text>}
              <TextInput
                placeholder="Email"
                value={values.email}
                onChangeText={(text) => setFieldValue("email", text)}
                keyboardType="email-address"
                className=" border rounded-3xl w-full py-4 mb-5 border-gray-400 px-4 "
              />
              <View className="p-2 flex-row items-center border rounded-3xl w-full py-4 mb-5 border-gray-400 px-4 ">
                <TextInput className="flex-1" placeholder="Password" value={values.password} onChangeText={(text) => setFieldValue("password", text)} secureTextEntry={!passwordVisible} />
                <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
                  <FontAwesome name={passwordVisible ? "eye" : "eye-slash"} size={20} />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                className="bg-green-600 w-full py-4 rounded-3xl mb-5"
                onPress={() => {
                  handleSubmit()
                }}
              >
                <Text className="text-white font-medium text-center">Sign in</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="mb-5"
                onPress={() => {
                  navigation.navigate("ForgotPword");
                }}
              >
                <Text className="text-green-500 text-center">Forgot Password?</Text>
              </TouchableOpacity>
              <View className="items-center flex-row">
                <Text className="text-gray-600">Don't have an account? </Text>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("SignupWithEmail");
                  }}
                >
                  <Text className="text-green-500"> Sign Up</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </Formik>
      )}
    </SafeAreaView>
  );
};

export default LoginWIthEmail;
