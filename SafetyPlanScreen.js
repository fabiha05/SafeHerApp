// screens/SafetyPlanScreen.js
import React from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView 
} from "react-native";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";

export default function SafetyPlanScreen({ navigation }) {
  const { colors } = useTheme();
  const { t } = useLanguage();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header - Centered */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>{t("safetyPlan") || "My Safety Plan"}</Text>
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.description, { color: colors.text }]}>
          <Text style={styles.bold}>1. Safe Places:</Text> Identify safe locations to go to in an emergency, such as a friend's house, a shelter, or a public place.{'\n\n'}
          <Text style={styles.bold}>2. Emergency Contacts:</Text> List emergency contacts, including friends, family, and local support services.{'\n\n'}
          <Text style={styles.bold}>3. Communication Strategies:</Text> Develop strategies for safe communication, such as using a code word or a different phone.{'\n\n'}
          <Text style={styles.bold}>4. Essentials to Take:</Text> Prepare a bag with essential items to take if you need to leave quickly, including important documents, money, and medications.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  content: {
    paddingBottom: 30,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  bold: {
    fontWeight: "bold",
    color: "#E12764",
  },
});