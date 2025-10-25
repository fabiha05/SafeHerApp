// screens/EmergencyContacts.js
import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Linking,
  Alert,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as SMS from "expo-sms";
import * as Location from "expo-location";
import { ContactsContext } from "../context/ContactsContext";
import { useTheme } from "../context/ThemeContext"; // ✅ import theme

export default function EmergencyContacts() {
  const { colors } = useTheme(); // ✅ dark/light colors
  const { contacts, setContacts } = useContext(ContactsContext);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newWhatsapp, setNewWhatsapp] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editWhatsapp, setEditWhatsapp] = useState("");

  const sendSOS = async () => {
    if (!contacts || contacts.length === 0) {
      Alert.alert("No contacts", "Please add emergency contacts first.");
      return;
    }

    // 📍 Location
    let locationText = "";
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Highest,
        });
        locationText = `\nLocation: https://maps.google.com/?q=${loc.coords.latitude},${loc.coords.longitude}`;
      }
    } catch (e) {}

    const phoneNumbers = contacts.map((c) => c.phone).filter(Boolean);
    const message = `🚨 SOS! I need urgent help.${locationText}`;

    // ✅ SMS
    if (phoneNumbers.length > 0) {
      const isAvailable = await SMS.isAvailableAsync();
      if (isAvailable) {
        try {
          await SMS.sendSMSAsync(phoneNumbers, message);
        } catch (err) {
          Alert.alert("Error", "Unable to send SMS.");
        }
      }
    }

    // ✅ WhatsApp
    contacts.forEach((c) => {
      if (c.whatsapp) {
        const url = `whatsapp://send?phone=${c.whatsapp}&text=${encodeURIComponent(
          message
        )}`;
        Linking.openURL(url).catch(() => {
          Alert.alert("WhatsApp Error", "WhatsApp not installed");
        });
      }
    });

    Alert.alert("SOS Sent", "SOS alert sent to all contacts.");
  };

  const addContact = () => {
    if (!newName.trim() || (!newPhone.trim() && !newWhatsapp.trim())) {
      Alert.alert("Validation", "Please enter at least one number.");
      return;
    }
    setContacts((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        name: newName.trim(),
        phone: newPhone.trim(),
        whatsapp: newWhatsapp.trim(),
      },
    ]);
    setNewName("");
    setNewPhone("");
    setNewWhatsapp("");
  };

  const deleteContact = (id) => {
    setContacts((prev) => prev.filter((c) => c.id !== id));
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setEditName(item.name);
    setEditPhone(item.phone);
    setEditWhatsapp(item.whatsapp || "");
  };

  const saveEdit = () => {
    setContacts((prev) =>
      prev.map((c) =>
        c.id === editingId
          ? {
              ...c,
              name: editName.trim(),
              phone: editPhone.trim(),
              whatsapp: editWhatsapp.trim(),
            }
          : c
      )
    );
    setEditingId(null);
    setEditName("");
    setEditPhone("");
    setEditWhatsapp("");
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.header, { color: colors.text }]}> Emergency Contacts</Text>

      <TouchableOpacity
        style={[styles.sosButton, { backgroundColor: colors.primary }]}
        onPress={sendSOS}
      >
        <Ionicons name="alert-circle-outline" size={20} color="#fff" />
        <Text style={styles.sosText}>Send SOS Now</Text>
      </TouchableOpacity>

      {/* Add */}
      <View style={styles.inputRow}>
        <TextInput
          placeholder="Name"
          placeholderTextColor={colors.placeholder}
          style={[styles.input, { color: colors.text, borderColor: colors.placeholder }]}
          value={newName}
          onChangeText={setNewName}
        />
        <TextInput
          placeholder="Phone"
          placeholderTextColor={colors.placeholder}
          style={[styles.input, { marginLeft: 8, color: colors.text, borderColor: colors.placeholder }]}
          value={newPhone}
          onChangeText={setNewPhone}
          keyboardType="phone-pad"
        />
        <TextInput
          placeholder="WhatsApp"
          placeholderTextColor={colors.placeholder}
          style={[styles.input, { marginLeft: 8, color: colors.text, borderColor: colors.placeholder }]}
          value={newWhatsapp}
          onChangeText={setNewWhatsapp}
          keyboardType="phone-pad"
        />
      </View>
      <TouchableOpacity
        style={[styles.addBtn, { backgroundColor: "#E12764" }]}
        onPress={addContact}
      >
        <Text style={{ color: "#fff" }}>Add Contact</Text>
      </TouchableOpacity>

      <FlatList
        data={contacts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingTop: 12 }}
        renderItem={({ item }) => (
          <View style={[styles.contactCard, { backgroundColor: colors.card }]}>
            {editingId === item.id ? (
              <View style={{ flex: 1 }}>
                <TextInput
                  value={editName}
                  onChangeText={setEditName}
                  placeholderTextColor={colors.placeholder}
                  style={[styles.input, { color: colors.text, borderColor: colors.placeholder }]}
                />
                <TextInput
                  value={editPhone}
                  onChangeText={setEditPhone}
                  placeholderTextColor={colors.placeholder}
                  style={[styles.input, { marginTop: 8, color: colors.text, borderColor: colors.placeholder }]}
                  keyboardType="phone-pad"
                />
                <TextInput
                  value={editWhatsapp}
                  onChangeText={setEditWhatsapp}
                  placeholderTextColor={colors.placeholder}
                  style={[styles.input, { marginTop: 8, color: colors.text, borderColor: colors.placeholder }]}
                  keyboardType="phone-pad"
                />
                <View style={{ flexDirection: "row", marginTop: 8 }}>
                  <TouchableOpacity
                    style={[styles.actionBtn, { backgroundColor: "#2a9d8f" }]}
                    onPress={saveEdit}
                  >
                    <Text style={{ color: "#fff" }}>Save</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.actionBtn,
                      { backgroundColor: "#888", marginLeft: 8 },
                    ]}
                    onPress={() => setEditingId(null)}
                  >
                    <Text style={{ color: "#fff" }}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <>
                <View>
                  <Text style={[styles.name, { color: colors.text }]}>{item.name}</Text>
                  <Text style={[styles.phone, { color: colors.text }]}>
                    📞 {item.phone || "No Phone"}
                  </Text>
                  <Text style={[styles.phone, { color: colors.text }]}>
                    💬 {item.whatsapp || "No WhatsApp"}
                  </Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <TouchableOpacity
                    style={[styles.iconBtn, { backgroundColor: "#4b7bec" }]}
                    onPress={() => startEdit(item)}
                  >
                    <Ionicons name="create-outline" size={18} color="#fff" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.iconBtn,
                      { backgroundColor: "#e63946", marginLeft: 8 },
                    ]}
                    onPress={() => deleteContact(item.id)}
                  >
                    <Ionicons name="trash-outline" size={18} color="#fff" />
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
    textAlign: "center",
  },
  sosButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 10,
  },
  sosText: { color: "#fff", marginLeft: 8, fontWeight: "700" },
  inputRow: { flexDirection: "row", marginTop: 12 },
  input: {
    flex: 1,
    borderWidth: 1,
    padding: 8,
    borderRadius: 8,
  },
  addBtn: {
    marginTop: 8,
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  contactCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  name: { fontSize: 16, fontWeight: "600" },
  phone: { marginTop: 2 },
  iconBtn: { padding: 8, borderRadius: 6 },
  actionBtn: { padding: 8, borderRadius: 8 },
});
