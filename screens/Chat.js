import React, { useEffect, useState } from "react";
import { View, SafeAreaView, Text, TouchableOpacity, Image } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
import { renderBubble, renderLoading, renderSend } from "../utils/ChatRender";
import BackBtn from "../utils/BackBtn";

const Chat = ({ navigation }) => {
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
    },
  ];
  const currentUser = {
    email: "me@you.com",
    displayName: "Dora",
    photoURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREO17hg6KvLlweeZWN0LCEdi-OXM9qGpbQ9w&usqp=CAU",
  };
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setMessages([
      {
        _id: "you",
        text: "Hi there",
        createdAt: new Date(),
        user: {
          _id: currentUser?.email,
          name: currentUser?.displayName,
          avatar: currentUser?.photoURL,
        },
        // Mark the message as sent, using one tick
        sent: true,
        // Mark the message as received, using two tick
        received: true,
        // Mark the message as pending with a clock loader
        pending: false,
        isTyping: true,
      },
    ]);
  }, []);

  const onSend = (newMessages = []) => {
    setMessages((previousMessages) => GiftedChat.append(previousMessages, newMessages));
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 p-2">
        <View className="flex-row item-center border-b-0 pb-2 border-gray-300 shadow-md">
          <View className="flex-row items-center">
            <BackBtn
              onPress={() => {
                navigation.goBack();
              }}
            />
            <View className="ml-5">
              <Image source={{ uri: chats[0].image }} className="w-12 h-12 rounded-full" />
              {chats[0].online && <View className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border border-white"></View>}
            </View>

            <Text className="text-xl font-semibold mx-3">{"Dora Light"}</Text>
          </View>
        </View>
        <GiftedChat
          messages={messages}
          showAvatarForEveryMessage={true}
          onSend={(newMessages) => onSend(newMessages)}
          renderSend={renderSend}
          renderBubble={renderBubble}
          renderLoading={renderLoading}
        isLoadingEarlier={loading}
          user={{
            _id: "me",
            name: "Archer",
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default Chat;
