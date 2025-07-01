import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

export default function RootLayout() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const hasCompletedOnboarding = await AsyncStorage.getItem(
        "hasCompletedOnboarding"
      );

      if (token) {
        setIsAuthenticated(true);
        // User is logged in, can navigate to dashboard
      } else if (hasCompletedOnboarding) {
        // User has seen onboarding but not logged in, go to login
        router.replace("/auth/login");
      } else {
        // New user, show landing page
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#1a365d",
        }}
      >
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="light" backgroundColor="#1a365d" translucent={false} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#1a365d" },
          animation: "slide_from_right",
        }}
      >
        {/* Landing/Onboarding Flow */}
        <Stack.Screen
          name="index"
          options={{
            title: "SilverHealth",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="onboarding"
          options={{
            title: "Get Started",
            headerShown: false,
          }}
        />

        {/* Auth Flow */}
        <Stack.Screen
          name="auth/login"
          options={{
            title: "Login",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="auth/register"
          options={{
            title: "Register",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="auth/forgot-password"
          options={{
            title: "Reset Password",
            headerShown: false,
          }}
        />

        {/* Protected Routes */}
        <Stack.Screen
          name="(protected)/dashboard"
          options={{
            title: "Dashboard",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="(protected)/profile"
          options={{
            title: "Profile",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="(protected)/health-data"
          options={{
            title: "Health Data",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="(protected)/settings"
          options={{
            title: "Settings",
            headerShown: false,
          }}
        />

        {/* Other Pages */}
        <Stack.Screen
          name="features"
          options={{
            title: "Features",
            headerShown: false,
          }}
        />
      </Stack>
    </>
  );
}
