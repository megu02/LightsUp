import { API_CONFIG } from '@/constants/config';
import { useTheme } from '@react-navigation/native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, Plus, Power, Trash2 } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, Dimensions, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import ColorPicker from 'react-native-wheel-color-picker';

const { width } = Dimensions.get('window');

export default function RoomModal() {
  const { id, name } = useLocalSearchParams();
  const router = useRouter();
  
  const [brightness, setBrightness] = useState(65);
  const [currentColor, setCurrentColor] = useState('#3b82f6');
  const [isOn, setIsOn] = useState(true);
  const [newSceneName, setNewSceneName] = useState('');
  const [customPresets, setCustomPresets] = useState<any[]>([]);

  const { colors, dark } = useTheme();

  useEffect(() => {
    fetch(`${API_CONFIG.BASE_URL}/rooms/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.brightness !== undefined) setBrightness(data.brightness);
        if (data.color) setCurrentColor(data.color);
        if (data.isActive !== undefined) setIsOn(data.isActive);
      })
      .catch(err => console.log("Błąd pobierania danych pokoju", err));

    fetch(`${API_CONFIG.BASE_URL}/presets`)
      .then(res => res.json())
      .then(data => setCustomPresets(Array.isArray(data) ? data : []))
      .catch(() => setCustomPresets([]));
  }, [id]);

  const updateValue = (newBrightness: number, newColor?: string, newIsOn?: boolean) => {
    setBrightness(newBrightness);
    if (newColor) setCurrentColor(newColor);
    if (newIsOn !== undefined) setIsOn(newIsOn);

    const updateData: any = { 
        brightness: newBrightness,
        isActive: newIsOn !== undefined ? newIsOn : isOn
    };
    if (newColor) updateData.color = newColor;

    fetch(`${API_CONFIG.BASE_URL}/rooms/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData)
    }).catch(err => console.log("Błąd zapisu w pokoju", err));
  };

  const saveNewPreset = async () => {
    if (!newSceneName.trim()) {
      Alert.alert("Błąd", "Wpisz nazwę sceny");
      return;
    }
    const newPreset = { name: newSceneName, color: currentColor, brightness: brightness };
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
    } catch (e) { Alert.alert("Błąd", "Nie udało się zapisać sceny"); }
  };

  const deletePreset = async (presetId: string) => {
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}/presets/${presetId}`, { method: 'DELETE' });
      if (res.ok) setCustomPresets(prev => prev.filter(p => p.id !== presetId));
    } catch (e) { console.error(e); }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: isOn ? '#1e40af' : '#334155' }]}>
        <View style={styles.headerTop}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <ChevronLeft color="white" size={28} />
                <Text style={styles.backText}>Wróć</Text>
            </TouchableOpacity>
            
            {/* PRZYCISK WŁĄCZ/WYŁĄCZ W NAGŁÓWKU */}
            <TouchableOpacity 
                style={[styles.powerButton, { backgroundColor: isOn ? '#3b82f6' : '#ef4444' }]} 
                onPress={() => updateValue(brightness, currentColor, !isOn)}
            >
                <Power color="white" size={20} />
            </TouchableOpacity>
        </View>
        <Text style={styles.roomName}>{name}</Text>
        <Text style={styles.statusLabel}>{isOn ? 'Światło włączone' : 'Światło wyłączone'}</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        <View style={[styles.section, { opacity: isOn ? 1 : 0.4 }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Jasność: {Math.round(brightness)}%</Text>
          <View 
            pointerEvents={isOn ? 'auto' : 'none'}
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
            <View style={[styles.customSliderFill, { width: `${brightness}%`, backgroundColor: isOn ? '#3b82f6' : '#94a3b8' }]} />
          </View>
        </View>

        <View style={[styles.section, { opacity: isOn ? 1 : 0.4 }]} pointerEvents={isOn ? 'auto' : 'none'}>
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
                  onPress={() => updateValue(preset.brightness, preset.color, true)} // Scena zawsze włącza światło
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
  header: { paddingTop: 60, paddingHorizontal: 24, paddingBottom: 30, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  backButton: { flexDirection: 'row', alignItems: 'center', marginLeft: -8 },
  backText: { color: 'white', fontSize: 16, fontWeight: '600' },
  powerButton: { width: 45, height: 45, borderRadius: 22.5, justifyContent: 'center', alignItems: 'center', elevation: 5 },
  roomName: { color: 'white', fontSize: 32, fontWeight: 'bold' },
  statusLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 14, marginTop: 4 },
  content: { padding: 24 },
  section: { marginBottom: 35 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  customSliderContainer: { height: 35, width: '100%', borderRadius: 18, overflow: 'hidden' },
  customSliderFill: { height: '100%' },
  pickerContainer: { height: 260, width: '100%' },
  addPresetRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  input: { flex: 1, height: 50, borderRadius: 12, paddingHorizontal: 15, fontSize: 16, borderWidth: 1, borderColor: 'rgba(0,0,0,0.1)' },
  plusButton: { backgroundColor: '#3b82f6', width: 50, height: 50, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  scenesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, paddingBottom: 60 },
  sceneWrapper: { position: 'relative', width: '47%' },
  sceneCard: { padding: 18, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  sceneText: { color: 'white', fontWeight: 'bold', fontSize: 14 },
  deleteBadge: { position: 'absolute', top: -5, right: -5, backgroundColor: 'white', borderRadius: 12, padding: 6, elevation: 5 }
});