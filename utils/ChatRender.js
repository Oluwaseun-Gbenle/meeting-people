import { FontAwesome } from "@expo/vector-icons";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { Bubble } from "react-native-gifted-chat";

export const renderSend = (props) => {
  return (
    <View style={{ position: "absolute", right: 10, top: 6 }}>
      <TouchableOpacity
      style={{ padding:8 }}
        onPress={() => {
          props.onSend({ text: props.text.trim() }, true);
        }}
      >
        <FontAwesome name="send" size={20} color="green" />
      </TouchableOpacity>
    </View>
  );
};

export const renderLoading = () => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
};

export const renderBubble = (props) => {
  return (
    <Bubble
      {...props}
      textStyle={{
        // Custom text styles for the message
        right: {
          color: "white",
        },
        left: {
          color: "black",
        },
      }}
      wrapperStyle={{
        // Custom wrapper styles for the bubble
        left: {
          backgroundColor: "#e5e5e5", // Color for messages from others
        },
        right: {
          backgroundColor: "#38A169", // Color for messages from the current user
        },
      }}
    />
  );
};
