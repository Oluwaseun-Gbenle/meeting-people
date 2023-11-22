import { View, Text, TouchableOpacity, SafeAreaView, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import FullImgModal from "../utils/FulImageModal";
import { signOut } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { Logout } from "./Login/Logout";
import { Entypo, Feather } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import { db, storage } from "../firebaseConfig";
import { doc, getDoc, getFirestore, updateDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';


const Profile = () => {
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentUserDetails, setcurrentUserDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigation = useNavigation();
  const [imgUrl, setImgUrl] = useState(null)
  const [userDetails, setUserDetails] = useState({})

  useEffect(() => {
    (async () => {
      const currentUserData = await AsyncStorage.getItem("user");
      const currentUser = JSON.parse(currentUserData);
      setcurrentUserDetails(currentUser);
    })();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userRef = doc(db, 'users', currentUserDetails.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          setImgUrl(userData.displayImage);
          setUserDetails(userData);
        } else {
          console.log("No such user!");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
  
    fetchUserData();
  
    return () => {
      setImgUrl(null);
    };
  }, [currentUserDetails]);
  

  const toggleMenu = () => {
    setMenuVisible(!isMenuVisible);
  };

  const requestPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return false;
    }
    return true;
  };

  const pickImage = async () => {
    const hasPermission = await requestPermission();
    if (!hasPermission) return;
  
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
  
    if (!result.canceled) {
      uploadImage(result.uri);
    }
  };

  const uploadImage = async (uri) => {
    const currentUserId = currentUserDetails.uid;
    const fileName = `profile_${currentUserId}`;
    const storage = getStorage();
    const reference = ref(storage, fileName);
    try {
      // Convert the local file URI to a Blob
      const response = await fetch(uri);
      const blob = await response.blob();
      // Upload the Blob to Firebase Storage
      const snapshot = await uploadBytes(reference, blob);
      // Get the download URL
      const url = await getDownloadURL(snapshot.ref);
      await updateProfileImageInFirestore(currentUserId, url);
      setImgUrl(url);
      console.log('Download URL:', url);
    }  catch (error) {
      console.error("Error uploading image: ", error);
    }
  };
  const updateProfileImageInFirestore = async (currentUserId, imageUrl) => {
    const db = getFirestore();
    const userDoc = doc(db, 'users', currentUserId); 
  
    try {
      await updateDoc(userDoc, {
        displayImage: imageUrl
      });
      console.log('Profile image updated in Firestore');
    } catch (error) {
      console.error('Error updating profile image in Firestore:', error);
    }
  };
  useEffect(() => {
  console.log('img',imgUrl);  
  }, [imgUrl])
  

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="py-3 flex-1">
        {/* header */}
        {modalVisible && imgUrl &&
        <FullImgModal modalVisible={modalVisible} 
        setModalVisible={setModalVisible} 
        image={imgUrl} />}
        <View className="flex-row item-center border-b-2 pb-2 border-gray-300 shadow-md">
          <TouchableOpacity onPress={toggleMenu} className="ml-4">
            <Ionicons name="menu-outline" size={28} color="black" />
          </TouchableOpacity>
          <View className="flex-1 items-center">
            <Text className="text-2xl font-semibold -ml-10">Profile</Text>
          </View>
        </View>
        <View className="flex-1 items-center m-5 relative">
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            {!imgUrl ? (
              <View className=" bg-slate-400 w-36 h-36 justify-center items-center rounded-full">
                <Entypo name="user" size={100} color="white" />
              </View>
            ) : (
              <Image source={{ uri: imgUrl }} className="w-36 h-36 rounded-full" />
            )}
          </TouchableOpacity>
          <TouchableOpacity className="absolute top-28 right-28" onPress={()=>pickImage()}>
            <Feather name="edit-3" size={38} color="black" />
          </TouchableOpacity>
          <Text className="mt-2 text-xl ">{userDetails.displayName}</Text>
          <TouchableOpacity
            className="bg-slate-300 w-full py-3 rounded-3xl m-8"
            onPress={() => {
              Logout(signOut, auth, navigation, setLoading, setError, AsyncStorage);
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
