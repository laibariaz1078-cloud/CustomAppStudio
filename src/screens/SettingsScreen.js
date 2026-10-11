import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { C, Label, Primary, Seg } from '../components/ui';
import BottomTabs from '../components/BottomTabs';
import { clearLocalData, DEFAULT_SETTINGS, getSettings, setSettings } from '../storage/designs';

export default function SettingsScreen({ navigation }) {
  const [settings, setCurrent] = useState(DEFAULT_SETTINGS);
  useEffect(() => {
    getSettings().then(setCurrent).catch((error) => Alert.alert('Could not load settings', error.message || String(error)));
  }, []);
  const update = async (patch) => {
    const next = { ...settings, ...patch };
    setCurrent(next);
    try {
      await setSettings(next);
    } catch (error) {
      setCurrent(settings);
      Alert.alert('Could not save settings', error.message || String(error));
    }
  };
  const clearData = () => Alert.alert('Clear all local data?', 'Saved designs, profile information, settings, export counts and generated files will be removed from this device.', [
    { text: 'Cancel', style: 'cancel' },
    { text: 'Clear data', style: 'destructive', onPress: async () => {
      try {
        await clearLocalData();
        for (const name of ['exports', 'media']) {
          const uri = FileSystem.documentDirectory + name + '/';
          const info = await FileSystem.getInfoAsync(uri);
          if (info.exists) await FileSystem.deleteAsync(uri, { idempotent: true });
        }
        setCurrent(DEFAULT_SETTINGS);
        Alert.alert('Local data cleared', 'Saved data and generated files were removed from this device.');
      } catch (error) {
        Alert.alert('Could not clear local data', error.message || String(error));
      }
    } },
  ]);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 24 }}>
        <Label>Resume PDF page size</Label>
        <View style={{ flexDirection: 'row' }}><Seg value={settings.pageSize} onChange={(pageSize) => update({ pageSize })} options={[{ k: 'a4', label: 'A4' }, { k: 'letter', label: 'US Letter' }]} /></View>
        <Label>Card / invitation image format</Label>
        <View style={{ flexDirection: 'row' }}><Seg value={settings.imageFormat} onChange={(imageFormat) => update({ imageFormat })} options={[{ k: 'png', label: 'PNG' }, { k: 'jpg', label: 'JPEG' }]} /></View>
        <Label>About</Label>
        <View style={{ backgroundColor: '#fff', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: C.border }}>
          <Text style={{ color: C.text, fontWeight: '700' }}>CustomApp Studio</Text>
          <Text style={{ color: C.muted, fontSize: 12, marginTop: 4 }}>Version 1.0.0 · All designs and profile data are stored locally on your device.</Text>
        </View>
        <Label>Local data</Label>
        <Primary title="Clear all local data" icon="trash-outline" color={C.danger} style={{ marginTop: 4 }} onPress={clearData} />
      </ScrollView>
      <BottomTabs navigation={navigation} active="Settings" />
    </View>
  );
}
