// screens/AdminReportsScreen.js
import React from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useReports } from "../context/ReportsContext";
import { useTheme } from "../context/ThemeContext";

export default function AdminReportsScreen() {
  const { reports, deleteReport } = useReports();
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={reports}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.reportCard, { backgroundColor: colors.card }]}>
            <Text style={{ color: colors.text, fontWeight: "700" }}>{item.title}</Text>
            <Text style={{ color: colors.text }}>{item.description}</Text>
            <Text style={{ color: colors.textSecondary }}>
              {item.isAnonymous ? "Anonymous" : item.reporterName}
            </Text>
            <TouchableOpacity
              style={[styles.deleteButton, { backgroundColor: colors.primary }]}
              onPress={() => deleteReport(item.id)}
            >
              <Text style={{ color: "#fff" }}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  reportCard: { padding: 12, borderRadius: 10, marginBottom: 12, elevation: 2 },
  deleteButton: { marginTop: 8, padding: 8, borderRadius: 8, alignItems: "center" },
});