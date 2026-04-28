import { Tabs } from 'expo-router';
import { House, Timer, User } from 'lucide-react-native';
import React from 'react';
import { Platform, StyleSheet } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#3b82f6',
        tabBarInactiveTintColor: '#94a3b8',
        tabBarShowLabel: true, // PRZYWRACAMY NAPISY
        tabBarLabelStyle: styles.label, // STYL NAPISÓW
        tabBarStyle: styles.tabBar,
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
    bottom: -20,
    left: 20,
    right: 20,
    height: 135, 
    backgroundColor: '#1b1b1b',
    borderRadius: 40,
    borderTopWidth: 0,
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 25 : 15,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 5, // Odstęp od ikony
  }
});