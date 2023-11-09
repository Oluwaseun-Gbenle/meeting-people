import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../firebase";
import { Alert } from "react-native";

export const signUpUser = (userName, email, password,navigation,setIsLoading) => {
  setIsLoading(true)//start loadiing
  createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
      // signed in
      const user = userCredential.user;
      updateProfile(user, {
          displayName : userName,
      })
      .then(() => {
        Alert.alert(
          'Successful',
          'You have been successfully registered',
          { cancelable: false }
        );
          navigation.navigate("LoginWithEmail")
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
  }

  export const LogInUser = (email, password, navigation, setIsLoading) => {
    setIsLoading(true); // Start loading
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        navigation.navigate('ChatLobby');
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

 
 
  
  
  