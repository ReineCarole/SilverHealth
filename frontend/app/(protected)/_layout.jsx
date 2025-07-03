import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  StatusBar,
  Alert,
  Text,
  TouchableOpacity,
} from "react-native";
import { Tabs, useRouter, useSegments } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http://192.168.100.128:5000";

export default function RootLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  useEffect(() => {
    if (isAuthenticated === null) return;

    const inAuthGroup = segments[0] === "auth";
    const inTabGroup = segments[0] === "(protected)";

    if (isAuthenticated && !inTabGroup) {
      router.replace("/(protected)/dashboard");
    } else if (!isAuthenticated && !inAuthGroup) {
      router.replace("/auth/login");
    }
  }, [isAuthenticated, segments]);

  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
  
      if (token) {
        const response = await fetch(`${API_URL}/api/auth/profile`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
  
        if (response.ok) {
          const userData = await response.json();
  
          // Add this line to save the fullName in AsyncStorage
          await AsyncStorage.setItem("userFullName", userData.fullName);
  
          setIsAuthenticated(true);
        } else {
          await AsyncStorage.multiRemove(["userToken", "userId", "userFullName"]);
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };
  

  if (isLoading || isAuthenticated === null) {
    return (
      <View style={styles.loadingContainer}>
        <Ionicons name="heart-outline" size={48} color="#007AFF" />
        <Text style={styles.loadingText}>SilverHealth</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      {isAuthenticated ? (
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: "#007AFF",
            tabBarInactiveTintColor: "#8E8E93",
            tabBarStyle: styles.tabBar,
            tabBarLabelStyle: styles.tabBarLabel,
            headerShown: false,
            tabBarHideOnKeyboard: true,
          }}
        >
          <Tabs.Screen
            name="dashboard"
            options={{
              title: "Dashboard",
              tabBarIcon: ({ color, size, focused }) =>
                icon("home", color, size, focused),
            }}
          />
          <Tabs.Screen
            name="health-data"
            options={{
              title: "Health Data",
              tabBarIcon: ({ color, size, focused }) =>
                icon("pulse", color, size, focused),
            }}
          />
          <Tabs.Screen
            name="reports"
            options={{
              title: "Reports",
              tabBarIcon: ({ color, size, focused }) =>
                icon("analytics", color, size, focused),
            }}
          />
          <Tabs.Screen
            name="profile"
            options={{
              title: "Profile",
              tabBarIcon: ({ color, size, focused }) =>
                icon("person", color, size, focused),
            }}
          />
          <Tabs.Screen
            name="settings"
            options={{ href: null, title: "Settings" }}
          />
          <Tabs.Screen
            name="device-management"
            options={{ href: null, title: "Device Management" }}
          />
          <Tabs.Screen
            name="emergency-contacts"
            options={{ href: null, title: "Emergency Contacts" }}
          />
        </Tabs>
      ) : (
        <View style={styles.authContainer} />
      )}
    </View>
  );
}

function icon(name, color, size, focused) {
  return (
    <View style={[styles.iconContainer, focused && styles.activeIconContainer]}>
      <Ionicons
        name={focused ? name : `${name}-outline`}
        size={size}
        color={color}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },
  authContainer: { flex: 1, backgroundColor: "#f8f9fa" },
  tabBar: {
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#E5E5EA",
    height: 85,
    paddingBottom: 20,
    paddingTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  tabBarLabel: { fontSize: 12, fontWeight: "500", marginTop: 4 },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  activeIconContainer: { backgroundColor: "rgba(0, 122, 255, 0.1)" },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  loadingText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#007AFF",
    marginTop: 16,
  },
});
