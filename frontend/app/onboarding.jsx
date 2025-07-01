import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import ChevronLeft from "./components/icons/chevronLeft";

const { width, height } = Dimensions.get("window");

const onboardingData = [
  {
    id: 1,
    title: "Welcome to SilverHealth",
    subtitle: "Your personal health monitoring companion",
    description:
      "Advanced wearable technology designed specifically for senior health monitoring and peace of mind.",
    icon: "heart-outline",
    color: "#4299e1",
  },
  {
    id: 2,
    title: "Real-Time Monitoring",
    subtitle: "Stay connected to your health 24/7",
    description:
      "Monitor heart rate, blood pressure, temperature, and blood oxygen levels continuously throughout the day.",
    icon: "pulse-outline",
    color: "#48bb78",
  },
  {
    id: 3,
    title: "Smart Alerts & Insights",
    subtitle: "Intelligent health notifications",
    description:
      "Get instant alerts when vital signs are abnormal and receive personalized health insights powered by AI.",
    icon: "notifications-outline",
    color: "#ed8936",
  },
  {
    id: 4,
    title: "Connect with Caregivers",
    subtitle: "Keep your loved ones informed",
    description:
      "Share your health data with family members and healthcare providers for better care coordination.",
    icon: "people-outline",
    color: "#9f7aea",
  },
];

export default function Onboarding() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const isLastSlide = currentIndex === onboardingData.length - 1;

  const handleNext = () => {
    if (isLastSlide) {
      router.replace("/auth/login");
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSkip = () => {
    router.replace("/auth/login");
  };

  const currentData = onboardingData[currentIndex];

  return (
    <LinearGradient colors={["#1a365d", "#2d5aa0"]} style={styles.container}>
      {/* Skip Button */}
      <ChevronLeft />
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      {/* Content */}
      <View style={styles.content}>
        {/* Icon */}
        <View
          style={[styles.iconContainer, { backgroundColor: currentData.color }]}
        >
          <Ionicons name={currentData.icon} size={60} color="#ffffff" />
        </View>

        {/* Text Content */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>{currentData.title}</Text>
          <Text style={styles.subtitle}>{currentData.subtitle}</Text>
          <Text style={styles.description}>{currentData.description}</Text>
        </View>

        {/* Progress Indicators */}
        <View style={styles.progressContainer}>
          {onboardingData.map((_, index) => (
            <View
              key={index}
              style={[
                styles.progressDot,
                {
                  backgroundColor:
                    index === currentIndex
                      ? "#ffffff"
                      : "rgba(255, 255, 255, 0.3)",
                  width: index === currentIndex ? 30 : 10,
                },
              ]}
            />
          ))}
        </View>

        {/* Navigation Buttons */}
        <View style={styles.navigationContainer}>
          {currentIndex > 0 && (
            <TouchableOpacity
              style={styles.previousButton}
              onPress={handlePrevious}
            >
              <Ionicons name="arrow-back" size={24} color="#ffffff" />
              <Text style={styles.previousText}>Previous</Text>
            </TouchableOpacity>
          )}

          <View style={styles.spacer} />

          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextText}>
              {isLastSlide ? "Get Started" : "Next"}
            </Text>
            <Ionicons name="arrow-forward" size={24} color="#1a365d" />
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  skipButton: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 1,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  skipText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 16,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
    paddingTop: 100,
    paddingBottom: 50,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  textContainer: {
    alignItems: "center",
    marginBottom: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "600",
  },
  description: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 40,
  },
  progressDot: {
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    transition: "all 0.3s ease",
  },
  navigationContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 20,
  },
  previousButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.5)",
    borderRadius: 25,
  },
  previousText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  spacer: {
    flex: 1,
  },
  nextButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    paddingHorizontal: 25,
    paddingVertical: 15,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  nextText: {
    color: "#1a365d",
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 8,
  },
});
