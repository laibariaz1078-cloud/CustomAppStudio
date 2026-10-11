import React, { useCallback, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, Modal, TextInput, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { C, Empty, Primary, Seg } from '../components/ui';
import { DesignView } from '../components/DesignView';
import { listDesigns, deleteDesign, duplicateDesign, renameDesign } from '../storage/designs';
import { APPS } from '../templates';

export default function MyDesignsScreen({ navigation }) {
  const [list, setList] = useState(null);
  const [filter, setFilter] = useState('all');
  const [ren, setRen] = useState(null);
  const load = useCallback(() => listDesigns().then(setList).catch(() => setList([])), []);
  useFocusEffect(useCallback(() => { load(); }, [load]));
  const shown = (list || []).filter((d) => filter === 'all' || d.appType === filter);
  const del = (d) => Alert.alert('Delete design?', `"${d.name}" will be removed from this device.`, [{ text: 'Cancel', style: 'cancel' }, { text: 'Delete', style: 'destructive', onPress: async () => { await deleteDesign(d.id); load(); } }]);
  if (!list) return <ActivityIndicator style={{ marginTop: 40 }} size="large" color={C.primary} />;
  return (
    <View style={{ flex: 1 }}>
      <View style={{ padding: 12 }}><Seg value={filter} onChange={setFilter} options={[{ k: 'all', label: 'All' }, ...APPS.map((a) => ({ k: a.key, label: a.title.split(' ')[0] }))]} /></View>
      <FlatList data={shown} keyExtractor={(d) => d.id} contentContainerStyle={{ padding: 12, paddingTop: 0 }}
        ListEmptyComponent={<Empty title="No saved designs" sub="Pick a template, customize it and tap the check mark to save." />}
        renderItem={({ item: d }) => (
          <View style={{ flexDirection: 'row', backgroundColor: '#fff', borderRadius: 14, padding: 10, marginBottom: 10, borderWidth: 1, borderColor: C.border, alignItems: 'center' }}>
            <TouchableOpacity onPress={() => navigation.navigate('Preview', { designId: d.id })} style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
              <View style={{ borderRadius: 6, overflow: 'hidden', borderWidth: 1, borderColor: C.border }}><DesignView design={d} scale={Math.min(70 / d.width, 90 / d.height)} /></View>
              <View style={{ flex: 1, marginLeft: 12 }}><Text numberOfLines={1} style={{ fontWeight: '700', color: C.text }}>{d.name}</Text><Text style={{ color: C.muted, fontSize: 12 }}>{new Date(d.updatedAt).toLocaleString()}</Text></View>
            </TouchableOpacity>
            <TouchableOpacity accessibilityLabel="Edit" style={{ padding: 9 }} onPress={() => navigation.navigate('Editor', { designId: d.id })}><Ionicons name="create-outline" size={22} color={C.text} /></TouchableOpacity>
            <TouchableOpacity accessibilityLabel="Rename" style={{ padding: 9 }} onPress={() => setRen({ id: d.id, name: d.name })}><Ionicons name="text-outline" size={22} color={C.text} /></TouchableOpacity>
            <TouchableOpacity accessibilityLabel="Duplicate" style={{ padding: 9 }} onPress={async () => { await duplicateDesign(d.id); load(); }}><Ionicons name="copy-outline" size={22} color={C.text} /></TouchableOpacity>
            <TouchableOpacity accessibilityLabel="Delete" style={{ padding: 9 }} onPress={() => del(d)}><Ionicons name="trash-outline" size={22} color={C.danger} /></TouchableOpacity>
          </View>)} />
      <Modal visible={!!ren} transparent animationType="fade" onRequestClose={() => setRen(null)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', padding: 24 }}>
          <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 16 }}>
            <Text style={{ fontWeight: '700', fontSize: 16, marginBottom: 10 }}>Rename design</Text>
            <TextInput autoFocus value={ren?.name || ''} onChangeText={(t) => setRen({ ...ren, name: t })} style={{ borderWidth: 1, borderColor: C.border, borderRadius: 10, padding: 10 }} />
            <View style={{ flexDirection: 'row', marginTop: 14 }}>
              <TouchableOpacity onPress={() => setRen(null)} style={{ flex: 1, alignItems: 'center', padding: 12 }}><Text>Cancel</Text></TouchableOpacity>
              <Primary title="Save" style={{ flex: 1 }} disabled={!ren?.name?.trim()} onPress={async () => { await renameDesign(ren.id, ren.name.trim()); setRen(null); load(); }} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
