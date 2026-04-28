import Slider from '@react-native-community/slider';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, Coffee, Flame, Moon, PartyPopper, Sun } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function RoomModal() {
  const { id, name } = useLocalSearchParams();
  const router = useRouter();
  const [brightness, setBrightness] = useState(65);
  const [activeScene, setActiveScene] = useState('');

  // Pobieranie aktualnej jasności z db.json
  useEffect(() => {
    fetch(`http://192.168.0.16:3000/rooms/${id}`)
      .then(res => res.json())
      .then(data => setBrightness(data.brightness))
      .catch(err => console.log("Błąd pobierania jasności", err));
  }, [id]);

  // Funkcja aktualizacji jasności (PATCH)
  const updateBrightness = (val: number) => {
    setBrightness(val);
    fetch(`http://192.168.0.16:3000/rooms/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ brightness: val })
    }).catch(err => console.log("Błąd zapisu", err));
  };

  return (
    <View style={styles.container}>
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
        {/* POPRAWIONA SEKCJA JASNOŚCI */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Jasność</Text>
            <Text style={styles.valueText}>{Math.round(brightness)}%</Text>
          </View>
          
          <Slider
            style={{width: '100%', height: 40}}
            minimumValue={0}
            maximumValue={100}
            step={1}
            value={brightness}
            minimumTrackTintColor="#3b82f6"
            maximumTrackTintColor="#e2e8f0"
            thumbTintColor="#3b82f6"
            onValueChange={(val) => setBrightness(val)} 
            onSlidingComplete={(val) => updateBrightness(val)}
          />
          
          <View style={styles.sliderIcons}>
            <Moon size={20} color="#94a3b8" />
            <Sun size={20} color="#94a3b8" />
          </View>
        </View>

        {/* SCENY */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sceny nastrojowe</Text>
          <View style={styles.scenesGrid}>
            {[
              { label: 'Relaks', icon: Coffee, color: '#dbeafe', textColor: '#1e40af' },
              { label: 'Impreza', icon: PartyPopper, color: '#f3e8ff', textColor: '#7e22ce' },
              { label: 'Urodziny', icon: Sun, color: '#ffedd5', textColor: '#9a3412' },
              { label: 'Świeca', icon: Flame, color: '#fee2e2', textColor: '#b91c1c' },
            ].map((scene) => (
              <TouchableOpacity 
                key={scene.label} 
                style={[
                  styles.sceneCard, 
                  { backgroundColor: scene.color },
                  activeScene === scene.label && { borderWidth: 2, borderColor: scene.textColor }
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
  container: { flex: 1, backgroundColor: '#f8fafc' },
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
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1e293b' },
  valueText: { fontSize: 18, fontWeight: 'bold', color: '#3b82f6' },
  sliderIcons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8, paddingHorizontal: 4 },
  scenesGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  sceneCard: { width: '48%', padding: 20, borderRadius: 20, marginBottom: 12, alignItems: 'center', flexDirection: 'row', gap: 10 },
  sceneText: { fontWeight: 'bold', fontSize: 15 }
});