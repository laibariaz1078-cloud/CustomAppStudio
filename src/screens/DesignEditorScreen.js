import React, { useEffect, useLayoutEffect, useRef, useState, useMemo } from 'react';
import { View, Text, ScrollView, Modal, TouchableOpacity, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DesignView } from '../components/DesignView';
import { Btn, C, Seg } from '../components/ui';
import PropertyPanel from '../editor/PropertyPanel';
import { useEditorState } from '../editor/useEditorState';
import { createFromTemplate, txt, shp, img, uid } from '../templates';
import { getDesign, getProfile, saveDesign } from '../storage/designs';
import { pickImage } from '../utils/media';

const STICKERS = ['⭐', '❤️', '🎉', '🌙', '🌸', '🎈', '💍', '🕌', '✨', '🎂', '🌿', '👑'];
const RESUME_SECTIONS = ['SUMMARY', 'EDUCATION', 'EXPERIENCE', 'PROJECTS', 'SKILLS', 'CERTIFICATIONS', 'LANGUAGES', 'ACHIEVEMENTS', 'CUSTOM SECTION'];

export default function DesignEditorScreen({ route, navigation }) {
  const ed = useEditorState();
  const { design } = ed;
  const [sel, setSel] = useState(null);
  const [area, setArea] = useState({ w: 0, h: 0 });
  const [layers, setLayers] = useState(false);
  const [sections, setSections] = useState(false);
  const [stickers, setStickers] = useState(false);
  const [saving, setSaving] = useState(false);
  const designRef = useRef(null); designRef.current = design;
  const allowLeave = useRef(false);
  const dirty = useRef(false); dirty.current = !!(ed.h && ed.h.past.length);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const p = route.params || {};
        const d = p.designId ? await getDesign(p.designId) : createFromTemplate(p.templateId);
        if (!d) {
          Alert.alert('Not found', 'This design could not be opened.');
          if (active) navigation.goBack();
          return;
        }
        if (active) ed.init(d);
      } catch (error) {
        Alert.alert('Could not open editor', error.message || String(error));
        if (active) navigation.goBack();
      }
    })();
    return () => { active = false; };
  }, []);
  useEffect(() => navigation.addListener('beforeRemove', (event) => {
    if (allowLeave.current || !dirty.current) return;
    event.preventDefault();
    Alert.alert('Discard changes?', 'Your unsaved edits will be lost.', [
      { text: 'Keep editing', style: 'cancel' },
      { text: 'Discard changes', style: 'destructive', onPress: () => { allowLeave.current = true; navigation.dispatch(event.data.action); } },
    ]);
  }), [navigation]);

  const save = async () => {
    try {
      setSaving(true);
      const d = await saveDesign(designRef.current);
      allowLeave.current = true;
      navigation.replace('Preview', { designId: d.id });
    } catch (e) {
      Alert.alert(e.code === 'DESIGN_LIMIT_REACHED' ? 'Free plan limit reached' : 'Save failed', String(e.message || e));
      setSaving(false);
    }
  };
  const leave = () => navigation.goBack();
  const deleteElement = (item) => Alert.alert('Delete element?', 'This element will be removed from your design.', [
    { text: 'Cancel', style: 'cancel' },
    { text: 'Delete', style: 'destructive', onPress: () => { ed.removeElement(item.id); setSel(null); } },
  ]);
  const confirmAction = (title, message, label, action) => Alert.alert(title, message, [
    { text: 'Cancel', style: 'cancel' },
    { text: label, style: 'destructive', onPress: action },
  ]);
  useLayoutEffect(() => {
    navigation.setOptions({ headerLeft: () => (
      <TouchableOpacity accessibilityRole="button" accessibilityLabel="Back" onPress={leave} style={{ minWidth: 54, minHeight: 44, alignItems: 'center', justifyContent: 'center' }}>
        <Ionicons name="arrow-back" size={20} color={C.text} /><Text style={{ fontSize: 9, color: C.text }}>Back</Text>
      </TouchableOpacity>
    ), headerRight: () => (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Btn icon="arrow-undo" label="Undo" disabled={!ed.canUndo} onPress={ed.undo} />
        <Btn icon="arrow-redo" label="Redo" disabled={!ed.canRedo} onPress={ed.redo} />
        <Btn icon="checkmark-circle" label="Save" disabled={saving || !design} onPress={save} color={C.primary} />
      </View>) });
  }, [navigation, ed.canUndo, ed.canRedo, saving, design]);

  const api = useMemo(() => ({ select: setSel, begin: ed.begin, live: ed.live, end: ed.end }), [ed.begin, ed.live, ed.end]);
  if (!design) return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator size="large" color={C.primary} /></View>;

  const scale = area.w ? Math.min((area.w - 24) / design.width, (area.h - 24) / design.height) : 0.3;
  const el = design.elements.find((e) => e.id === sel) || null;
  const center = (w, h) => ({ x: Math.round((design.width - w) / 2), y: Math.round((design.height - h) / 2) });
  const add = (e) => { ed.addElement(e); setSel(e.id); };
  const choose = async (cb) => { try { const uri = await pickImage(); if (uri) cb(uri); } catch (e) { Alert.alert('Image error', String(e.message || e)); } };
  const resizeCanvas = (nextWidth, nextHeight, swapAxes = false) => {
    const sx = swapAxes ? nextWidth / design.height : nextWidth / design.width;
    const sy = swapAxes ? nextHeight / design.width : nextHeight / design.height;
    const elements = design.elements.map((item) => ({
      ...item,
      x: Math.round((swapAxes ? item.y : item.x) * sx),
      y: Math.round((swapAxes ? item.x : item.y) * sy),
      w: Math.max(1, Math.round((swapAxes ? item.h : item.w) * sx)),
      h: Math.max(1, Math.round((swapAxes ? item.w : item.h) * sy)),
    }));
    ed.patchDesign({ width: nextWidth, height: nextHeight, elements });
  };
  const autofill = async () => {
    try {
      const profile = await getProfile();
      if (!profile.name && !profile.email && !profile.phone && !profile.jobTitle && !profile.photoUri) {
        Alert.alert('Profile is empty', 'Add your details on the Profile tab before using autofill.');
        return;
      }
      const replacements = [
        ['Your Name', profile.name], ['Professional Title', profile.jobTitle], ['Designation', profile.jobTitle],
        ['you@email.com', profile.email], ['you@company.com', profile.email], ['+92 300 0000000', profile.phone],
      ].filter(([, value]) => value);
      const elements = design.elements.map((item) => {
        let next = item;
        if (item.type === 'text') {
          let text = item.text;
          replacements.forEach(([from, to]) => { text = text.split(from).join(to); });
          if (text !== item.text) next = { ...next, text };
        }
        if (item.type === 'image' && profile.photoUri && !item.uri && (design.appType === 'resume' || design.appType === 'card')) next = { ...next, uri: profile.photoUri };
        return next;
      });
      ed.patchDesign({ elements });
      Alert.alert('Profile details added', 'Review the filled fields and adjust the layout if needed.');
    } catch (error) {
      Alert.alert('Autofill failed', error.message || String(error));
    }
  };
  const sectionGroups = design.appType === 'resume' ? design.elements.reduce((groups, item) => {
    if (!item.sectionId) return groups;
    if (!groups[item.sectionId]) groups[item.sectionId] = [];
    groups[item.sectionId].push(item);
    return groups;
  }, {}) : {};
  const addResumeSection = (name) => {
    const sectionId = uid();
    const y = Math.max(0, ...design.elements.map((item) => item.y + item.h)) + 12;
    const heading = { ...txt(name, 40, y, design.width - 80, 22, { fontSize: 13, fontWeight: '700', color: design.palette.primary }), sectionId, sectionRole: 'heading' };
    const divider = { ...shp(40, y + 23, design.width - 80, 1.5, design.palette.primary, { opacity: 0.5 }), sectionId, sectionRole: 'divider' };
    const body = { ...txt(`Add your ${name.toLowerCase()} details here.`, 40, y + 30, design.width - 80, 50, { fontSize: 12 }), sectionId, sectionRole: 'body' };
    ed.patchDesign({ height: Math.max(design.height, y + 100), elements: [...design.elements, heading, divider, body] });
    setSel(heading.id);
    setSections(false);
  };
  const removeResumeSection = (sectionId) => Alert.alert('Remove section?', 'The section title, divider and content will be removed.', [
    { text: 'Cancel', style: 'cancel' },
    { text: 'Remove', style: 'destructive', onPress: () => ed.patchDesign({ elements: design.elements.filter((item) => item.sectionId !== sectionId) }) },
  ]);
  const moveResumeSection = (sectionId, direction) => {
    const ordered = Object.entries(sectionGroups).map(([id, items]) => ({ id, top: Math.min(...items.map((item) => item.y)) })).sort((a, b) => a.top - b.top);
    const index = ordered.findIndex((item) => item.id === sectionId);
    const other = ordered[index + direction];
    if (!other) return;
    const currentTop = ordered[index].top;
    const shiftCurrent = other.top - currentTop;
    const shiftOther = currentTop - other.top;
    const elements = design.elements.map((item) => item.sectionId === sectionId
      ? { ...item, y: item.y + shiftCurrent }
      : item.sectionId === other.id ? { ...item, y: item.y + shiftOther } : item);
    ed.patchDesign({ elements });
  };
  const availableSections = RESUME_SECTIONS.filter((name) => name === 'CUSTOM SECTION' || !Object.values(sectionGroups).some((group) => {
    const heading = group.find((item) => item.sectionRole === 'heading');
    const title = (heading?.text || '').toUpperCase();
    return title === name || (name === 'SUMMARY' && title === 'PROFILE');
  }));

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={90}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#E9EBF3' }} onLayout={(e) => setArea({ w: e.nativeEvent.layout.width, h: e.nativeEvent.layout.height })}>
        <View style={{ elevation: 4, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 8 }}><DesignView design={design} scale={scale} selectedId={sel} api={api} /></View>
      </View>
      <View style={{ height: 270, backgroundColor: C.card, borderTopWidth: 1, borderColor: C.border, paddingHorizontal: 10, paddingTop: 8 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0 }}>
          <Btn icon="text" label="Add Text" onPress={() => add(txt('New text', center(180, 40).x, center(180, 40).y, 180, 40, { fontSize: 22 }))} />
          <Btn icon="image" label="Add Image" onPress={() => choose((uri) => { const e = img(center(120, 120).x, center(120, 120).y, 120, 120, { uri }); add(e); })} />
          <Btn icon="square" label="Add Shape" onPress={() => add(shp(center(120, 80).x, center(120, 80).y, 120, 80, design.palette.primary, { radius: 8 }))} />
          <Btn icon="ellipse" label="Circle" onPress={() => add(shp(center(90, 90).x, center(90, 90).y, 90, 90, design.palette.secondary, { radius: 45 }))} />
          <Btn icon="happy-outline" label="Sticker" active={stickers} onPress={() => setStickers(!stickers)} />
          <Btn icon="layers-outline" label="Layers" onPress={() => setLayers(true)} />
          <Btn icon="refresh" label="Reset template" color={C.danger} onPress={() => Alert.alert('Reset design?', 'This restores the original template (you can undo).', [{ text: 'Cancel', style: 'cancel' }, { text: 'Reset', style: 'destructive', onPress: () => { ed.resetToTemplate(); setSel(null); } }])} />
          {design.appType === 'resume' ? <Btn icon="list-outline" label="Sections" onPress={() => setSections(true)} /> : null}
          {design.appType === 'resume' || design.appType === 'card' ? <Btn icon="person-outline" label="Autofill" onPress={autofill} /> : null}
        </ScrollView>
        {design.appType === 'card' ? <View style={{ marginTop: 6 }}><Text style={{ color: C.muted, fontSize: 10, marginBottom: 3 }}>CARD ORIENTATION</Text><Seg value={design.width >= design.height ? 'landscape' : 'portrait'} onChange={(value) => { if ((value === 'landscape') !== (design.width >= design.height)) resizeCanvas(design.height, design.width, true); }} options={[{ k: 'landscape', label: 'Landscape' }, { k: 'portrait', label: 'Portrait' }]} /></View> : null}
        {design.appType === 'invite' ? <View style={{ marginTop: 6 }}><Text style={{ color: C.muted, fontSize: 10, marginBottom: 3 }}>INVITATION SIZE</Text><Seg value={design.width === design.height ? 'square' : design.height > design.width * 1.5 ? 'story' : design.width > design.height ? 'landscape' : 'portrait'} onChange={(value) => { const sizes = { portrait: [360, 500], landscape: [500, 350], square: [400, 400], story: [360, 640] }; resizeCanvas(...sizes[value]); }} options={[{ k: 'portrait', label: 'Portrait' }, { k: 'landscape', label: 'Landscape' }, { k: 'square', label: 'Square' }, { k: 'story', label: 'Story' }]} /></View> : null}
        {stickers && <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0, marginTop: 6 }}>{STICKERS.map((sticker, index) => (
          <Btn key={sticker} icon="happy-outline" label={`Add ${['star', 'heart', 'party', 'moon', 'flower', 'balloon', 'ring', 'mosque', 'sparkle', 'cake', 'leaf', 'crown'][index]} sticker`} onPress={() => add(txt(sticker, center(60, 60).x, center(60, 60).y, 60, 60, { fontSize: 44, align: 'center' }))} />))}</ScrollView>}
        <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: 30 }}>
          <PropertyPanel el={el} design={design} ed={ed}
            onPickImage={() => choose((uri) => ed.patchEl(el.id, { uri }))}
            onPickBg={() => choose((uri) => ed.patchBackground({ uri }))}
            onRemoveBg={() => confirmAction('Remove background image?', 'The background image will be removed from this design.', 'Remove', () => ed.patchBackground({ uri: null }))}
            onClearImage={() => confirmAction('Remove this image?', 'The selected image will be removed from this design.', 'Remove', () => ed.patchEl(el.id, { uri: null }))}
            onDelete={deleteElement} />
        </ScrollView>
      </View>
      <Modal visible={sections} animationType="slide" transparent onRequestClose={() => setSections(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' }}>
          <View style={{ maxHeight: '75%', backgroundColor: '#fff', borderTopLeftRadius: 18, borderTopRightRadius: 18, padding: 14 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ fontSize: 17, fontWeight: '700', color: C.text }}>Resume sections</Text>
              <Btn icon="close-circle-outline" label="Close" onPress={() => setSections(false)} />
            </View>
            <Text style={{ color: C.muted, fontSize: 12, marginVertical: 7 }}>Add a standard section or custom section</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>{availableSections.map((name) => <Btn key={name} icon="add-circle-outline" label={`Add ${name === 'CUSTOM SECTION' ? 'Custom' : name}`} onPress={() => addResumeSection(name)} />)}</ScrollView>
            <ScrollView>{Object.entries(sectionGroups).map(([sectionId, group]) => {
              const heading = group.find((item) => item.sectionRole === 'heading');
              const title = heading?.text || 'Resume section';
              return (
                <View key={sectionId} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 5, borderBottomWidth: 1, borderColor: C.border }}>
                  <TouchableOpacity accessibilityRole="button" accessibilityLabel={`Edit ${title}`} onPress={() => { setSel(heading?.id || group[0].id); setSections(false); }} style={{ flex: 1, minHeight: 44, flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons name="reorder-three-outline" size={18} color={C.primary} /><Text numberOfLines={1} style={{ marginLeft: 7, color: C.text, flex: 1 }}>{title}</Text>
                  </TouchableOpacity>
                  <Btn icon="arrow-up" label="Raise" onPress={() => moveResumeSection(sectionId, -1)} />
                  <Btn icon="arrow-down" label="Lower" onPress={() => moveResumeSection(sectionId, 1)} />
                  <Btn icon="trash-outline" label="Remove" color={C.danger} onPress={() => removeResumeSection(sectionId)} />
                </View>
              );
            })}</ScrollView>
          </View>
        </View>
      </Modal>
      <Modal visible={layers} animationType="slide" transparent onRequestClose={() => setLayers(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' }}>
          <View style={{ maxHeight: '70%', backgroundColor: '#fff', borderTopLeftRadius: 18, borderTopRightRadius: 18, padding: 14 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}><Text style={{ fontSize: 17, fontWeight: '700' }}>Layers (top first)</Text><Btn icon="close-circle-outline" label="Close" onPress={() => setLayers(false)} /></View>
            <ScrollView>{[...design.elements].reverse().map((e) => (
              <View key={e.id} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 6, borderBottomWidth: 1, borderColor: C.border, backgroundColor: sel === e.id ? C.primary + '15' : '#fff' }}>
                <Btn icon={e.type === 'text' ? 'text-outline' : e.type === 'image' ? 'image-outline' : 'square-outline'} label={e.type === 'text' ? (e.text || 'Text').slice(0, 10) : e.type === 'image' ? 'Image' : 'Shape'} onPress={() => { setSel(e.id); setLayers(false); }} />
                <Btn icon={e.visible ? 'eye' : 'eye-off'} label={e.visible ? 'Hide' : 'Show'} onPress={() => ed.patchEl(e.id, { visible: !e.visible })} />
                <Btn icon={e.locked ? 'lock-closed' : 'lock-open-outline'} label={e.locked ? 'Unlock' : 'Lock'} onPress={() => ed.patchEl(e.id, { locked: !e.locked })} />
                <Btn icon="arrow-up" label="Raise" onPress={() => ed.reorder(e.id, 'up')} />
                <Btn icon="arrow-down" label="Lower" onPress={() => ed.reorder(e.id, 'down')} />
              </View>))}</ScrollView>
          </View>
        </View>
      </Modal>
      {saving && <View style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(255,255,255,0.7)', alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator size="large" color={C.primary} /><Text style={{ marginTop: 8 }}>Saving…</Text></View>}
    </KeyboardAvoidingView>
  );
}
