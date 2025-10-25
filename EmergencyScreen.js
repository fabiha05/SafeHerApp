import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, FlatList } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

// Emergency contacts
const emergencyContacts = [
  { id: '1', key: 'policeEmergency', icon: 'shield-star' },
  { id: '2', key: 'womenHelpline', icon: 'shield-half-full' },
  { id: '3', key: 'ambulance', icon: 'ambulance' },
];

const EmergencyContactCard = ({ title, subtitle, icon, colors }) => (
  <TouchableOpacity style={[styles.card, { backgroundColor: colors.card }]}>
    <MaterialCommunityIcons name={icon} size={35} color={colors.primary} style={styles.cardIcon} />
    <View style={styles.cardTextContainer}>
      <Text style={[styles.cardTitle, { color: colors.text }]}>{title}</Text>
      <Text style={[styles.cardSubtitle, { color: colors.text }]}>{subtitle}</Text>
    </View>
  </TouchableOpacity>
);

export default function EmergencyScreen({ navigation }) {
  const { colors } = useTheme();
  const { t } = useLanguage();

  const contactData = emergencyContacts.map(c => ({
    ...c,
    title: t(c.key),
    subtitle: t('available247'), // 24/7 Services
  }));

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{t('emergency')}</Text>
        <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="close" size={28} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Emergency Cards */}
      <View style={styles.contentContainer}>
        <FlatList
          data={contactData}
          renderItem={({ item }) => (
            <EmergencyContactCard
              title={item.title}
              subtitle={item.subtitle}
              icon={item.icon}
              colors={colors}
            />
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.flatListContent}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: 'hidden',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
  },
  closeButton: { padding: 5, zIndex: 1 },
  contentContainer: { flex: 1, paddingHorizontal: 15 },
  card: {
    flexDirection: 'row',
    borderRadius: 15,
    padding: 20,
    marginVertical: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  cardIcon: { marginRight: 15 },
  cardTextContainer: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: '600' },
  cardSubtitle: { fontSize: 14, marginTop: 4, lineHeight: 20 },
  flatListContent: { paddingBottom: 20 },
});
