import { useState, useRef, useCallback } from 'react';
import { uid, createFromTemplate } from '../templates';

const MAX = 50;
// Undo/redo history + live (non-history) updates for dragging. One history entry per drag/resize gesture.
export function useEditorState() {
  const [h, setH] = useState(null);
  const present = useRef(null); present.current = h ? h.present : null;
  const snap = useRef(null);

  const init = useCallback((d) => setH({ past: [], present: d, future: [] }), []);
  const commit = useCallback((fn) => setH((s) => ({ past: [...s.past.slice(-MAX), s.present], present: fn(s.present), future: [] })), []);
  const mapEl = (id, patch) => (d) => ({ ...d, elements: d.elements.map((e) => (e.id === id ? { ...e, ...patch } : e)) });
  const patchEl = useCallback((id, patch) => commit(mapEl(id, patch)), [commit]);
  const live = useCallback((id, patch) => setH((s) => ({ ...s, present: mapEl(id, patch)(s.present) })), []);
  const begin = useCallback(() => { snap.current = present.current; }, []);
  const end = useCallback(() => setH((s) => (snap.current && s.present !== snap.current ? { past: [...s.past.slice(-MAX), snap.current], present: s.present, future: [] } : s)), []);
  const undo = useCallback(() => setH((s) => (s.past.length ? { past: s.past.slice(0, -1), present: s.past[s.past.length - 1], future: [s.present, ...s.future] } : s)), []);
  const redo = useCallback(() => setH((s) => (s.future.length ? { past: [...s.past, s.present], present: s.future[0], future: s.future.slice(1) } : s)), []);

  const addElement = useCallback((el) => commit((d) => ({ ...d, elements: [...d.elements, el] })), [commit]);
  const removeElement = useCallback((id) => commit((d) => ({ ...d, elements: d.elements.filter((e) => e.id !== id) })), [commit]);
  const duplicate = useCallback((id) => {
    const nid = 'e' + uid();
    commit((d) => { const e = d.elements.find((x) => x.id === id); return e ? { ...d, elements: [...d.elements, { ...e, id: nid, x: e.x + 14, y: e.y + 14 }] } : d; });
    return nid;
  }, [commit]);
  const reorder = useCallback((id, mode) => commit((d) => {
    const a = [...d.elements]; const i = a.findIndex((e) => e.id === id); if (i < 0) return d;
    const [e] = a.splice(i, 1);
    const j = mode === 'front' ? a.length : mode === 'back' ? 0 : mode === 'up' ? Math.min(a.length, i + 1) : Math.max(0, i - 1);
    a.splice(j, 0, e); return { ...d, elements: a };
  }), [commit]);
  const patchDesign = useCallback((patch) => commit((d) => ({ ...d, ...patch })), [commit]);
  const patchBackground = useCallback((patch) => commit((d) => ({ ...d, background: { ...d.background, ...patch } })), [commit]);
  // Recolors every element/background that used the template's primary or secondary color.
  const setThemeColor = useCallback((key, color) => commit((d) => {
    const old = d.palette[key]; const same = (c) => typeof c === 'string' && c.toLowerCase() === old.toLowerCase();
    return { ...d, palette: { ...d.palette, [key]: color }, background: same(d.background.color) ? { ...d.background, color } : d.background,
      elements: d.elements.map((e) => ({ ...e, color: same(e.color) ? color : e.color, bg: same(e.bg) ? color : e.bg, borderColor: same(e.borderColor) ? color : e.borderColor })) };
  }), [commit]);
  const resetToTemplate = useCallback(() => commit((d) => { const t = createFromTemplate(d.templateId); return { ...t, id: d.id, name: d.name, createdAt: d.createdAt }; }), [commit]);

  return { h, design: h ? h.present : null, canUndo: !!h && h.past.length > 0, canRedo: !!h && h.future.length > 0,
    init, patchEl, live, begin, end, undo, redo, addElement, removeElement, duplicate, reorder, patchDesign, patchBackground, setThemeColor, resetToTemplate };
}
