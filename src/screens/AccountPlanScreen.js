import React, { useCallback, useState } from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import * as FileSystem from 'expo-file-system';
import { C, Primary } from '../components/ui';
import BottomTabs from '../components/BottomTabs';
import { clearDesigns, FREE_DESIGN_LIMIT, getExportCount, getStorageUsage, listDesigns } from '../storage/designs';

export default function AccountPlanScreen({ navigation }) {
  const [usage, setUsage] = useState({ designs: 0, exports: 0, bytes: 0 });
  const [busy, setBusy] = useState(false);
  const refresh = useCallback(async () => {
    try {
      const [designs, exports, bytes] = await Promise.all([listDesigns(), getExportCount(), getStorageUsage()]);
      setUsage({ designs: designs.length, exports, bytes });
    } catch (error) {
      Alert.alert('Could not load usage', error.message || String(error));
    }
  }, []);
  useFocusEffect(useCallback(() => { refresh(); }, [refresh]));

  const clearCache = () => Alert.alert('Clear temporary cache?', 'Temporary CustomApp Studio files will be removed. Saved designs and exports are kept.', [
    { text: 'Cancel', style: 'cancel' },
    { text: 'Clear cache', style: 'destructive', onPress: async () => {
      try {
        const cacheDir = FileSystem.cacheDirectory + 'customapp-studio/';
        const info = await FileSystem.getInfoAsync(cacheDir);
        if (info.exists) await FileSystem.deleteAsync(cacheDir, { idempotent: true });
        Alert.alert('Cache cleared', info.exists ? 'Temporary CustomApp Studio files were removed.' : 'There were no temporary CustomApp Studio files to remove.');
      } catch (error) {
        Alert.alert('Could not clear cache', error.message || String(error));
      }
    } },
  ]);
  const removeDesigns = () => Alert.alert('Clear all designs?', 'This permanently deletes every saved design from this device. Your exports are not deleted.', [
    { text: 'Cancel', style: 'cancel' },
    { text: 'Clear designs', style: 'destructive', onPress: async () => {
      try {
        setBusy(true);
        await clearDesigns();
        await refresh();
      } catch (error) {
        Alert.alert('Could not clear designs', error.message || String(error));
      } finally {
        setBusy(false);
      }
    } },
  ]);
  const mb = (usage.bytes / (1024 * 1024)).toFixed(2);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 18, paddingBottom: 24 }}>
        <Text style={{ fontSize: 24, fontWeight: '800', color: C.text }}>Your plan</Text>
        <View style={{ flexDirection: 'row', marginTop: 14 }}>
          <View style={{ flex: 1, padding: 14, backgroundColor: '#fff', borderRadius: 14, borderWidth: 1, borderColor: C.primary, marginRight: 7 }}>
            <Text style={{ fontSize: 17, fontWeight: '800', color: C.text }}>Free</Text>
            <Text style={{ color: C.muted, marginTop: 8 }}>Up to {FREE_DESIGN_LIMIT} saved designs</Text>
            <Text style={{ color: C.muted, marginTop: 4 }}>Local PDF and image exports</Text>
            <Text style={{ color: C.primary, fontWeight: '700', marginTop: 10 }}>Current plan</Text>
          </View>
          <View style={{ flex: 1, padding: 14, backgroundColor: '#F1F1FE', borderRadius: 14, borderWidth: 1, borderColor: '#D8D8F5', marginLeft: 7 }}>
            <Text style={{ fontSize: 17, fontWeight: '800', color: C.text }}>Pro</Text>
            <Text style={{ color: C.muted, marginTop: 8 }}>More designs and advanced tools</Text>
            <Text style={{ color: C.primary, fontWeight: '700', marginTop: 10 }}>Coming soon</Text>
          </View>
        </View>
        <Text style={{ fontSize: 18, fontWeight: '800', color: C.text, marginTop: 24, marginBottom: 10 }}>Local usage</Text>
        {[['Saved designs', `${usage.designs} / ${FREE_DESIGN_LIMIT}`], ['Exports completed', String(usage.exports)], ['Storage used', `${mb} MB`]].map(([label, value]) => (
          <View key={label} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderColor: C.border }}>
            <Text style={{ color: C.text }}>{label}</Text><Text style={{ color: C.muted, fontWeight: '700' }}>{value}</Text>
          </View>
        ))}
        <Primary title={busy ? 'Clearing designs' : 'Clear all designs'} icon="trash-outline" color={C.danger} style={{ marginTop: 20 }} onPress={removeDesigns} loading={busy} />
        <Primary title="Clear cache" icon="trash-outline" color={C.danger} style={{ marginTop: 10 }} onPress={clearCache} />
        <Text style={{ color: C.muted, fontSize: 12, marginTop: 16 }}>All account and plan information is local. Pro has no purchase flow yet.</Text>
      </ScrollView>
      <BottomTabs navigation={navigation} active="Profile" />
    </View>
  );
}
