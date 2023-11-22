import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../../firebaseConfig";
import { Alert } from "react-native";
import { doc, setDoc } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";


export const createUserProfile = async (user) => {
  // user object comes from the Firebase Auth user creation process
  const userRef = doc(db, "users", user.uid);
  await setDoc(userRef, {
    email: user.email,
    displayName: user.displayName || '',
    displayImage: user.displayImage || ''
  });
}

export const signUpUser = (userName, email, password, navigation, setIsLoading) => {
  setIsLoading(true); //start loadiing
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // signed in
      const user = userCredential.user;
      updateProfile(user, {
        displayName: userName,
      })
        .then(() => {
          createUserProfile(user);
          Alert.alert("Successful", "You have been successfully registered", { cancelable: false });
          navigation.navigate("LoginWithEmail");
        })
        .catch((error) => {
          alert(error.message);
        })
        .finally(() => {
          setIsLoading(false); // Stop loading regardless of outcome
        });
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(errorMessage);
    })
    .finally(() => {
      setIsLoading(false); // Stop loading regardless of outcome
    });
};

export const LogInUser = (email, password, navigation, setIsLoading) => {
  setIsLoading(true); // Start loading
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      AsyncStorage.setItem("user", JSON.stringify(user));
      navigation.navigate("ChatLobby");
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(errorMessage);
    })
    .finally(() => {
      setIsLoading(false); // Stop loading regardless of outcome
    });
};
