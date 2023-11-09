import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, FlatList, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { handleDelete } from "../utils/DeleteFunc";
import { LogBox } from "react-native";
import Dice from "../utils/RollDiceAnime";
import { SwipeListView } from "react-native-swipe-list-view";

const Lobby2 = ({ navigation }) => {
  LogBox.ignoreLogs(["ViewPropTypes"]);
  const chats = [
    {
      id: "1",
      name: "Dora",
      lastMessage: "Hey there!",
      time: "2:30 PM",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREO17hg6KvLlweeZWN0LCEdi-OXM9qGpbQ9w&usqp=CAU",
      online: true,
    },
    {
      id: "2",
      name: "Aminu",
      lastMessage: "Hey there to you too nice to meet you",
      time: "6:30 PM",
      image: "https://a.storyblok.com/f/191576/1200x800/215e59568f/round_profil_picture_after_.webp",
      online: false,
    }, ];
  
 

  const [chatList, setChatList] = useState(chats);
  const [isMenuVisible, setMenuVisible] = useState(false);
  const toggleMenu = () => {
    setMenuVisible(!isMenuVisible);
  };

  const renderHiddenItem = ({ item }) => {
    return( // Added the return statement here
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity
          style={{
            marginVertical: 10,
            display:"flex",
            alignItems: 'center',
            justifyContent: 'center',
            width:60,
            height: 60,
            backgroundColor: 'red',
            shadowColor: '#000',
          }}
          onPress={() => {
            Alert.alert('Delete?', item.name);
          }}
        >
          <Text style={{ color: '#FFF',fontWeight:700}} >Delete</Text>
        </TouchableOpacity>
      </View>
    
 ) };
  


  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="py-3 flex-1">
        {/* header */}
        <View className="flex-row item-center border-b-2 pb-2 border-gray-300 justify-between shadow-md">
          <TouchableOpacity onPress={toggleMenu} className="pl-5">
            <Ionicons name="menu-outline" size={28} color="black" />
          </TouchableOpacity>
          <Text className="text-2xl font-semibold">Chats</Text>
          <TouchableOpacity className="mr-5" onPress={() => {}}>
            <Dice />
          </TouchableOpacity>
        </View>
        <View className="flex-row items-center px-5">
          <TextInput className="flex-1 my-2 p-3 rounded-lg pl-8 bg-gray-200" placeholderTextColor="#636363" placeholder="Search" />
          <Text className="absolute left-8">
            <Ionicons name="search" size={16} color="gray" />
          </Text>
        </View>

        {/* chat */}
        {chats.length === 0 ? (
          <View className="flex flex-1 items-center justify-center">
            <FontAwesome5 name="dice" size={55} color="gray" />
            <Text className="text-xl text-gray-400">Click the dice to generate new chats</Text>
          </View>
        ) : (
          <SwipeListView
            data={chats}
            renderItem={({ item }) => (
              <TouchableOpacity
                className="flex-row items-center py-3 border-b border-gray-200 px-5"
                onPress={() => {
                  navigation.navigate("Chat",{chatId : item.id});
                }}
              >
                <View className="relative">
                  <Image source={{ uri: item.image }} className="w-12 h-12 rounded-full" />
                  {item.online && <View className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border border-white"></View>}
                </View>
                <View className="flex-1 ml-3">
                  <Text className="font-medium">{item.name}</Text>
                  <Text className="text-gray-600 truncate">{item.lastMessage}</Text>
                </View>
                <Text className="text-gray-500">{item.time}</Text>
              </TouchableOpacity>
            )}
            renderHiddenItem={renderHiddenItem}
            rightOpenValue={-75}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default Lobby2;
