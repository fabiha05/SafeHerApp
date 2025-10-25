// screens/ReportScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
  Image,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import { useReports } from "../context/ReportsContext";
import { useUser } from "../context/UserContext";

export default function ReportScreen({ navigation, route }) {
  const { colors } = useTheme();
  const { t } = useLanguage();
  const { addReport, updateReport, loading: reportsLoading } = useReports();
  const { currentUser } = useUser();

  const reportToEdit = route.params?.reportToEdit;

  const [title, setTitle] = useState(reportToEdit?.title || "");
  const [description, setDescription] = useState(reportToEdit?.description || "");
  const [anonymous, setAnonymous] = useState(reportToEdit?.isAnonymous || false);
  const [imageUri, setImageUri] = useState(reportToEdit?.image || null);
  const [location, setLocation] = useState(reportToEdit?.location || null);
  const [dateTime, setDateTime] = useState("");
  const [saving, setSaving] = useState(false);

  // Check if user is logged in
  useEffect(() => {
    if (!currentUser) {
      Alert.alert(
        "Login Required",
        "You need to be logged in to submit reports",
        [
          {
            text: "OK",
            onPress: () => navigation.navigate("Login")
          }
        ]
      );
    }
  }, [currentUser]);

  // Set current date/time
  useEffect(() => {
    const now = new Date();
    setDateTime(now.toLocaleString());
  }, []);

  // Get location (only if not anonymous)
  useEffect(() => {
    (async () => {
      if (anonymous) return;
      
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          console.log("Location permission denied");
          return;
        }
        let loc = await Location.getCurrentPositionAsync({});
        setLocation({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          address: `Lat: ${loc.coords.latitude.toFixed(4)}, Lng: ${loc.coords.longitude.toFixed(4)}`
        });
      } catch (err) {
        console.log("Location error:", err);
      }
    })();
  }, [anonymous]);

  // Image pickers
  const pickImageFromGallery = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        alert(t("permissionDenied") || "Permission to access gallery was denied");
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.7,
        allowsEditing: true,
        aspect: [4, 3],
      });
      if (!result.canceled) setImageUri(result.assets[0].uri);
    } catch (error) {
      console.error("Error picking image:", error);
      alert("Failed to pick image from gallery");
    }
  };

  const takePhotoWithCamera = async () => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        alert(t("permissionDenied") || "Camera permission was denied");
        return;
      }
      const result = await ImagePicker.launchCameraAsync({ 
        quality: 0.7,
        allowsEditing: true,
        aspect: [4, 3],
      });
      if (!result.canceled) setImageUri(result.assets[0].uri);
    } catch (error) {
      console.error("Error taking photo:", error);
      alert("Failed to take photo");
    }
  };

  const handleSave = async () => {
    // Validation
    if (!title.trim() && !description.trim() && !imageUri) {
      alert(t("fill_something") || "Please add a title, description, or image.");
      return;
    }

    if (!currentUser) {
      Alert.alert("Login Required", "Please log in to submit reports");
      return;
    }

    setSaving(true);

    try {
      const reportData = {
        title: title.trim(),
        description: description.trim(),
        isAnonymous: anonymous,
        // Reporter info (only if not anonymous)
        reporterName: anonymous ? null : currentUser?.fullName || currentUser?.name || "Unknown",
        reporterEmail: anonymous ? null : currentUser?.email || null,
        reporterPhone: anonymous ? null : currentUser?.phone || null,
        reporterCnic: anonymous ? null : currentUser?.cnic || null,
        image: imageUri,
        dateTime: new Date().toISOString(),
        location: anonymous ? null : location,
        status: 'pending',
      };

      if (reportToEdit) {
        await updateReport(reportToEdit.id, reportData);
        Alert.alert("Success", t("report_updated") || "Report updated successfully!");
      } else {
        await addReport(reportData);
        Alert.alert("Success", t("save_report") || "Report submitted successfully!");
        
        // Clear form after successful submission
        setTitle("");
        setDescription("");
        setImageUri(null);
      }

      navigation.goBack();
    } catch (error) {
      console.error("Error saving report:", error);
      Alert.alert(
        "Error", 
        error.message || "Failed to save report. Please check your connection and try again."
      );
    } finally {
      setSaving(false);
    }
  };

  if (reportsLoading && !saving) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ marginTop: 10, color: colors.text }}>Loading reports...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            {reportToEdit ? t("edit_report") || "Edit Report" : t("add_report") || "Add New Report"}
          </Text>
          <TouchableOpacity 
            onPress={() => navigation.goBack()} 
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            disabled={saving}
          >
            <Ionicons name="close" size={28} color={saving ? colors.placeholder : colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Inputs */}
        <TextInput
          style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
          placeholder={t("title") || "Title (optional)"}
          placeholderTextColor={colors.placeholder}
          value={title}
          onChangeText={setTitle}
          editable={!saving}
        />

        <TextInput
          style={[
            styles.input,
            { height: 120, textAlignVertical: "top", backgroundColor: colors.card, color: colors.text },
          ]}
          placeholder={t("description") || "Description (optional)"}
          placeholderTextColor={colors.placeholder}
          multiline
          value={description}
          onChangeText={setDescription}
          editable={!saving}
        />

        {/* Image buttons */}
        <View style={styles.imageRow}>
          <TouchableOpacity 
            style={[styles.imageButton, { backgroundColor: colors.card, opacity: saving ? 0.6 : 1 }]} 
            onPress={pickImageFromGallery}
            disabled={saving}
          >
            <Ionicons name="image-outline" size={20} color={colors.primary} />
            <Text style={[styles.imageText, { color: colors.text }]}> {t("gallery") || "Gallery"}</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.imageButton, { backgroundColor: colors.card, opacity: saving ? 0.6 : 1 }]} 
            onPress={takePhotoWithCamera}
            disabled={saving}
          >
            <Ionicons name="camera-outline" size={20} color={colors.primary} />
            <Text style={[styles.imageText, { color: colors.text }]}> {t("camera") || "Camera"}</Text>
          </TouchableOpacity>
        </View>

        {/* Preview image */}
        {imageUri && (
          <View style={styles.imagePreviewContainer}>
            <Image source={{ uri: imageUri }} style={styles.previewImage} />
            {!saving && (
              <TouchableOpacity 
                style={styles.removeImageButton}
                onPress={() => setImageUri(null)}
              >
                <Ionicons name="close-circle" size={24} color="#ff4444" />
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Anonymous toggle */}
        <View style={styles.switchRow}>
          <Text style={[styles.label, { color: colors.text }]}>{t("report_anonymously") || "Report anonymously"}</Text>
          <Switch
            value={anonymous}
            onValueChange={setAnonymous}
            trackColor={{ false: "#ccc", true: colors.primary }}
            thumbColor={colors.switchThumb}
            disabled={saving}
          />
        </View>

        {/* User info: show real logged-in user info */}
        {!anonymous && currentUser && (
          <View style={[styles.infoBox, { backgroundColor: colors.card }]}>
            <Ionicons name="person-circle-outline" size={40} color={colors.primary} />
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text style={[styles.infoName, { color: colors.text }]}>
                {currentUser.fullName || currentUser.name || "No name"}
              </Text>

              {currentUser.cnic && (
                <Text style={[styles.infoSub, { color: colors.placeholder }]}>🆔 {currentUser.cnic}</Text>
              )}
              {currentUser.phone && (
                <Text style={[styles.infoSub, { color: colors.placeholder }]}>📱 {currentUser.phone}</Text>
              )}
              {currentUser.email && (
                <Text style={[styles.infoSub, { color: colors.placeholder }]}>📧 {currentUser.email}</Text>
              )}
            </View>
          </View>
        )}

        {/* Date/time */}
        <View style={[styles.infoBox, { backgroundColor: colors.card }]}>
          <Ionicons name="time-outline" size={20} color={colors.primary} />
          <Text style={[styles.infoText, { color: colors.text }]}>{dateTime}</Text>
        </View>

        {/* Location (hide if anonymous or missing) */}
        {!anonymous && location && (
          <View style={[styles.infoBox, { backgroundColor: colors.card }]}>
            <Ionicons name="location-outline" size={20} color={colors.primary} />
            <Text style={[styles.infoText, { color: colors.text }]}>{location.address}</Text>
          </View>
        )}

        {/* Save Button */}
        <TouchableOpacity 
          style={[
            styles.saveButton, 
            { 
              backgroundColor: saving ? "#ccc" : "#E12764",
              opacity: saving ? 0.7 : 1
            }
          ]} 
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.saveText}>
              {reportToEdit ? t("update_report") || "Update" : t("save_report") || "Save Report"}
            </Text>
          )}
        </TouchableOpacity>

        {/* Helper text */}
        <Text style={[styles.helperText, { color: colors.placeholder }]}>
          💡 You need at least a title, description, or image to submit a report
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
    marginTop: 12,
  },
  headerTitle: { fontSize: 20, fontWeight: "700" },
  input: { 
    borderRadius: 12, 
    padding: 12, 
    marginBottom: 14, 
    fontSize: 15, 
    elevation: 2,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  imageRow: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    marginBottom: 14 
  },
  imageButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 10,
    justifyContent: "center",
    flex: 1,
    marginHorizontal: 6,
    elevation: 2,
  },
  imageText: { marginLeft: 6, fontSize: 13, fontWeight: "600" },
  imagePreviewContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  previewImage: { 
    width: "100%", 
    height: 200, 
    borderRadius: 12,
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 12,
    padding: 4,
  },
  switchRow: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center", 
    marginBottom: 12, 
    paddingHorizontal: 4 
  },
  label: { fontSize: 15, fontWeight: "600" },
  infoBox: { 
    flexDirection: "row", 
    alignItems: "center", 
    padding: 12, 
    borderRadius: 12, 
    marginBottom: 12, 
    elevation: 2 
  },
  infoName: { fontSize: 16, fontWeight: "700" },
  infoText: { marginLeft: 8, fontSize: 14, fontWeight: "500" },
  infoSub: { marginTop: 4, fontSize: 13 },
  saveButton: { 
    paddingVertical: 14, 
    borderRadius: 12, 
    alignItems: "center", 
    marginTop: 12,
  },
  saveText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  helperText: {
    textAlign: 'center',
    fontSize: 12,
    marginTop: 8,
    fontStyle: 'italic',
  },
});