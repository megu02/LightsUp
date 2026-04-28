import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Bell, CircleHelp, LogOut, Moon, Shield } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Switch, TouchableOpacity, View } from 'react-native';

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
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Sekcja Profilu */}
        <ThemedView style={styles.profileCard}>
          <Image source={{ uri: userData.avatar }} style={styles.avatar} />
          <ThemedText type="defaultSemiBold" style={styles.userName}>{userData.name}</ThemedText>
          <ThemedText style={styles.userEmail}>{userData.email}</ThemedText>
          <TouchableOpacity style={styles.editButton}>
            <ThemedText style={styles.editButtonText}>Edytuj profil</ThemedText>
          </TouchableOpacity>
        </ThemedView>

        {/* Ustawienia */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Preferencje</ThemedText>
          
          <ThemedView style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Moon size={22} color={isDarkMode ? "#3b82f6" : "#64748b"} />
              <ThemedText style={styles.settingLabel}>Tryb ciemny</ThemedText>
            </View>
            <Switch 
              value={isDarkMode} 
              onValueChange={toggleTheme}
              trackColor={{ false: "#cbd5e1", true: "#3b82f6" }}
            />
          </ThemedView>

          <ThemedView style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Bell size={22} color="#64748b" />
              <ThemedText style={styles.settingLabel}>Powiadomienia</ThemedText>
            </View>
            <Switch value={userData.notifications} trackColor={{ true: "#3b82f6" }} />
          </ThemedView>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>System</ThemedText>
          {[
            { icon: Shield, label: 'Prywatność' },
            { icon: CircleHelp, label: 'Centrum Pomocy (FAQ)' },
            { icon: LogOut, label: 'Wyloguj', color: '#ef4444' }
          ].map((item, idx) => (
            <TouchableOpacity key={idx} style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <item.icon size={22} color={item.color || "#64748b"} />
                <ThemedText style={[styles.settingLabel, item.color && { color: item.color }]}>
                  {item.label}
                </ThemedText>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60 },
  profileCard: { alignItems: 'center', padding: 20, marginBottom: 20 },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 15 },
  userName: { fontSize: 22 },
  userEmail: { color: '#64748b', marginBottom: 15 },
  editButton: { backgroundColor: '#3b82f6', paddingHorizontal: 25, paddingVertical: 10, borderRadius: 20 },
  editButtonText: { color: 'white', fontWeight: 'bold' },
  section: { paddingHorizontal: 20, marginBottom: 25 },
  sectionTitle: { fontSize: 14, color: '#64748b', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 },
  settingRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingVertical: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e2e8f0'
  },
  settingLeft: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  settingLabel: { fontSize: 16 },
  scrollContent: {
    paddingBottom: 160,
  },
});