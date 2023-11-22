import React, { useCallback, useEffect, useState } from "react";
import { View, SafeAreaView, Text, TouchableOpacity, Image } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
import { addRecipientToRandomListIfNeeded, renderBubble, renderLoading, renderSend } from "../utils/ChatRender";
import BackBtn from "../utils/BackBtn";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, setDoc, doc } from "firebase/firestore";
import { db, realTimeDb } from "../firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { onDisconnect, ref, set } from "firebase/database";
import { fetchUserOnlineStatus } from "../utils/OnlineStatus";
import { Entypo } from "@expo/vector-icons";

const Chat = ({ route, navigation }) => {
  const { friendId, friendName, friendImage } = route.params;
  const [currentUserDetails, setcurrentUserDetails] = useState({});
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFriendOnline, setIsFriendOnline] = useState(true);
  const chatId = [currentUserDetails.uid, friendId].sort().join("_");

  useEffect(() => {
    (async () => {
      const currentUserData = await AsyncStorage.getItem("user");
      const currentUser = JSON.parse(currentUserData);
      setcurrentUserDetails(currentUser);
    })();
  }, []);

  useEffect(() => {
   const isOnline = fetchUserOnlineStatus(friendId)// Listen to friend's online status
  setIsFriendOnline(isOnline)
  }, [friendId])
  

  useEffect(() => {
    // Create a query to get messages
    const messagesRef = collection(db, `chats/${chatId}/messages`);
    const q = query(messagesRef, orderBy("createdAt", "desc"));
    // Subscribe to message updates
    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      const msgs = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        const createdAt = data.createdAt.toDate();
        return { _id: doc.id, ...data, createdAt };
      });
      setMessages(msgs);
      //addRecipientToRandomListIfNeeded(friendId,currentUserDetails.uid)
      // If there are new messages, update the chat details
      if (msgs.length > 0) {
        const lastMessage = msgs[0];
        const chatDetailsRef = doc(db, `chatDetails/${chatId}`);
        await setDoc(
          chatDetailsRef,
          {
            lastMessage: lastMessage.text,
            lastMessageTime: lastMessage.createdAt,
            recipient: lastMessage.recipient,
          },
          { merge: true }
        );
      }
    });

    return () => {
      unsubscribe();
    }; // Unsubscribe on unmount
  }, [chatId, realTimeDb, currentUserDetails, friendId]);

  const onSend = useCallback(
    (msgs = []) => {
      msgs.forEach((msg) => {
        // Add new message to Firestore
        const messagesRef = collection(db, `chats/${chatId}/messages`);
        addDoc(messagesRef, { ...msg, createdAt: new Date(), recipient: friendId });
      });
    },
    [chatId, friendId]
  );

console.log('isfriendonline',isFriendOnline);
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
              {Object.keys(friendImage || {}).length === 0 ?  (
                <View className=" bg-slate-400 w-12 h-12 justify-center items-center rounded-full">
                  <Entypo name="user" size={25} color="white" />
                </View>
              ) : (
                <Image source={{ uri: friendImage }} className="w-12 h-12 rounded-full" />
              )}
              {isFriendOnline && <View className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border border-white"></View>}
            </View>

            <Text className="text-xl font-semibold mx-3">{friendName}</Text>
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
            _id: currentUserDetails?.uid,
            name: currentUserDetails?.displayName,
            avatar: friendImage,
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default Chat;
