import React from 'react';
import { View, Text, TextInput, ScrollView } from 'react-native';
import { Btn, Swatches, Stepper, Seg, Label, C } from '../components/ui';
import { FONT_NAMES } from '../utils/fonts';

const Row = ({ children }) => <ScrollView horizontal showsHorizontalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={{ alignItems: 'center', paddingVertical: 2 }}>{children}</ScrollView>;

export default function PropertyPanel({ el, design, ed, onPickImage, onPickBg }) {
  const p = (patch) => ed.patchEl(el.id, patch);
  if (!el) {
    return (
      <View>
        <Label>Background color</Label><Swatches value={design.background.color} onPick={(c) => ed.patchBackground({ color: c })} />
        <Row><Btn icon="image" label="Bg image" onPress={onPickBg} />{design.background.uri ? <Btn icon="close-circle" label="Remove bg" onPress={() => ed.patchBackground({ uri: null })} /> : null}</Row>
        <Label>Primary color (recolors template)</Label><Swatches value={design.palette.primary} onPick={(c) => ed.setThemeColor('primary', c)} />
        <Label>Secondary color</Label><Swatches value={design.palette.secondary} onPick={(c) => ed.setThemeColor('secondary', c)} />
        <Text style={{ color: C.muted, fontSize: 12, marginTop: 8 }}>Tap an element on the canvas to edit it. Drag to move, use the blue handle to resize.</Text>
      </View>
    );
  }
  return (
    <View>
      <Row>
        <Btn icon="copy-outline" label="Duplicate" onPress={() => ed.duplicate(el.id)} />
        <Btn icon="trash-outline" label="Delete" color={C.danger} onPress={() => ed.removeElement(el.id)} />
        <Btn icon={el.locked ? 'lock-closed' : 'lock-open-outline'} label={el.locked ? 'Unlock' : 'Lock'} active={el.locked} onPress={() => p({ locked: !el.locked })} />
        <Btn icon="eye-off-outline" label="Hide" onPress={() => p({ visible: false })} />
        <Btn icon="arrow-up" label="Forward" onPress={() => ed.reorder(el.id, 'up')} />
        <Btn icon="arrow-down" label="Backward" onPress={() => ed.reorder(el.id, 'down')} />
        <Btn icon="caret-up-circle-outline" label="To front" onPress={() => ed.reorder(el.id, 'front')} />
        <Btn icon="caret-down-circle-outline" label="To back" onPress={() => ed.reorder(el.id, 'back')} />
      </Row>
      {el.type === 'text' && (<>
        <Label>Text</Label>
        <TextInput value={el.text} multiline onChangeText={(t) => ed.live(el.id, { text: t })} onFocus={ed.begin} onBlur={ed.end} style={{ borderWidth: 1, borderColor: C.border, borderRadius: 10, padding: 10, minHeight: 44, maxHeight: 110, backgroundColor: '#fff', color: C.text }} />
        <Row>
          <Stepper label="Size" value={el.fontSize} min={6} max={120} onChange={(v) => p({ fontSize: v })} />
          <Seg value={el.fontWeight} onChange={(k) => p({ fontWeight: k })} options={[{ k: '400', label: 'Reg' }, { k: '700', label: 'Bold' }, { k: '800', label: 'Black' }]} />
          <Seg value={el.fontStyle} onChange={(k) => p({ fontStyle: k })} options={[{ k: 'normal', label: 'Normal' }, { k: 'italic', label: 'Italic' }]} />
          <Seg value={el.align} onChange={(k) => p({ align: k })} options={[{ k: 'left', icon: 'reorder-two' }, { k: 'center', icon: 'menu' }, { k: 'right', icon: 'reorder-two-outline' }]} />
        </Row>
        <Label>Font</Label><Row><Seg value={el.fontFamily} onChange={(k) => p({ fontFamily: k })} options={FONT_NAMES.map((n) => ({ k: n, label: n }))} /></Row>
        <Label>Text color</Label><Swatches value={el.color} onPick={(c) => p({ color: c })} />
      </>)}
      {el.type === 'shape' && (<><Label>Fill color</Label><Swatches value={el.bg} onPick={(c) => p({ bg: c })} /></>)}
      {el.type === 'image' && (<Row><Btn icon="images" label={el.uri ? 'Replace' : 'Choose image'} onPress={onPickImage} />{el.uri ? <Btn icon="close" label="Clear" onPress={() => p({ uri: null })} /> : null}</Row>)}
      {el.type !== 'text' && (<>
        <Label>Border</Label><Row><Stepper label="Width" value={el.borderWidth} max={20} onChange={(v) => p({ borderWidth: v })} /><Stepper label="Radius" value={el.radius} step={4} max={500} onChange={(v) => p({ radius: v })} /></Row>
        <Swatches value={el.borderColor} onPick={(c) => p({ borderColor: c })} />
      </>)}
      <Label>Layout</Label>
      <Row>
        <Stepper label="X" value={el.x} step={5} min={-1000} max={2000} onChange={(v) => p({ x: v })} /><Stepper label="Y" value={el.y} step={5} min={-1000} max={2000} onChange={(v) => p({ y: v })} />
        <Stepper label="Width" value={el.w} step={5} min={10} max={2000} onChange={(v) => p({ w: v })} /><Stepper label="Height" value={el.h} step={5} min={10} max={2000} onChange={(v) => p({ h: v })} />
        <Stepper label="Rotate" value={el.rotation || 0} step={15} min={-360} max={360} onChange={(v) => p({ rotation: v })} />
        <Stepper label="Opacity" value={el.opacity} step={0.1} min={0.1} max={1} fmt={(v) => Math.round(v * 100) + '%'} onChange={(v) => p({ opacity: v })} />
        <Btn icon="contrast-outline" label="Shadow" active={el.shadow} onPress={() => p({ shadow: !el.shadow })} />
      </Row>
    </View>
  );
}
