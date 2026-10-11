import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

// Lets the user choose an image and copies it into app storage so it survives restarts.
export async function pickImage() {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) throw new Error('Allow photo-library access in your device settings to choose an image.');
  const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.9 });
  if (res.canceled || !res.assets?.length) return null;
  const src = res.assets[0].uri;
  const dir = FileSystem.documentDirectory + 'media/';
  const info = await FileSystem.getInfoAsync(dir);
  if (!info.exists) await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
  const ext = (src.split('.').pop() || 'jpg').split('?')[0].slice(0, 4);
  const dest = dir + Date.now() + '.' + ext;
  await FileSystem.copyAsync({ from: src, to: dest });
  return dest;
}
