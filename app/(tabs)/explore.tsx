import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Bell, CircleHelp, LogOut, Shield } from 'lucide-react-native';
import React from 'react';
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function SettingsScreen() {
  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileCard}>
          <Image 
            source={{ uri: 'https://icons.veryicon.com/png/o/miscellaneous/standard/avatar-15.png' }} 
            style={styles.avatar} 
          />
          <ThemedText type="defaultSemiBold" style={styles.userName}>Krzysztof Dębiec</ThemedText>
          <ThemedText style={styles.userEmail}>k.debiec@student.pl </ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>System</ThemedText>
          {[
            { icon: Bell, label: 'Powiadomienia ' },
            { icon: Shield, label: 'Prywatność ' },
            { icon: CircleHelp, label: 'Centrum Pomocy ' },
            { icon: LogOut, label: 'Wyloguj ', color: '#ef4444' }
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
  scrollContent: { paddingBottom: 160 },
  profileCard: { alignItems: 'center', padding: 20 },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 15 },
  userName: { fontSize: 22 },
  userEmail: { color: '#64748b', marginBottom: 15 },
  section: { paddingHorizontal: 20, marginTop: 20 },
  sectionTitle: { fontSize: 14, color: '#64748b', marginBottom: 10, textTransform: 'uppercase' },
  settingRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9'
  },
  settingLeft: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  settingLabel: { fontSize: 16 }
});