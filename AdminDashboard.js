// screens/AdminDashboard.js (Fixed for showing reports)
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  ScrollView
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUser } from "../context/UserContext";
import { useReports } from "../context/ReportsContext";
import { useTheme } from "../context/ThemeContext";

export default function AdminDashboard() {
  const { logout, toggleBlockUser } = useUser();
  const { reports, loadReports } = useReports();
  const { colors, isDark } = useTheme();

  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);
  const [userReports, setUserReports] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  // Load all users
  const loadUsers = async () => {
    const usersData = await AsyncStorage.getItem("users");
    setUsers(usersData ? JSON.parse(usersData) : []);
  };

  useEffect(() => {
    loadUsers();
    loadReports(); // load all reports from AsyncStorage
  }, []);

  // Delete user
  const deleteUser = async (email) => {
    Alert.alert(
      "Delete User",
      "Are you sure you want to delete this user?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const updatedUsers = users.filter(u => u.email !== email);
            await AsyncStorage.setItem("users", JSON.stringify(updatedUsers));
            setUsers(updatedUsers);
          }
        }
      ]
    );
  };

  // Block / Unblock user
  const handleBlock = async (email) => {
    await toggleBlockUser(email);
    await loadUsers();
  };

  // Show password
  const handleShowPassword = async (email) => {
    const user = users.find(u => u.email === email);
    if (user) Alert.alert("User Password", user.password || "No password set");
  };

  // Logout
  const handleLogout = async () => {
    await logout();
  };

  // Open user reports modal
  const openUserReports = (user) => {
    setSelectedUser(user);
    // Filter latest reports every time modal opens
    const userReportsFiltered = reports.filter(r => r.userEmail === user.email);
    setUserReports(userReportsFiltered);
    setModalVisible(true);
  };

  // Filter and search users
  const filteredUsers = users
    .filter(u => filter === "all" || (filter === "active" && !u.isBlocked) || (filter === "blocked" && u.isBlocked))
    .filter(u => {
      if (!u.name) u.name = "";
      if (!u.email) u.email = "";
      return u.name.toLowerCase().includes(searchText.toLowerCase()) ||
             u.email.toLowerCase().includes(searchText.toLowerCase());
    });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Admin Dashboard</Text>

      <TextInput
        placeholder="Search by name or email"
        placeholderTextColor={isDark ? "#aaa" : "#888"}
        style={[styles.searchInput, { backgroundColor: colors.card, color: colors.text }]}
        value={searchText}
        onChangeText={setSearchText}
      />

      <View style={styles.filterRow}>
        {["all", "active", "blocked"].map(f => (
          <TouchableOpacity
            key={f}
            style={[styles.filterBtn, filter === f && { backgroundColor: colors.primary }]}
            onPress={() => setFilter(f)}
          >
            <Text style={{ color: filter === f ? "#fff" : colors.text, fontWeight: "bold" }}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredUsers}
        keyExtractor={item => item.email}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
        renderItem={({ item }) => (
          <View style={[styles.userCard, { backgroundColor: colors.card }]}>
            <View>
              <Text style={[styles.userName, { color: colors.text }]}>{item.name}</Text>
              <Text style={[styles.userEmail, { color: colors.textSecondary }]}>{item.email}</Text>
              <Text style={[styles.userPhone, { color: colors.textSecondary }]}>Phone: {item.phone || "N/A"}</Text>
              <Text style={[styles.userStatus, { color: item.isBlocked ? "#f44336" : "#4caf50" }]}>
                {item.isBlocked ? "Blocked" : "Active"}
              </Text>
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: item.isBlocked ? "#4caf50" : "#f44336" }]}
                onPress={() => handleBlock(item.email)}
              >
                <Text style={styles.actionText}>{item.isBlocked ? "Unblock" : "Block"}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.actionBtn, { backgroundColor: "#e91e63" }]} onPress={() => deleteUser(item.email)}>
                <Text style={styles.actionText}>Delete</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.actionBtn, { backgroundColor: "#2196f3" }]} onPress={() => handleShowPassword(item.email)}>
                <Text style={styles.actionText}>Show</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.actionBtn, { backgroundColor: "#FF9800" }]} onPress={() => openUserReports(item)}>
                <Text style={styles.actionText}>Reports</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={{ textAlign: "center", marginTop: 20, color: colors.text }}>No users found.</Text>}
      />

      {/* Modal for user reports */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>{selectedUser?.name} Reports</Text>
            <ScrollView style={{ maxHeight: 300 }}>
              {userReports.length === 0 ? (
                <Text style={{ color: colors.textSecondary }}>No reports submitted.</Text>
              ) : (
                userReports.map((r, index) => (
                  <View key={index} style={[styles.reportCard, { backgroundColor: isDark ? "#333" : "#f7f7f7" }]}>
                    <Text style={[styles.reportTitle, { color: colors.text }]}>Type: {r.type}</Text>
                    <Text style={{ color: colors.textSecondary }}>Date: {r.date}</Text>
                    <Text style={{ color: colors.textSecondary }}>Status: {r.status}</Text>
                    <Text style={{ color: colors.textSecondary }}>Details: {r.details}</Text>
                  </View>
                ))
              )}
            </ScrollView>
            <TouchableOpacity style={styles.closeBtn} onPress={() => setModalVisible(false)}>
              <Text style={{ color: "#fff" }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <TouchableOpacity style={[styles.logoutButton, { backgroundColor: colors.primary }]} onPress={handleLogout}>
        <Text style={[styles.logoutText, { color: "#fff" }]}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  searchInput: { borderWidth: 1, borderRadius: 15, padding: 12, marginBottom: 15 },
  filterRow: { flexDirection: "row", justifyContent: "space-around", marginBottom: 15 },
  filterBtn: { paddingHorizontal: 25, paddingVertical: 10, borderRadius: 25 },
  userCard: { borderRadius: 20, padding: 20, marginBottom: 15, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 8, elevation: 5 },
  userName: { fontSize: 20, fontWeight: "bold" },
  userEmail: { fontSize: 14, marginBottom: 5 },
  userPhone: { fontSize: 14, marginBottom: 5 },
  userStatus: { fontWeight: "bold", fontSize: 14 },
  buttonRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 15, flexWrap: "wrap" },
  actionBtn: { paddingVertical: 10, paddingHorizontal: 18, borderRadius: 15, marginTop: 5 },
  actionText: { color: "#fff", fontWeight: "bold", fontSize: 14 },
  logoutButton: { padding: 16, borderRadius: 30, alignItems: "center", marginTop: 15 },
  logoutText: { fontSize: 18, fontWeight: "bold" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" },
  modalContent: { width: "85%", borderRadius: 15, padding: 20 },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 15 },
  closeBtn: { marginTop: 15, padding: 10, borderRadius: 10, alignItems: "center", backgroundColor: "#A25A6F" },
  reportCard: { padding: 10, borderRadius: 12, marginBottom: 10 },
  reportTitle: { fontWeight: "bold" },
});
