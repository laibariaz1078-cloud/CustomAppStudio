import React, { useCallback, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, Modal, TextInput, ActivityIndicator, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { C, Empty, Primary, Seg } from '../components/ui';
import { Btn } from '../components/ui';
import BottomTabs from '../components/BottomTabs';
import { DesignView } from '../components/DesignView';
import { listDesigns, deleteDesign, duplicateDesign, renameDesign } from '../storage/designs';
import { APPS } from '../templates';

export default function MyDesignsScreen({ navigation }) {
  const [list, setList] = useState(null);
  const [listError, setListError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [ren, setRen] = useState(null);
  const load = useCallback(() => {
    setList(null);
    setListError(null);
    return listDesigns().then(setList).catch((error) => {
      const message = error.message || String(error);
      setListError(message);
      Alert.alert('Could not load designs', message);
    });
  }, []);
  useFocusEffect(useCallback(() => { load(); }, [load]));
  const shown = (list || []).filter((d) => filter === 'all' || d.appType === filter);
  const del = (d) => Alert.alert('Delete design?', `"${d.name}" will be removed from this device.`, [{ text: 'Cancel', style: 'cancel' }, { text: 'Delete', style: 'destructive', onPress: async () => { try { await deleteDesign(d.id); await load(); } catch (error) { Alert.alert('Could not delete design', error.message || String(error)); } } }]);
  if (!list && !listError) return <View style={{ flex: 1 }}><ActivityIndicator style={{ flex: 1 }} size="large" color={C.primary} /><BottomTabs navigation={navigation} active="MyDesigns" /></View>;
  if (listError) return <View style={{ flex: 1 }}>
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <Empty icon="alert-circle-outline" title="Designs could not be loaded" sub={listError} />
      <Primary title="Retry loading designs" icon="refresh" onPress={load} />
    </View>
    <BottomTabs navigation={navigation} active="MyDesigns" />
  </View>;
  return (
    <View style={{ flex: 1 }}>
      <View style={{ padding: 12 }}><Seg value={filter} onChange={setFilter} options={[{ k: 'all', label: 'All' }, ...APPS.map((a) => ({ k: a.key, label: a.title.split(' ')[0] }))]} /></View>
      <FlatList data={shown} keyExtractor={(d) => d.id} contentContainerStyle={{ padding: 12, paddingTop: 0 }}
        ListEmptyComponent={<Empty title="No saved designs" sub="Pick a template, customize it and tap the check mark to save." />}
        renderItem={({ item: d }) => (
          <View style={{ backgroundColor: '#fff', borderRadius: 14, padding: 10, marginBottom: 10, borderWidth: 1, borderColor: C.border }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity accessibilityRole="button" accessibilityLabel={`Preview ${d.name}`} onPress={() => navigation.navigate('Preview', { designId: d.id })} style={{ flexDirection: 'row', flex: 1, alignItems: 'center', minHeight: 90 }}>
              <View style={{ borderRadius: 6, overflow: 'hidden', borderWidth: 1, borderColor: C.border }}><DesignView design={d} scale={Math.min(70 / d.width, 90 / d.height)} /></View>
              <View style={{ flex: 1, marginLeft: 12 }}><View style={{ flexDirection: 'row', alignItems: 'center' }}><Ionicons name="eye-outline" size={14} color={C.primary} /><Text numberOfLines={1} style={{ fontWeight: '700', color: C.text, marginLeft: 4 }}>{d.name}</Text></View><Text style={{ color: C.muted, fontSize: 12 }}>{new Date(d.updatedAt).toLocaleString()}</Text></View>
            </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 8 }}>
              <Btn icon="create-outline" label="Edit" onPress={() => navigation.navigate('Editor', { designId: d.id })} />
              <Btn icon="text-outline" label="Rename" onPress={() => setRen({ id: d.id, name: d.name })} />
              <Btn icon="copy-outline" label="Duplicate" onPress={async () => { try { await duplicateDesign(d.id); await load(); } catch (error) { Alert.alert(error.code === 'DESIGN_LIMIT_REACHED' ? 'Free plan limit reached' : 'Could not duplicate design', error.message || String(error)); } }} />
              <Btn icon="trash-outline" label="Delete" color={C.danger} onPress={() => del(d)} />
            </ScrollView>
          </View>)} />
      <Modal visible={!!ren} transparent animationType="fade" onRequestClose={() => setRen(null)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', padding: 24 }}>
          <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 16 }}>
            <Text style={{ fontWeight: '700', fontSize: 16, marginBottom: 10 }}>Rename design</Text>
            <TextInput accessibilityLabel="Design name" autoFocus value={ren?.name || ''} onChangeText={(t) => setRen({ ...ren, name: t })} style={{ minHeight: 44, borderWidth: 1, borderColor: C.border, borderRadius: 10, padding: 10 }} />
            <View style={{ flexDirection: 'row', marginTop: 14 }}>
              <TouchableOpacity accessibilityRole="button" accessibilityLabel="Cancel rename" onPress={() => setRen(null)} style={{ minHeight: 48, flex: 1, alignItems: 'center', justifyContent: 'center', padding: 8, flexDirection: 'row' }}><Ionicons name="close-circle-outline" size={18} color={C.text} /><Text style={{ marginLeft: 5 }}>Cancel</Text></TouchableOpacity>
              <Primary title="Save name" icon="checkmark-circle-outline" style={{ flex: 1 }} disabled={!ren?.name?.trim()} onPress={async () => { try { await renameDesign(ren.id, ren.name.trim()); setRen(null); await load(); } catch (error) { Alert.alert('Could not rename design', error.message || String(error)); } }} />
            </View>
          </View>
        </View>
      </Modal>
      <BottomTabs navigation={navigation} active="MyDesigns" />
    </View>
  );
}
