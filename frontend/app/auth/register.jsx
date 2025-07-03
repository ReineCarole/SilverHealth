import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import ChevronLeft from "../components/icons/chevronLeft";

const { width, height } = Dimensions.get("window");

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    gender: "",
    phone: "",
    password: "",
    confirmPassword: "",
    emergencyContact: "",
    emergencyPhone: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    const {
      fullName,
      email,
      gender,
      phone,
      password,
      confirmPassword,
      emergencyContact,
      emergencyPhone,
    } = formData;

    if (!fullName.trim()) {
      Alert.alert("Error", "Please enter your full name");
      return false;
    }

    if (!email.trim() || !email.includes("@")) {
      Alert.alert("Error", "Please enter a valid email address");
      return false;
    }

    if (!phone.trim() || phone.length < 10) {
      Alert.alert("Error", "Please enter a valid phone number");
      return false;
    }

    if (!password || password.length < 8) {
      Alert.alert("Error", "Password must be at least 8 characters long");
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return false;
    }

    if (!emergencyContact.trim()) {
      Alert.alert("Error", "Please enter emergency contact name");
      return false;
    }

    if (!emergencyPhone.trim() || emergencyPhone.length < 10) {
      Alert.alert("Error", "Please enter a valid emergency contact number");
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await fetch(
        "http://192.168.100.128:5000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fullName: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            password: formData.password,
            emergencyContactName: formData.emergencyContact,
            emergencyContactPhone: formData.emergencyPhone,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        Alert.alert("Registration Failed", data.message || "Please try again.");
        return;
      }

      Alert.alert("Success", "Account created successfully! Please login.", [
        {
          text: "OK",
          onPress: () => router.push("/auth/login"),
        },
      ]);
    } catch (error) {
      console.error("Register error:", error);
      Alert.alert("Error", "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderInputField = (
    placeholder,
    value,
    onChangeText,
    keyboardType = "default",
    secureTextEntry = false,
    showPasswordToggle = false
  ) => (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#A0A0A0"
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        autoCapitalize="none"
      />
      {showPasswordToggle && (
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() =>
            secureTextEntry
              ? setShowPassword(!showPassword)
              : setShowConfirmPassword(!showConfirmPassword)
          }
        >
          <Ionicons
            name={secureTextEntry ? "eye-off" : "eye"}
            size={20}
            color="#666"
          />
        </TouchableOpacity>
      )}
    </View>
  );

  const handleSignIn = () => {
    router.push("/auth/login");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <LinearGradient
        colors={["#4A90E2", "#357ABD", "#2C5F91"]}
        style={styles.gradient}
      >
        <ChevronLeft />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Ionicons name="heart" size={40} color="white" />
            </View>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>
              Join SilverHealth for comprehensive health monitoring
            </Text>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.sectionTitle}>Personal Information</Text>

            {renderInputField("Full Name", formData.fullName, (value) =>
              handleInputChange("fullName", value)
            )}

            {renderInputField(
              "Email Address",
              formData.email,
              (value) => handleInputChange("email", value),
              "email-address"
            )}

            {renderInputField(
              "Phone Number",
              formData.phone,
              (value) => handleInputChange("phone", value),
              "phone-pad"
            )}

            {renderInputField(
              "Password",
              formData.password,
              (value) => handleInputChange("password", value),
              "default",
              !showPassword,
              true
            )}

            {renderInputField(
              "Confirm Password",
              formData.confirmPassword,
              (value) => handleInputChange("confirmPassword", value),
              "default",
              !showConfirmPassword,
              true
            )}

            <Text style={[styles.sectionTitle, { marginTop: 30 }]}>
              Emergency Contact
            </Text>

            {renderInputField(
              "Emergency Contact Name",
              formData.emergencyContact,
              (value) => handleInputChange("emergencyContact", value)
            )}

            {renderInputField(
              "Emergency Contact Phone",
              formData.emergencyPhone,
              (value) => handleInputChange("emergencyPhone", value),
              "phone-pad"
            )}

            <TouchableOpacity
              style={[
                styles.registerButton,
                isLoading && styles.disabledButton,
              ]}
              onPress={handleRegister}
              disabled={isLoading}
            >
              <Text style={styles.registerButtonText}>
                {isLoading ? "Creating Account..." : "Create Account"}
              </Text>
              {!isLoading && (
                <Ionicons
                  name="arrow-forward"
                  size={20}
                  color="white"
                  style={styles.arrowIcon}
                />
              )}
            </TouchableOpacity>

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={handleSignIn}>
                <Text style={styles.loginLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 50,
  },
  logoContainer: {
    alignItems: "center",
    paddingTop: 80,
    paddingBottom: 40,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    paddingHorizontal: 20,
  },
  formContainer: {
    paddingHorizontal: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
    marginBottom: 20,
    marginTop: 10,
  },
  inputContainer: {
    position: "relative",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 15,
    fontSize: 16,
    color: "#333",
  },
  eyeIcon: {
    position: "absolute",
    right: 20,
    top: 15,
  },
  registerButton: {
    backgroundColor: "#1E88E5",
    borderRadius: 25,
    paddingVertical: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  disabledButton: {
    opacity: 0.6,
  },
  registerButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    marginRight: 10,
  },
  arrowIcon: {
    marginLeft: 5,
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },
  loginText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 16,
  },
  loginLink: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
});

export default Register;
