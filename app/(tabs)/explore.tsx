import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@react-navigation/native';
import { CircleHelp, LogOut, Moon, Sun } from 'lucide-react-native';
import React from 'react';
import { Image, ScrollView, StyleSheet, TouchableOpacity, View, useColorScheme } from 'react-native';

export default function SettingsScreen() {
  // Pobieramy aktualne kolory motywu
  const { colors } = useTheme();
  // Sprawdzamy, czy system jest w trybie ciemnym, aby wyświetlić odpowiednią ikonę
  const systemColorScheme = useColorScheme();

  return (
    <ThemedView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileCard}>
          <Image 
            source={{ uri: 'https://icons.veryicon.com/png/o/miscellaneous/standard/avatar-15.png' }} 
            style={styles.avatar} 
          />
          <ThemedText type="defaultSemiBold" style={[styles.userName, { color: colors.text }]}>
            Krzysztof Dębiec
          </ThemedText>
          <ThemedText style={styles.userEmail}>k.debiec@student.pl</ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText style={[styles.sectionTitle, { color: colors.primary }]}>Wygląd </ThemedText>
          
          <TouchableOpacity 
            style={[styles.settingRow, { borderBottomColor: colors.border }]}
            onPress={() => alert('Zmiana motywu będzie dostępna po dodaniu Context API!')}
          >
            <View style={styles.settingLeft}>
              {systemColorScheme === 'dark' ? (
                <Moon size={22} color={colors.primary} />
              ) : (
                <Sun size={22} color={colors.primary} />
              )}
              <ThemedText style={styles.settingLabel}>Motyw aplikacji </ThemedText>
            </View>
            <ThemedText style={{ color: colors.primary }}>
              {systemColorScheme === 'dark' ? 'Ciemny ' : 'Jasny '}
            </ThemedText>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <ThemedText style={[styles.sectionTitle, { color: colors.primary }]}>System </ThemedText>
          {[
            { icon: CircleHelp, label: 'Centrum Pomocy ' },
            { icon: LogOut, label: 'Wyloguj ', color: '#ef4444' }
          ].map((item, idx) => (
            <TouchableOpacity 
              key={idx} 
              style={[styles.settingRow, { borderBottomColor: colors.border }]}
            >
              <View style={styles.settingLeft}>
                <item.icon size={22} color={item.color || colors.primary} />
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
  sectionTitle: { fontSize: 12, marginBottom: 10, textTransform: 'uppercase', fontWeight: 'bold' },
  settingRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  settingLeft: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  settingLabel: { fontSize: 16 }
});