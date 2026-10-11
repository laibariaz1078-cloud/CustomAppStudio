import React, { forwardRef, useRef } from 'react';
import { View, Text, Image, PanResponder, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { resolveFont } from '../utils/fonts';

export function ElementBody({ el }) {
  const shadow = el.shadow ? { shadowColor: '#000', shadowOpacity: 0.35, shadowRadius: 6, shadowOffset: { width: 0, height: 3 }, elevation: 6 } : null;
  if (el.type === 'text') {
    return (
    <Text style={{ width: '100%', height: '100%', color: el.color, backgroundColor: el.bg || 'transparent', borderRadius: el.radius || 0, borderWidth: el.borderWidth || 0, borderColor: el.borderColor, fontSize: el.fontSize, fontWeight: el.fontWeight, fontStyle: el.fontStyle, textAlign: el.align, fontFamily: resolveFont(el.fontFamily),
        textShadowColor: el.shadow ? 'rgba(0,0,0,0.35)' : 'transparent', textShadowRadius: el.shadow ? 4 : 0, textShadowOffset: { width: 0, height: 2 } }}>{el.text}</Text>
    );
  }
  const common = { width: '100%', height: '100%', borderRadius: el.radius, borderWidth: el.borderWidth, borderColor: el.borderColor, overflow: 'hidden', ...shadow };
  if (el.type === 'shape') return <View style={[common, { backgroundColor: el.bg }]} />;
  return (
    <View style={[common, { backgroundColor: '#E5E7EB', alignItems: 'center', justifyContent: 'center' }]}>
      {el.uri ? <Image source={{ uri: el.uri }} style={{ width: '100%', height: '100%' }} resizeMode="cover" /> : <Ionicons name="image-outline" size={Math.max(14, Math.min(el.w, el.h) / 3)} color="#9CA3AF" />}
    </View>
  );
}

function ElementView({ el, scale, selected, apiRef }) {
  const ref = useRef(el); ref.current = el;
  const sc = useRef(scale); sc.current = scale;
  const start = useRef({});
  const move = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => true, onPanResponderTerminationRequest: () => false,
    onPanResponderGrant: () => { start.current = { x: ref.current.x, y: ref.current.y }; apiRef.current.select(ref.current.id); apiRef.current.begin(); },
    onPanResponderMove: (_, g) => { if (ref.current.locked) return; apiRef.current.live(ref.current.id, { x: Math.round(start.current.x + g.dx / sc.current), y: Math.round(start.current.y + g.dy / sc.current) }); },
    onPanResponderRelease: () => apiRef.current.end(), onPanResponderTerminate: () => apiRef.current.end(),
  })).current;
  const size = useRef({});
  const resize = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => true, onPanResponderTerminationRequest: () => false,
    onPanResponderGrant: () => { size.current = { w: ref.current.w, h: ref.current.h }; apiRef.current.begin(); },
    onPanResponderMove: (_, g) => apiRef.current.live(ref.current.id, { w: Math.max(12, Math.round(size.current.w + g.dx / sc.current)), h: Math.max(12, Math.round(size.current.h + g.dy / sc.current)) }),
    onPanResponderRelease: () => apiRef.current.end(), onPanResponderTerminate: () => apiRef.current.end(),
  })).current;
  if (!el.visible) return null;
  const hs = 30 / scale;
  return (
    <View {...move.panHandlers} style={{ position: 'absolute', left: el.x, top: el.y, width: el.w, height: el.h, opacity: el.opacity, transform: [{ rotate: (el.rotation || 0) + 'deg' }] }}>
      <ElementBody el={el} />
      {selected && <View pointerEvents="none" style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, borderWidth: 1.5 / scale, borderColor: el.locked ? '#DC2626' : '#5B5BD6', borderStyle: 'dashed' }} />}
      {selected && !el.locked && <View {...resize.panHandlers} style={{ position: 'absolute', right: -hs / 2, bottom: -hs / 2, width: hs, height: hs, borderRadius: hs / 2, backgroundColor: '#5B5BD6', borderWidth: 2 / scale, borderColor: '#fff' }} />}
    </View>
  );
}

// Renders a design at `scale`. Pass `api` + `selectedId` to make it interactive (editor); omit for thumbnails/previews/export.
export const DesignView = forwardRef(function DesignView({ design, scale, selectedId, api }, ref) {
  const apiRef = useRef(api); apiRef.current = api;
  const w = design.width * scale, h = design.height * scale;
  return (
    <View ref={ref} collapsable={false} style={{ width: w, height: h, overflow: 'hidden', backgroundColor: design.background.color }}>
      <View style={{ position: 'absolute', left: 0, top: 0, width: design.width, height: design.height, transform: [{ translateX: -(design.width - w) / 2 }, { translateY: -(design.height - h) / 2 }, { scale }] }}>
        {design.background.uri ? <Image source={{ uri: design.background.uri }} style={{ position: 'absolute', width: '100%', height: '100%' }} resizeMode="cover" /> : null}
        {api ? <Pressable style={{ position: 'absolute', width: '100%', height: '100%' }} onPress={() => apiRef.current.select(null)} /> : null}
        {design.elements.map((el) => api
          ? <ElementView key={el.id} el={el} scale={scale} selected={selectedId === el.id} apiRef={apiRef} />
          : el.visible ? (
            <View key={el.id} pointerEvents="none" style={{ position: 'absolute', left: el.x, top: el.y, width: el.w, height: el.h, opacity: el.opacity, transform: [{ rotate: (el.rotation || 0) + 'deg' }] }}><ElementBody el={el} /></View>
          ) : null)}
      </View>
    </View>
  );
});
