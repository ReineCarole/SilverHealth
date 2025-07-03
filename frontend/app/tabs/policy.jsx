import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function PrivacyPolicy() {
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const renderExpandableSection = (title, content, sectionKey) => (
    <View style={styles.section}>
      <TouchableOpacity
        style={styles.sectionHeader}
        onPress={() => toggleSection(sectionKey)}
      >
        <Text style={styles.sectionTitle}>{title}</Text>
        <Ionicons
          name={expandedSections[sectionKey] ? "chevron-up" : "chevron-down"}
          size={20}
          color="#666"
        />
      </TouchableOpacity>
      {expandedSections[sectionKey] && (
        <View style={styles.sectionContent}>
          <Text style={styles.contentText}>{content}</Text>
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
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.introSection}>
          <Text style={styles.introTitle}>SilverHealth Privacy Policy</Text>
          <Text style={styles.introText}>
            Last updated: January 2025{"\n\n"}
            At SilverHealth, we are committed to protecting your privacy and
            ensuring the security of your personal health information. This
            Privacy Policy explains how we collect, use, and safeguard your data
            when you use our wearable health monitoring system and mobile
            application.
          </Text>
        </View>

        {renderExpandableSection(
          "Information We Collect",
          `We collect the following types of information:

Health Data:
• Heart rate measurements
• Blood pressure readings
• Blood oxygen levels (SpO2)
• Body temperature
• Physical activity data
• Fall detection events
• Emergency alerts

Personal Information:
• Name and contact information
• Age and gender
• Emergency contact details
• Device identifiers
• Location data (when enabled)

Technical Data:
• App usage statistics
• Device performance metrics
• Error logs and crash reports
• Bluetooth connectivity data

All health data is collected only with your explicit consent and is encrypted both in transit and at rest.`,
          "information"
        )}

        {renderExpandableSection(
          "How We Use Your Information",
          `We use your information for the following purposes:

Primary Health Monitoring:
• Provide real-time health monitoring
• Generate health reports and trends
• Send alerts for abnormal readings
• Emergency response coordination

App Functionality:
• Personalize your experience
• Improve app performance
• Provide customer support
• Send important notifications

Research and Development:
• Improve our algorithms (anonymized data only)
• Develop new features
• Enhance device accuracy
• Medical research (with explicit consent)

We never sell your personal health data to third parties. Any data sharing for research purposes is completely anonymized and requires your explicit opt-in consent.`,
          "usage"
        )}

        {renderExpandableSection(
          "Data Storage and Security",
          `Your data security is our top priority:

Encryption:
• All data is encrypted using AES-256 encryption
• Secure transmission via TLS/SSL protocols
• End-to-end encryption for sensitive data

Storage:
• Health data stored securely on encrypted servers
• Regular security audits and penetration testing
• Compliance with healthcare data standards
• Data centers with 24/7 monitoring

Access Control:
• Role-based access to your data
• Multi-factor authentication
• Regular access reviews
• Automatic session timeouts

Data Retention:
• Health data retained as per your settings (default: 365 days)
• You can delete your data at any time
• Automatic deletion of old data
• Secure data destruction protocols`,
          "security"
        )}

        {renderExpandableSection(
          "Your Rights and Choices",
          `You have complete control over your data:

Data Access:
• View all collected data in the app
• Export your health data
• Request data reports
• Access data processing logs

Data Control:
• Opt-in/opt-out of data collection features
• Choose what data to share
• Set data retention periods
• Delete specific data points

Privacy Settings:
• Control notification preferences
• Manage emergency contact access
• Set sharing permissions
• Configure alert thresholds

Account Management:
• Update personal information
• Change privacy settings
• Deactivate monitoring features
• Delete your account completely

If you choose to delete your account, all personal data will be permanently removed within 30 days.`,
          "rights"
        )}

        {renderExpandableSection(
          "Emergency Data Sharing",
          `In emergency situations, we may share limited data:

Automatic Emergency Response:
• Location data with emergency services (if enabled)
• Basic health metrics for medical response
• Emergency contact notification
• Medical alert information

You can configure emergency sharing settings in the app. All emergency data sharing is designed to save lives and is limited to the minimum necessary information.

Emergency contacts will receive:
• Alert notifications
• Basic health status
• Location information (if enabled)
• Time and nature of emergency`,
          "emergency"
        )}

        {renderExpandableSection(
          "Third-Party Services",
          `We work with trusted partners to provide our services:

Cloud Storage:
• Encrypted data storage with certified providers
• Healthcare-compliant cloud infrastructure
• Regular security assessments
• Data processing agreements in place

Analytics:
• Anonymized usage analytics only
• No personal health data shared
• Opt-out available in settings
• GDPR and HIPAA compliant partners

Device Manufacturers:
• Minimal technical data for device functionality
• No personal health information shared
• Secure device pairing protocols
• Regular security updates

All third-party partners are required to maintain the same high standards of data protection and privacy that we uphold.`,
          "thirdparty"
        )}

        {renderExpandableSection(
          "International Data Transfers",
          `Your data may be processed in different countries:

Data Protection:
• All transfers comply with international privacy laws
• Adequate protection measures in place
• Standard contractual clauses used
• Regular compliance monitoring

Your Rights:
• Right to know where your data is processed
• Right to object to international transfers
• Right to data portability
• Right to local data storage (premium feature)

We ensure that regardless of where your data is processed, it receives the same level of protection as required by the strictest applicable privacy laws.`,
          "international"
        )}

        {renderExpandableSection(
          "Children's Privacy",
          `Our service is not intended for children under 18:

Age Restrictions:
• Minimum age of 18 to create an account
• Parental consent required for minors
• Special protections for youth data
• Age verification processes

If we discover that we have collected data from a child under 18 without proper consent, we will delete that information immediately.`,
          "children"
        )}

        {renderExpandableSection(
          "Changes to This Policy",
          `We may update this Privacy Policy from time to time:

Notification:
• Email notification of significant changes
• In-app notifications for policy updates
• 30-day notice period for major changes
• Option to review changes before they take effect

Your Choices:
• Continue using the service (acceptance)
• Opt-out of new data practices
• Delete your account if you disagree
• Export your data before changes take effect

We will always notify you of material changes and give you the opportunity to review and accept new terms before they become effective.`,
          "changes"
        )}

        <View style={styles.contactSection}>
          <Text style={styles.contactTitle}>Contact Us</Text>
          <Text style={styles.contactText}>
            If you have any questions about this Privacy Policy or our data
            practices, please contact us: Email: privacy@silverhealth.com Phone:
            +1 (555) 123-4567 Address: SilverHealth Privacy Office 123 Health
            Tech Boulevard Medical District, NY 10001 Data Protection Officer:
            Email: dpo@silverhealth.com Phone: +1 (555) 123-4568 We are
            committed to addressing your privacy concerns promptly and
            transparently.
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            © 2025 SilverHealth. All rights reserved.{"\n"}
            This Privacy Policy is effective as of January 1, 2025.
          </Text>
        </View>
      </ScrollView>
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
  introSection: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    marginVertical: 15,
  },
  introTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2196F3",
    marginBottom: 15,
    textAlign: "center",
  },
  introText: {
    fontSize: 14,
    lineHeight: 22,
    color: "#666",
    textAlign: "justify",
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginVertical: 5,
    overflow: "hidden",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    flex: 1,
  },
  sectionContent: {
    padding: 15,
  },
  contentText: {
    fontSize: 14,
    lineHeight: 22,
    color: "#666",
    textAlign: "justify",
  },
  contactSection: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    marginVertical: 15,
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 15,
  },
  contactText: {
    fontSize: 14,
    lineHeight: 22,
    color: "#666",
  },
  footer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    marginVertical: 15,
    marginBottom: 30,
  },
  footerText: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
    lineHeight: 18,
  },
});
