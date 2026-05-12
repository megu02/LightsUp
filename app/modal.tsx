import { API_CONFIG } from '@/constants/config';
import { useTheme } from '@react-navigation/native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, Plus, Trash2 } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, Dimensions, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import ColorPicker from 'react-native-wheel-color-picker';

const { width } = Dimensions.get('window');

export default function RoomModal() {
  const { id, name } = useLocalSearchParams();
  const router = useRouter();
  
  const [brightness, setBrightness] = useState(65);
  const [currentColor, setCurrentColor] = useState('#3b82f6');
  const [newSceneName, setNewSceneName] = useState('');
  const [customPresets, setCustomPresets] = useState<any[]>([]);

  const { colors, dark } = useTheme();

  useEffect(() => {
    fetch(`${API_CONFIG.BASE_URL}/rooms/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.brightness !== undefined) setBrightness(data.brightness);
        if (data.color) setCurrentColor(data.color);
      })
      .catch(err => console.log("Błąd pobierania danych pokoju", err));

    // Pobierz sceny
    fetch(`${API_CONFIG.BASE_URL}/presets`)
      .then(res => res.json())
      .then(data => setCustomPresets(Array.isArray(data) ? data : []))
      .catch(() => setCustomPresets([]));
  }, [id]);

  const updateValue = (newBrightness: number, newColor?: string) => {
    setBrightness(newBrightness);
    if (newColor) setCurrentColor(newColor);

    const updateData: any = { brightness: newBrightness };
    if (newColor) updateData.color = newColor;

    fetch(`${API_CONFIG.BASE_URL}/rooms/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData)
    }).catch(err => console.log("Błąd zapisu w pokoju", err));
  };

  // DODAWANIE NOWEJ SCENY
  const saveNewPreset = async () => {
    if (!newSceneName.trim()) {
      Alert.alert("Błąd", "Wpisz nazwę sceny");
      return;
    }
    
    const newPreset = { 
      name: newSceneName, 
      color: currentColor, 
      brightness: brightness 
    };
    
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}/presets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPreset),
      });

      if (res.ok) {
        const saved = await res.json();
        setCustomPresets(prev => [...prev, saved]);
        setNewSceneName('');
        Alert.alert("Sukces", "Scena dodana!");
      }
    } catch (e) { 
      Alert.alert("Błąd", "Nie udało się zapisać sceny");
    }
  };

  // USUWANIE SCENY
  const deletePreset = async (presetId: string) => {
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}/presets/${presetId}`, { method: 'DELETE' });
      if (res.ok) {
        setCustomPresets(prev => prev.filter(p => p.id !== presetId));
      }
    } catch (e) { console.error(e); }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* NAGŁÓWEK */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft color="white" size={28} />
          <Text style={styles.backText}>Wróć</Text>
        </TouchableOpacity>
        <Text style={styles.roomName}>{name}</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* SLIDER JASNOŚCI */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Jasność: {Math.round(brightness)}%</Text>
          <View 
            style={[styles.customSliderContainer, { backgroundColor: dark ? 'rgba(255,255,255,0.1)' : '#e2e8f0' }]}
            onStartShouldSetResponder={() => true}
            onMoveShouldSetResponder={() => true}
            onResponderMove={(evt) => {
              const sliderWidth = width - 48; 
              let percent = Math.round((evt.nativeEvent.locationX / sliderWidth) * 100);
              setBrightness(Math.max(0, Math.min(100, percent)));
            }}
            onResponderRelease={() => updateValue(brightness)}
          >
            <View style={[styles.customSliderFill, { width: `${brightness}%`, backgroundColor: '#3b82f6' }]} />
          </View>
        </View>

        {/* KOŁO WYBORU KOLORU */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 15 }]}>Kolor światła</Text>
          <View style={styles.pickerContainer}>
            <ColorPicker
              color={currentColor}
              onColorChange={setCurrentColor}
              onColorChangeComplete={(color) => updateValue(brightness, color)}
              thumbSize={25}
              noSnap={true}
            />
          </View>
        </View>

        {/* ZARZĄDZANIE SCENAMI */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 15 }]}>Nowa scena</Text>
          <View style={styles.addPresetRow}>
            <TextInput
              style={[styles.input, { color: colors.text, backgroundColor: dark ? 'rgba(255,255,255,0.05)' : '#f1f5f9' }]}
              placeholder="Nazwa sceny..."
              placeholderTextColor="#94a3b8"
              value={newSceneName}
              onChangeText={setNewSceneName}
            />
            <TouchableOpacity style={styles.plusButton} onPress={saveNewPreset}>
              <Plus color="white" size={24} />
            </TouchableOpacity>
          </View>

          <View style={styles.scenesGrid}>
            {customPresets.map((preset) => (
              <View key={preset.id} style={styles.sceneWrapper}>
                <TouchableOpacity 
                  style={[styles.sceneCard, { backgroundColor: preset.color || '#3b82f6' }]}
                  onPress={() => updateValue(preset.brightness, preset.color)} // Scena ustawia oba parametry
                >
                  <Text style={styles.sceneText} numberOfLines={1}>{preset.name}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteBadge} onPress={() => deletePreset(preset.id)}>
                  <Trash2 color="#ef4444" size={14} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { backgroundColor: '#1e40af', paddingTop: 60, paddingHorizontal: 24, paddingBottom: 30, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  backButton: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, marginLeft: -8 },
  backText: { color: 'white', fontSize: 16, fontWeight: '600' },
  roomName: { color: 'white', fontSize: 32, fontWeight: 'bold' },
  content: { padding: 24 },
  section: { marginBottom: 35 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold' },
  customSliderContainer: { height: 35, width: '100%', borderRadius: 18, overflow: 'hidden', position: 'relative' },
  customSliderFill: { height: '100%' },
  pickerContainer: { height: 260, width: '100%' },
  addPresetRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  input: { flex: 1, height: 50, borderRadius: 12, paddingHorizontal: 15, fontSize: 16, borderWidth: 1, borderColor: 'rgba(0,0,0,0.1)' },
  plusButton: { backgroundColor: '#3b82f6', width: 50, height: 50, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  scenesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12,  paddingBottom: 60 },
  sceneWrapper: { position: 'relative', width: '47%' },
  sceneCard: { padding: 18, borderRadius: 15, alignItems: 'center', justifyContent: 'center', elevation: 2 },
  sceneText: { color: 'white', fontWeight: 'bold', fontSize: 14 },
  deleteBadge: { position: 'absolute', top: -5, right: -5, backgroundColor: 'white', borderRadius: 12, padding: 6, elevation: 5 }
});