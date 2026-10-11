import React, { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { C, Primary } from '../components/ui';
import { DesignView } from '../components/DesignView';
import { APPS } from '../templates';
import { listDesigns } from '../storage/designs';

export default function HomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [recent, setRecent] = useState([]);
  useFocusEffect(useCallback(() => { listDesigns().then((d) => setRecent(d.slice(0, 8))); }, []));
  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingTop: insets.top + 12, paddingBottom: 40 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View><Text style={{ color: C.muted }}>Welcome to</Text><Text style={{ fontSize: 26, fontWeight: '800', color: C.text }}>CustomApp Studio</Text></View>
        <TouchableOpacity accessibilityLabel="Settings" onPress={() => navigation.navigate('Settings')} style={s.round}><Ionicons name="settings-outline" size={22} color={C.text} /></TouchableOpacity>
      </View>
      <Primary title="Create New Design" icon="add-circle" style={{ marginTop: 18 }} onPress={() => navigation.navigate('MiniApps')} />
      <Text style={s.h}>Mini-Apps</Text>
      {APPS.map((a) => (
        <TouchableOpacity key={a.key} style={s.card} onPress={() => navigation.navigate('Gallery', { appType: a.key, title: a.title })}>
          <View style={[s.icon, { backgroundColor: a.color }]}><Ionicons name={a.icon} size={26} color="#fff" /></View>
          <View style={{ flex: 1 }}><Text style={{ fontWeight: '700', fontSize: 16, color: C.text }}>{a.title}</Text><Text style={{ color: C.muted, fontSize: 12, marginTop: 2 }}>{a.desc}</Text></View>
          <Ionicons name="chevron-forward" size={20} color={C.muted} />
        </TouchableOpacity>))}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={s.h}>Recent designs</Text>
        <TouchableOpacity onPress={() => navigation.navigate('MyDesigns')} style={{ padding: 8 }}><Text style={{ color: C.primary, fontWeight: '700' }}>See all</Text></TouchableOpacity>
      </View>
      {recent.length === 0 ? <Text style={{ color: C.muted }}>No designs yet. Pick a mini-app above to start.</Text> : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>{recent.map((d) => (
          <TouchableOpacity key={d.id} onPress={() => navigation.navigate('Preview', { designId: d.id })} style={{ marginRight: 12 }}>
            <View style={s.thumb}><DesignView design={d} scale={Math.min(110 / d.width, 140 / d.height)} /></View>
            <Text numberOfLines={1} style={{ width: 110, fontSize: 12, marginTop: 4, color: C.text }}>{d.name}</Text>
          </TouchableOpacity>))}</ScrollView>)}
      <TouchableOpacity style={[s.card, { marginTop: 20 }]} onPress={() => navigation.navigate('MyDesigns')}>
        <Ionicons name="folder-open" size={24} color={C.primary} style={{ marginRight: 14 }} /><Text style={{ flex: 1, fontWeight: '700', color: C.text }}>My Designs</Text><Ionicons name="chevron-forward" size={20} color={C.muted} />
      </TouchableOpacity>
    </ScrollView>
  );
}
const s = StyleSheet.create({
  h: { fontSize: 18, fontWeight: '800', color: C.text, marginTop: 22, marginBottom: 10 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 14, borderRadius: 16, marginBottom: 10, borderWidth: 1, borderColor: C.border, minHeight: 64 },
  icon: { width: 52, height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  round: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: C.border },
  thumb: { borderRadius: 8, overflow: 'hidden', borderWidth: 1, borderColor: C.border, alignSelf: 'flex-start' },
});
