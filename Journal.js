import React from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Share,
} from "react-native";
import { useReports } from "../context/ReportsContext";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import { Ionicons } from "@expo/vector-icons";

export default function Journal({ navigation }) {
//  const { reports, removeReport } = useReports();
const { reports, deleteReport } = useReports();

  const { colors } = useTheme();
  const { t } = useLanguage();

  const handleExport = async (item) => {
    try {
      let message = `${t("title")}: ${item.title || ""}\n${t("description")}: ${item.description || ""}\n`;
      if (!item.isAnonymous) {
        if (item.reporterName) message += `${t("reporter")}: ${item.reporterName}\n`;
        if (item.reporterEmail) message += `📧 ${item.reporterEmail}\n`;
        if (item.reporterPhone) message += `📱 ${item.reporterPhone}\n`;
        if (item.reporterCnic) message += `🆔 ${item.reporterCnic}\n`;
      }
      if (item.dateTime) message += `🕒 ${item.dateTime}\n`;
      if (item.location) message += `📍 ${item.location}\n`;
      await Share.share({ message });
    } catch (error) {
      alert(t("share_error") || "Error sharing report");
    }
  };

  const renderReport = ({ item }) => (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.card, shadowColor: colors.text },
      ]}
    >
      {/* Image */}
      {item.image && <Image source={{ uri: item.image }} style={styles.image} />}

      {/* Title */}
      <Text style={[styles.title, { color: colors.text }]}>
        {item.title || t("title")}
      </Text>

      {/* Description */}
      <Text style={[styles.description, { color: colors.text }]}>
        {item.description || t("no_description")}
      </Text>

      {/* Reporter info */}
      {!item.isAnonymous && (
        <View style={{ marginBottom: 10 }}>
          {item.reporterName && (
            <Text style={[styles.reporter, { color: colors.text }]}>
              {t("reporter")}: {item.reporterName}
            </Text>
          )}
          {item.reporterEmail && (
            <Text style={[styles.reporter, { color: colors.text }]}>
              📧 {item.reporterEmail}
            </Text>
          )}
          {item.reporterPhone && (
            <Text style={[styles.reporter, { color: colors.text }]}>
              📱 {item.reporterPhone}
            </Text>
          )}
          {item.reporterCnic && (
            <Text style={[styles.reporter, { color: colors.text }]}>
              🆔 {item.reporterCnic}
            </Text>
          )}
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.actions}>
        {/* Delete */}
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#FF4D4D" }]}
          //onPress={() => removeReport(item.id)}
          onPress={() => deleteReport(item.id)}

        >
          
          <Ionicons name="trash-outline" size={18} color="#fff" />
          <Text style={styles.buttonText}>{t("delete")}</Text>
        </TouchableOpacity>

        {/* Edit */}
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={() => navigation.navigate("ReportScreen", { reportToEdit: item })}
        >
          <Ionicons name="create-outline" size={18} color="#fff" />
          <Text style={styles.buttonText}>{t("edit")}</Text>
        </TouchableOpacity>

        {/* Export */}
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#4CAF50" }]}
          onPress={() => handleExport(item)}
        >
          <Ionicons name="share-social-outline" size={18} color="#fff" />
          <Text style={styles.buttonText}>{t("export") || "Export"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {reports.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: colors.text }]}>
            {t("no_reports")}
          </Text>
        </View>
      ) : (
        <FlatList
          data={reports}
          keyExtractor={(item) => item.id}
          renderItem={renderReport}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15 },
  card: {
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  image: { width: "100%", height: 180, borderRadius: 12, marginBottom: 10 },
  title: { fontWeight: "bold", fontSize: 17, marginBottom: 6 },
  description: { fontSize: 14, marginBottom: 8 },
  reporter: { fontStyle: "italic", fontSize: 13, marginBottom: 4 },
  actions: { flexDirection: "row", justifyContent: "flex-end" },
  button: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginLeft: 10,
  },
  buttonText: { color: "#fff", fontWeight: "600", marginLeft: 5 },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { fontSize: 16, fontStyle: "italic" },
});
