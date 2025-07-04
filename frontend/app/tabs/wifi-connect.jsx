import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  ScrollView,
  Dimensions,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import Icon from "react-native-vector-icons/MaterialIcons";

const { width } = Dimensions.get("window");

export default function ESP32Dashboard() {
  const navigation = useNavigation();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  const handleBack = () => {
    try {
      navigation.goBack();
    } catch (error) {
      console.log("Navigation not available:", error);
      Alert.alert("Back", "Navigation not available");
    }
  };

  const fetchData = async () => {
    if (!hasLoadedOnce) {
      setIsLoading(true);
    } else {
      setIsRefreshing(true);
    }
    setError(null);

    try {
      const response = await axios.get("http://192.168.100.182/data");
      console.log("ESP32 Data:", response.data);
      setData(response.data);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (error) {
      console.error("Error fetching ESP32 data:", error);
      setError("Could not connect to ESP32. Please check your connection.");
      Alert.alert(
        "Connection Error",
        "Could not connect to ESP32. Please check your connection."
      );
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
      setHasLoadedOnce(true);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => {
      fetchData();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const getTemperatureColor = (temp) => {
    if (temp < 20) return "#3B82F6";
    if (temp < 30) return "#10B981";
    if (temp < 40) return "#F59E0B";
    return "#EF4444";
  };

  const getHeartRateColor = (hr) => {
    if (hr < 60) return "#3B82F6";
    if (hr < 100) return "#10B981";
    if (hr < 150) return "#F59E0B";
    return "#EF4444";
  };

  const getoxygenColor = (oxygen) => {
    if (oxygen >= 95) return "#10B981";
    if (oxygen >= 90) return "#F59E0B";
    return "#EF4444";
  };

  if (isLoading && !hasLoadedOnce) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingCard}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>Connecting to ESP32...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Header */}
        <View style={styles.headerContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBack}
            activeOpacity={0.7}
          >
            <Icon name="arrow-back" size={24} color="#1F2937" />
          </TouchableOpacity>
          <View style={styles.header}>
            <Text style={styles.title}>ESP32 Sensor Dashboard</Text>
            <Text style={styles.subtitle}>Real-time sensor monitoring</Text>
          </View>
        </View>

        {/* Status */}
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <View style={styles.statusIndicator}>
              <Icon
                name={error ? "wifi-off" : "wifi"}
                size={20}
                color={error ? "#EF4444" : "#10B981"}
              />
              <Text
                style={[
                  styles.statusText,
                  { color: error ? "#EF4444" : "#10B981" },
                ]}
              >
                {error ? "Disconnected" : "Connected"}
              </Text>
              {isRefreshing && (
                <View style={{ marginLeft: 8 }}>
                  <ActivityIndicator size="small" color="#3B82F6" />
                </View>
              )}
            </View>
            {lastUpdated && (
              <Text style={styles.lastUpdated}>
                Last updated: {lastUpdated}
              </Text>
            )}
          </View>
        </View>

        {/* Error */}
        {error && (
          <View style={styles.errorCard}>
            <View style={styles.errorIndicator}>
              <View style={styles.errorDot} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          </View>
        )}

        {/* Data */}
        {data && (
          <View style={styles.dataContainer}>
            {/* Temperature */}
            <View style={styles.dataCard}>
              <View style={styles.cardHeader}>
                <View
                  style={[styles.iconContainer, { backgroundColor: "#FED7AA" }]}
                >
                  <Icon name="thermostat" size={24} color="#EA580C" />
                </View>
                <View style={styles.cardHeaderText}>
                  <Text style={styles.cardTitle}>Temperature</Text>
                  <Text style={styles.cardSubtitle}>Current reading</Text>
                </View>
              </View>
              <Text
                style={[
                  styles.dataValue,
                  { color: getTemperatureColor(data.temperature) },
                ]}
              >
                {data.temperature !== undefined && data.temperature !== null
                  ? `${data.temperature}°C`
                  : "--"}
              </Text>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${Math.min(
                        Math.max((data.temperature / 50) * 100, 0),
                        100
                      )}%`,
                      backgroundColor: getTemperatureColor(data.temperature),
                    },
                  ]}
                />
              </View>
            </View>

            {/* Heart Rate */}
            <View style={styles.dataCard}>
              <View style={styles.cardHeader}>
                <View
                  style={[styles.iconContainer, { backgroundColor: "#FECACA" }]}
                >
                  <Icon name="favorite" size={24} color="#DC2626" />
                </View>
                <View style={styles.cardHeaderText}>
                  <Text style={styles.cardTitle}>Heart Rate</Text>
                  <Text style={styles.cardSubtitle}>Beats per minute</Text>
                </View>
              </View>
              <Text
                style={[
                  styles.dataValue,
                  { color: getHeartRateColor(data.heart_rate) },
                ]}
              >
                {data.heart_rate !== undefined && data.heart_rate !== null
                  ? `${data.heart_rate} BPM`
                  : "--"}
              </Text>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${Math.min(
                        Math.max((data.heart_rate / 200) * 100, 0),
                        100
                      )}%`,
                      backgroundColor: getHeartRateColor(data.heart_rate),
                    },
                  ]}
                />
              </View>
            </View>

            {/* oxygen */}
            <View style={styles.dataCard}>
              <View style={styles.cardHeader}>
                <View
                  style={[styles.iconContainer, { backgroundColor: "#A7F3D0" }]}
                >
                  <Icon name="water-drop" size={24} color="#059669" />
                </View>
                <View style={styles.cardHeaderText}>
                  <Text style={styles.cardTitle}>Blood Oxygen</Text>
                  <Text style={styles.cardSubtitle}>SpO₂ Level</Text>
                </View>
              </View>
              <Text
                style={[
                  styles.dataValue,
                  { color: getoxygenColor(data.oxygen) },
                ]}
              >
                {data.oxygen !== undefined && data.oxygen !== null
                  ? `${data.oxygen}%`
                  : "--"}
              </Text>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${Math.min(
                        Math.max((data.oxygen / 100) * 100, 0),
                        100
                      )}%`,
                      backgroundColor: getoxygenColor(data.oxygen),
                    },
                  ]}
                />
              </View>
            </View>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            ESP32 Dashboard • Built with React Native
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F3F4F6" },
  container: { flex: 1, backgroundColor: "#F3F4F6" },
  contentContainer: { padding: 16, paddingBottom: 32 },
  headerContainer: { marginBottom: 24, marginTop: 10 },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  header: { alignItems: "center" },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 8,
  },
  subtitle: { fontSize: 16, color: "#6B7280" },
  statusCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  statusHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusIndicator: { flexDirection: "row", alignItems: "center" },
  statusText: { fontWeight: "600", marginLeft: 8, fontSize: 16 },
  lastUpdated: { fontSize: 12, color: "#6B7280" },
  errorCard: {
    backgroundColor: "#FEF2F2",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  errorIndicator: { flexDirection: "row", alignItems: "center" },
  errorDot: {
    width: 8,
    height: 8,
    backgroundColor: "#EF4444",
    borderRadius: 4,
    marginRight: 8,
  },
  errorText: { color: "#B91C1C", fontWeight: "500", flex: 1 },
  dataContainer: { gap: 16 },
  dataCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  cardHeaderText: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: "600", color: "#1F2937" },
  cardSubtitle: { fontSize: 12, color: "#6B7280", marginTop: 2 },
  dataValue: { fontSize: 32, fontWeight: "bold", marginBottom: 12 },
  progressBar: {
    height: 8,
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: { height: "100%", borderRadius: 4 },
  loadingCard: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  loadingText: { fontSize: 16, color: "#4B5563", marginTop: 16 },
  footer: { alignItems: "center", marginTop: 24 },
  footerText: { fontSize: 12, color: "#6B7280" },
});
