import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  ScrollView,
  Modal,
  Pressable,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import { useUser } from "../context/UserContext";

export default function SettingsScreen() {
  const { colors, toggleDarkMode, isDarkMode } = useTheme();
  const { t, changeLanguage, language } = useLanguage();
  const { currentUser, logout } = useUser();
  const [appLock, setAppLock] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [isHelpModalVisible, setIsHelpModalVisible] = useState(false);
  const [isAboutModalVisible, setIsAboutModalVisible] = useState(false);

  // Load App Lock preference from AsyncStorage
  useEffect(() => {
    const loadAppLock = async () => {
      try {
        const savedValue = await AsyncStorage.getItem("appLockEnabled");
        if (savedValue !== null) {
          setAppLock(savedValue === "true");
        }
      } catch (error) {
        console.log("Error loading App Lock preference:", error);
      }
    };
    loadAppLock();
  }, []);

  // Save App Lock preference to AsyncStorage
  const toggleAppLock = async (value) => {
    setAppLock(value);
    try {
      await AsyncStorage.setItem("appLockEnabled", value ? "true" : "false");
      Alert.alert("App Lock", `App Lock has been ${value ? "enabled" : "disabled"}`);
    } catch (error) {
      console.log("Error saving App Lock preference:", error);
    }
  };

  const handleLanguageSelect = (lang) => {
    changeLanguage(lang);
    setModalVisible(false);
  };

  const handleLogout = () => {
    Alert.alert(
      t("sign_out"),
      t("confirm_logout") || "Are you sure you want to logout?",
      [
        { text: t("cancel") || "Cancel", style: "cancel" },
        {
          text: t("logout") || "Logout",
          style: "destructive",
          onPress: () => logout(),
        },
      ]
    );
  };

  const helpContent = [
     {
      question: 'Is my data secure and private?',
      answer: 'Yes, all your data is encrypted end-to-end and stored securely. We never share your information without your explicit consent. Your privacy and safety are our top priorities.',
    },
    {
      question: 'Can someone else see that I\'m using this app?',
      answer: 'The app is designed to be discreet. You can enable App Lock to prevent unauthorized access.',
    },
    {
      question: 'What happens when I press the emergency button?',
      answer: 'The emergency button will immediately notify your emergency contacts, share your location (if enabled), and provide quick access to emergency services.',
    },
    {
      question: 'How do I create a safety plan?',
      answer: 'Go to Resources > Safety Planning to access our step-by-step guide. This will help you prepare for various scenarios and identify safe places and trusted contacts.',
    },
    {
      question: 'Is there someone I can talk to immediately?',
      answer: 'Yes, use the Support Chat feature for AI-powered assistance, or contact the emergency hotlines listed in the Resources section for immediate human support.',
    },
  ];
    
  const aboutContent = (
    <View style={styles.aboutUsContent}>
      <Text style={styles.sectionTitle}>Our Mission</Text>
        <Text style={styles.sectionText}>
          Safe Her is dedicated to providing a safe and supportive space for women experiencing domestic violence. 
          Our mission is to empower survivors with resources, information, and a sense of community, helping them 
          navigate their journey towards safety and healing.
        </Text>
        
        <Text style={styles.sectionTitle}>About Safe Her</Text>
        <Text style={styles.sectionText}>
          Safe Her is a mobile application designed to support women experiencing domestic violence. It offers a 
          range of features, including emergency contacts, safety planning tools, educational resources, and a 
          supportive community forum. The app is developed and maintained by a team of dedicated professionals 
          and volunteers committed to ending domestic violence.
        </Text>
        
        <Text style={styles.sectionTitle}>Our Team</Text>
        <Text style={styles.sectionText}>
          Our team comprises experts in domestic violence advocacy, technology, and mental health. We work 
          collaboratively to ensure the app remains a reliable and effective resource for survivors. We are 
          passionate about creating a world where all women can live free from violence.
        </Text>
    </View>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Profile Box */}
      <View style={styles.profileBox}>
        <View style={[styles.avatar, { backgroundColor: "#E12764"}]}>
          <Text style={{ color: "white", fontSize: 24, fontWeight: "bold" }}>
            {currentUser.fullName.charAt(0).toUpperCase()}
          </Text>
        </View>
        <Text style={[styles.name, { color: colors.text }]}>{currentUser.fullName}</Text>
        <Text style={[styles.role, { color: colors.text }]}>{t("registered_user")}</Text>
      </View>

      {/* Privacy & Security */}
      <Text style={[styles.sectionTitle, { color: colors.text }]}>{t("privacy_security")}</Text>
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Row icon="key-outline" label={t("app_lock")} value={appLock} onValueChange={toggleAppLock} colors={colors} />
      </View>

      {/* Notifications */}
      <Text style={[styles.sectionTitle, { color: colors.text }]}>{t("notifications")}</Text>
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Row icon="notifications-outline" label={t("push_notifications")} value={pushNotifications} onValueChange={setPushNotifications} colors={colors} />
      </View>

      {/* Accessibility */}
      <Text style={[styles.sectionTitle, { color: colors.text }]}>{t("accessibility")}</Text>
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <LinkRow icon="language-outline" label={t("language")} value={language.toUpperCase()} onPress={() => setModalVisible(true)} colors={colors} />
        <Row icon="moon-outline" label={t("dark_mode")} value={isDarkMode} onValueChange={toggleDarkMode} colors={colors} />
      </View>

      {/* Support */}
      <Text style={[styles.sectionTitle, { color: colors.text }]}>{t("support")}</Text>
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <LinkRow icon="help-circle-outline" label={t("help_faq")} onPress={() => setIsHelpModalVisible(true)} colors={colors} />
      </View>

      {/* About Us */}
      <Text style={[styles.sectionTitle, { color: colors.text }]}>{t("about_us")}</Text>
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <LinkRow icon="information-circle-outline" label={t("about_us")} onPress={() => setIsAboutModalVisible(true)} colors={colors} />
      </View>

      {/* Sign Out Button */}
      <TouchableOpacity style={[styles.signOutBtn, { backgroundColor: '#E12764' }]} onPress={handleLogout}>
        <Text style={styles.signOutText}>{t("sign_out")}</Text>
      </TouchableOpacity>

      {/* Language Modal */}
      <Modal transparent visible={modalVisible} animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>{t("language")}</Text>
            <TouchableOpacity style={styles.modalOption} onPress={() => handleLanguageSelect("en")}>
              <Text style={[styles.modalOptionText, { color: colors.text }]}>English</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalOption} onPress={() => handleLanguageSelect("ur")}>
              <Text style={[styles.modalOptionText, { color: colors.text }]}>اردو</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      {/* Help Modal */}
      <Modal visible={isHelpModalVisible} animationType="slide" onRequestClose={() => setIsHelpModalVisible(false)}>
        <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <Text style={[styles.modalHeader, { color: colors.text }]}>Help & FAQ</Text>
          <ScrollView>
            {helpContent.map((item, index) => (
              <View key={index} style={styles.faqItem}>
                <Text style={[styles.question, { color: colors.text }]}>{item.question}</Text>
                <Text style={[styles.answer, { color: colors.text }]}>{item.answer}</Text>
              </View>
            ))}
          </ScrollView>
          <TouchableOpacity style={[styles.closeButton, { backgroundColor:"#E12764" }]} onPress={() => setIsHelpModalVisible(false)}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* About Modal */}
      <Modal visible={isAboutModalVisible} animationType="slide" onRequestClose={() => setIsAboutModalVisible(false)}>
        <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <Text style={[styles.modalHeader, { color: colors.text }]}>About Us</Text>
          <ScrollView>{aboutContent}</ScrollView>
          <TouchableOpacity style={[styles.closeButton, { backgroundColor: '#E12764' }]} onPress={() => setIsAboutModalVisible(false)}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </ScrollView>
  );
}

// Switch Row
function Row({ icon, label, value, onValueChange, colors }) {
  return (
    <View style={styles.row}>
      <Ionicons name={icon} size={22} color={colors.text} style={{ marginRight: 10 }} />
      <Text style={[styles.rowLabel, { color: colors.text }]}>{label}</Text>
      <Switch value={value} onValueChange={onValueChange} trackColor={{ false: "#ccc", true: colors.primary }} thumbColor={colors.switchThumb} />
    </View>
  );
}

// Link Row
function LinkRow({ icon, label, value, onPress, colors }) {
  return (
    <TouchableOpacity style={styles.row} onPress={onPress}>
      <Ionicons name={icon} size={22} color={colors.text} style={{ marginRight: 10 }} />
      <Text style={[styles.rowLabel, { color: colors.text }]}>{label}</Text>
      {value && <Text style={[styles.rowValue, { color: colors.text }]}>{value}</Text>}
      <Ionicons name="chevron-forward-outline" size={20} color={colors.placeholder} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  profileBox: { alignItems: "center", padding: 20 },
  avatar: { width: 80, height: 80, borderRadius: 40, alignItems: "center", justifyContent: "center", marginBottom: 10 },
  name: { fontSize: 20, fontWeight: "600" },
  role: { fontSize: 14 },
  sectionTitle: { marginTop: 10, marginLeft: 15, marginBottom: 5, fontSize: 16, fontWeight: "600" },
  sectionText: { fontSize: 14, lineHeight: 22, color: "#000" },
  card: { borderRadius: 12, marginHorizontal: 15, marginBottom: 10, padding: 5, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 3, elevation: 2 },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 12, paddingHorizontal: 10, borderBottomWidth: 1, borderBottomColor: "#eee" },
  rowLabel: { flex: 1, fontSize: 15 },
  rowValue: { fontSize: 13, marginRight: 5 },
  signOutBtn: { margin: 20, paddingVertical: 14, borderRadius: 12, alignItems: "center" },
  signOutText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: 220, borderRadius: 12, paddingVertical: 20 },
  modalTitle: { fontSize: 16, fontWeight: '600', textAlign: 'center', marginBottom: 15 },
  modalOption: { paddingVertical: 10, paddingHorizontal: 20 },
  modalOptionText: { fontSize: 15, textAlign: 'center' },
  modalContainer: { flex: 1, padding: 20 , color: "#FCF8F9"},
  modalHeader: { fontSize: 22, fontWeight: "bold", marginBottom: 15 },
  faqItem: { marginBottom: 15 },
  question: { fontWeight: "bold", fontSize: 15 },
  answer: { fontSize: 13, marginTop: 5 },
  aboutUsContent: { padding: 10 },
  closeButton: { marginTop: 20, alignSelf: "center", paddingVertical: 10, paddingHorizontal: 30, borderRadius: 10 },
  closeButtonText: { color: "#fff", fontSize: 16 },
});
