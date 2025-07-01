import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("window");

export default function LandingPage() {
  const handleGetStarted = async () => {
    await AsyncStorage.setItem("hasCompletedOnboarding", "true");
    router.push("/onboarding");
  };

  const handleLearnMore = () => {
    router.push("/features");
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        bounces={true}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Section */}
        <LinearGradient
          colors={["#1a365d", "#2d5aa0", "#4299e1"]}
          style={styles.heroSection}
        >
          <View style={styles.heroContent}>
            {/* Logo/Brand */}
            <View style={styles.brandContainer}>
              <View style={styles.logoContainer}>
                <Ionicons name="heart-outline" size={40} color="#ffffff" />
              </View>
              <Text style={styles.brandText}>SilverHealth</Text>
              <Text style={styles.tagline}>
                Advanced Health Monitoring for Seniors
              </Text>
            </View>

            {/* Hero Device Visualization */}
            <View style={styles.heroImageContainer}>
              <View style={styles.deviceMockup}>
                <View style={styles.armband}>
                  <View style={styles.sensor} />
                  <View style={styles.sensorLine} />
                  <View style={styles.sensorDot} />
                </View>
                <View style={styles.connectionLine} />
                <View style={styles.phoneMockup}>
                  <View style={styles.phoneScreen}>
                    <View style={styles.healthMetric}>
                      <Ionicons name="heart" size={16} color="#e53e3e" />
                      <Text style={styles.metricText}>72 BPM</Text>
                    </View>
                    <View style={styles.healthMetric}>
                      <Ionicons name="thermometer" size={16} color="#38a169" />
                      <Text style={styles.metricText}>36.5°C</Text>
                    </View>
                    <View style={styles.healthMetric}>
                      <Ionicons name="fitness" size={16} color="#3182ce" />
                      <Text style={styles.metricText}>120/80</Text>
                    </View>
                    <View style={styles.healthMetric}>
                      <Ionicons name="leaf" size={16} color="#2f855a" />
                      <Text style={styles.metricText}>98% SpO2</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>

            {/* Hero CTA */}
            <View style={styles.heroActions}>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleGetStarted}
                activeOpacity={0.8}
              >
                <Text style={styles.primaryButtonText}>Get Started</Text>
                <Ionicons name="arrow-forward" size={20} color="#2b6cb0" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={handleLearnMore}
                activeOpacity={0.8}
              >
                <Text style={styles.secondaryButtonText}>Learn More</Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>

        {/* Features Section */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>
            Comprehensive Health Monitoring
          </Text>
          <Text style={styles.sectionSubtitle}>
            Real-time vital signs tracking designed specifically for elderly
            care
          </Text>

          <View style={styles.featuresGrid}>
            <View style={styles.featureCard}>
              <LinearGradient
                colors={["#fed7d7", "#feb2b2"]}
                style={styles.featureIcon}
              >
                <Ionicons name="heart" size={28} color="#c53030" />
              </LinearGradient>
              <Text style={styles.featureTitle}>Heart Rate</Text>
              <Text style={styles.featureDescription}>
                Continuous heart rate monitoring with irregular rhythm detection
              </Text>
            </View>

            <View style={styles.featureCard}>
              <LinearGradient
                colors={["#bee3f8", "#90cdf4"]}
                style={styles.featureIcon}
              >
                <Ionicons name="fitness" size={28} color="#2b6cb0" />
              </LinearGradient>
              <Text style={styles.featureTitle}>Blood Pressure</Text>
              <Text style={styles.featureDescription}>
                Non-invasive blood pressure tracking with trend analysis
              </Text>
            </View>

            <View style={styles.featureCard}>
              <LinearGradient
                colors={["#c6f6d5", "#9ae6b4"]}
                style={styles.featureIcon}
              >
                <Ionicons name="leaf" size={28} color="#2f855a" />
              </LinearGradient>
              <Text style={styles.featureTitle}>Blood Oxygen</Text>
              <Text style={styles.featureDescription}>
                SpO2 monitoring to ensure optimal oxygen levels
              </Text>
            </View>

            <View style={styles.featureCard}>
              <LinearGradient
                colors={["#fbb6ce", "#f687b3"]}
                style={styles.featureIcon}
              >
                <Ionicons name="thermometer" size={28} color="#b83280" />
              </LinearGradient>
              <Text style={styles.featureTitle}>Temperature</Text>
              <Text style={styles.featureDescription}>
                Body temperature monitoring with fever alerts
              </Text>
            </View>
          </View>
        </View>

        {/* Benefits Section */}
        <LinearGradient
          colors={["#f7fafc", "#edf2f7"]}
          style={styles.benefitsSection}
        >
          <Text style={styles.sectionTitle}>Why Choose SilverHealth?</Text>

          <View style={styles.benefitsList}>
            <View style={styles.benefitItem}>
              <View style={styles.benefitIconContainer}>
                <Ionicons name="bluetooth" size={24} color="#4299e1" />
              </View>
              <View style={styles.benefitContent}>
                <Text style={styles.benefitTitle}>
                  Seamless Bluetooth Connectivity
                </Text>
                <Text style={styles.benefitDescription}>
                  Wireless connection ensures continuous monitoring without
                  cables or complexity
                </Text>
              </View>
            </View>

            <View style={styles.benefitItem}>
              <View style={styles.benefitIconContainer}>
                <Ionicons name="shield-checkmark" size={24} color="#48bb78" />
              </View>
              <View style={styles.benefitContent}>
                <Text style={styles.benefitTitle}>Medical Grade Accuracy</Text>
                <Text style={styles.benefitDescription}>
                  Clinically validated sensors ensure reliable and precise
                  health data
                </Text>
              </View>
            </View>

            <View style={styles.benefitItem}>
              <View style={styles.benefitIconContainer}>
                <Ionicons name="notifications" size={24} color="#ed8936" />
              </View>
              <View style={styles.benefitContent}>
                <Text style={styles.benefitTitle}>Smart Emergency Alerts</Text>
                <Text style={styles.benefitDescription}>
                  Instant notifications for caregivers when vital signs indicate
                  concern
                </Text>
              </View>
            </View>

            <View style={styles.benefitItem}>
              <View style={styles.benefitIconContainer}>
                <Ionicons name="analytics" size={24} color="#9f7aea" />
              </View>
              <View style={styles.benefitContent}>
                <Text style={styles.benefitTitle}>
                  Health Insights & Trends
                </Text>
                <Text style={styles.benefitDescription}>
                  AI-powered analytics provide meaningful health patterns and
                  recommendations
                </Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* Technology Section */}
        <View style={styles.techSection}>
          <Text style={styles.sectionTitle}>Advanced Wearable Technology</Text>
          <Text style={styles.sectionSubtitle}>
            Engineered specifically for comfort and accuracy in elderly care
          </Text>

          <View style={styles.techGrid}>
            <View style={styles.techCard}>
              <Ionicons name="watch" size={40} color="#4299e1" />
              <Text style={styles.techCardTitle}>Comfortable Armband</Text>
              <Text style={styles.techCardDesc}>
                Lightweight, breathable design for 24/7 wear
              </Text>
            </View>

            <View style={styles.techCard}>
              <Ionicons name="battery-charging" size={40} color="#48bb78" />
              <Text style={styles.techCardTitle}>Long Battery Life</Text>
              <Text style={styles.techCardDesc}>
                Up to 7 days of continuous monitoring
              </Text>
            </View>

            <View style={styles.techCard}>
              <Ionicons name="water" size={40} color="#38b2ac" />
              <Text style={styles.techCardTitle}>Water Resistant</Text>
              <Text style={styles.techCardDesc}>
                IPX7 rating for daily activities
              </Text>
            </View>
          </View>
        </View>

        {/* CTA Section */}
        <View style={styles.ctaSection}>
          <Text style={styles.ctaTitle}>Ready to Transform Elder Care?</Text>
          <Text style={styles.ctaSubtitle}>
            Join thousands of families who trust SilverHealth for their loved
            ones' wellbeing
          </Text>

          <TouchableOpacity
            style={styles.ctaButton}
            onPress={handleGetStarted}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={["#4299e1", "#3182ce"]}
              style={styles.ctaButtonGradient}
            >
              <Text style={styles.ctaButtonText}>Start Monitoring Today</Text>
              <Ionicons name="arrow-forward" size={20} color="#ffffff" />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            © 2024 SilverHealth • Bachelor of Technology Project
          </Text>
          <Text style={styles.footerSubText}>
            Empowering healthier aging through innovative wearable technology
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a365d",
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  heroSection: {
    minHeight: height * 0.85,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 50 : 20,
    paddingBottom: 40,
  },
  heroContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
  },
  brandContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  brandText: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 8,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  tagline: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.95)",
    textAlign: "center",
    maxWidth: 300,
    lineHeight: 22,
  },
  heroImageContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 30,
  },
  deviceMockup: {
    alignItems: "center",
    justifyContent: "center",
  },
  armband: {
    width: 140,
    height: 70,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 12,
  },
  sensor: {
    width: 24,
    height: 24,
    backgroundColor: "#4299e1",
    borderRadius: 12,
    marginBottom: 6,
  },
  sensorLine: {
    width: 50,
    height: 3,
    backgroundColor: "#4299e1",
    marginBottom: 3,
    borderRadius: 2,
  },
  sensorDot: {
    width: 10,
    height: 10,
    backgroundColor: "#48bb78",
    borderRadius: 5,
  },
  connectionLine: {
    width: 3,
    height: 45,
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    marginBottom: 25,
    borderRadius: 2,
  },
  phoneMockup: {
    width: 160,
    height: 280,
    backgroundColor: "rgba(255, 255, 255, 0.98)",
    borderRadius: 25,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 16,
  },
  phoneScreen: {
    flex: 1,
    backgroundColor: "#f8fafc",
    borderRadius: 15,
    padding: 15,
    justifyContent: "space-around",
  },
  healthMetric: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 12,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  metricText: {
    marginLeft: 10,
    fontSize: 14,
    fontWeight: "600",
    color: "#2d3748",
  },
  heroActions: {
    width: "100%",
    alignItems: "center",
    marginTop: 20,
  },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    paddingHorizontal: 35,
    paddingVertical: 18,
    borderRadius: 30,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 12,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2b6cb0",
    marginRight: 10,
  },
  secondaryButton: {
    paddingHorizontal: 35,
    paddingVertical: 15,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 25,
  },
  secondaryButtonText: {
    fontSize: 16,
    color: "#ffffff",
    fontWeight: "600",
  },
  featuresSection: {
    padding: 30,
    backgroundColor: "#ffffff",
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2d3748",
    textAlign: "center",
    marginBottom: 10,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: "#718096",
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  featuresGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  featureCard: {
    width: (width - 80) / 2,
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  featureIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2d3748",
    marginBottom: 8,
    textAlign: "center",
  },
  featureDescription: {
    fontSize: 13,
    color: "#718096",
    textAlign: "center",
    lineHeight: 18,
  },
  benefitsSection: {
    padding: 30,
  },
  benefitsList: {
    marginTop: 20,
  },
  benefitItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 25,
    backgroundColor: "#ffffff",
    padding: 25,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  benefitIconContainer: {
    width: 55,
    height: 55,
    borderRadius: 28,
    backgroundColor: "#f7fafc",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  benefitContent: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2d3748",
    marginBottom: 6,
  },
  benefitDescription: {
    fontSize: 14,
    color: "#718096",
    lineHeight: 20,
  },
  techSection: {
    padding: 30,
    backgroundColor: "#ffffff",
  },
  techGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  techCard: {
    width: (width - 100) / 3,
    alignItems: "center",
    padding: 15,
    backgroundColor: "#f8fafc",
    borderRadius: 15,
    marginHorizontal: 5,
  },
  techCardTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#2d3748",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 5,
  },
  techCardDesc: {
    fontSize: 11,
    color: "#718096",
    textAlign: "center",
    lineHeight: 14,
  },
  ctaSection: {
    padding: 40,
    backgroundColor: "#ffffff",
    alignItems: "center",
  },
  ctaTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#2d3748",
    textAlign: "center",
    marginBottom: 12,
  },
  ctaSubtitle: {
    fontSize: 16,
    color: "#718096",
    textAlign: "center",
    marginBottom: 35,
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  ctaButton: {
    borderRadius: 30,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 12,
  },
  ctaButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingVertical: 20,
  },
  ctaButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    marginRight: 12,
  },
  footer: {
    padding: 35,
    backgroundColor: "#f7fafc",
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: "#4a5568",
    textAlign: "center",
    fontWeight: "600",
    marginBottom: 5,
  },
  footerSubText: {
    fontSize: 12,
    color: "#718096",
    textAlign: "center",
    fontStyle: "italic",
  },
});
