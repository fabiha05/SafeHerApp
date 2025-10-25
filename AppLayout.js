import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { useTheme } from "../context/ThemeContext"; // Dark mode
import { useLanguage } from "../context/LanguageContext"; // Language

export default function AppLayout({ children }) {
  const { colors } = useTheme();
  const { t } = useLanguage();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20 },
});
