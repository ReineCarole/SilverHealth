import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Button,
  Alert,
} from "react-native";
import axios from "axios";

export default function ESP32DataScreen() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      // ⚠️ Replace with your ESP32 IP address
      const response = await axios.get("http://192.168.100.160/data");
      setData(response.data);
    } catch (error) {
      console.error("Error fetching ESP32 data:", error);
      Alert.alert("Error", "Could not connect to ESP32.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ESP32 Sensor Data</Text>
      {loading && <ActivityIndicator size="large" />}
      {data ? (
        <View>
          <Text>Temperature: {data.temperature} °C</Text>
          <Text>Heart Rate: {data.heart_rate} bpm</Text>
        </View>
      ) : !loading ? (
        <Text>No data yet.</Text>
      ) : null}
      <Button title="Refresh" onPress={fetchData} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
});
