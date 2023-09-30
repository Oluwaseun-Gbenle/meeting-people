import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import StartUpScreen from "./screens/StartUpScreen";
import Home from "./screens/Home";
import Login from "./screens/Login";

const Stack = createStackNavigator();

const Navigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="StartUpScreen"
    >
      <Stack.Screen name="StartUpScreen" component={StartUpScreen}/>
      <Stack.Screen name="Home" component={Home}/>
      <Stack.Screen name="Login" component={Login}/>
    </Stack.Navigator>
  );
};

export default Navigator;
