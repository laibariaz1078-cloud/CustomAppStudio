import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const C = { primary: '#5B5BD6', bg: '#F6F7FB', card: '#FFFFFF', text: '#1B1B2F', muted: '#6B7080', border: '#E3E5EE', danger: '#D64545', ok: '#2E9E6B' };
export const PALETTE = ['#000000', '#FFFFFF', '#1F2937', '#6B7280', '#DC2626', '#EA580C', '#F59E0B', '#16A34A', '#0F766E', '#2563EB', '#5B5BD6', '#9333EA', '#DB2777', '#C9A24B', '#FDE68A', '#E0F2FE'];

export function Btn({ icon, label, onPress, active, disabled, color }) {
  return (
    <TouchableOpacity accessibilityLabel={label} disabled={disabled} onPress={onPress} style={[s.btn, active && { backgroundColor: C.primary + '22', borderColor: C.primary }, disabled && { opacity: 0.35 }]}>
      <Ionicons name={icon} size={20} color={color || (active ? C.primary : C.text)} />
      <Text style={[s.btnTxt, color && { color }]}>{label}</Text>
    </TouchableOpacity>
  );
}
export function Primary({ title, onPress, icon, style, disabled, loading }) {
  return (
    <TouchableOpacity disabled={disabled || loading} onPress={onPress} style={[s.primary, (disabled || loading) && { opacity: 0.6 }, style]}>
      {loading ? <ActivityIndicator color="#fff" /> : <>{icon && <Ionicons name={icon} size={18} color="#fff" style={{ marginRight: 6 }} />}<Text style={s.primaryTxt}>{title}</Text></>}
    </TouchableOpacity>
  );
}
export function Swatches({ value, onPick, colors = PALETTE }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 4 }}>
      {colors.map((c) => (
        <TouchableOpacity key={c} accessibilityLabel={'Color ' + c} onPress={() => onPick(c)} style={[s.sw, { backgroundColor: c }, (value || '').toLowerCase() === c.toLowerCase() && { borderColor: C.primary, borderWidth: 3 }]} />
      ))}
    </ScrollView>
  );
}
export function Stepper({ label, value, onChange, step = 1, min = 0, max = 999, fmt }) {
  const set = (v) => onChange(Math.max(min, Math.min(max, Math.round(v * 100) / 100)));
  return (
    <View style={s.stepper}>
      <Text style={s.stLabel}>{label}</Text>
      <TouchableOpacity style={s.stBtn} onPress={() => set(value - step)}><Ionicons name="remove" size={18} color={C.text} /></TouchableOpacity>
      <Text style={s.stVal}>{fmt ? fmt(value) : Math.round(value)}</Text>
      <TouchableOpacity style={s.stBtn} onPress={() => set(value + step)}><Ionicons name="add" size={18} color={C.text} /></TouchableOpacity>
    </View>
  );
}
export function Seg({ options, value, onChange }) {
  return (
    <View style={s.seg}>
      {options.map((o) => (
        <TouchableOpacity key={o.k} onPress={() => onChange(o.k)} style={[s.segItem, value === o.k && { backgroundColor: C.primary }]}>
          {o.icon ? <Ionicons name={o.icon} size={16} color={value === o.k ? '#fff' : C.text} /> : <Text style={{ color: value === o.k ? '#fff' : C.text, fontSize: 12 }}>{o.label}</Text>}
        </TouchableOpacity>
      ))}
    </View>
  );
}
export function Empty({ icon = 'folder-open-outline', title, sub }) {
  return (
    <View style={{ alignItems: 'center', padding: 40 }}>
      <Ionicons name={icon} size={56} color={C.muted} />
      <Text style={{ fontSize: 17, fontWeight: '700', color: C.text, marginTop: 10 }}>{title}</Text>
      {sub ? <Text style={{ color: C.muted, textAlign: 'center', marginTop: 4 }}>{sub}</Text> : null}
    </View>
  );
}
export const Label = ({ children }) => <Text style={{ fontSize: 11, fontWeight: '700', color: C.muted, marginTop: 10, marginBottom: 2, textTransform: 'uppercase' }}>{children}</Text>;

const s = StyleSheet.create({
  btn: { minWidth: 56, minHeight: 48, paddingHorizontal: 8, marginRight: 6, alignItems: 'center', justifyContent: 'center', borderRadius: 10, borderWidth: 1, borderColor: C.border, backgroundColor: '#fff' },
  btnTxt: { fontSize: 10, color: C.text, marginTop: 2 },
  primary: { flexDirection: 'row', backgroundColor: C.primary, minHeight: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16 },
  primaryTxt: { color: '#fff', fontWeight: '700', fontSize: 15 },
  sw: { width: 32, height: 32, borderRadius: 16, marginRight: 8, borderWidth: 1, borderColor: '#cfd3de' },
  stepper: { flexDirection: 'row', alignItems: 'center', marginRight: 14, marginVertical: 4 },
  stLabel: { fontSize: 12, color: C.muted, marginRight: 6, width: 44 },
  stBtn: { width: 34, height: 34, borderRadius: 8, borderWidth: 1, borderColor: C.border, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' },
  stVal: { width: 38, textAlign: 'center', fontWeight: '600', color: C.text },
  seg: { flexDirection: 'row', borderWidth: 1, borderColor: C.border, borderRadius: 10, overflow: 'hidden', marginRight: 10 },
  segItem: { minWidth: 40, minHeight: 36, paddingHorizontal: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' },
});
