import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  Linking,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as Contacts from "expo-contacts";

export default function EmergencyContacts() {
  const [contacts, setContacts] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    relationship: "",
    isPrimary: false,
  });

  useEffect(() => {
    loadEmergencyContacts();
  }, []);

  const loadEmergencyContacts = async () => {
    try {
      // This would typically fetch from your backend API
      // For now, using mock data
      const mockContacts = [
        {
          id: "1",
          name: "Dr. John Smith",
          phone: "+237123456789",
          relationship: "Doctor",
          isPrimary: true,
        },
        {
          id: "2",
          name: "Mary Johnson",
          phone: "+237987654321",
          relationship: "Daughter",
          isPrimary: false,
        },
      ];
      setContacts(mockContacts);
    } catch (error) {
      console.error("Error loading emergency contacts:", error);
    }
  };

  const openModal = (contact = null) => {
    if (contact) {
      setEditingContact(contact);
      setFormData(contact);
    } else {
      setEditingContact(null);
      setFormData({ name: "", phone: "", relationship: "", isPrimary: false });
    }
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingContact(null);
    setFormData({ name: "", phone: "", relationship: "", isPrimary: false });
  };

  const saveContact = async () => {
    if (!formData.name || !formData.phone) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    try {
      if (editingContact) {
        // Update existing contact
        const updatedContacts = contacts.map((contact) =>
          contact.id === editingContact.id
            ? { ...formData, id: editingContact.id }
            : contact
        );
        setContacts(updatedContacts);
      } else {
        // Add new contact
        const newContact = {
          ...formData,
          id: Date.now().toString(),
        };
        setContacts([...contacts, newContact]);
      }
      closeModal();
      Alert.alert("Success", "Emergency contact saved successfully");
    } catch (error) {
      Alert.alert("Error", "Failed to save contact");
    }
  };

  const deleteContact = (contactId) => {
    Alert.alert(
      "Delete Contact",
      "Are you sure you want to delete this emergency contact?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setContacts(contacts.filter((contact) => contact.id !== contactId));
          },
        },
      ]
    );
  };

  const callContact = (phone) => {
    const phoneUrl = `tel:${phone}`;
    Linking.canOpenURL(phoneUrl).then((supported) => {
      if (supported) {
        Linking.openURL(phoneUrl);
      } else {
        Alert.alert("Error", "Phone calls are not supported on this device");
      }
    });
  };

  const importFromContacts = async () => {
    try {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === "granted") {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers],
        });

        if (data.length > 0) {
          // Show contact picker (simplified version)
          Alert.alert(
            "Import Contacts",
            "Contact import feature will be implemented"
          );
        }
      }
    } catch (error) {
      Alert.alert("Error", "Failed to access contacts");
    }
  };

  const renderContactItem = (contact) => (
    <View key={contact.id} style={styles.contactItem}>
      <View style={styles.contactInfo}>
        <View style={styles.contactHeader}>
          <Text style={styles.contactName}>{contact.name}</Text>
          {contact.isPrimary && (
            <View style={styles.primaryBadge}>
              <Text style={styles.primaryBadgeText}>PRIMARY</Text>
            </View>
          )}
        </View>
        <Text style={styles.contactPhone}>{contact.phone}</Text>
        <Text style={styles.contactRelationship}>{contact.relationship}</Text>
      </View>
      <View style={styles.contactActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => callContact(contact.phone)}
        >
          <Ionicons name="call" size={20} color="#4CAF50" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => openModal(contact)}
        >
          <Ionicons name="create" size={20} color="#2196F3" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => deleteContact(contact.id)}
        >
          <Ionicons name="trash" size={20} color="#F44336" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Emergency Contacts</Text>
        <TouchableOpacity onPress={() => openModal()}>
          <Ionicons name="add" size={24} color="#2196F3" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={24} color="#FF9800" />
          <Text style={styles.infoText}>
            These contacts will be notified in case of emergency alerts from
            your health monitoring device.
          </Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Emergency Contacts</Text>
            <TouchableOpacity
              onPress={importFromContacts}
              style={styles.importButton}
            >
              <Ionicons name="person-add" size={16} color="#2196F3" />
              <Text style={styles.importButtonText}>Import</Text>
            </TouchableOpacity>
          </View>

          {contacts.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="people-outline" size={48} color="#ccc" />
              <Text style={styles.emptyStateText}>
                No emergency contacts added
              </Text>
              <TouchableOpacity
                style={styles.addFirstButton}
                onPress={() => openModal()}
              >
                <Text style={styles.addFirstButtonText}>Add First Contact</Text>
              </TouchableOpacity>
            </View>
          ) : (
            contacts.map(renderContactItem)
          )}
        </View>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingContact ? "Edit Contact" : "Add Contact"}
              </Text>
              <TouchableOpacity onPress={closeModal}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Name *</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.name}
                  onChangeText={(text) =>
                    setFormData({ ...formData, name: text })
                  }
                  placeholder="Enter contact name"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Phone Number *</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.phone}
                  onChangeText={(text) =>
                    setFormData({ ...formData, phone: text })
                  }
                  placeholder="+237 123 456 789"
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Relationship</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.relationship}
                  onChangeText={(text) =>
                    setFormData({ ...formData, relationship: text })
                  }
                  placeholder="e.g., Doctor, Family, Friend"
                />
              </View>

              <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={() =>
                  setFormData({ ...formData, isPrimary: !formData.isPrimary })
                }
              >
                <Ionicons
                  name={formData.isPrimary ? "checkbox" : "checkbox-outline"}
                  size={24}
                  color="#2196F3"
                />
                <Text style={styles.checkboxLabel}>Set as primary contact</Text>
              </TouchableOpacity>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={closeModal}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={saveContact}>
                <Text style={styles.saveButtonText}>Save</Text>
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
    fontWeight: "bold",
    color: "#333",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  infoText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  importButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#e3f2fd",
    borderRadius: 20,
  },
  importButtonText: {
    marginLeft: 5,
    fontSize: 14,
    color: "#2196F3",
  },
  contactItem: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  contactInfo: {
    flex: 1,
  },
  contactHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  contactName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  primaryBadge: {
    marginLeft: 10,
    backgroundColor: "#4CAF50",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  primaryBadgeText: {
    fontSize: 10,
    color: "#fff",
    fontWeight: "bold",
  },
  contactPhone: {
    fontSize: 14,
    color: "#2196F3",
    marginBottom: 2,
  },
  contactRelationship: {
    fontSize: 14,
    color: "#666",
  },
  contactActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    padding: 8,
    marginLeft: 5,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#666",
    marginTop: 10,
    marginBottom: 20,
  },
  addFirstButton: {
    backgroundColor: "#2196F3",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  addFirstButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  modalBody: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  checkboxLabel: {
    marginLeft: 10,
    fontSize: 16,
    color: "#333",
  },
  modalFooter: {
    flexDirection: "row",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  cancelButton: {
    flex: 1,
    padding: 12,
    alignItems: "center",
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    color: "#666",
  },
  saveButton: {
    flex: 1,
    padding: 12,
    alignItems: "center",
    backgroundColor: "#2196F3",
    borderRadius: 8,
  },
  saveButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
});
