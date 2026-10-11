import React, { useCallback, useRef, useState } from 'react';
import { View, Text, ScrollView, Alert, useWindowDimensions, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { C, Primary } from '../components/ui';
import { DesignView } from '../components/DesignView';
import { getDesign, getSettings } from '../storage/designs';
import { exportDesign, shareFile } from '../utils/exporter';

export default function SavedDesignPreviewScreen({ route, navigation }) {
  const { width, height } = useWindowDimensions();
  const [design, setDesign] = useState(null);
  const [settings, setSettings] = useState(null);
  const [busy, setBusy] = useState(false);
  const [file, setFile] = useState(null);
  const ref = useRef(null);
  useFocusEffect(useCallback(() => { getDesign(route.params.designId).then(setDesign); getSettings().then(setSettings); setFile(null); }, [route.params.designId]));
  if (!design || !settings) return <ActivityIndicator style={{ marginTop: 40 }} size="large" color={C.primary} />;
  const scale = Math.min((width - 32) / design.width, (height * 0.6) / design.height);
  const isResume = design.appType === 'resume';
  const run = async (share) => {
    try {
      setBusy(true);
      const f = file || (await exportDesign(ref, design, settings)); setFile(f);
      if (share) await shareFile(f); else Alert.alert('Exported', `Saved ${f.ext.toUpperCase()} file to:\n${f.uri}`, [{ text: 'OK' }, { text: 'Share', onPress: () => shareFile(f).catch((e) => Alert.alert('Share failed', String(e.message || e))) }]);
    } catch (e) { Alert.alert('Export failed', String(e.message || e)); } finally { setBusy(false); }
  };
  return (
    <ScrollView contentContainerStyle={{ padding: 16, alignItems: 'center' }}>
      <Text style={{ fontSize: 18, fontWeight: '800', color: C.text, alignSelf: 'flex-start', marginBottom: 10 }}>{design.name}</Text>
      <View style={{ elevation: 4, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 8 }}><DesignView ref={ref} design={design} scale={scale} /></View>
      <Text style={{ color: C.muted, marginTop: 10, fontSize: 12 }}>{isResume ? `PDF • ${settings.pageSize === 'letter' ? 'US Letter' : 'A4'} (change in Settings)` : `${settings.imageFormat.toUpperCase()} image (change in Settings)`}</Text>
      <View style={{ width: '100%', marginTop: 14 }}>
        <Primary title={isResume ? 'Export PDF' : 'Export Image'} icon="download" loading={busy} onPress={() => run(false)} />
        <Primary title="Share" icon="share-social" style={{ marginTop: 10, backgroundColor: C.ok }} disabled={busy} onPress={() => run(true)} />
        <Primary title="Edit design" icon="create" style={{ marginTop: 10, backgroundColor: '#374151' }} disabled={busy} onPress={() => navigation.navigate('Editor', { designId: design.id })} />
      </View>
    </ScrollView>
  );
}
