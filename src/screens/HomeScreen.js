import React, { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { C, Primary } from '../components/ui';
import { DesignView } from '../components/DesignView';
import BottomTabs from '../components/BottomTabs';
import { APPS } from '../templates';
import { listDesigns } from '../storage/designs';

export default function HomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [recent, setRecent] = useState([]);
  const [recentError, setRecentError] = useState(null);
  const loadRecent = useCallback(() => {
    setRecentError(null);
    listDesigns().then((d) => setRecent(d.slice(0, 8))).catch((e) => {
      setRecentError(e.message || String(e));
      Alert.alert('Could not load designs', e.message || String(e));
    });
  }, []);
  useFocusEffect(useCallback(() => { loadRecent(); }, [loadRecent]));
  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingTop: insets.top + 12, paddingBottom: 28 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={{ flex: 1 }}><Text style={{ color: C.muted }}>Welcome to</Text><Text style={{ fontSize: 26, fontWeight: '800', color: C.text }}>CustomApp Studio</Text></View>
          <TouchableOpacity accessibilityRole="button" accessibilityLabel="Profile" onPress={() => navigation.navigate('Profile')} style={s.round}><Ionicons name="person-circle-outline" size={22} color={C.text} /><Text style={s.roundLabel}>Profile</Text></TouchableOpacity>
          <TouchableOpacity accessibilityRole="button" accessibilityLabel="Settings" onPress={() => navigation.navigate('Settings')} style={s.round}><Ionicons name="settings-outline" size={20} color={C.text} /><Text style={s.roundLabel}>Settings</Text></TouchableOpacity>
        </View>
        <Primary title="Create New Design" icon="add-circle" style={{ marginTop: 18 }} onPress={() => navigation.navigate('MiniApps')} />
        <Text style={s.h}>Mini-Apps</Text>
        {APPS.map((a) => (
          <TouchableOpacity key={a.key} accessibilityRole="button" accessibilityLabel={`Open ${a.title}`} style={s.card} onPress={() => navigation.navigate('Gallery', { appType: a.key, title: a.title })}>
            <View style={[s.icon, { backgroundColor: a.color }]}><Ionicons name={a.icon} size={26} color="#fff" /></View>
            <View style={{ flex: 1 }}><Text style={{ fontWeight: '700', fontSize: 16, color: C.text }}>{a.title}</Text><Text style={{ color: C.muted, fontSize: 12, marginTop: 2 }}>{a.desc}</Text></View>
            <Ionicons name="chevron-forward" size={20} color={C.muted} />
          </TouchableOpacity>))}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={s.h}>Recent designs</Text>
          <TouchableOpacity accessibilityRole="button" accessibilityLabel="See all designs" onPress={() => navigation.navigate('MyDesigns')} style={{ minHeight: 44, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 6 }}><Text style={{ color: C.primary, fontWeight: '700' }}>See all</Text><Ionicons name="chevron-forward" size={17} color={C.primary} /></TouchableOpacity>
        </View>
        {recentError ? <View><Text style={{ color: C.danger }}>Recent designs could not be loaded.</Text><Primary title="Retry loading designs" icon="refresh" style={{ marginTop: 8 }} onPress={loadRecent} /></View> : recent.length === 0 ? <Text style={{ color: C.muted }}>No designs yet. Pick a mini-app above to start.</Text> : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>{recent.map((d) => (
            <TouchableOpacity key={d.id} accessibilityRole="button" accessibilityLabel={`Preview ${d.name}`} onPress={() => navigation.navigate('Preview', { designId: d.id })} style={{ marginRight: 12 }}>
              <View style={s.thumb}><DesignView design={d} scale={Math.min(110 / d.width, 140 / d.height)} /></View>
              <View style={{ flexDirection: 'row', alignItems: 'center', width: 110, marginTop: 4 }}><Ionicons name="eye-outline" size={13} color={C.primary} /><Text numberOfLines={1} style={{ flex: 1, fontSize: 12, marginLeft: 3, color: C.text }}>{d.name}</Text></View>
            </TouchableOpacity>))}</ScrollView>)}
        <TouchableOpacity accessibilityRole="button" accessibilityLabel="Open My Designs" style={[s.card, { marginTop: 20 }]} onPress={() => navigation.navigate('MyDesigns')}>
          <Ionicons name="folder-open" size={24} color={C.primary} style={{ marginRight: 14 }} /><Text style={{ flex: 1, fontWeight: '700', color: C.text }}>My Designs</Text><Ionicons name="chevron-forward" size={20} color={C.muted} />
        </TouchableOpacity>
      </ScrollView>
      <BottomTabs navigation={navigation} active="Home" />
    </View>
  );
}
const s = StyleSheet.create({
  h: { fontSize: 18, fontWeight: '800', color: C.text, marginTop: 22, marginBottom: 10 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 14, borderRadius: 16, marginBottom: 10, borderWidth: 1, borderColor: C.border, minHeight: 64 },
  icon: { width: 52, height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  round: { minWidth: 48, minHeight: 48, paddingHorizontal: 4, borderRadius: 12, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: C.border, marginLeft: 6 },
  roundLabel: { fontSize: 8, color: C.text },
  thumb: { borderRadius: 8, overflow: 'hidden', borderWidth: 1, borderColor: C.border, alignSelf: 'flex-start' },
});
