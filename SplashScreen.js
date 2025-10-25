import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

export default function SplashScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo.png')} style={styles.logo} />
      <Text style={styles.title}>SafeHer</Text>
      <Text style={styles.subtitle}>Women's Safety & Support Network</Text>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffe6eb', justifyContent: 'center', alignItems: 'center' },
  logo: { width: 200, height: 195, marginBottom: 20 },
  title: { fontSize: 50, fontWeight: 'bold', color: '#e91e63' },
  subtitle: { fontSize: 14, color: '#A25A6F', marginBottom: 40 },
  button: { backgroundColor: '#e91e63', paddingVertical: 12, paddingHorizontal: 40, borderRadius: 25 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
