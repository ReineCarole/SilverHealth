import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import ChevronLeft from "./components/icons/chevronLeft";

const { width, height } = Dimensions.get("window");

const Features = () => {
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [fadeAnim] = useState(new Animated.Value(1));

  const features = [
    {
      id: "heart-rate",
      title: "Heart Rate",
      description:
        "Continuous heart rate monitoring with irregular rhythm detection",
      icon: "heart",
      color: "#FF6B6B",
      bgColor: "rgba(255, 107, 107, 0.1)",
      details: [
        "Real-time heart rate tracking",
        "Irregular rhythm detection",
        "Heart rate variability analysis",
        "Resting and active HR zones",
        "Historical trends and patterns",
      ],
    },
    {
      id: "blood-pressure",
      title: "Blood Pressure",
      description: "Non-invasive blood pressure tracking with trend analysis",
      icon: "pulse",
      color: "#4ECDC4",
      bgColor: "rgba(78, 205, 196, 0.1)",
      details: [
        "Systolic and diastolic monitoring",
        "Hypertension alerts",
        "Daily, weekly, monthly trends",
        "Medication reminder integration",
        "Healthcare provider sharing",
      ],
    },
    {
      id: "blood-oxygen",
      title: "Blood Oxygen",
      description: "SpO2 monitoring to ensure optimal oxygen levels",
      icon: "leaf",
      color: "#45B7D1",
      bgColor: "rgba(69, 183, 209, 0.1)",
      details: [
        "Continuous SpO2 monitoring",
        "Low oxygen level alerts",
        "Sleep apnea detection",
        "Respiratory health insights",
        "Exercise oxygen efficiency",
      ],
    },
    {
      id: "temperature",
      title: "Temperature",
      description: "Body temperature monitoring with fever alerts",
      icon: "thermometer",
      color: "#F7B731",
      bgColor: "rgba(247, 183, 49, 0.1)",
      details: [
        "Continuous body temperature",
        "Fever detection and alerts",
        "Temperature trend analysis",
        "Infection early warning",
        "Recovery monitoring",
      ],
    },
  ];

  const emergencyFeatures = [
    {
      id: "emergency-alerts",
      title: "Smart Emergency Alerts",
      description:
        "Instant notifications for caregivers when vital signs indicate concern",
      icon: "alert-circle",
      color: "#FF4757",
    },
    {
      id: "fall-detection",
      title: "Fall Detection",
      description:
        "Automatic fall detection with immediate emergency contact notification",
      icon: "shield-checkmark",
      color: "#5F27CD",
    },
    {
      id: "medication-reminders",
      title: "Medication Reminders",
      description:
        "Smart reminders for medication times with adherence tracking",
      icon: "medical",
      color: "#00D2D3",
    },
    {
      id: "health-insights",
      title: "Health Insights & Trends",
      description:
        "AI-powered analytics provide meaningful health patterns and recommendations",
      icon: "analytics",
      color: "#FF9F43",
    },
  ];

  const handleFeaturePress = (feature) => {
    setSelectedFeature(selectedFeature === feature.id ? null : feature.id);

    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0.7,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const renderFeatureCard = (feature, isEmergency = false) => (
    <TouchableOpacity
      key={feature.id}
      style={[
        styles.featureCard,
        isEmergency && styles.emergencyCard,
        selectedFeature === feature.id && styles.selectedCard,
      ]}
      onPress={() => !isEmergency && handleFeaturePress(feature)}
      activeOpacity={0.8}
    >
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: feature.bgColor || `${feature.color}20` },
        ]}
      >
        <Ionicons name={feature.icon} size={30} color={feature.color} />
      </View>

      <View style={styles.featureContent}>
        <Text style={styles.featureTitle}>{feature.title}</Text>
        <Text style={styles.featureDescription}>{feature.description}</Text>

        {selectedFeature === feature.id && feature.details && (
          <View style={styles.detailsContainer}>
            {feature.details.map((detail, index) => (
              <View key={index} style={styles.detailItem}>
                <Ionicons
                  name="checkmark-circle"
                  size={16}
                  color={feature.color}
                />
                <Text style={styles.detailText}>{detail}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      {!isEmergency && (
        <Ionicons
          name={selectedFeature === feature.id ? "chevron-up" : "chevron-down"}
          size={20}
          color="#666"
        />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#4A90E2", "#357ABD"]} style={styles.header}>
        <ChevronLeft />
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Health Monitoring Features</Text>
          <Text style={styles.headerSubtitle}>
            Comprehensive vital signs tracking
          </Text>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          {/* Main Features */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Vital Signs Monitoring</Text>
            <Text style={styles.sectionSubtitle}>
              Real-time tracking of essential health metrics designed
              specifically for elderly care
            </Text>

            <View style={styles.featuresGrid}>
              {features.map((feature) => renderFeatureCard(feature))}
            </View>
          </View>

          {/* Emergency Features */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Advanced Care Features</Text>
            <Text style={styles.sectionSubtitle}>
              Enhanced safety and health management capabilities
            </Text>

            <View style={styles.emergencyGrid}>
              {emergencyFeatures.map((feature) =>
                renderFeatureCard(feature, true)
              )}
            </View>
          </View>

          {/* Technology Highlights */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Why Choose SilverHealth?</Text>

            <View style={styles.highlightCard}>
              <View style={styles.highlightRow}>
                <Ionicons name="bluetooth" size={24} color="#4A90E2" />
                <View style={styles.highlightContent}>
                  <Text style={styles.highlightTitle}>
                    Seamless Connectivity
                  </Text>
                  <Text style={styles.highlightText}>
                    Bluetooth connection ensures continuous monitoring without
                    cables
                  </Text>
                </View>
              </View>

              <View style={styles.highlightRow}>
                <Ionicons name="shield-checkmark" size={24} color="#4CAF50" />
                <View style={styles.highlightContent}>
                  <Text style={styles.highlightTitle}>
                    Medical Grade Accuracy
                  </Text>
                  <Text style={styles.highlightText}>
                    Clinically validated sensors for reliable health data
                  </Text>
                </View>
              </View>

              <View style={styles.highlightRow}>
                <Ionicons name="battery-full" size={24} color="#FF9800" />
                <View style={styles.highlightContent}>
                  <Text style={styles.highlightTitle}>Long Battery Life</Text>
                  <Text style={styles.highlightText}>
                    Up to 7 days of continuous monitoring
                  </Text>
                </View>
              </View>

              <View style={styles.highlightRow}>
                <Ionicons name="water" size={24} color="#00BCD4" />
                <View style={styles.highlightContent}>
                  <Text style={styles.highlightTitle}>Water Resistant</Text>
                  <Text style={styles.highlightText}>
                    IPX7 rating for daily activities and peace of mind
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* CTA Section */}
          <View style={styles.ctaSection}>
            <LinearGradient
              colors={["#4A90E2", "#357ABD"]}
              style={styles.ctaCard}
            >
              <Text style={styles.ctaTitle}>Ready to Start Monitoring?</Text>
              <Text style={styles.ctaText}>
                Join thousands of families who trust SilverHealth for their
                loved ones' wellbeing
              </Text>

              <TouchableOpacity
                style={styles.ctaButton}
                onPress={() => router.push("/register")}
              >
                <Text style={styles.ctaButtonText}>Get Started Today</Text>
                <Ionicons name="arrow-forward" size={20} color="#4A90E2" />
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    paddingTop: 30,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerContent: {
    marginTop: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  content: {
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: "#7F8C8D",
    lineHeight: 24,
    marginBottom: 25,
  },
  featuresGrid: {
    gap: 15,
  },
  featureCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    alignItems: "flex-start",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  emergencyCard: {
    marginBottom: 15,
  },
  selectedCard: {
    borderColor: "#4A90E2",
    borderWidth: 2,
    shadowColor: "#4A90E2",
    shadowOpacity: 0.2,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2C3E50",
    marginBottom: 6,
  },
  featureDescription: {
    fontSize: 14,
    color: "#7F8C8D",
    lineHeight: 20,
  },
  detailsContainer: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: "#5D6D7E",
    marginLeft: 10,
    flex: 1,
  },
  emergencyGrid: {
    gap: 15,
  },
  highlightCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  highlightRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  highlightContent: {
    flex: 1,
    marginLeft: 15,
  },
  highlightTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2C3E50",
    marginBottom: 4,
  },
  highlightText: {
    fontSize: 14,
    color: "#7F8C8D",
    lineHeight: 20,
  },
  ctaSection: {
    marginTop: 20,
  },
  ctaCard: {
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
  },
  ctaTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
    marginBottom: 10,
    textAlign: "center",
  },
  ctaText: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 25,
  },
  ctaButton: {
    backgroundColor: "white",
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 30,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  ctaButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4A90E2",
    marginRight: 10,
  },
});

export default Features;
