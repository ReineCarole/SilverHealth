import React from "react";
import {
  TouchableOpacity,
  StyleSheet,
  Platform,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const ChevronLeft = ({
  onPress,
  color = "white",
  size = 24,
  style = {},
  backgroundColor = "rgba(255, 255, 255, 0.2)",
  showBackground = true,
}) => {
  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      // Default behavior: go back
      if (router.canGoBack()) {
        router.back();
      } else {
        // If can't go back, navigate to a default route
        router.push("/");
      }
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, showBackground && { backgroundColor }, style]}
      onPress={handlePress}
      activeOpacity={0.7}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <Ionicons name="chevron-back" size={size} color={color} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : StatusBar.currentHeight + 10,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default ChevronLeft;
