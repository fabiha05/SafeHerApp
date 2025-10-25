// screens/AppLockScreen.js
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../context/ThemeContext";

export default function AppLockScreen({ navigation }) {
  const { colors } = useTheme();
  const [pin, setPin] = useState("");
  const [storedPin, setStoredPin] = useState(null);

  useEffect(() => {
    AsyncStorage.getItem("appLockPin").then((value) => {
      if (!value) {
        AsyncStorage.setItem("appLockPin", "1234"); // default PIN
        setStoredPin("1234");
      } else {
        setStoredPin(value);
      }
    });
  }, []);

  const handleUnlock = () => {
    if (pin === storedPin) {
      navigation.replace("MainApp");
    } else {
      Alert.alert("Incorrect PIN", "Please enter the correct PIN.");
      setPin("");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Enter PIN to Unlock</Text>
      <TextInput
        style={[styles.input, { color: colors.text, borderColor: colors.primary }]}
        value={pin}
        onChangeText={setPin}
        keyboardType="numeric"
        secureTextEntry
        maxLength={4}
        placeholder="****"
        placeholderTextColor={colors.placeholder || "#999"}
      />
      <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]} onPress={handleUnlock}>
        <Text style={styles.buttonText}>Unlock</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  input: { width: "50%", borderWidth: 1, borderRadius: 10, textAlign: "center", fontSize: 20, padding: 10, marginBottom: 20 },
  button: { paddingVertical: 12, paddingHorizontal: 30, borderRadius: 10 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
