// screens/NotificationsScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function NotificationsScreen({ navigation }) {
  
  // Sample notifications data
  const [notifications, setNotifications] = useState([
    // Motivational Messages
    {
      id: '1',
      title: '💪 Stay Strong!',
      message: 'Your safety matters. Keep being vigilant and trust your instincts.',
      type: 'motivation',
      time: '2 hours ago',
      read: false,
    },
    {
      id: '2',
      title: '🌟 You Got This!',
      message: 'Remember, you have the power to protect yourself. Stay aware of your surroundings.',
      type: 'motivation',
      time: '1 day ago',
      read: true,
    },
    {
      id: '3',
      title: '🛡️ Safety First',
      message: 'Your proactive approach to safety is commendable. Keep up the great work!',
      type: 'motivation',
      time: '2 days ago',
      read: true,
    },

    // Admin Warnings
    {
      id: '4',
      title: '🚨 Content Warning',
      message: 'Your recent report has been reviewed. Appropriate action has been taken.',
      type: 'admin-warning',
      time: '30 minutes ago',
      read: false,
    },
    {
      id: '5',
      title: '⚠️ Report Processed',
      message: 'Unethical content has been removed based on your report. Thank you for keeping the community safe.',
      type: 'admin-warning',
      time: '5 hours ago',
      read: true,
    },

    // SOS Success Messages
    {
      id: '6',
      title: '✅ SOS Sent Successfully',
      message: 'Your emergency alert has been sent to your trusted contacts.',
      type: 'sos-success',
      time: '15 minutes ago',
      read: false,
    },
    {
      id: '7',
      title: '📱 Help is Coming',
      message: 'Emergency services have been notified with your location.',
      type: 'sos-success',
      time: '1 week ago',
      read: true,
    },
  ]);

  // Mark notification as read
  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
    Alert.alert('Success', 'All notifications marked as read');
  };

  // Clear all notifications
  const clearAll = () => {
    Alert.alert(
      'Clear All',
      'Are you sure you want to clear all notifications?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => setNotifications([])
        },
      ]
    );
  };

  // Get color based on notification type
  const getNotificationColor = (type) => {
    switch (type) {
      case 'motivation':
        return '#27ae60'; // Green
      case 'admin-warning':
        return '#e74c3c'; // Red
      case 'sos-success':
        return '#3498db'; // Blue
      default:
        return '#95a5a6'; // Gray
    }
  };

  // Get icon based on notification type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'motivation':
        return 'heart';
      case 'admin-warning':
        return 'warning';
      case 'sos-success':
        return 'checkmark-circle';
      default:
        return 'notifications';
    }
  };

  // Add test notification
  const addTestNotification = (type) => {
    const testMessages = {
      motivation: [
        { title: '💚 You Are Safe', message: 'Remember, your safety is our top priority. Stay strong!' },
        { title: '🌈 Positive Vibes', message: 'Your courage in reporting issues helps make everyone safer.' },
      ],
      'admin-warning': [
        { title: '🚨 Report Reviewed', message: 'Your report has been processed and appropriate action taken.' },
        { title: '⚠️ Action Taken', message: 'Content violation has been addressed. Thank you for reporting.' },
      ],
      'sos-success': [
        { title: '✅ Emergency Alert Sent', message: 'Your SOS has been successfully delivered to emergency contacts.' },
        { title: '📡 Help Activated', message: 'Emergency response has been initiated with your location details.' },
      ],
    };

    const messages = testMessages[type];
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    
    const newNotification = {
      id: Date.now().toString(),
      title: randomMessage.title,
      message: randomMessage.message,
      type: type,
      time: 'Just now',
      read: false,
    };

    setNotifications(prev => [newNotification, ...prev]);
  };

  // Filter unread notifications
  const unreadCount = notifications.filter(notif => !notif.read).length;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        
        <View style={styles.headerTitle}>
          <Text style={styles.headerTitleText}>Notifications</Text>
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>

        <TouchableOpacity style={styles.clearButton} onPress={clearAll}>
          <Ionicons name="trash-outline" size={20} color="#666" />
        </TouchableOpacity>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity 
          style={[styles.actionBtn, { backgroundColor: '#27ae60' }]}
          onPress={() => addTestNotification('motivation')}
        >
          <Ionicons name="heart" size={16} color="#fff" />
          <Text style={styles.actionText}>Add Positive</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionBtn, { backgroundColor: '#e74c3c' }]}
          onPress={() => addTestNotification('admin-warning')}
        >
          <Ionicons name="warning" size={16} color="#fff" />
          <Text style={styles.actionText}>Test Alert</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionBtn, { backgroundColor: '#3498db' }]}
          onPress={() => addTestNotification('sos-success')}
        >
          <Ionicons name="alert-circle" size={16} color="#fff" />
          <Text style={styles.actionText}>SOS Test</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionBtn, { backgroundColor: '#9b59b6' }]}
          onPress={markAllAsRead}
        >
          <Ionicons name="checkmark-done" size={16} color="#fff" />
          <Text style={styles.actionText}>Mark All Read</Text>
        </TouchableOpacity>
      </View>

      {/* Notifications List */}
      <ScrollView style={styles.scrollView}>
        {notifications.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="notifications-off-outline" size={64} color="#bdc3c7" />
            <Text style={styles.emptyTitle}>No Notifications</Text>
            <Text style={styles.emptyText}>
              You're all caught up!{'\n'}
              Your safety notifications will appear here.
            </Text>
          </View>
        ) : (
          notifications.map((notification) => (
            <TouchableOpacity
              key={notification.id}
              style={[
                styles.notificationCard,
                { 
                  borderLeftColor: getNotificationColor(notification.type),
                  opacity: notification.read ? 0.7 : 1 
                }
              ]}
              onPress={() => markAsRead(notification.id)}
            >
              <View style={styles.notificationHeader}>
                <View style={[
                  styles.iconContainer,
                  { backgroundColor: getNotificationColor(notification.type) + '20' }
                ]}>
                  <Ionicons 
                    name={getNotificationIcon(notification.type)} 
                    size={20} 
                    color={getNotificationColor(notification.type)} 
                  />
                </View>
                
                <View style={styles.notificationContent}>
                  <View style={styles.titleRow}>
                    <Text style={styles.notificationTitle}>
                      {notification.title}
                    </Text>
                    {!notification.read && (
                      <View style={[
                        styles.unreadDot,
                        { backgroundColor: getNotificationColor(notification.type) }
                      ]} />
                    )}
                  </View>
                  
                  <Text style={styles.notificationMessage}>
                    {notification.message}
                  </Text>
                  
                  <Text style={styles.notificationTime}>
                    {notification.time}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitleText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginRight: 8,
  },
  badge: {
    backgroundColor: '#e74c3c',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  clearButton: {
    padding: 8,
  },
  quickActions: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    gap: 8,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 4,
  },
  actionText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  notificationCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#34495e',
    lineHeight: 20,
    marginBottom: 8,
  },
  notificationTime: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
    lineHeight: 20,
  },
});