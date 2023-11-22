import { get, onValue, ref, set, onDisconnect,serverTimestamp } from "firebase/database";
import { db, realTimeDb } from "../firebaseConfig";

export const setUserOnlineStatus = (userId,isOnline=true) => {
 const statusRef = ref(realTimeDb, `status/${userId}`);

  set(statusRef, { online: isOnline, last_changed: serverTimestamp() })
    .then(() => console.log(`Online status set to ${isOnline} for user ${userId}`))
    .catch((error) => console.error("Error setting online status: ", error));

  // Set up onDisconnect to handle user going offline
  if (isOnline) {
    onDisconnect(statusRef).set({ online: false, last_changed: serverTimestamp() });
  }
};

export const fetchUserOnlineStatus = async (userId) => {
  console.log(`Fetching online status for user: ${userId}`);
  const onlineStatusRef = ref(realTimeDb, "status/" + userId);
  try {
    const statusSnap = await get(onlineStatusRef);
    console.log("statusSnap", statusSnap.val());

    const isOnline = statusSnap.exists() && statusSnap.val().online;
    console.log(`User online status: ${isOnline}`);
    return !!isOnline; // Ensures the return value is a boolean
  } catch (error) {
    console.error("Error fetching online status: ", error);
    return false;
  }
};
