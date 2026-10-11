import React, { useEffect, useLayoutEffect, useRef, useState, useMemo } from 'react';
import { View, Text, ScrollView, Modal, TouchableOpacity, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DesignView } from '../components/DesignView';
import { Btn, C } from '../components/ui';
import PropertyPanel from '../editor/PropertyPanel';
import { useEditorState } from '../editor/useEditorState';
import { createFromTemplate, txt, shp, img, uid } from '../templates';
import { getDesign, saveDesign } from '../storage/designs';
import { pickImage } from '../utils/media';

const STICKERS = ['⭐', '❤️', '🎉', '🌙', '🌸', '🎈', '💍', '🕌', '✨', '🎂', '🌿', '👑'];

export default function DesignEditorScreen({ route, navigation }) {
  const ed = useEditorState();
  const { design } = ed;
  const [sel, setSel] = useState(null);
  const [area, setArea] = useState({ w: 0, h: 0 });
  const [layers, setLayers] = useState(false);
  const [stickers, setStickers] = useState(false);
  const [saving, setSaving] = useState(false);
  const designRef = useRef(null); designRef.current = design;

  useEffect(() => {
    (async () => {
      const p = route.params || {};
      const d = p.designId ? await getDesign(p.designId) : createFromTemplate(p.templateId);
      if (!d) { Alert.alert('Not found', 'This design could not be opened.'); navigation.goBack(); return; }
      ed.init(d);
    })();
  }, []);

  const save = async () => {
    try { setSaving(true); const d = await saveDesign(designRef.current); navigation.replace('Preview', { designId: d.id }); }
    catch (e) { Alert.alert('Save failed', String(e.message || e)); setSaving(false); }
  };
  useLayoutEffect(() => {
    navigation.setOptions({ headerRight: () => (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity accessibilityLabel="Undo" disabled={!ed.canUndo} onPress={ed.undo} style={{ padding: 8, opacity: ed.canUndo ? 1 : 0.3 }}><Ionicons name="arrow-undo" size={22} color={C.text} /></TouchableOpacity>
        <TouchableOpacity accessibilityLabel="Redo" disabled={!ed.canRedo} onPress={ed.redo} style={{ padding: 8, opacity: ed.canRedo ? 1 : 0.3 }}><Ionicons name="arrow-redo" size={22} color={C.text} /></TouchableOpacity>
        <TouchableOpacity accessibilityLabel="Save" onPress={save} style={{ padding: 8 }}><Ionicons name="checkmark-circle" size={28} color={C.primary} /></TouchableOpacity>
      </View>) });
  }, [navigation, ed.canUndo, ed.canRedo]);

  const api = useMemo(() => ({ select: setSel, begin: ed.begin, live: ed.live, end: ed.end }), [ed.begin, ed.live, ed.end]);
  if (!design) return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator size="large" color={C.primary} /></View>;

  const scale = area.w ? Math.min((area.w - 24) / design.width, (area.h - 24) / design.height) : 0.3;
  const el = design.elements.find((e) => e.id === sel) || null;
  const center = (w, h) => ({ x: Math.round((design.width - w) / 2), y: Math.round((design.height - h) / 2) });
  const add = (e) => { ed.addElement(e); setSel(e.id); };
  const choose = async (cb) => { try { const uri = await pickImage(); if (uri) cb(uri); } catch (e) { Alert.alert('Image error', String(e.message || e)); } };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={90}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#E9EBF3' }} onLayout={(e) => setArea({ w: e.nativeEvent.layout.width, h: e.nativeEvent.layout.height })}>
        <View style={{ elevation: 4, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 8 }}><DesignView design={design} scale={scale} selectedId={sel} api={api} /></View>
      </View>
      <View style={{ height: 270, backgroundColor: C.card, borderTopWidth: 1, borderColor: C.border, paddingHorizontal: 10, paddingTop: 8 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0 }}>
          <Btn icon="text" label="Text" onPress={() => add(txt('New text', center(180, 40).x, center(180, 40).y, 180, 40, { fontSize: 22 }))} />
          <Btn icon="image" label="Image" onPress={() => { const e = img(center(120, 120).x, center(120, 120).y, 120, 120); add(e); }} />
          <Btn icon="square" label="Shape" onPress={() => add(shp(center(120, 80).x, center(120, 80).y, 120, 80, design.palette.primary, { radius: 8 }))} />
          <Btn icon="ellipse" label="Circle" onPress={() => add(shp(center(90, 90).x, center(90, 90).y, 90, 90, design.palette.secondary, { radius: 45 }))} />
          <Btn icon="happy-outline" label="Sticker" active={stickers} onPress={() => setStickers(!stickers)} />
          <Btn icon="layers-outline" label="Layers" onPress={() => setLayers(true)} />
          <Btn icon="refresh" label="Reset" onPress={() => Alert.alert('Reset design?', 'This restores the original template (you can undo).', [{ text: 'Cancel', style: 'cancel' }, { text: 'Reset', style: 'destructive', onPress: () => { ed.resetToTemplate(); setSel(null); } }])} />
        </ScrollView>
        {stickers && <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0, marginTop: 6 }}>{STICKERS.map((s) => (
          <TouchableOpacity key={s} style={{ padding: 8 }} onPress={() => add(txt(s, center(60, 60).x, center(60, 60).y, 60, 60, { fontSize: 44, align: 'center' }))}><Text style={{ fontSize: 28 }}>{s}</Text></TouchableOpacity>))}</ScrollView>}
        <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: 30 }}>
          <PropertyPanel el={el} design={design} ed={ed}
            onPickImage={() => choose((uri) => ed.patchEl(el.id, { uri }))}
            onPickBg={() => choose((uri) => ed.patchBackground({ uri }))} />
        </ScrollView>
      </View>
      <Modal visible={layers} animationType="slide" transparent onRequestClose={() => setLayers(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' }}>
          <View style={{ maxHeight: '70%', backgroundColor: '#fff', borderTopLeftRadius: 18, borderTopRightRadius: 18, padding: 14 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}><Text style={{ fontSize: 17, fontWeight: '700' }}>Layers (top first)</Text><TouchableOpacity onPress={() => setLayers(false)} style={{ padding: 8 }}><Ionicons name="close" size={24} /></TouchableOpacity></View>
            <ScrollView>{[...design.elements].reverse().map((e) => (
              <View key={e.id} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 6, borderBottomWidth: 1, borderColor: C.border, backgroundColor: sel === e.id ? C.primary + '15' : '#fff' }}>
                <TouchableOpacity style={{ flex: 1, padding: 6 }} onPress={() => { setSel(e.id); setLayers(false); }}>
                  <Text numberOfLines={1} style={{ color: C.text }}>{e.type === 'text' ? '🅣 ' + e.text.replace(/\n/g, ' ') : e.type === 'image' ? '🖼 Image' : '▭ Shape'}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ padding: 10 }} onPress={() => ed.patchEl(e.id, { visible: !e.visible })}><Ionicons name={e.visible ? 'eye' : 'eye-off'} size={20} color={C.text} /></TouchableOpacity>
                <TouchableOpacity style={{ padding: 10 }} onPress={() => ed.patchEl(e.id, { locked: !e.locked })}><Ionicons name={e.locked ? 'lock-closed' : 'lock-open-outline'} size={20} color={e.locked ? C.danger : C.text} /></TouchableOpacity>
                <TouchableOpacity style={{ padding: 10 }} onPress={() => ed.reorder(e.id, 'up')}><Ionicons name="arrow-up" size={20} color={C.text} /></TouchableOpacity>
                <TouchableOpacity style={{ padding: 10 }} onPress={() => ed.reorder(e.id, 'down')}><Ionicons name="arrow-down" size={20} color={C.text} /></TouchableOpacity>
              </View>))}</ScrollView>
          </View>
        </View>
      </Modal>
      {saving && <View style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(255,255,255,0.7)', alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator size="large" color={C.primary} /><Text style={{ marginTop: 8 }}>Saving…</Text></View>}
    </KeyboardAvoidingView>
  );
}
