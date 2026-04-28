import { Link } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

export default function DashboardScreen() {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    fetch('http://192.168.0.16:3000/rooms')
      .then(res => res.json())
      .then(data => setRooms(data))
      .catch(err => console.log("Uruchom json-server!", err));
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>{"Panel\nSterowania"}</Text>
          <View style={styles.profileContainer}>
            <Image source={{ uri: 'https://icons.veryicon.com/png/o/miscellaneous/standard/avatar-15.png' }} style={styles.profilePic} />
          </View>
        </View>
        <Text style={styles.headerSubtitle}>Wszystkie pokoje</Text>
      </View>

      <View style={styles.grid}>
        {rooms.map((room) => (
          <Link key={room.id} href={`/modal?id=${room.id}&name=${room.name}`} asChild>
            <TouchableOpacity style={styles.roomCard}>
              <View style={[styles.roomIconBg, { backgroundColor: room.color }]}>
                <Text style={styles.roomIconText}>{room.icon}</Text>
              </View>
              <Text style={styles.roomLabel}>{room.name}</Text>
              <Text style={styles.roomSubLabel}>{room.lights} Światła</Text>
            </TouchableOpacity>
          </Link>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f4f8' },
  header: { backgroundColor: '#1e40af', paddingTop: 60, paddingHorizontal: 24, paddingBottom: 30, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  headerTitle: { color: 'white', fontSize: 28, fontWeight: 'bold', lineHeight: 34 },
  headerSubtitle: { color: 'rgba(255,255,255,0.7)', fontSize: 16 },
  profileContainer: { position: 'relative' },
  profilePic: { width: 48, height: 48, borderRadius: 24, borderWidth: 2, borderColor: 'rgba(255,255,255,0.5)' },
  statusDot: { position: 'absolute', top: 0, right: 0, width: 12, height: 12, backgroundColor: '#ef4444', borderRadius: 6, borderWidth: 2, borderColor: 'white' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', padding: 12, justifyContent: 'space-between' },
  roomCard: { backgroundColor: 'white', width: (width - 48) / 2, margin: 6, padding: 20, borderRadius: 24, alignItems: 'center', elevation: 2 },
  roomIconBg: { width: 60, height: 60, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  roomIconText: { fontSize: 24 },
  roomLabel: { fontWeight: 'bold', color: '#1e293b', fontSize: 16 },
  roomSubLabel: { color: '#94a3b8', fontSize: 12 },
});