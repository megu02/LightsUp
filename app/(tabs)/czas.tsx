import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { API_CONFIG } from '@/constants/config';
import { useTheme } from '@react-navigation/native';
import { Lightbulb, Plus, Trash2, X } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, Switch, TextInput, TouchableOpacity, View } from 'react-native';

export default function TabCzasScreen() {
  const [schedules, setSchedules] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [presets, setPresets] = useState<any[]>([]);
  const [isModalVisible, setModalVisible] = useState(false);

  const [name, setName] = useState('');
  const [time, setTime] = useState('12:00');
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [selectedPreset, setSelectedPreset] = useState<any>(null);

  const { colors, dark } = useTheme();

  const fetchData = async () => {
    try {
      const [schRes, roomRes, preRes] = await Promise.all([
        fetch(`${API_CONFIG.BASE_URL}/schedules`),
        fetch(`${API_CONFIG.BASE_URL}/rooms`),
        fetch(`${API_CONFIG.BASE_URL}/presets`)
      ]);
      setSchedules(await schRes.json());
      setRooms(await roomRes.json());
      setPresets(await preRes.json());
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleAddSchedule = async () => {
    if (!name || !selectedRoom || !selectedPreset) {
      Alert.alert("Błąd", "Wypełnij wszystkie pola");
      return;
    }

    const newSchedule = {
      name,
      time,
      isEnabled: true,
      roomId: selectedRoom.id,
      roomName: selectedRoom.name,
      presetName: selectedPreset.name
    };

    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}/schedules`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSchedule)
      });
      if (res.ok) {
        setModalVisible(false);
        setName('');
        fetchData();
      }
    } catch (e) { console.error(e); }
  };

  const deleteSchedule = (id: string) => {
    fetch(`${API_CONFIG.BASE_URL}/schedules/${id}`, { method: 'DELETE' }).then(fetchData);
  };

  const toggleSchedule = (id: string, current: boolean) => {
    fetch(`${API_CONFIG.BASE_URL}/schedules/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isEnabled: !current })
    }).then(fetchData);
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title">Harmonogramy</ThemedText>
        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Plus color="white" size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {schedules.map((item) => (
          <View key={item.id} style={[styles.card, { backgroundColor: dark ? '#1e293b' : '#f8fafc' }]}>
            <View style={styles.cardRow}>
              <View>
                <ThemedText style={styles.timeText}>{item.time}</ThemedText>
                <ThemedText style={styles.nameText}>{item.name}</ThemedText>
              </View>
              <Switch 
                value={item.isEnabled} 
                onValueChange={() => toggleSchedule(item.id, item.isEnabled)}
                trackColor={{ true: '#3b82f6' }}
              />
            </View>
            <View style={styles.cardFooter}>
              <View style={styles.tag}>
                <Lightbulb size={12} color="#3b82f6" />
                <ThemedText style={styles.tagText}>{item.roomName} • {item.presetName}</ThemedText>
              </View>
              <TouchableOpacity onPress={() => deleteSchedule(item.id)}>
                <Trash2 size={18} color="#ef4444" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* MODAL DODAWANIA */}
      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
            <View style={styles.modalHeader}>
              <ThemedText style={styles.modalTitle}>Nowy harmonogram</ThemedText>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X color={colors.text} size={24} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <ThemedText style={styles.label}>Nazwa wydarzenia</ThemedText>
              <TextInput 
                style={[styles.input, { color: colors.text, backgroundColor: dark ? '#1e293b' : '#f1f5f9' }]}
                placeholder="np. Wieczorne czytanie"
                placeholderTextColor="#94a3b8"
                value={name}
                onChangeText={setName}
              />

              <ThemedText style={styles.label}>Godzina (HH:MM)</ThemedText>
              <TextInput 
                style={[styles.input, { color: colors.text, backgroundColor: dark ? '#1e293b' : '#f1f5f9' }]}
                value={time}
                onChangeText={setTime}
                keyboardType="numbers-and-punctuation"
              />

              <ThemedText style={styles.label}>Wybierz pokój </ThemedText>
              <View style={styles.pickerGrid}>
                {rooms.map(room => (
                  <TouchableOpacity 
                    key={room.id}
                    style={[styles.pickerItem, selectedRoom?.id === room.id && styles.selectedItem]}
                    onPress={() => setSelectedRoom(room)}
                  >
                    <ThemedText style={selectedRoom?.id === room.id && {color: 'white'}}>{room.icon} {room.name} </ThemedText>
                  </TouchableOpacity>
                ))}
              </View>

              <ThemedText style={styles.label}>Wybierz scenę</ThemedText>
              <View style={styles.pickerGrid}>
                {presets.map(preset => (
                  <TouchableOpacity 
                    key={preset.id}
                    style={[styles.pickerItem, selectedPreset?.id === preset.id && styles.selectedItem]}
                    onPress={() => setSelectedPreset(preset)}
                  >
                    <ThemedText style={selectedPreset?.id === preset.id && {color: 'white'}}>{preset.name} </ThemedText>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity style={styles.saveButton} onPress={handleAddSchedule}>
                <ThemedText style={styles.saveButtonText}>Zapisz harmonogram</ThemedText>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, marginBottom: 20 },
  addButton: { backgroundColor: '#3b82f6', width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  content: { padding: 24, paddingBottom: 110 },
  card: { borderRadius: 24, padding: 20, marginBottom: 16, elevation: 2 },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  timeText: { fontSize: 32, fontWeight: 'bold', color: '#3b82f6', paddingTop: 10, paddingBottom: 10 },
  nameText: { fontSize: 16, fontWeight: '600', marginTop: -4 },
  cardFooter: { marginTop: 15, paddingTop: 15, borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.05)', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  tag: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(59, 130, 246, 0.1)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  tagText: { fontSize: 12, color: '#3b82f6', fontWeight: '600' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 24, height: '85%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
  modalTitle: { fontSize: 22, fontWeight: 'bold' },
  label: { fontSize: 14, fontWeight: '700', marginBottom: 8, marginTop: 15, color: '#64748b' },
  input: { height: 55, borderRadius: 16, paddingHorizontal: 16, fontSize: 16 },
  pickerGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 5 },
  pickerItem: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0' },
  selectedItem: { backgroundColor: '#3b82f6', borderColor: '#3b82f6' },
  saveButton: { backgroundColor: '#3b82f6', height: 60, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginTop: 30, marginBottom: 20 },
  saveButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' }
});