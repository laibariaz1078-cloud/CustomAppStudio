import AsyncStorage from '@react-native-async-storage/async-storage';
import { uid } from '../templates';

const KEY = 'cas.designs.v1';
const SKEY = 'cas.settings.v1';
export const DEFAULT_SETTINGS = { pageSize: 'a4', imageFormat: 'png' };

async function readAll() { try { return JSON.parse((await AsyncStorage.getItem(KEY)) || '[]'); } catch (e) { return []; } }
const writeAll = (list) => AsyncStorage.setItem(KEY, JSON.stringify(list));

export async function listDesigns() { return (await readAll()).sort((a, b) => b.updatedAt - a.updatedAt); }
export async function getDesign(id) { return (await readAll()).find((d) => d.id === id) || null; }
export async function saveDesign(design) {
  const list = await readAll(); const d = { ...design, updatedAt: Date.now() };
  const i = list.findIndex((x) => x.id === d.id); if (i >= 0) list[i] = d; else list.push(d);
  await writeAll(list); return d;
}
export async function deleteDesign(id) { await writeAll((await readAll()).filter((d) => d.id !== id)); }
export async function renameDesign(id, name) { const l = await readAll(); const d = l.find((x) => x.id === id); if (d) { d.name = name; d.updatedAt = Date.now(); await writeAll(l); } }
export async function duplicateDesign(id) {
  const l = await readAll(); const d = l.find((x) => x.id === id); if (!d) return null;
  const copy = { ...JSON.parse(JSON.stringify(d)), id: 'd' + uid(), name: d.name + ' (copy)', createdAt: Date.now(), updatedAt: Date.now() };
  l.push(copy); await writeAll(l); return copy;
}
export async function clearDesigns() { await AsyncStorage.removeItem(KEY); }
export async function getSettings() { try { return { ...DEFAULT_SETTINGS, ...JSON.parse((await AsyncStorage.getItem(SKEY)) || '{}') }; } catch (e) { return DEFAULT_SETTINGS; } }
export async function setSettings(s) { await AsyncStorage.setItem(SKEY, JSON.stringify(s)); }
