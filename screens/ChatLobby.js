import React, { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, FlatList, Image, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import Swipeout from "react-native-swipeout";
import { handleDelete } from "../utils/DeleteFunc";
import { LogBox } from "react-native";
import Dice from "../utils/RollDiceAnime";
import Dropdown from "../utils/DropDown";
import { auth, db, realTimeDb } from "../firebaseConfig";
import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { Logout } from "./Login/Logout";
import { signOut } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { format } from "date-fns";
import { useFocusEffect } from "@react-navigation/native";
import { Entypo } from "@expo/vector-icons";
import { fetchUserOnlineStatus, setUserOnlineStatus } from "../utils/OnlineStatus";

const ChatLobby = ({ navigation }) => {
  LogBox.ignoreLogs(["ViewPropTypes"]);

  const [userChatList, setUserChatList] = useState([]);
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState('');
  const [error, setError] = useState("");
  const toggleMenu = () => {
    setMenuVisible(!isMenuVisible);
  };
useEffect(() => {
const getCurrentId = async () => {
    const currentUserData = await AsyncStorage.getItem("user");
    const currentUser = JSON.parse(currentUserData);
    const userId = currentUser ? currentUser.uid : null;
    setCurrentUserId(userId);
  };
  getCurrentId();
  return () => {
    setCurrentUserId('')
  }
}, [])

  

  useFocusEffect(
    useCallback(() => {
      (async () => {
        setLoading(true);
        try {
          if (currentUserId) {
            const docRef = doc(db, "userRandomList", currentUserId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              const users = docSnap.data().users;
              if (users && users.length > 0) {
                await fetchChatDetailsAndUserInfo(users);
              } else {
                console.log("User list is empty");
                setUserChatList([]);
              }
            }
          } else {
            console.log("No current user ID found");
          }
        } catch (error) {
          setError(error.message || "Error fetching data");
        } finally {
          setLoading(false);
        }
      })();
      return () => {
        console.log("ChatLobby is unmounting");
        setUserChatList([]);
      };
    }, [])
  );

  useEffect(() => {
    setUserOnlineStatus(currentUserId);
  }, [currentUserId])
  

  const fetchChatDetailsAndUserInfo = async (userList) => {
    const userDetailsList = [];
    setLoading(true);

    for (const user of userList) {
      try {
        //fetch online status
        const isOnline = fetchUserOnlineStatus(user.id);
        console.log(`${user.name} is online:`,isOnline);
        //fetch chat details
        const chatId = [currentUserId, user.id].sort().join("_");
        const chatRef = doc(db, `chatDetails/${chatId}`);
        const chatSnap = await getDoc(chatRef);
        // Fetch user details, including image URL
        const userRef = doc(db, "users", user.id);
        const userSnap = await getDoc(userRef);
        const userData = userSnap.exists() ? userSnap.data() : {};

        let userDetails = { ...user, lastMessage: "", lastMessageTime: "", image: userData.displayImage || "", online: isOnline };
        if (chatSnap.exists()) {
          const chatData = chatSnap.data();
          userDetails = {
            ...userDetails,
            lastMessage: chatData.lastMessage || "",
            lastMessageTime: chatData.lastMessageTime ? chatData.lastMessageTime.toDate().toISOString() : "",
          };
        }
        userDetailsList.push(userDetails);
      } catch (error) {
        console.error(`Error processing user ${user.name}: `, error);
      }
    }

    setLoading(false);
    setUserChatList(userDetailsList); // Update local state
    await updateRandomUsersList(userDetailsList, currentUserId); // Update Firestore
  };

  const updateRandomUsersList = async (usersList, currentUserId) => {
    setLoading(true);
    if (!currentUserId) {
      console.error("No current user ID available");
      return;
    }
    const listRef = doc(db, "userRandomList", currentUserId);
    try {
      await setDoc(listRef, { users: usersList });
      console.log("Random users list updated in database");
    } catch (error) {
      console.error("Error updating random users list: ", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRandomUser = async () => {
    let users;
    const usersFromStore = collection(db, "users");
    try {
      const userList = await getDocs(usersFromStore);
      const filteredUsers = userList.docs.filter((doc) => doc.id !== currentUserId && !userChatList.some((user) => user.id === doc.id));
      if (filteredUsers.length === 0) return null;
      const randomIndex = Math.floor(Math.random() * filteredUsers.length);
      const randomDoc = filteredUsers[randomIndex];
      let userData = randomDoc.data();
      users = {
        id: randomDoc.id,
        name: userData.displayName,
        image: userData.displayImage,
      };
    } catch (error) {
      console.error("Error fetching users: ", error);
    }
    setUserChatList((prevUser) => [...prevUser, users]);
    if (userChatList.length > 0) {
      await updateRandomUsersList([...userChatList, users], currentUserId);
    }
  };

  console.log("chatUsersList", currentUserId);
  return (
    <SafeAreaView className="flex-1 bg-white">
      {isLoading ? (
        <ActivityIndicator size="large" color="#2ace06" className="flex-1 justify-center" />
      ) : (
        <View className="py-3 flex-1">
          {/* header */}
          <View className="flex-row item-center border-b-2 pb-2 border-gray-300 justify-between shadow-md">
            <View>
              <TouchableOpacity onPress={toggleMenu} className="pl-5">
                <Ionicons name="menu-outline" size={28} color="black" />
              </TouchableOpacity>
              <Dropdown
                setIsOpen={setMenuVisible}
                isOpen={isMenuVisible}
                list={[
                  { name: "Profile", navigate: "Profile" },
                  { name: "Logout", navigate: "Login" },
                ]}
                navigation={navigation}
                func={() => Logout(signOut, auth, setLoading, setError, AsyncStorage)}
              />
            </View>
            <Text className="text-2xl font-semibold">Chats</Text>
            <View className="mr-5 px-3 ">
              <Dice
                onDiceRoll={() => {
                  fetchRandomUser();
                }}
              />
            </View>
          </View>

          <View className="flex-row items-center px-5">
            <TextInput className="flex-1 my-2 p-3 rounded-lg pl-8 bg-gray-200" placeholderTextColor="#636363" placeholder="Search" />
            <Text className="absolute left-8">
              <Ionicons name="search" size={16} color="gray" />
            </Text>
          </View>

          {/* chat */}
          {userChatList?.length === 0 ? (
            <View className="flex flex-1 items-center justify-center">
              <FontAwesome5 name="dice" size={55} color="gray" />
              <Text className="text-xl text-gray-400">Click the dice to generate new chats</Text>
            </View>
          ) : (
            <FlatList
              data={userChatList}
              renderItem={({ item }) => {
                const swipeoutBtns = [
                  {
                    text: "Delete",
                    backgroundColor: "red",
                    onPress: () => handleDelete(item.id, userChatList, setUserChatList),
                  },
                ];
                return (
                  <Swipeout right={swipeoutBtns} backgroundColor="white">
                    <TouchableOpacity
                      className="flex-row items-center py-3 border-b border-gray-200 px-5"
                      onPress={() => {
                        navigation.navigate("Chat", { friendId: item.id, friendName: item.name, friendImage: item.image || {} });
                      }}
                    >
                      <View className="relative">
                        {!item.image ? (
                          <View className=" bg-slate-400 w-12 h-12 justify-center items-center rounded-full">
                            <Entypo name="user" size={25} color="white" />
                          </View>
                        ) : (
                          <Image source={{ uri: item.image || {} }} className="w-12 h-12 rounded-full" />
                        )}
                        {item.online && <View className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border border-white"></View>}
                      </View>
                      <View className="flex-1 ml-3">
                        <Text className="font-medium">{item.name}</Text>
                        <Text className="text-gray-600 truncate">{item.lastMessage}</Text>
                      </View>
                      <Text className="text-gray-500">{item.lastMessageTime ? format(new Date(item.lastMessageTime), "hh:mm a") : ""}</Text>
                    </TouchableOpacity>
                  </Swipeout>
                );
              }}
              keyExtractor={(item) => item.id}
            />
          )}
        </View>
      )}
    </SafeAreaView>
  );
};

export default ChatLobby;
