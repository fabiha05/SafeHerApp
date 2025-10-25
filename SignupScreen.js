import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useUser } from "../context/UserContext";

export default function SignupScreen({ navigation }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [cnic, setCnic] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const { signup } = useUser();

  const handleSignup = async () => {
    if (!fullName || !email || !phone || !cnic || !password) {
      return Alert.alert("Error", "Please fill all required fields");
    }
    if (!agreeTerms) {
      return Alert.alert("Error", "You must agree to the terms");
    }

    try {
      setLoading(true);

      const newUser = {
        fullName,
        email,
        phone,
        cnic,
        password,
        role: "user",
        createdAt: new Date().toISOString(),
      };

      await signup(newUser);

      setLoading(false);
      Alert.alert("Success", "Account created successfully! Please login now.");

      // ✅ Signup ke baad sidha Login screen
      navigation.replace("Login");
    } catch (err) {
      setLoading(false);
      console.error("Signup error:", err);
      Alert.alert("Error", err.message || "Signup failed");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Back Button */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Ionicons name="arrow-back" size={24} color="#A25A6F" />
      </TouchableOpacity>

      {/* Logo */}
      <Image source={require("../assets/logo.png")} style={styles.logo} />

      <Text style={styles.title}>Create Account</Text>

      {/* Full Name */}
      <View style={styles.inputWrapper}>
        <Ionicons name="person-outline" size={20} color="#A25A6F" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={fullName}
          onChangeText={setFullName}
        />
      </View>

      {/* Email */}
      <View style={styles.inputWrapper}>
        <Ionicons name="mail-outline" size={20} color="#A25A6F" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Email Address"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      {/* Phone */}
      <View style={styles.inputWrapper}>
        <Ionicons name="call-outline" size={20} color="#A25A6F" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          maxLength={11}
        />
      </View>

      {/* CNIC */}
      <View style={styles.inputWrapper}>
        <Ionicons name="id-card-outline" size={20} color="#A25A6F" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="CNIC"
          value={cnic}
          onChangeText={setCnic}
          keyboardType="number-pad"
          maxLength={13}
        />
      </View>

      {/* Password */}
      <View style={styles.inputWrapper}>
        <Ionicons name="lock-closed-outline" size={20} color="#A25A6F" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Create Password"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity 
          onPress={() => setShowPassword(!showPassword)}
          style={styles.eyeIcon}
        >
          <Ionicons
            name={showPassword ? "eye-outline" : "eye-off-outline"}
            size={20}
            color="#A25A6F"
          />
        </TouchableOpacity>
      </View>

      {/* Terms */}
      <TouchableOpacity
        style={styles.checkboxContainer}
        onPress={() => setAgreeTerms(!agreeTerms)}
      >
        <View style={[styles.checkbox, agreeTerms && styles.checkboxChecked]}>
          {agreeTerms && (
            <Ionicons name="checkmark" size={14} color="#fff" />
          )}
        </View>
        <Text style={styles.checkboxLabel}>
          I agree to the{" "}
          <Text style={styles.link}>Terms of Service & Privacy</Text>
        </Text>
      </TouchableOpacity>

      {/* Create Account Button */}
      <TouchableOpacity
        style={[styles.button, (!agreeTerms || loading) && { opacity: 0.6 }]}
        disabled={!agreeTerms || loading}
        onPress={handleSignup}
      >
        <Text style={styles.buttonText}>
          {loading ? "Creating..." : "Create Account"}
        </Text>
      </TouchableOpacity>

      {/* Footer */}
      <View style={styles.footer}>
        <Text>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.link}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flexGrow: 1, 
    backgroundColor: "#F7E8EB",
    padding: 20,
    paddingTop: 60 
  },
  backButton: { position: "absolute", top: 40, left: 20, zIndex: 1 },
  logo: { width: 180, height: 180, alignSelf: "center", marginBottom: 20 },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    color: "#5E5D5D",
    marginBottom: 30,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 30,
    backgroundColor: "#FCF8F9",
    marginBottom: 15,
    paddingHorizontal: 15,
  },
  inputIcon: {
    marginRight: 10, // Added spacing between icon and input
  },
  input: { 
    flex: 1, 
    color: "#A25A6F", 
    paddingVertical: 12,
    paddingLeft: 5, // Added extra padding for better spacing
  },
  eyeIcon: {
    padding: 5, // Added padding for better touch area
  },
  checkboxContainer: { 
    flexDirection: "row", 
    alignItems: "center", 
    marginBottom: 20 
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "#A25A6F",
    borderRadius: 4,
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  checkboxChecked: {
    backgroundColor: '#E12764',
    borderColor: '#E12764',
  },
  checkboxLabel: { 
    fontSize: 13, 
    color: "#5E5D5D", 
    flexShrink: 1,
    flex: 1,
  },
  link: { color: "#A25A6F", fontWeight: "bold" },
  button: {
    backgroundColor: "#E12764",
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
    marginBottom: 25,
  },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  footer: { flexDirection: "row", justifyContent: "center" },
});