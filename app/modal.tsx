import { API_CONFIG } from '@/constants/config';
import { useTheme } from '@react-navigation/native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, Coffee, Flame, Moon, PartyPopper, Sun } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Dimensions, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

export default function RoomModal() {
  const { id, name } = useLocalSearchParams();
  const router = useRouter();
  const [brightness, setBrightness] = useState(65);
  const [activeScene, setActiveScene] = useState('');
  
  // Pobieramy kolory i informację o tym, czy tryb jest ciemny
  const { colors, dark } = useTheme();

  // Pobieranie aktualnej jasności z bazy
  useEffect(() => {
    fetch(`${API_CONFIG.BASE_URL}/rooms/${id}`)
      .then(res => res.json())
      .then(data => setBrightness(data.brightness))
      .catch(err => console.log("Błąd pobierania jasności", err));
  }, [id]);

  // Funkcja zapisu jasności na serwerze
  const updateBrightness = (val: number) => {
    setBrightness(val);
    fetch(`${API_CONFIG.BASE_URL}/rooms/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ brightness: val })
    }).catch(err => console.log("Błąd zapisu", err));
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* NAGŁÓWEK MODALA */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft color="white" size={28} />
          <Text style={styles.backText}>Wróć</Text>
        </TouchableOpacity>
        <Text style={styles.roomName}>{name}</Text>
        <Text style={styles.subtitle}>Panel Sterowania</Text>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
           {['Główne', 'Biurko', 'Szafka', 'Nocne'].map((item, index) => (
             <View key={index} style={[styles.chip, index === 0 && styles.chipActive]}>
               <Text style={[styles.chipText, index === 0 && styles.chipTextActive]}>{item}</Text>
             </View>
           ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.content}>
        {/* SEKCJA JASNOŚCI Z GRUBĄ BELKĄ */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Jasność</Text>
            <Text style={styles.valueText}>{Math.round(brightness)}%</Text>
          </View>
          
          <View 
            style={[
                styles.customSliderContainer, 
                { backgroundColor: dark ? 'rgba(255,255,255,0.1)' : '#e2e8f0' }
            ]}
            onStartShouldSetResponder={() => true}
            onMoveShouldSetResponder={() => true}
            onResponderMove={(evt) => {
              // Obliczanie procentu na podstawie szerokości ekranu minus paddingi (24+24=48)
              const touchX = evt.nativeEvent.locationX;
              const sliderWidth = width - 48; 
              let percent = Math.round((touchX / sliderWidth) * 100);
              percent = Math.max(0, Math.min(100, percent));
              setBrightness(percent);
            }}
            onResponderRelease={() => updateBrightness(brightness)}
          >
            <View 
              style={[
                styles.customSliderFill, 
                { width: `${brightness}%`, backgroundColor: '#3b82f6' }
              ]} 
            />
          </View>
          
          <View style={styles.sliderIcons}>
            <Moon size={20} color="#94a3b8" />
            <Sun size={20} color="#94a3b8" />
          </View>
        </View>

        {/* SEKCJA SCEN NASTROJOWYCH */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Sceny nastrojowe</Text>
          <View style={styles.scenesGrid}>
            {[
              { label: 'Relaks', icon: Coffee, color: dark ? '#1e3a8a' : '#dbeafe', textColor: dark ? '#93c5fd' : '#1e40af' },
              { label: 'Impreza', icon: PartyPopper, color: dark ? '#4c1d95' : '#f3e8ff', textColor: dark ? '#d8b4fe' : '#7e22ce' },
              { label: 'Urodziny', icon: Sun, color: dark ? '#7c2d12' : '#ffedd5', textColor: dark ? '#fdba74' : '#9a3412' },
              { label: 'Świeca', icon: Flame, color: dark ? '#7f1d1d' : '#fee2e2', textColor: dark ? '#fca5a5' : '#b91c1c' },
            ].map((scene) => (
              <TouchableOpacity 
                key={scene.label} 
                style={[
                  styles.sceneCard, 
                  { 
                    backgroundColor: scene.color,
                    // Dynamiczne obramowanie dla trybu ciemnego i aktywnej sceny
                    borderWidth: dark && activeScene !== scene.label ? 1 : (activeScene === scene.label ? 2 : 0), 
                    borderColor: activeScene === scene.label ? scene.textColor : (dark ? 'rgba(255, 255, 255, 0.15)' : 'transparent'),
                  }
                ]}
                onPress={() => setActiveScene(scene.label)}
              >
                <scene.icon color={scene.textColor} size={24} />
                <Text style={[styles.sceneText, { color: scene.textColor }]}>{scene.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { 
    backgroundColor: '#1e40af', 
    paddingTop: Platform.OS === 'ios' ? 60 : 40, 
    paddingHorizontal: 24, 
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30
  },
  backButton: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, marginLeft: -8 },
  backText: { color: 'white', fontSize: 16, fontWeight: '600' },
  roomName: { color: 'white', fontSize: 32, fontWeight: 'bold' },
  subtitle: { color: 'rgba(255,255,255,0.6)', fontSize: 16, marginBottom: 20 },
  chipScroll: { flexDirection: 'row' },
  chip: { paddingHorizontal: 20, paddingVertical: 8, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.1)', marginRight: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  chipActive: { backgroundColor: 'white' },
  chipText: { color: 'white', fontWeight: '600' },
  chipTextActive: { color: '#1e40af' },
  content: { padding: 24 },
  section: { marginBottom: 32 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold' },
  valueText: { fontSize: 18, fontWeight: 'bold', color: '#3b82f6' },
  
  customSliderContainer: {
    height: 30, 
    width: '100%',
    borderRadius: 15,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
  },
  customSliderFill: {
    height: '100%',
    borderRadius: 15,
  },
  
  sliderIcons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12, paddingHorizontal: 4 },
  scenesGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  sceneCard: { width: '48%', padding: 20, borderRadius: 20, marginBottom: 12, alignItems: 'center', flexDirection: 'row', gap: 10 },
  sceneText: { fontWeight: 'bold', fontSize: 15 }
});