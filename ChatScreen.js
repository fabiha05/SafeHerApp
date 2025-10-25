// screens/ChatScreen.js
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { useTheme } from "../context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const GEMINI_API_KEY = "AIzaSyChOTHl3HzxoipdHj3qu5KmfKl80SeY0bY"; // Replace with your key

export default function ChatScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();

  const [messages, setMessages] = useState([
    { id: "1", text: "Hello! How can I help you today?", sender: "bot" },
  ]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef();

  const sendMessageToGemini = async (text) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
        { contents: [{ parts: [{ text }] }] },
        { headers: { "Content-Type": "application/json" } }
      );

      const botReply =
        response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "I couldn't understand. Please rephrase.";

      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), text: botReply, sender: "bot" },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), text: "Something went wrong!", sender: "bot" },
      ]);
    }
    setLoading(false);
  };

  const handleSend = () => {
    if (!inputText.trim()) return;
    const userMessage = { id: Date.now().toString(), text: inputText, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    sendMessageToGemini(inputText);
    setInputText("");
  };

  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const renderItem = ({ item }) => (
    <View
      style={[
        styles.messageBubble,
        {
          backgroundColor:
            item.sender === "user" ? colors.primary : colors.card,
          alignSelf: item.sender === "user" ? "flex-end" : "flex-start",
          borderTopLeftRadius: item.sender === "user" ? 20 : 0,
          borderTopRightRadius: item.sender === "user" ? 0 : 20,
        },
      ]}
    >
      <Text
        style={[
          styles.messageText,
          { color: item.sender === "user" ? colors.background : colors.text },
        ]}
      >
        {item.text}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      {/* Navbar without Cross Button */}
      <View style={styles.navBar}>
        <Text style={[styles.navTitle, { color: colors.text }]}>ChatBot</Text>
      </View>

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 10, paddingBottom: 10 }}
        />

        {loading && (
          <View style={styles.loadingIndicator}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text style={[styles.typingText, { color: colors.text }]}>AI is typing...</Text>
          </View>
        )}

        {/* Input + Send */}
        <View style={[styles.inputWrapper, { backgroundColor: colors.card }]}>
          <TextInput
            style={[styles.input, { backgroundColor: colors.input, color: colors.text }]}
            placeholder="Type a message..."
            placeholderTextColor={colors.placeholder}
            value={inputText}
            onChangeText={setInputText}
            multiline
          />
          <TouchableOpacity
            style={[styles.sendButton, { backgroundColor: "#E12764" }]}
            onPress={handleSend}
          >
            <Text style={[styles.sendButtonText, { color: colors.background }]}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },

  navBar: {
    height: 70,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 15,
    marginTop: 10,
    marginHorizontal: 10,
    borderRadius: 15,
    backgroundColor: "transparent",
  },
  navTitle: { 
    fontSize: 22, 
    fontWeight: "bold",
    textAlign: "center",
  },

  container: { flex: 1 },

  messageBubble: {
    padding: 14,
    marginVertical: 5,
    maxWidth: "75%",
    borderRadius: 20,
  },
  messageText: { fontSize: 16 },

  loadingIndicator: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingBottom: 5,
  },
  typingText: { marginLeft: 5, fontSize: 14 },

  inputWrapper: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginHorizontal: 10,
    marginBottom: 10,
    alignItems: "center",
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    fontSize: 16,
    backgroundColor: "#FCF8F9",
  },
  sendButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginLeft: 8,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
  },
  sendButtonText: { fontWeight: "bold", fontSize: 16 },
});