import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

export default function SettingsScreen() {
  const [userData, setUserData] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    fetch('http://192.168.0.16:3000/user')
      .then(res => res.json())
      .then(data => {
        setUserData(data);
        setIsDarkMode(data.theme === 'dark');
      });
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode ? 'dark' : 'light';
    setIsDarkMode(!isDarkMode);
    
    // Zapisujemy preferencję w "bazie"
    fetch('http://192.168.0.16:3000/user', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ theme: newTheme })
    });
  };

  if (!userData) return null;

  return (
    <ThemedView style={styles.container}>
      <ScrollView>
        {/* Ustawienia */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Czas</ThemedText>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60 },
  section: { paddingHorizontal: 20, marginBottom: 25 },
  sectionTitle: { fontSize: 14, color: '#64748b', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 },

});