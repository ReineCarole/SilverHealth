import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Linking,
  TextInput,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function HelpSupport() {
  const [expandedFAQ, setExpandedFAQ] = useState({});
  const [contactModalVisible, setContactModalVisible] = useState(false);
  const [supportForm, setSupportForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    priority: "medium",
  });

  const toggleFAQ = (index) => {
    setExpandedFAQ((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleContactSupport = () => {
    setContactModalVisible(true);
  };

  const submitSupportRequest = () => {
    if (!supportForm.name || !supportForm.email || !supportForm.message) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    // Here you would typically send the support request to your backend
    console.log("Support request submitted:", supportForm);

    Alert.alert(
      "Support Request Submitted",
      "Thank you for contacting us. We will respond within 24 hours.",
      [
        {
          text: "OK",
          onPress: () => {
            setContactModalVisible(false);
            setSupportForm({
              name: "",
              email: "",
              subject: "",
              message: "",
              priority: "medium",
            });
          },
        },
      ]
    );
  };

  const openURL = async (url) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert("Error", "Cannot open this link");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to open link");
    }
  };

  const faqData = [
    {
      question: "How do I connect my wearable device to the app?",
      answer:
        "To connect your SilverHealth wearable:\n\n1. Make sure Bluetooth is enabled on your phone\n2. Open the SilverHealth app\n3. Go to Device Management\n4. Tap 'Add New Device'\n5. Follow the pairing instructions\n6. Your device should appear in the list once connected\n\nIf you're having trouble, make sure your device is charged and within 10 feet of your phone.",
    },
    {
      question: "Why are my health readings inconsistent?",
      answer:
        "Several factors can affect reading accuracy:\n\n• Device placement: Ensure the armband is snug but not too tight\n• Movement: Stay still during measurements\n• Skin condition: Clean, dry skin provides better contact\n• Battery level: Low battery can affect sensor performance\n• Environmental factors: Extreme temperatures can impact readings\n\nFor best results, take measurements at the same time each day in a quiet environment.",
    },
    {
      question: "How do I set up emergency contacts?",
      answer:
        "To set up emergency contacts:\n\n1. Go to Settings > Emergency Contacts\n2. Tap 'Add Contact'\n3. Enter contact information\n4. Set their relationship to you\n5. Choose notification preferences\n6. Save the contact\n\nYou can add up to 5 emergency contacts. They will be notified during health emergencies or if you activate the panic button.",
    },
    {
      question: "What should I do if I get a health alert?",
      answer:
        "When you receive a health alert:\n\n1. Don't panic - stay calm\n2. Check if you're feeling any symptoms\n3. If you feel unwell, contact your doctor\n4. For severe alerts, consider calling emergency services\n5. Take another reading after a few minutes\n6. Note any activities that might have caused the alert\n\nRemember: Our device provides monitoring but cannot replace professional medical advice.",
    },
    {
      question: "How long does the device battery last?",
      answer:
        "Battery life depends on usage:\n\n• Continuous monitoring: 2-3 days\n• Regular monitoring: 5-7 days\n• Basic monitoring: 7-10 days\n\nTo extend battery life:\n• Reduce monitoring frequency\n• Turn off GPS when not needed\n• Lower screen brightness\n• Disable unnecessary notifications\n\nThe app will alert you when battery is low (below 20%).",
    },
    {
      question: "Can I wear the device while swimming or showering?",
      answer:
        "The SilverHealth armband is water-resistant (IPX7 rating):\n\n✅ Safe for:\n• Hand washing\n• Light rain\n• Sweat during exercise\n• Brief water exposure\n\n❌ Not safe for:\n• Swimming\n• Hot showers\n• Submersion in water\n• High-pressure water\n\nAlways dry the device thoroughly after water exposure.",
    },
    {
      question: "How do I interpret my health data trends?",
      answer:
        "Understanding your health trends:\n\n📈 Heart Rate:\n• Resting: 60-100 bpm is normal\n• Trends show fitness level changes\n• Sudden spikes may indicate stress or illness\n\n🩸 Blood Pressure:\n• Normal: <120/80 mmHg\n• Monitor trends over time\n• Single high readings aren't always concerning\n\n🌡️ Temperature:\n• Normal: 36.1-37.2°C (97-99°F)\n• Slight variations are normal\n• Consistent elevation may indicate fever\n\n🫁 Oxygen Levels:\n• Normal: 95-100%\n• Below 90% requires medical attention\n• Monitor during illness",
    },
    {
      question: "What if my device won't sync with the app?",
      answer:
        "Troubleshooting sync issues:\n\n1. Check Bluetooth connection\n2. Restart both app and device\n3. Ensure devices are close together\n4. Check for app updates\n5. Clear app cache (Android)\n6. Re-pair the device if necessary\n\nIf problems persist:\n• Check device compatibility\n• Ensure sufficient phone storage\n• Contact support for advanced troubleshooting",
    },
  ];

  const quickActions = [
    {
      title: "Device Setup Guide",
      description: "Step-by-step device setup",
      icon: "hardware-chip-outline",
      action: () =>
        Alert.alert("Device Setup", "Opening device setup guide..."),
    },
    {
      title: "Troubleshooting",
      description: "Common issues and solutions",
      icon: "construct-outline",
      action: () =>
        Alert.alert("Troubleshooting", "Opening troubleshooting guide..."),
    },
    {
      title: "Video Tutorials",
      description: "Watch how-to videos",
      icon: "play-circle-outline",
      action: () =>
        Alert.alert("Video Tutorials", "Opening video tutorials..."),
    },
    {
      title: "User Manual",
      description: "Complete user documentation",
      icon: "document-text-outline",
      action: () => Alert.alert("User Manual", "Opening user manual..."),
    },
  ];

  const contactOptions = [
    {
      title: "Live Chat",
      description: "Chat with support agent",
      icon: "chatbubble-ellipses-outline",
      action: () =>
        Alert.alert("Live Chat", "Live chat will be available soon!"),
    },
    {
      title: "Call Support",
      description: "+1 (555) 123-4567",
      icon: "call-outline",
      action: () => openURL("tel:+15551234567"),
    },
    {
      title: "Email Support",
      description: "support@silverhealth.com",
      icon: "mail-outline",
      action: () => openURL("mailto:support@silverhealth.com"),
    },
    {
      title: "Schedule Callback",
      description: "We'll call you back",
      icon: "calendar-outline",
      action: () =>
        Alert.alert(
          "Schedule Callback",
          "Callback scheduling will be available soon!"
        ),
    },
  ];

  const renderQuickAction = (action, index) => (
    <TouchableOpacity
      key={index}
      style={styles.quickActionItem}
      onPress={action.action}
    >
      <View style={styles.quickActionIcon}>
        <Ionicons name={action.icon} size={24} color="#2196F3" />
      </View>
      <View style={styles.quickActionText}>
        <Text style={styles.quickActionTitle}>{action.title}</Text>
        <Text style={styles.quickActionDescription}>{action.description}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#ccc" />
    </TouchableOpacity>
  );

  const renderContactOption = (option, index) => (
    <TouchableOpacity
      key={index}
      style={styles.contactOption}
      onPress={option.action}
    >
      <View style={styles.contactIcon}>
        <Ionicons name={option.icon} size={24} color="#4CAF50" />
      </View>
      <View style={styles.contactText}>
        <Text style={styles.contactTitle}>{option.title}</Text>
        <Text style={styles.contactDescription}>{option.description}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderFAQItem = (item, index) => (
    <View key={index} style={styles.faqItem}>
      <TouchableOpacity
        style={styles.faqHeader}
        onPress={() => toggleFAQ(index)}
      >
        <Text style={styles.faqQuestion}>{item.question}</Text>
        <Ionicons
          name={expandedFAQ[index] ? "chevron-up" : "chevron-down"}
          size={20}
          color="#666"
        />
      </TouchableOpacity>
      {expandedFAQ[index] && (
        <View style={styles.faqAnswer}>
          <Text style={styles.faqAnswerText}>{item.answer}</Text>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Support</Text>
        <TouchableOpacity onPress={handleContactSupport}>
          <Ionicons name="headset-outline" size={24} color="#2196F3" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsContainer}>
            {quickActions.map((action, index) =>
              renderQuickAction(action, index)
            )}
          </View>
        </View>

        {/* Contact Support */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Support</Text>
          <View style={styles.contactContainer}>
            {contactOptions.map((option, index) =>
              renderContactOption(option, index)
            )}
          </View>
        </View>

        {/* Emergency Support */}
        <View style={styles.emergencySection}>
          <View style={styles.emergencyHeader}>
            <Ionicons name="warning-outline" size={24} color="#F44336" />
            <Text style={styles.emergencyTitle}>Emergency Support</Text>
          </View>
          <Text style={styles.emergencyText}>
            For medical emergencies, immediately call your local emergency
            services. For urgent device issues affecting your safety, call our
            24/7 emergency line:
          </Text>
          <TouchableOpacity
            style={styles.emergencyButton}
            onPress={() => openURL("tel:+15551234568")}
          >
            <Ionicons name="call" size={20} color="#fff" />
            <Text style={styles.emergencyButtonText}>
              Emergency: +1 (555) 123-4568
            </Text>
          </TouchableOpacity>
        </View>

        {/* FAQ Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          <View style={styles.faqContainer}>
            {faqData.map((item, index) => renderFAQItem(item, index))}
          </View>
        </View>

        {/* System Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>System Status</Text>
          <View style={styles.statusContainer}>
            <View style={styles.statusItem}>
              <View
                style={[styles.statusIndicator, { backgroundColor: "#4CAF50" }]}
              />
              <Text style={styles.statusText}>App Services: Operational</Text>
            </View>
            <View style={styles.statusItem}>
              <View
                style={[styles.statusIndicator, { backgroundColor: "#4CAF50" }]}
              />
              <Text style={styles.statusText}>Cloud Sync: Operational</Text>
            </View>
            <View style={styles.statusItem}>
              <View
                style={[styles.statusIndicator, { backgroundColor: "#FF9800" }]}
              />
              <Text style={styles.statusText}>
                Emergency Services: Maintenance
              </Text>
            </View>
          </View>
        </View>

        {/* App Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Information</Text>
          <View style={styles.infoContainer}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Version</Text>
              <Text style={styles.infoValue}>1.0.0</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Build</Text>
              <Text style={styles.infoValue}>2025.01.001</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Last Updated</Text>
              <Text style={styles.infoValue}>January 15, 2025</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Contact Support Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={contactModalVisible}
        onRequestClose={() => setContactModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Contact Support</Text>
              <TouchableOpacity onPress={() => setContactModalVisible(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Name *</Text>
                <TextInput
                  style={styles.formInput}
                  value={supportForm.name}
                  onChangeText={(text) =>
                    setSupportForm({ ...supportForm, name: text })
                  }
                  placeholder="Enter your name"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Email *</Text>
                <TextInput
                  style={styles.formInput}
                  value={supportForm.email}
                  onChangeText={(text) =>
                    setSupportForm({ ...supportForm, email: text })
                  }
                  placeholder="Enter your email"
                  keyboardType="email-address"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Subject</Text>
                <TextInput
                  style={styles.formInput}
                  value={supportForm.subject}
                  onChangeText={(text) =>
                    setSupportForm({ ...supportForm, subject: text })
                  }
                  placeholder="Brief description of your issue"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Priority</Text>
                <View style={styles.priorityContainer}>
                  {["low", "medium", "high", "urgent"].map((priority) => (
                    <TouchableOpacity
                      key={priority}
                      style={[
                        styles.priorityButton,
                        supportForm.priority === priority &&
                          styles.priorityButtonActive,
                      ]}
                      onPress={() =>
                        setSupportForm({ ...supportForm, priority })
                      }
                    >
                      <Text
                        style={[
                          styles.priorityButtonText,
                          supportForm.priority === priority &&
                            styles.priorityButtonTextActive,
                        ]}
                      >
                        {priority.charAt(0).toUpperCase() + priority.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Message *</Text>
                <TextInput
                  style={[styles.formInput, styles.messageInput]}
                  value={supportForm.message}
                  onChangeText={(text) =>
                    setSupportForm({ ...supportForm, message: text })
                  }
                  placeholder="Describe your issue in detail..."
                  multiline
                  numberOfLines={4}
                />
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setContactModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={submitSupportRequest}
              >
                <Text style={styles.submitButtonText}>Submit Request</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginVertical: 10,
    padding: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 15,
  },
  quickActionsContainer: {
    gap: 1,
  },
  quickActionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#f0f0f0",
  },
  quickActionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E3F2FD",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  quickActionText: {
    flex: 1,
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  quickActionDescription: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  contactContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  contactOption: {
    width: "48%",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    marginBottom: 10,
  },
  contactIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#E8F5E8",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  contactText: {
    alignItems: "center",
  },
  contactTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    textAlign: "center",
  },
  contactDescription: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    marginTop: 2,
  },
  emergencySection: {
    backgroundColor: "#FFEBEE",
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#FFCDD2",
  },
  emergencyHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  emergencyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#F44336",
    marginLeft: 8,
  },
  emergencyText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 15,
  },
  emergencyButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F44336",
    paddingVertical: 12,
    borderRadius: 8,
  },
  emergencyButtonText: {
    color: "#fff",
    fontWeight: "600",
    marginLeft: 8,
  },
  faqContainer: {
    gap: 1,
  },
  faqItem: {
    borderBottomWidth: 0.5,
    borderBottomColor: "#f0f0f0",
  },
  faqHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  faqQuestion: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    flex: 1,
    marginRight: 10,
  },
  faqAnswer: {
    paddingBottom: 15,
  },
  faqAnswerText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  statusContainer: {
    gap: 10,
  },
  statusItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  statusText: {
    fontSize: 14,
    color: "#333",
  },
  infoContainer: {
    gap: 10,
  },
  infoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoLabel: {
    fontSize: 14,
    color: "#666",
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 15,
    width: "90%",
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  modalBody: {
    padding: 20,
    maxHeight: 400,
  },
  formGroup: {
    marginBottom: 15,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginBottom: 5,
  },
  formInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  messageInput: {
    height: 80,
    textAlignVertical: "top",
  },
  priorityContainer: {
    flexDirection: "row",
    gap: 8,
  },
  priorityButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    backgroundColor: "#f0f0f0",
  },
  priorityButtonActive: {
    backgroundColor: "#2196F3",
  },
  priorityButtonText: {
    fontSize: 12,
    color: "#666",
  },
  priorityButtonTextActive: {
    color: "#fff",
  },
  modalFooter: {
    flexDirection: "row",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    gap: 10,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
  },
  submitButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#4CAF50",
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
  },
  submitButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#fff",
  },
});
