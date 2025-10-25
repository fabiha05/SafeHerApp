// utils/sosHelper.js
import { Linking, Alert } from "react-native";
import * as Location from "expo-location";

export const sendSOS = async (contacts) => {
  const baseMessage = "🚨 SOS Alert! I need urgent help. Please respond immediately.";

  try {
    // ✅ Location permission & fetch
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "Location access is required to send SOS with location.");
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    const latitude = location.coords.latitude;
    const longitude = location.coords.longitude;
    const mapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;

    const message = `${baseMessage}\n📍 My Location: ${mapsLink}`;

    // ✅ Loop contacts
    for (let contact of contacts) {
      // Call
      if (contact.phone) {
        Linking.openURL(`tel:${contact.phone}`);
      }

      // WhatsApp
      if (contact.whatsapp) {
        const url = `whatsapp://send?phone=${contact.whatsapp}&text=${encodeURIComponent(message)}`;
        Linking.openURL(url).catch(() => {
          Alert.alert("WhatsApp Error", "WhatsApp not installed");
        });
      }

      // Email
      if (contact.email) {
        const url = `mailto:${contact.email}?subject=SOS Alert&body=${encodeURIComponent(message)}`;
        Linking.openURL(url);
      }
    }
  } catch (error) {
    Alert.alert("Error", "Failed to get location or send SOS.");
  }
};
