import React, { useEffect, useState } from 'react';
import { View, Text, Alert, ScrollView } from 'react-native';
import { C, Seg, Primary, Label } from '../components/ui';
import { getSettings, setSettings, clearDesigns, DEFAULT_SETTINGS } from '../storage/designs';

export default function SettingsScreen() {
  const [s, setS] = useState(DEFAULT_SETTINGS);
  useEffect(() => { getSettings().then(setS); }, []);
  const upd = (patch) => { const n = { ...s, ...patch }; setS(n); setSettings(n); };
  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Label>Resume PDF page size</Label>
      <View style={{ flexDirection: 'row' }}><Seg value={s.pageSize} onChange={(k) => upd({ pageSize: k })} options={[{ k: 'a4', label: 'A4' }, { k: 'letter', label: 'US Letter' }]} /></View>
      <Label>Card / invitation image format</Label>
      <View style={{ flexDirection: 'row' }}><Seg value={s.imageFormat} onChange={(k) => upd({ imageFormat: k })} options={[{ k: 'png', label: 'PNG' }, { k: 'jpg', label: 'JPEG' }]} /></View>
      <Label>Data</Label>
      <Primary title="Delete all saved designs" icon="trash" style={{ backgroundColor: C.danger }} onPress={() => Alert.alert('Delete everything?', 'All saved designs on this device will be removed.', [{ text: 'Cancel', style: 'cancel' }, { text: 'Delete all', style: 'destructive', onPress: async () => { await clearDesigns(); Alert.alert('Done', 'All designs deleted.'); } }])} />
      <Text style={{ color: C.muted, marginTop: 24, fontSize: 12 }}>CustomApp Studio 1.0 — everything is stored locally on your device. No account, no backend, no cloud.</Text>
    </ScrollView>
  );
}
