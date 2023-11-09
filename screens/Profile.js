import { View, Text, TouchableOpacity, SafeAreaView, Image } from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import FullImgModal from "../utils/FulImageModal";
import { signOut } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Profile = () => {
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const toggleMenu = () => {
    setMenuVisible(!isMenuVisible);
  };

  const logout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      await navigation.navigate("Login");
    } catch (error) {
      setError(error);
    } finally {
      await AsyncStorage.removeItem("user");
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="py-3 flex-1">
        {/* header */}
        {modalVisible && <FullImgModal modalVisible={modalVisible}
         setModalVisible={setModalVisible} 
         image={"https://a.storyblok.com/f/191576/1200x800/215e59568f/round_profil_picture_after_.webp"} />}
        <View className="flex-row item-center border-b-2 pb-2 border-gray-300 shadow-md">
          <TouchableOpacity onPress={toggleMenu} className="ml-4">
            <Ionicons name="menu-outline" size={28} color="black" />
          </TouchableOpacity>
          <View className="flex-1 items-center">
            <Text className="text-2xl font-semibold -ml-10">Profile</Text>
          </View>
        </View>
        <View className="flex-1 items-center m-5">
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Image source={{ uri: "https://a.storyblok.com/f/191576/1200x800/215e59568f/round_profil_picture_after_.webp" }} 
            className="w-36 h-36 rounded-full"  />
          </TouchableOpacity>
          <Text className="mt-2 text-xl ">Archer Philips</Text>
          <TouchableOpacity
            className="bg-slate-300 w-full py-3 rounded-3xl m-8"
            onPress={() => {
              logout();
            }}
          >
            <Text className="text-gray font-medium text-center">Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Profile;
