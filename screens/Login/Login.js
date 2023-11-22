import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { FontAwesome5 } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Google from "expo-auth-session/providers/google";
//import * as Facebook from "expo-auth-session/providers/facebook";
import { ANDROID_CLIENT_ID, IOS_CLIENT_ID, WEB_CLIENT_ID, FB_APP_ID } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as WebBrowser from "expo-web-browser";
import { GoogleAuthProvider, signInWithCredential, onAuthStateChanged, signInWithPopup, FacebookAuthProvider } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { ResponseType } from "expo-auth-session";
import { createUserProfile } from "./firebaseFunc";

const Login = ({ navigation }) => {
  WebBrowser.maybeCompleteAuthSession();
  //hook to set user
  const [userInfo, setUserInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  //client IDs from .env
  const config = {
    responseType: ResponseType.IdToken,
    androidClientId: ANDROID_CLIENT_ID,
    iosClientId: IOS_CLIENT_ID,
    webClientId: WEB_CLIENT_ID,
  };

  // const fbConfig = {
  //   clientid: FB_APP_ID,
  //   responseType: 'token',
  // };
  //request - An instance of AuthRequest that can be used to prompt the user for authorization. This will be null until the auth request has finished loading.
  //response - This is null until promptAsync has been invoked. Once fulfilled it will return information about the authorization.
  //promptAsync - When invoked, a web browser will open up and prompt the user for authentication. Accepts an AuthRequestPromptOptions object with options about how the prompt will execute.
  const [request, response, promptAsync] = Google.useAuthRequest(config);
  //const [fbRequest, fbResponse, fbPromptAsync] = Facebook.useAuthRequest(fbConfig);

  const localUser = () => {
    AsyncStorage.getItem("user")
      .then((userJSON) => {
        setLoading(true);
        if (userJSON) {
          setUserInfo(JSON.parse(userJSON));
          console.log("localuser", JSON.parse(userJSON));
        } else return null;
      })
      .catch((error) => {
        setError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    localUser();

    // This function will set up the listener for the auth state
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserInfo(user);
          // Check if the user profile exists in Firestore
      const userProfileRef = doc(db, "users", user.uid);
      const userProfileSnap = await getDoc(userProfileRef);
      if (!userProfileSnap.exists()) {
        // If the profile doesn't exist, create it 
        await createUserProfile(user);
      }
        await AsyncStorage.setItem("user", JSON.stringify(user));
        navigation.navigate("ChatLobby");
        console.log("user", JSON.stringify(user));
      } else {
        setUserInfo(null);
        await AsyncStorage.removeItem("user");
        console.log("user", "user not authenticated");
      }
      setLoading(false);
    });

    // Return the cleanup function to be called when the component unmounts
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (response?.type == "success") {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential);
    }
  }, [response]);

  const signInWithGoogle = async () => {
    setLoading(true);
    await promptAsync()
      .then(() => {
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
      });
  };

  // useEffect(() => {
  //   if (fbResponse?.type == "success") {
  //     const { access_token  } = fbResponse.params;
  //     console.log("token", fbResponse);
  //     const credential = GoogleAuthProvider.credential(access_token );
  //     signInWithCredential(auth, credential);
  //   }
  // }, [fbResponse]);

  // const signInWithFacebook = async () => {
  //   setLoading(true);
  //   await fbPromptAsync()
  //     .then(() => {
  //       setLoading(false);
  //     })
  //     .catch((error) => {
  //       setError(error);
  //     });

  // };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 justify-center items-center px-10">
        <Text className="text-2xl font-bold mb-10">Welcome</Text>

        {/* Sign in with Email */}
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("LoginWithEmail");
          }}
          className="bg-green-500 w-full mb-4 py-4 rounded-3xl flex-row justify-center items-center px-5"
        >
          <Text className="text-white font-medium text-center">Continue with email</Text>
        </TouchableOpacity>

        <View className="bor">
          <Text className="text-gray-400 mb-6">OR</Text>
        </View>

        {/* Other Sign in options */}
        <TouchableOpacity className="w-full mb-4 py-4 bg-transparent border rounded-3xl flex-row justify-between items-center px-5" onPress={() => signInWithGoogle()}>
          <Image source={require("../../assets/google-svg.png")} style={{ width: 20, height: 20 }} />
          <Text className="font-medium flex-1 text-center ">Continue with Google</Text>
        </TouchableOpacity>

        {/* <TouchableOpacity className="w-full mb-4 py-4 bg-transparent border rounded-3xl flex-row justify-between items-center px-5" onPress={() => signInWithFacebook()}>
          <FontAwesome5 name="facebook" size={20} color="blue" />
          <Text className="font-medium flex-1 text-center ">Continue with Facebook</Text>
        </TouchableOpacity> */}
      </View>
    </SafeAreaView>
  );
};

export default Login;
