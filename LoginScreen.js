// LoginScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useUser } from "../context/UserContext";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useUser();

  const handleLogin = async () => {
    if (!email || !password) {
      return Alert.alert("Error", "Please fill in all fields");
    }

    try {
      setLoading(true);
      const result = await login(email, password);
      
      //if (result.success) {
        // Navigation is handled automatically by auth state listener
       // console.log("Login successful");
      if (result.success) {
  // ✅ Navigation will happen automatically via UserContext auth listener
         console.log("Login successful - navigation in progress");
      } else {
        if (result.error === "blocked") {
          Alert.alert(
            "Account Blocked", 
            "Your account has been blocked. Please contact support."
          );
        } else {
          Alert.alert("Login Failed", result.error || "Invalid email or password");
        }
      }
    } catch (err) {
      console.error("Login error:", err);
      Alert.alert("Error", "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require("../assets/logo.png")} style={styles.logo} />
      <Text style={styles.title}>Welcome Back</Text>

      <Text style={styles.label}>Email Address</Text>
      <View style={styles.inputWrapper}>
        <Ionicons name="mail-outline" size={20} color="#A25A6F" />
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          placeholderTextColor="#A25A6F"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
      </View>
      

      <Text style={styles.label}>Password</Text>
      <View style={styles.inputWrapper}>
        <Ionicons name="lock-closed-outline" size={20} color="#A25A6F" />
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          placeholderTextColor="#A25A6F"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons 
            name={showPassword ? "eye-outline" : "eye-off-outline"} 
            size={20} 
            color="#A25A6F" 
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={[styles.button, loading && { opacity: 0.6 }]} 
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Sign In Securely</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity 
       style={styles.forgotPassword}
        onPress={() => navigation.navigate('ForgotPassword')}>
      <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text>Don't have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
          <Text style={styles.link}>Create Account</Text>
        </TouchableOpacity>
      </View>
    </View>
    
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#F7E8EB", 
    padding: 20, 
    justifyContent: "center" 
  },
  logo: { 
    width: 200, 
    height: 195, 
    alignSelf: "center", 
    marginBottom: 20 
  },
  title: { 
    fontSize: 26, 
    fontWeight: "bold", 
    textAlign: "center", 
    color: "#5E5D5D", 
    marginBottom: 30 
  },
  label: { 
    fontSize: 16, 
    color: "#5E5D5D", 
    fontWeight: "bold", 
    marginBottom: 5,
    marginLeft: 5 
  },
  inputWrapper: { 
    flexDirection: "row", 
    alignItems: "center", 
    borderWidth: 1, 
    borderColor: "#ddd", 
    borderRadius: 30, 
    backgroundColor: "#FCF8F9", 
    marginBottom: 20, 
    paddingHorizontal: 15 
  },
  input: { 
    flex: 1, 
    color: "#A25A6F", 
    paddingVertical: 12,
    paddingHorizontal: 10 
  },
  button: {
    backgroundColor: "#e91e63",
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
    marginBottom: 25,
    minHeight: 50,
    justifyContent: 'center'
  },
  buttonText: { 
    color: "#fff", 
    fontSize: 19, 
    fontWeight: "bold" 
  },
  footer: { 
    flexDirection: "row", 
    justifyContent: "center" 
  },
  link: { 
    color: "#A25A6F", 
    fontWeight: "bold" 
  },
  forgotPassword: {
   alignItems: 'center',
   marginBottom: 20,
},
 forgotPasswordText: {
  color: '#A25A6F',
  fontSize: 16,
  fontWeight: 'bold',
},
});
