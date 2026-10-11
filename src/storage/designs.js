import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import { uid } from '../templates';

const KEY = 'cas.designs.v1';
const SKEY = 'cas.settings.v1';
const PKEY = 'cas.profile.v1';
const EKEY = 'cas.exports.v1';
export const FREE_DESIGN_LIMIT = 5;
export const DEFAULT_SETTINGS = { pageSize: 'a4', imageFormat: 'png' };
export const DEFAULT_PROFILE = { name: '', email: '', phone: '', jobTitle: '', photoUri: '' };

async function readJson(key, fallback) {
  const value = await AsyncStorage.getItem(key);
  if (value === null) return fallback;
  try {
    return JSON.parse(value);
  } catch (error) {
    throw new Error(`Unable to read local app data (${key}): ${error.message || error}`);
  }
}

async function readAll() {
  const list = await readJson(KEY, []);
  if (!Array.isArray(list)) throw new Error('Saved designs data is invalid. Clear app data in Settings to recover.');
  return list;
}

const writeAll = (list) => AsyncStorage.setItem(KEY, JSON.stringify(list));

export async function listDesigns() {
  return (await readAll()).sort((a, b) => b.updatedAt - a.updatedAt);
}

export async function getDesign(id) {
  return (await readAll()).find((d) => d.id === id) || null;
}

export async function saveDesign(design) {
  const list = await readAll();
  const existing = list.findIndex((item) => item.id === design.id);
  if (existing < 0 && list.length >= FREE_DESIGN_LIMIT) {
    const error = new Error(`The free plan saves up to ${FREE_DESIGN_LIMIT} designs. Delete a saved design to make room.`);
    error.code = 'DESIGN_LIMIT_REACHED';
    throw error;
  }
  const saved = { ...design, updatedAt: Date.now() };
  if (existing >= 0) list[existing] = saved;
  else list.push(saved);
  await writeAll(list);
  return saved;
}

export async function deleteDesign(id) {
  await writeAll((await readAll()).filter((design) => design.id !== id));
}

export async function renameDesign(id, name) {
  const list = await readAll();
  const design = list.find((item) => item.id === id);
  if (!design) throw new Error('This design no longer exists.');
  design.name = name;
  design.updatedAt = Date.now();
  await writeAll(list);
}

export async function duplicateDesign(id) {
  const list = await readAll();
  if (list.length >= FREE_DESIGN_LIMIT) {
    const error = new Error(`The free plan saves up to ${FREE_DESIGN_LIMIT} designs. Delete a saved design to make room.`);
    error.code = 'DESIGN_LIMIT_REACHED';
    throw error;
  }
  const design = list.find((item) => item.id === id);
  if (!design) throw new Error('This design no longer exists.');
  const copy = { ...JSON.parse(JSON.stringify(design)), id: 'd' + uid(), name: design.name + ' (copy)', createdAt: Date.now(), updatedAt: Date.now() };
  list.push(copy);
  await writeAll(list);
  return copy;
}

export async function clearDesigns() {
  await AsyncStorage.removeItem(KEY);
}

export async function getSettings() {
  return { ...DEFAULT_SETTINGS, ...(await readJson(SKEY, {})) };
}

export async function setSettings(settings) {
  await AsyncStorage.setItem(SKEY, JSON.stringify(settings));
}

export async function getProfile() {
  return { ...DEFAULT_PROFILE, ...(await readJson(PKEY, {})) };
}

export async function saveProfile(profile) {
  await AsyncStorage.setItem(PKEY, JSON.stringify({ ...DEFAULT_PROFILE, ...profile }));
}

export async function clearProfile() {
  await AsyncStorage.removeItem(PKEY);
}

export async function getExportCount() {
  return readJson(EKEY, 0);
}

export async function recordExport() {
  const count = await getExportCount();
  await AsyncStorage.setItem(EKEY, JSON.stringify(count + 1));
}

export async function getStorageUsage() {
  const keys = await AsyncStorage.getAllKeys();
  const values = await AsyncStorage.multiGet(keys);
  const metadataBytes = values.reduce((total, pair) => total + (pair[0].startsWith('cas.') ? (pair[0].length + (pair[1] || '').length) * 2 : 0), 0);
  const folderBytes = async (uri) => {
    const info = await FileSystem.getInfoAsync(uri);
    if (!info.exists) return 0;
    if (!info.isDirectory) return info.size || 0;
    const entries = await FileSystem.readDirectoryAsync(uri);
    const sizes = await Promise.all(entries.map(async (entry) => {
      const childUri = uri.replace(/\/?$/, '/') + entry;
      const childInfo = await FileSystem.getInfoAsync(childUri);
      return childInfo.isDirectory ? folderBytes(childUri + '/') : childInfo.size || 0;
    }));
    return sizes.reduce((total, size) => total + size, 0);
  };
  const fileBytes = await Promise.all(['exports/', 'media/'].map((folder) => folderBytes(FileSystem.documentDirectory + folder)));
  return metadataBytes + fileBytes.reduce((total, size) => total + size, 0);
}

export async function clearLocalData() {
  const keys = await AsyncStorage.getAllKeys();
  const appKeys = keys.filter((key) => key.startsWith('cas.'));
  if (appKeys.length) await AsyncStorage.multiRemove(appKeys);
}
