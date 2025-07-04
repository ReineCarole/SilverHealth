import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Switch,
  Dimensions,
  StatusBar,
  Animated,
  Alert,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

const AdvancedSettings = () => {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [locationServices, setLocationServices] = useState(true);
  const [biometricAuth, setBiometricAuth] = useState(false);
  const [autoBackup, setAutoBackup] = useState(true);
  const [dataSync, setDataSync] = useState(true);
  const [analyticsOptIn, setAnalyticsOptIn] = useState(false);
  const [crashReports, setCrashReports] = useState(true);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleGoBack = () => {
    router.back();
  };

  const handleResetSettings = () => {
    Alert.alert(
      "Reset All Settings",
      "Are you sure you want to reset all settings to default? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: () => {
            // Reset all settings to default
            setDarkMode(false);
            setNotifications(true);
            setLocationServices(true);
            setBiometricAuth(false);
            setAutoBackup(true);
            setDataSync(true);
            setAnalyticsOptIn(false);
            setCrashReports(true);
            Alert.alert(
              "Settings Reset",
              "All settings have been reset to default values"
            );
          },
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action is permanent and cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            Alert.alert(
              "Account Deleted",
              "Your account has been scheduled for deletion"
            );
          },
        },
      ]
    );
  };

  const theme = {
    background: darkMode ? "#0a0a0a" : "#f8fafc",
    cardBg: darkMode ? "#1a1a1a" : "#ffffff",
    text: darkMode ? "#ffffff" : "#1e293b",
    textSecondary: darkMode ? "#9ca3af" : "#64748b",
    border: darkMode ? "#2d2d2d" : "#e2e8f0",
    accent: "#6366f1",
    accentLight: "#818cf8",
    danger: "#ef4444",
    success: "#10b981",
  };

  const SettingItem = ({
    title,
    subtitle,
    value,
    onToggle,
    icon,
    type = "switch",
  }) => (
    <View
      style={[
        styles.settingItem,
        { backgroundColor: theme.cardBg, borderColor: theme.border },
      ]}
    >
      <View style={styles.settingContent}>
        <View style={styles.settingIcon}>
          <Text style={[styles.iconText, { color: theme.accent }]}>{icon}</Text>
        </View>
        <View style={styles.settingText}>
          <Text style={[styles.settingTitle, { color: theme.text }]}>
            {title}
          </Text>
          <Text
            style={[styles.settingSubtitle, { color: theme.textSecondary }]}
          >
            {subtitle}
          </Text>
        </View>
      </View>
      {type === "switch" ? (
        <Switch
          value={value}
          onValueChange={onToggle}
          trackColor={{ false: theme.border, true: theme.accentLight }}
          thumbColor={value ? theme.accent : "#f4f3f4"}
          ios_backgroundColor={theme.border}
        />
      ) : (
        <TouchableOpacity
          style={[styles.actionButton, { borderColor: theme.accent }]}
        >
          <Text style={[styles.actionButtonText, { color: theme.accent }]}>
            Configure
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const SectionHeader = ({ title, subtitle }) => (
    <View style={styles.sectionHeader}>
      <Text style={[styles.sectionTitle, { color: theme.text }]}>{title}</Text>
      <Text style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>
        {subtitle}
      </Text>
    </View>
  );

  const DangerZone = () => (
    <View
      style={[
        styles.dangerZone,
        { backgroundColor: theme.cardBg, borderColor: theme.danger },
      ]}
    >
      <Text style={[styles.dangerTitle, { color: theme.danger }]}>
        ⚠️ Danger Zone
      </Text>
      <Text style={[styles.dangerSubtitle, { color: theme.textSecondary }]}>
        These actions are irreversible. Proceed with caution.
      </Text>
      <TouchableOpacity
        style={[styles.dangerButton, { backgroundColor: theme.danger }]}
        onPress={handleResetSettings}
      >
        <Text style={styles.dangerButtonText}>Reset All Settings</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.dangerButton,
          {
            backgroundColor: "transparent",
            borderColor: theme.danger,
            borderWidth: 1,
          },
        ]}
        onPress={handleDeleteAccount}
      >
        <Text style={[styles.dangerButtonText, { color: theme.danger }]}>
          Delete Account
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar
        barStyle={darkMode ? "light-content" : "dark-content"}
        backgroundColor={theme.background}
      />

      <LinearGradient
        colors={darkMode ? ["#1a1a1a", "#0a0a0a"] : ["#6366f1", "#8b5cf6"]}
        style={styles.header}
      >
        <Animated.View
          style={[
            styles.headerContent,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.headerTop}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleGoBack}
              activeOpacity={0.7}
            >
              <Text style={styles.backIcon}>←</Text>
            </TouchableOpacity>
            <View style={styles.headerTitleContainer}>
              <Text style={styles.headerTitle}>Advanced Settings</Text>
              <Text style={styles.headerSubtitle}>
                Customize your experience
              </Text>
            </View>
          </View>
        </Animated.View>
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <SectionHeader
            title="Appearance"
            subtitle="Personalize the look and feel"
          />
          <SettingItem
            title="Dark Mode"
            subtitle="Switch between light and dark themes"
            value={darkMode}
            onToggle={setDarkMode}
            icon="🌙"
          />

          <SectionHeader
            title="Privacy & Security"
            subtitle="Control your data and security preferences"
          />
          <SettingItem
            title="Biometric Authentication"
            subtitle="Use fingerprint or face unlock"
            value={biometricAuth}
            onToggle={setBiometricAuth}
            icon="🔒"
          />
          <SettingItem
            title="Location Services"
            subtitle="Allow app to access your location"
            value={locationServices}
            onToggle={setLocationServices}
            icon="📍"
          />
          <SettingItem
            title="Analytics Opt-in"
            subtitle="Help improve the app with usage data"
            value={analyticsOptIn}
            onToggle={setAnalyticsOptIn}
            icon="📊"
          />

          <SectionHeader
            title="Data Management"
            subtitle="Manage your data and backups"
          />
          <SettingItem
            title="Auto Backup"
            subtitle="Automatically backup your data"
            value={autoBackup}
            onToggle={setAutoBackup}
            icon="☁️"
          />
          <SettingItem
            title="Data Sync"
            subtitle="Sync data across devices"
            value={dataSync}
            onToggle={setDataSync}
            icon="🔄"
          />

          <SectionHeader
            title="Notifications"
            subtitle="Control how you receive updates"
          />
          <SettingItem
            title="Push Notifications"
            subtitle="Receive notifications on your device"
            value={notifications}
            onToggle={setNotifications}
            icon="🔔"
          />

          <SectionHeader
            title="Developer Options"
            subtitle="Advanced debugging and development tools"
          />
          <SettingItem
            title="Crash Reports"
            subtitle="Send crash reports to developers"
            value={crashReports}
            onToggle={setCrashReports}
            icon="🔧"
          />
          <SettingItem
            title="Debug Mode"
            subtitle="Enable debugging features"
            value={false}
            onToggle={() => {}}
            icon="🐛"
            type="button"
          />

          <DangerZone />
        </Animated.View>
      </ScrollView>
    </View>
  );
};

export default AdvancedSettings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 32,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    flex: 1,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  backIcon: {
    fontSize: 24,
    color: "#ffffff",
    fontWeight: "bold",
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: "center",
    marginRight: 56, // To center the title properly (back button width + margin)
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#e2e8f0",
    opacity: 0.9,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
  },
  sectionHeader: {
    marginBottom: 16,
    marginTop: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    opacity: 0.7,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    marginBottom: 12,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  settingContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(99, 102, 241, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  iconText: {
    fontSize: 18,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  settingSubtitle: {
    fontSize: 14,
    opacity: 0.7,
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  dangerZone: {
    marginTop: 32,
    padding: 24,
    borderRadius: 16,
    borderWidth: 2,
    borderStyle: "dashed",
  },
  dangerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  dangerSubtitle: {
    fontSize: 14,
    marginBottom: 20,
    opacity: 0.8,
  },
  dangerButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: "center",
  },
  dangerButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
});
