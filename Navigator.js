import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import StartUpScreen from "./screens/StartUpScreen";
import ChatLobby from "./screens/ChatLobby";
import Login from "./screens/Login/Login";
import LoginWIthEmail from "./screens/Login/LoginWIthEmail";
import SignupWithEmail from "./screens/Login/SignupWithEmail";
import ForgotPword from "./screens/Login/ForgotPword";
import PasswordResetPrompt from "./screens/Login/ResetPwordPrompt";
import ResetPassword from "./screens/Login/ResetPword";
import Chat from "./screens/Chat";
import Profile from "./screens/Profile";
import Lobby2 from "./screens/Lobby2";

const Stack = createStackNavigator();

const Navigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="StartUpScreen"
    >
      <Stack.Screen name="StartUpScreen" component={StartUpScreen} />
      <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
      <Stack.Screen name="LoginWithEmail" component={LoginWIthEmail} options={{ headerShown: false }} />
      <Stack.Screen name="SignupWithEmail" component={SignupWithEmail} options={{ headerShown: false }} />
      <Stack.Screen name="ForgotPword" component={ForgotPword} options={{ headerShown: false }} />
      <Stack.Screen name="PasswordResetPrompt" component={PasswordResetPrompt} options={{ headerShown: false }} />
      <Stack.Screen name="ResetPassword" component={ResetPassword} options={{ headerShown: false }} />
      <Stack.Screen name="ChatLobby" component={ChatLobby} />
      <Stack.Screen name="Chat" component={Chat} options={{ headerShown: false }} />
      <Stack.Screen name="Profile" component={Profile} />
    </Stack.Navigator>
  );
};

export default Navigator;
