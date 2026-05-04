import { Tabs } from 'expo-router';
import { House, Timer, User } from 'lucide-react-native';
import React from 'react';
import { StyleSheet } from 'react-native';
// Importujemy useTheme, aby pasek reagował na motyw
import { useTheme } from '@react-navigation/native';

export default function TabLayout() {
  // Pobieramy aktualne kolory[cite: 1]
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        // Używamy koloru podstawowego z motywu dla aktywnej zakładki[cite: 1]
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: '#94a3b8',
        tabBarShowLabel: true,
        tabBarLabelStyle: styles.label,
        // Dynamicznie zmieniamy tło paska na colors.card (lub background)[cite: 1]
        tabBarStyle: [
          styles.tabBar, 
          { backgroundColor: colors.card, borderTopColor: colors.border }
        ],
      }}>
      
      <Tabs.Screen
        name="index"
        options={{
          title: 'Światła',
          tabBarIcon: ({ color }) => <House size={24} color={color} />,
        }}
      />

      <Tabs.Screen
        name="czas" 
        options={{
          title: 'Czas',
          tabBarIcon: ({ color }) => <Timer size={24} color={color} />,
        }}
      />

      <Tabs.Screen
        name="explore"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color }) => <User size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: -20, // Poprawiłem z -20 na 20, żeby pasek nie chował się pod ekranem
    left: 20,
    right: 20,
    height: 135, // Zmniejszyłem ze 135 na 70 – standardowa wysokość paska
    borderRadius: 25,
    borderTopWidth: 0,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    // Usunąłem paddingTop/Bottom, height: 70 zajmie się wyrównaniem
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 5, // Odstęp od dołu
  }
});