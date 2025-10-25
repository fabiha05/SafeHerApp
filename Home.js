// screens/Home.js
import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as Location from "expo-location";
import { LinearGradient } from "expo-linear-gradient";
import * as SMS from "expo-sms";

import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import { ContactsContext } from "../context/ContactsContext";

export default function HomeScreen() {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const { t, changeLanguage, language } = useLanguage();
  const { contacts } = useContext(ContactsContext);

  // ✅ Combined SOS Function
  const sendSOS = async () => {
    if (!contacts || contacts.length === 0) {
      Alert.alert(t("no_contacts"), t("add_contacts_first") || "No emergency contacts. Add contacts first.");
      return;
    }

    // get location
    let locationText = "";
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      if (status === "granted") {
        const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest });
        locationText = `\nLocation: https://maps.google.com/?q=${loc.coords.latitude},${loc.coords.longitude}`;
      }
    } catch (e) {}

    const message = `🚨 SOS! I need urgent help.${locationText}`;

    // ✅ SMS
    const phoneNumbers = contacts.map((c) => c.phone).filter(Boolean);
    const isAvailable = await SMS.isAvailableAsync();
    if (isAvailable && phoneNumbers.length > 0) {
      try {
        await SMS.sendSMSAsync(phoneNumbers, message);
      } catch (err) {
        Alert.alert("Error", "Unable to send SMS.");
      }
    }

    // ✅ WhatsApp
    contacts.forEach((c) => {
      if (c.whatsapp) {
        const url = `whatsapp://send?phone=${c.whatsapp}&text=${encodeURIComponent(message)}`;
        Linking.openURL(url).catch(() => {
          Alert.alert("WhatsApp Error", "WhatsApp not installed");
        });
      }
    });

    // ✅ Email
    contacts.forEach((c) => {
      if (c.email) {
        const url = `mailto:${c.email}?subject=SOS Alert&body=${encodeURIComponent(message)}`;
        Linking.openURL(url);
      }
    });

    Alert.alert("SOS Triggered", "SOS messages triggered via SMS, WhatsApp, and Email.");
  };

  // Existing shareLocation function
  const shareLocation = async () => {
    try {
      let { status } = await Location.getForegroundPermissionsAsync();

      if (status !== "granted") {
        const { status: reqStatus } = await Location.requestForegroundPermissionsAsync();
        if (reqStatus !== "granted") {
          Alert.alert(
            t("permissionDenied"),
            t("locationPermissionRequired"),
            [
              { text: t("cancel"), style: "cancel" },
              { text: t("openSettings"), onPress: () => Linking.openSettings() },
            ]
          );
          return;
        }
        status = reqStatus;
      }

      const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest });
      const { latitude, longitude } = location.coords;
      Alert.alert(
        t("locationFetched"),
        `${t("latitude")}: ${latitude}\n${t("longitude")}: ${longitude}`
      );
      console.log("Current Location:", latitude, longitude);
    } catch (error) {
      Alert.alert(t("error"), t("unableToFetchLocation"));
      console.log(error);
    }
  };

  const emergencyHotlines = [
    { title: t("policeEmergency"), number: "15" },
    { title: t("ambulance"), number: "1122" },
    { title: t("womenHelpline"), number: "1094" },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Sticky Top Bar */}
      <View style={[styles.topBar, { backgroundColor: colors.background }]}>
        <View style={{ flexDirection: "row", marginRight: 10 }}>
          <TouchableOpacity
            onPress={() => changeLanguage("en")}
            style={[styles.langBtn, { backgroundColor: colors.card }]}
          >
            <Text style={{ color: language === "en" ? colors.primary : colors.text }}>EN</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => changeLanguage("ur")}
            style={[styles.langBtn, { backgroundColor: colors.card }]}
          >
            <Text style={{ color: language === "ur" ? colors.primary : colors.text }}>UR</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.topIcons}>
          {/* Bell icon - Updated to navigate to NotificationsScreen */}
          <TouchableOpacity onPress={() => navigation.navigate("NotificationsScreen")}>
            <Ionicons name="notifications-outline" size={26} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Scrollable Content */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* SOS Button */}
        <View style={styles.sosWrapper}>
          <TouchableOpacity
            activeOpacity={0.85}
            onLongPress={sendSOS}
            onPress={() => Alert.alert(t("holdToSendSOS") || "Hold to send SOS")}
            delayLongPress={600}
          >
            <LinearGradient
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              colors={[colors.primary, colors.gradientEnd || "#A25A6F"]}
              style={styles.sosButton}
            >
              <Ionicons name="warning-outline" size={55} color="#fff" />
              <Text style={styles.sosText}>SOS</Text>
              <Text style={styles.sosSubText}>{t("holdForEmergency")}</Text>
            </LinearGradient>
          </TouchableOpacity>

          <Text style={[styles.sosInfo, { color: colors.text }]}>
            {t("tapHoldInfo")}{"\n"}
            <Text
              style={[styles.link, { color: "#A25A6F" }]}
              onPress={() => navigation.navigate("EmergencyContacts")}
            >
              {t("manageContacts", { count: 3 })}
            </Text>
          </Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t("quickActions")}</Text>
          <View style={styles.quickActions}>
            <View style={styles.quickActionsRow}>
              <TouchableOpacity
                style={[styles.actionBox, { backgroundColor: colors.card }]}
                onPress={() => navigation.navigate("SafetyPlanScreen")}
              >
                <Ionicons name="document-text-outline" size={28} color={colors.primary} />
                <Text style={[styles.actionTitle, { color: colors.text }]}>{t("safetyPlan")}</Text>
                <Text style={[styles.actionSub]}>{t("reviewPlan")}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionBox, { backgroundColor: colors.card }]}
                onPress={() => navigation.navigate("ChatScreen")}
              >
                <Ionicons name="chatbubble-ellipses-outline" size={28} color={colors.primary} />
                <Text style={[styles.actionTitle, { color: colors.text }]}>{t("chatBot")}</Text>
                <Text style={[styles.actionSub]}>{t("talkAI")}</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.quickActionsRow}>
              <TouchableOpacity
                style={[styles.actionBox, { backgroundColor: colors.card }]}
                onPress={() => navigation.navigate("ReportScreen")}
              >
                <Ionicons name="create-outline" size={28} color={colors.primary} />
                <Text style={[styles.actionTitle, { color: colors.text }]}>{t("report")}</Text>
                <Text style={[styles.actionSub]}>{t("secureReport")}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionBox, { backgroundColor: colors.card }]}
                onPress={shareLocation}
              >
                <Ionicons name="location-outline" size={28} color={colors.primary} />
                <Text style={[styles.actionTitle, { color: colors.text }]}>{t("addLocation")}</Text>
                <Text style={[styles.actionSub]}>{t("connectLocation")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Emergency Hotlines */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>{t("emergencyHotlines")}</Text>
        {emergencyHotlines.map((item, index) => (
          <View key={index} style={[styles.hotline, { backgroundColor: colors.card }]}>
            <TouchableOpacity
              style={styles.hotlineRow}
              onPress={() => Linking.openURL(`tel:${item.number}`)}
            >
              <Ionicons name="call-outline" size={24} color={colors.primary} />
              <View style={styles.hotlineInfo}>
                <Text style={[styles.hotlineTitle, { color: colors.text }]}>{item.title}</Text>
                <Text style={[styles.hotlineNumber, { color: colors.primary }]}>{item.number}</Text>
                <Text style={[styles.hotlineSub]}>{t("available247")}</Text>
              </View>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 15, paddingBottom: 100, marginTop: 70 },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingTop: 30,
    paddingBottom: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: "#ccc",
    zIndex: 10,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 70,
  },
  topIcons: { flexDirection: "row", alignItems: "center" },
  langBtn: { marginHorizontal: 2, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 5 },
  sosWrapper: { alignItems: "center", marginBottom: 25 },
  sosButton: { borderRadius: 150, width: 220, height: 220, alignItems: "center", justifyContent: "center", elevation: 8 },
  sosText: { color: "#fff", fontSize: 34, fontWeight: "bold", marginTop: 10 },
  sosSubText: { color: "#fff", fontSize: 15 },
  sosInfo: { fontSize: 13, textAlign: "center", marginTop: 15 },
  link: { 
    fontWeight: "bold", 
    color: "#A25A6F", 
    textDecorationLine: "underline" 
  },
  quickActionsSection: {
    marginBottom: 25,
  },
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: "bold", 
    marginBottom: 12, 
    marginTop: 10,
    textAlign: "left"
  },
  quickActions: {
    alignItems: "center",
  },
  quickActionsRow: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    marginBottom: 15,
  },
  actionBox: { 
    width: "47%", 
    borderRadius: 16, 
    padding: 15, 
    marginHorizontal: "2.5%",
    elevation: 4,
    alignItems: "center",
  },
  actionTitle: { 
    fontSize: 15, 
    fontWeight: "bold", 
    marginTop: 8,
    textAlign: "center"
  },
  actionSub: { 
    fontSize: 12, 
    color: "gray",
    textAlign: "center"
  },
  hotline: { padding: 15, borderRadius: 16, marginBottom: 12, elevation: 3 },
  hotlineRow: { flexDirection: "row", alignItems: "center" },
  hotlineInfo: { marginLeft: 10 },
  hotlineTitle: { fontSize: 16, fontWeight: "bold" },
  hotlineNumber: { fontSize: 15 },
  hotlineSub: { fontSize: 13, color: "gray" },
});