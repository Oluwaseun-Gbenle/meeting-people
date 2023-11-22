import React from "react";
import { View, Text, TouchableOpacity, Modal, TouchableWithoutFeedback } from "react-native";

const Dropdown = ({ isOpen, setIsOpen, list,navigation,func }) => {
  return (
    <View style={{ position: "relative" }}>
      {isOpen && (
        <Modal transparent={true} animationType="fade" visible={isOpen} onRequestClose={() => setIsOpen(false)}>
          <TouchableWithoutFeedback onPress={() => setIsOpen(false)}>
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
              <View
                style={{
                  position: "absolute",
                  top: 100,
                  left: 10,
                  width: 180,
                  backgroundColor: "white",
                  borderRadius: 5,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.2,
                  shadowRadius: 2,
                  elevation: 3,
                }}
              >
                {list.map((item, index) => (
                  <TouchableOpacity key={index} 
                  style={{ flexDirection: "row", alignItems: "center", padding: 10, borderBottomWidth: 1, borderBottomColor: "#e0e0e0" }}
                  onPress={()=>{navigation.navigate(item.navigate); setIsOpen(false);item.name === 'Logout' && func()}}
                  > 
                    <Text style={{ marginLeft: 10 }}>{item.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      )}
    </View>
  );
};

export default Dropdown;
