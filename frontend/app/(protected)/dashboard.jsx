import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LineChart } from "react-native-chart-kit";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

const API_URL = "http://192.168.100.182"; // your ESP32 IP

const { width } = Dimensions.get("window");
const router = useRouter();

const Dashboard = () => {
  const [healthData, setHealthData] = useState({
    bloodPressure: { systolic: 120, diastolic: 80 }, // fallback dummy
    heartRate: 0,
    oxygenLevel: 98, // fallback dummy
    bodyTemperature: 0,
  });
  const [deviceStatus, setDeviceStatus] = useState({
    isConnected: false,
    batteryLevel: 0,
    lastSync: null,
  });
  const [chartData, setChartData] = useState({
    heartRate: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [userName, setUserName] = useState("");
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  useEffect(() => {
    loadDashboardData();
    loadUserInfo();
    const interval = setInterval(loadDashboardData, 5000); // auto-refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const loadUserInfo = async () => {
    try {
      const name = await AsyncStorage.getItem("userFullName");
      if (name && name.trim().length > 0) {
        setUserName(name);
      } else {
        setUserName("User");
      }
    } catch (error) {
      console.error("Error loading user info:", error);
      setUserName("User");
    }
  };

  const loadDashboardData = async () => {
    if (!hasLoadedOnce) setIsLoading(true); // Only show big loader on first load
    try {
      const response = await fetch(`${API_URL}/data`);
      if (response.ok) {
        const data = await response.json();
        setHealthData({
          bloodPressure: {
            systolic: data.sbp ?? 120,
            diastolic: data.dbp ?? 80,
          },
          heartRate: data.heart_rate,
          oxygenLevel: data.oxygen ?? 98,
          bodyTemperature: data.temperature,
        });
        setDeviceStatus({
          isConnected: true,
          batteryLevel: 75,
          lastSync: new Date().toISOString(),
        });
        setChartData((prev) => ({
          ...prev,
          heartRate: [
            ...prev.heartRate.slice(-6),
            { timestamp: Date.now(), value: data.heart_rate },
          ],
        }));
      } else {
        console.error("ESP32 responded with error");
        setDeviceStatus((prev) => ({ ...prev, isConnected: false }));
      }
    } catch (error) {
      console.error("Error loading data from ESP32:", error);
      setDeviceStatus((prev) => ({ ...prev, isConnected: false }));
    } finally {
      setHasLoadedOnce(true); // Mark that first load is done
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const connectDevice = () => {
    Alert.alert(
      "Connect Device",
      "Make sure your health monitoring device is turned on and connected to WiFi."
    );
  };

  const getHealthStatus = (type, value) => {
    switch (type) {
      case "bloodPressure":
        if (value.systolic > 140 || value.diastolic > 90)
          return { status: "high", color: "#FF3B30" };
        if (value.systolic < 90 || value.diastolic < 60)
          return { status: "low", color: "#FF9500" };
        return { status: "normal", color: "#34C759" };
      case "heartRate":
        if (value > 100) return { status: "high", color: "#FF3B30" };
        if (value < 60) return { status: "low", color: "#FF9500" };
        return { status: "normal", color: "#34C759" };
      case "oxygenLevel":
        if (value < 95) return { status: "low", color: "#FF3B30" };
        return { status: "normal", color: "#34C759" };
      case "temperature":
        if (value > 37.5) return { status: "high", color: "#FF3B30" };
        if (value < 36.1) return { status: "low", color: "#FF9500" };
        return { status: "normal", color: "#34C759" };
      default:
        return { status: "normal", color: "#34C759" };
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "Never";
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const chartConfig = {
    backgroundColor: "#ffffff",
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "4",
      strokeWidth: "2",
      stroke: "#007AFF",
    },
  };

  if (isLoading && !hasLoadedOnce) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" style={{ flex: 1 }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello, {userName}!</Text>
            <Text style={styles.subGreeting}>How are you feeling today?</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        {/* Device Status */}
        <View style={styles.deviceStatusCard}>
          <View style={styles.deviceStatusHeader}>
            <Ionicons
              name={deviceStatus.isConnected ? "wifi" : "wifi-outline"}
              size={24}
              color={deviceStatus.isConnected ? "#34C759" : "#666"}
            />
            <Text style={styles.deviceStatusTitle}>Health Monitor</Text>
            <Text
              style={[
                styles.connectionStatus,
                { color: deviceStatus.isConnected ? "#34C759" : "#FF3B30" },
              ]}
            >
              {deviceStatus.isConnected ? "Connected" : "Disconnected"}
            </Text>
          </View>

          {deviceStatus.isConnected ? (
            <View style={styles.deviceInfo}>
              <Text style={styles.batteryText}>
                Battery: {deviceStatus.batteryLevel}%
              </Text>
              <Text style={styles.syncText}>
                Last sync: {formatTime(deviceStatus.lastSync)}
              </Text>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.connectButton}
              onPress={connectDevice}
            >
              <Text style={styles.connectButtonText}>Connect Device</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Health Metrics Grid */}
        <View style={styles.metricsGrid}>
          {/* Blood Pressure */}
          <View style={[styles.metricCard, styles.largeCard]}>
            <View style={styles.metricHeader}>
              <Ionicons name="heart-outline" size={24} color="#FF3B30" />
              <Text style={styles.metricTitle}>Blood Pressure</Text>
            </View>
            <View style={styles.bpContainer}>
              <Text style={styles.bpValue}>
                {healthData.bloodPressure.systolic.toFixed(1)}/
                {healthData.bloodPressure.diastolic.toFixed(1)}
              </Text>
              <Text style={styles.bpUnit}>mmHg</Text>
            </View>
            <View
              style={[
                styles.statusIndicator,
                {
                  backgroundColor: getHealthStatus(
                    "bloodPressure",
                    healthData.bloodPressure
                  ).color,
                },
              ]}
            >
              <Text style={styles.statusText}>
                {getHealthStatus(
                  "bloodPressure",
                  healthData.bloodPressure
                ).status.toUpperCase()}
              </Text>
            </View>
          </View>

          {/* Heart Rate */}
          <View style={styles.metricCard}>
            <View style={styles.metricHeader}>
              <Ionicons name="pulse-outline" size={20} color="#FF9500" />
              <Text style={styles.metricTitle}>Heart Rate</Text>
            </View>
            <Text style={styles.metricValue}>{healthData.heartRate}</Text>
            <Text style={styles.metricUnit}>BPM</Text>
            <View
              style={[
                styles.statusDot,
                {
                  backgroundColor: getHealthStatus(
                    "heartRate",
                    healthData.heartRate
                  ).color,
                },
              ]}
            />
          </View>

          {/* Oxygen Level */}
          <View style={styles.metricCard}>
            <View style={styles.metricHeader}>
              <Ionicons name="fitness-outline" size={20} color="#007AFF" />
              <Text style={styles.metricTitle}>Blood Oxygen</Text>
            </View>
            <Text style={styles.metricValue}>
              {healthData.oxygenLevel.toFixed(1)}
            </Text>
            <Text style={styles.metricUnit}>%</Text>
            <View
              style={[
                styles.statusDot,
                {
                  backgroundColor: getHealthStatus(
                    "oxygenLevel",
                    healthData.oxygenLevel
                  ).color,
                },
              ]}
            />
          </View>

          {/* Body Temperature */}
          <View style={styles.metricCard}>
            <View style={styles.metricHeader}>
              <Ionicons name="thermometer-outline" size={20} color="#FF6B35" />
              <Text style={styles.metricTitle}>Temperature</Text>
            </View>
            <Text style={styles.metricValue}>
              {healthData.bodyTemperature.toFixed(1)}
            </Text>
            <Text style={styles.metricUnit}>°C</Text>
            <View
              style={[
                styles.statusDot,
                {
                  backgroundColor: getHealthStatus(
                    "temperature",
                    healthData.bodyTemperature
                  ).color,
                },
              ]}
            />
          </View>

          {/* Emergency Button */}
          <TouchableOpacity
            style={styles.emergencyCard}
            onPress={() => router.push("/tabs/emergency-contacts")}
          >
            <Ionicons name="call" size={24} color="#fff" />
            <Text style={styles.emergencyText}>Emergency</Text>
            <Text style={styles.emergencySubtext}>Tap for help</Text>
          </TouchableOpacity>
        </View>

        {/* Charts Section */}
        {chartData.heartRate.length > 0 && (
          <View style={styles.chartSection}>
            <Text style={styles.sectionTitle}>Heart Rate Trend (7 Days)</Text>
            <View style={styles.chartContainer}>
              <LineChart
                data={{
                  labels: chartData.heartRate.map((item) =>
                    new Date(item.timestamp).toLocaleDateString("en-US", {
                      weekday: "short",
                    })
                  ),
                  datasets: [
                    {
                      data: chartData.heartRate.map((item) => item.value),
                      color: (opacity = 1) => `rgba(255, 59, 48, ${opacity})`,
                      strokeWidth: 2,
                    },
                  ],
                }}
                width={width - 40}
                height={220}
                yAxisLabel=""
                yAxisSuffix=" BPM"
                chartConfig={chartConfig}
                bezier
                style={styles.chart}
              />
            </View>
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons
                name="document-text-outline"
                size={24}
                color="#007AFF"
              />
              <Text style={styles.actionText}>View Reports</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="calendar-outline" size={24} color="#007AFF" />
              <Text style={styles.actionText}>Schedule</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="medical-outline" size={24} color="#007AFF" />
              <Text style={styles.actionText}>Medications</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="settings-outline" size={24} color="#007AFF" />
              <Text style={styles.actionText}>Settings</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Health Tips */}
        <View style={styles.tipsSection}>
          <Text style={styles.sectionTitle}>Health Tips</Text>
          <View style={styles.tipCard}>
            <Ionicons name="bulb-outline" size={20} color="#FF9500" />
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Stay Hydrated</Text>
              <Text style={styles.tipDescription}>
                Drink at least 8 glasses of water daily to maintain optimal
                health.
              </Text>
            </View>
          </View>

          <View style={styles.tipCard}>
            <Ionicons name="walk-outline" size={20} color="#34C759" />
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Light Exercise</Text>
              <Text style={styles.tipDescription}>
                Take a 10-minute walk after meals to help regulate blood sugar.
              </Text>
            </View>
          </View>
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
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  subGreeting: {
    fontSize: 16,
    color: "#666",
    marginTop: 2,
  },
  notificationButton: {
    padding: 8,
    backgroundColor: "#fff",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  deviceStatusCard: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  deviceStatusHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  deviceStatusTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginLeft: 10,
    flex: 1,
  },
  connectionStatus: {
    fontSize: 14,
    fontWeight: "500",
  },
  deviceInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  batteryText: {
    fontSize: 14,
    color: "#666",
  },
  syncText: {
    fontSize: 14,
    color: "#666",
  },
  connectButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  connectButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 20,
    gap: 10,
  },
  metricCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    width: (width - 50) / 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: "relative",
  },
  largeCard: {
    width: width - 40,
  },
  metricHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  metricTitle: {
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
    fontWeight: "500",
  },
  metricValue: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  metricUnit: {
    fontSize: 14,
    color: "#666",
  },
  bpContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 12,
  },
  bpValue: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#FF3B30",
  },
  bpUnit: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FF3B30",
    marginLeft: 6,
    marginBottom: 10,
  },
  statusIndicator: {
    alignSelf: "flex-start",
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  statusText: {
    color: "#fff",
    fontWeight: "600",
  },
  statusDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    position: "absolute",
    top: 16,
    right: 16,
  },
  emergencyCard: {
    backgroundColor: "#FF3B30",
    marginTop: 16,
    marginHorizontal: 20,
    borderRadius: 16,
    paddingVertical: 24,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#FF3B30",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 6,
  },
  emergencyText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 20,
    marginTop: 8,
  },
  emergencySubtext: {
    color: "#fff",
    fontSize: 14,
    marginTop: 4,
  },
  chartSection: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: "#333",
  },
  chartContainer: {
    borderRadius: 16,
    overflow: "hidden",
  },
  chart: {
    borderRadius: 16,
  },
  quickActions: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    justifyContent: "space-between",
  },
  actionButton: {
    width: (width - 60) / 4,
    backgroundColor: "#E6F0FF",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  actionText: {
    marginTop: 8,
    fontSize: 12,
    color: "#007AFF",
    fontWeight: "600",
    textAlign: "center",
  },
  tipsSection: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  tipCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  tipContent: {
    marginLeft: 12,
    flex: 1,
  },
  tipTitle: {
    fontWeight: "600",
    fontSize: 16,
    marginBottom: 4,
    color: "#333",
  },
  tipDescription: {
    fontSize: 14,
    color: "#666",
  },
});

export default Dashboard;
