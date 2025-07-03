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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const handleBack = () => {
    try {
      navigation.goBack();
    } catch (error) {
      console.log("Navigation not available:", error);
      Alert.alert("Back", "Navigation not available");
    }
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // ⚠️ Replace with your ESP32 IP address
      const response = await axios.get("http://192.168.100.182/data");
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
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getTemperatureColor = (temp) => {
    if (temp < 20) return "#3B82F6"; // Blue
    if (temp < 30) return "#10B981"; // Green
    if (temp < 40) return "#F59E0B"; // Yellow
    return "#EF4444"; // Red
  };

  const getHeartRateColor = (hr) => {
    if (hr < 60) return "#3B82F6"; // Blue
    if (hr < 100) return "#10B981"; // Green
    if (hr < 150) return "#F59E0B"; // Yellow
    return "#EF4444"; // Red
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Header with Back Button */}
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

        {/* Status Card */}
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
            </View>
            {lastUpdated && (
              <Text style={styles.lastUpdated}>
                Last updated: {lastUpdated}
              </Text>
            )}
          </View>

          {/* Refresh Button */}
          <TouchableOpacity
            style={[
              styles.refreshButton,
              loading && styles.refreshButtonDisabled,
            ]}
            onPress={fetchData}
            disabled={loading}
            activeOpacity={0.8}
          >
            <Icon
              name="refresh"
              size={20}
              color="white"
              style={loading ? styles.spinningIcon : null}
            />
            <Text style={styles.refreshButtonText}>
              {loading ? "Refreshing..." : "Refresh Data"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Error Message */}
        {error && (
          <View style={styles.errorCard}>
            <View style={styles.errorIndicator}>
              <View style={styles.errorDot} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          </View>
        )}

        {/* Data Cards */}
        {data ? (
          <View style={styles.dataContainer}>
            {/* Temperature Card */}
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
                {data.temperature}°C
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

            {/* Heart Rate Card */}
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
                {data.heart_rate} BPM
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
          </View>
        ) : !loading && !error ? (
          <View style={styles.noDataCard}>
            <Icon
              name="wifi"
              size={48}
              color="#9CA3AF"
              style={styles.noDataIcon}
            />
            <Text style={styles.noDataTitle}>No Data Available</Text>
            <Text style={styles.noDataText}>
              Click refresh to get the latest sensor readings
            </Text>
          </View>
        ) : null}

        {/* Loading State */}
        {loading && !data && (
          <View style={styles.loadingCard}>
            <ActivityIndicator
              size="large"
              color="#3B82F6"
              style={styles.loader}
            />
            <Text style={styles.loadingText}>Connecting to ESP32...</Text>
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
  safeArea: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  headerContainer: {
    marginBottom: 24,
    marginTop: 10,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
  },
  statusCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  statusIndicator: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusText: {
    fontWeight: "600",
    marginLeft: 8,
    fontSize: 16,
  },
  lastUpdated: {
    fontSize: 12,
    color: "#6B7280",
  },
  refreshButton: {
    backgroundColor: "#3B82F6",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  refreshButtonDisabled: {
    backgroundColor: "#9CA3AF",
  },
  refreshButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
    marginLeft: 8,
  },
  spinningIcon: {
    // Note: React Native doesn't support CSS animations,
    // you might need to use Animated API for spinning effect
  },
  errorCard: {
    backgroundColor: "#FEF2F2",
    borderColor: "#FECACA",
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  errorIndicator: {
    flexDirection: "row",
    alignItems: "center",
  },
  errorDot: {
    width: 8,
    height: 8,
    backgroundColor: "#EF4444",
    borderRadius: 4,
    marginRight: 8,
  },
  errorText: {
    color: "#B91C1C",
    fontWeight: "500",
    flex: 1,
  },
  dataContainer: {
    gap: 16,
  },
  dataCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  cardHeaderText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
  },
  cardSubtitle: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
  dataValue: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  noDataCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 32,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 16,
  },
  noDataIcon: {
    marginBottom: 16,
    opacity: 0.5,
  },
  noDataTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#4B5563",
    marginBottom: 8,
  },
  noDataText: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },
  loadingCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 32,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 16,
  },
  loader: {
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 16,
    color: "#4B5563",
  },
  footer: {
    alignItems: "center",
    marginTop: 24,
  },
  footerText: {
    fontSize: 12,
    color: "#6B7280",
  },
});
