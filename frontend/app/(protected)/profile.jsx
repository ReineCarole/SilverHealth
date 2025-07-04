import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  Switch,
  Image,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http://192.168.100.128:5000";

const Profile = () => {
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    emergencyContact: "",
    medicalConditions: "",
  });
  const [settings, setSettings] = useState({
    notifications: true,
    dataSharing: false,
    emergencyAlerts: true,
    biometricLogin: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      setIsLoading(true);
      const token = await AsyncStorage.getItem("userToken");
      const userId = await AsyncStorage.getItem("userId");

      // Load user info from storage first (offline support)
      const storedName = await AsyncStorage.getItem("userFullName");
      const storedEmail = await AsyncStorage.getItem("userEmail");

      if (storedName || storedEmail) {
        setUserInfo((prev) => ({
          ...prev,
          name: storedName || "",
          email: storedEmail || "",
        }));
      }

      // Try to fetch complete profile from backend
      try {
        const profileResponse = await fetch(
          `${API_URL}/api/user/profile/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          setUserInfo(profileData);
        }
      } catch (profileError) {
        console.log("Profile backend not available, using stored data");
      }

      // Load user settings - try backend first, fallback to AsyncStorage
      try {
        const settingsResponse = await fetch(
          `${API_URL}/api/user/settings/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (settingsResponse.ok) {
          const settingsData = await settingsResponse.json();
          setSettings(settingsData);
          // Save to AsyncStorage as backup
          await AsyncStorage.setItem(
            "userSettings",
            JSON.stringify(settingsData)
          );
        } else {
          throw new Error("Backend settings not available");
        }
      } catch (settingsError) {
        // Load from AsyncStorage if backend fails
        console.log("Loading settings from local storage");
        const storedSettings = await AsyncStorage.getItem("userSettings");
        if (storedSettings) {
          const parsedSettings = JSON.parse(storedSettings);
          setSettings(parsedSettings);
          console.log("Loaded settings from AsyncStorage:", parsedSettings);
        } else {
          // Use default settings if nothing is stored
          const defaultSettings = {
            notifications: true,
            dataSharing: false,
            emergencyAlerts: true,
            biometricLogin: false,
          };
          setSettings(defaultSettings);
          await AsyncStorage.setItem(
            "userSettings",
            JSON.stringify(defaultSettings)
          );
          console.log("Using default settings");
        }
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      Alert.alert("Error", "Failed to load profile data");
    } finally {
      setIsLoading(false);
    }
  };

  const saveProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const userId = await AsyncStorage.getItem("userId");

      const response = await fetch(`${API_URL}/api/user/profile/${userId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userInfo),
      });

      if (response.ok) {
        // Update local storage
        await AsyncStorage.setItem("userName", userInfo.name);
        await AsyncStorage.setItem("userEmail", userInfo.email);

        setIsEditing(false);
        Alert.alert("Success", "Profile updated successfully");
      } else {
        Alert.alert("Error", "Failed to update profile");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      Alert.alert("Error", "Failed to save profile");
    }
  };

  const updateSettings = async (settingKey, value) => {
    try {
      // Update the local state immediately
      const updatedSettings = { ...settings, [settingKey]: value };
      setSettings(updatedSettings);

      console.log(`Updated ${settingKey} to ${value}`);
      console.log("New settings:", updatedSettings);

      // Save to AsyncStorage for persistence (since backend isn't working)
      await AsyncStorage.setItem(
        "userSettings",
        JSON.stringify(updatedSettings)
      );

      // Optional: Try to sync with backend but don't revert if it fails
      try {
        const token = await AsyncStorage.getItem("userToken");
        const userId = await AsyncStorage.getItem("userId");

        if (token && userId) {
          const response = await fetch(
            `${API_URL}/api/user/settings/${userId}`,
            {
              method: "PUT",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify(updatedSettings),
            }
          );

          if (response.ok) {
            console.log("Settings synced with backend successfully");
          } else {
            console.log("Backend sync failed, but settings saved locally");
          }
        }
      } catch (backendError) {
        console.log("Backend not available, settings saved locally only");
      }
    } catch (error) {
      console.error("Error updating settings:", error);
      Alert.alert("Error", "Failed to update settings. Please try again.");
    }
  };

  const logout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await AsyncStorage.multiRemove([
              "userToken",
              "userId",
              "userName",
              "userEmail",
            ]);
            router.replace("/auth/login");
          } catch (error) {
            console.error("Error during logout:", error);
            Alert.alert("Error", "Failed to logout properly");
          }
        },
      },
    ]);
  };

  const navigateToScreen = (screenName) => {
    router.push(`/tabs/${screenName}`);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" style={{ flex: 1 }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setIsEditing(!isEditing)}
          >
            <Ionicons
              name={isEditing ? "close" : "pencil"}
              size={20}
              color="#007AFF"
            />
          </TouchableOpacity>
        </View>

        {/* Profile Image Section */}
        <View style={styles.profileImageSection}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{
                uri:
                  "https://via.placeholder.com/120x120/007AFF/FFFFFF?text=" +
                  (userInfo.name ? userInfo.name.charAt(0).toUpperCase() : "U"),
              }}
              style={styles.profileImage}
            />
            <TouchableOpacity style={styles.cameraButton}>
              <Ionicons name="camera" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.profileName}>{userInfo.name || "User Name"}</Text>
          <Text style={styles.profileEmail}>
            {userInfo.email || "user@example.com"}
          </Text>
        </View>

        {/* Personal Information - Only show when editing */}
        {isEditing && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personal Information</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <TextInput
                style={styles.input}
                value={userInfo.name}
                onChangeText={(text) =>
                  setUserInfo({ ...userInfo, name: text })
                }
                placeholder="Enter your full name"
                autoCapitalize="words"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.input}
                value={userInfo.email}
                onChangeText={(text) =>
                  setUserInfo({ ...userInfo, email: text })
                }
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Phone Number</Text>
              <TextInput
                style={styles.input}
                value={userInfo.phone}
                onChangeText={(text) =>
                  setUserInfo({ ...userInfo, phone: text })
                }
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Date of Birth</Text>
              <TextInput
                style={styles.input}
                value={userInfo.dateOfBirth}
                onChangeText={(text) =>
                  setUserInfo({ ...userInfo, dateOfBirth: text })
                }
                placeholder="DD/MM/YYYY"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Emergency Contact</Text>
              <TextInput
                style={styles.input}
                value={userInfo.emergencyContact}
                onChangeText={(text) =>
                  setUserInfo({ ...userInfo, emergencyContact: text })
                }
                placeholder="Emergency contact number"
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Medical Conditions</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={userInfo.medicalConditions}
                onChangeText={(text) =>
                  setUserInfo({ ...userInfo, medicalConditions: text })
                }
                placeholder="Any medical conditions or allergies"
                multiline
                numberOfLines={3}
              />
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={saveProfile}>
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="notifications-outline" size={20} color="#666" />
              <Text style={styles.settingLabel}>Push Notifications</Text>
            </View>
            <Switch
              value={settings.notifications}
              onValueChange={(value) => {
                console.log("Push Notifications toggle clicked:", value);
                updateSettings("notifications", value);
              }}
              trackColor={{ false: "#E5E5EA", true: "#007AFF" }}
              thumbColor={settings.notifications ? "#fff" : "#f4f3f4"}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons
                name="shield-checkmark-outline"
                size={20}
                color="#666"
              />
              <Text style={styles.settingLabel}>Emergency Alerts</Text>
            </View>
            <Switch
              value={settings.emergencyAlerts}
              onValueChange={(value) => {
                console.log("Emergency Alerts toggle clicked:", value);
                updateSettings("emergencyAlerts", value);
              }}
              trackColor={{ false: "#E5E5EA", true: "#FF3B30" }}
              thumbColor={settings.emergencyAlerts ? "#fff" : "#f4f3f4"}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="share-outline" size={20} color="#666" />
              <Text style={styles.settingLabel}>Data Sharing</Text>
            </View>
            <Switch
              value={settings.dataSharing}
              onValueChange={(value) => {
                console.log("Data Sharing toggle clicked:", value);
                updateSettings("dataSharing", value);
              }}
              trackColor={{ false: "#E5E5EA", true: "#007AFF" }}
              thumbColor={settings.dataSharing ? "#fff" : "#f4f3f4"}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="finger-print-outline" size={20} color="#666" />
              <Text style={styles.settingLabel}>Biometric Login</Text>
            </View>
            <Switch
              value={settings.biometricLogin}
              onValueChange={(value) => {
                console.log("Biometric Login toggle clicked:", value);
                updateSettings("biometricLogin", value);
              }}
              trackColor={{ false: "#E5E5EA", true: "#007AFF" }}
              thumbColor={settings.biometricLogin ? "#fff" : "#f4f3f4"}
            />
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>

          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => navigateToScreen("emergency-contacts")}
          >
            <Ionicons name="call-outline" size={20} color="#007AFF" />
            <Text style={styles.actionLabel}>Emergency Contacts</Text>
            <Ionicons name="chevron-forward" size={16} color="#C7C7CC" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => navigateToScreen("wifi-connect")}
          >
            <Ionicons name="bluetooth-outline" size={20} color="#007AFF" />
            <Text style={styles.actionLabel}>Device Management</Text>
            <Ionicons name="chevron-forward" size={16} color="#C7C7CC" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => navigateToScreen("setting")}
          >
            <Ionicons name="settings-outline" size={20} color="#007AFF" />
            <Text style={styles.actionLabel}>Advanced Settings</Text>
            <Ionicons name="chevron-forward" size={16} color="#C7C7CC" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigateToScreen("help-and-support")}
            style={styles.actionItem}
          >
            <Ionicons name="help-circle-outline" size={20} color="#007AFF" />
            <Text style={styles.actionLabel}>Help & Support</Text>
            <Ionicons name="chevron-forward" size={16} color="#C7C7CC" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigateToScreen("policy")}
            style={styles.actionItem}
          >
            <Ionicons name="document-text-outline" size={20} color="#007AFF" />
            <Text style={styles.actionLabel}>Privacy Policy</Text>
            <Ionicons name="chevron-forward" size={16} color="#C7C7CC" />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.logoutButton} onPress={logout}>
            <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* App Version */}
        <View style={styles.versionSection}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
  },
  editButton: {
    padding: 8,
    backgroundColor: "#fff",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileImageSection: {
    alignItems: "center",
    paddingVertical: 20,
  },
  profileImageContainer: {
    position: "relative",
    marginBottom: 15,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#E5E5EA",
  },
  cameraButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#007AFF",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#fff",
  },
  profileName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 16,
    color: "#666",
  },
  section: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginVertical: 10,
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
    color: "#111",
  },
  inputGroup: {
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 6,
    color: "#444",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: "#222",
    backgroundColor: "#fff",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  saveButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  settingInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingLabel: {
    marginLeft: 12,
    fontSize: 16,
    color: "#444",
  },
  actionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  actionLabel: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: "#007AFF",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
  },
  logoutText: {
    color: "#FF3B30",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
  },
  versionSection: {
    marginVertical: 20,
    alignItems: "center",
  },
  versionText: {
    color: "#aaa",
  },
});

export default Profile;
