import { captureRef } from 'react-native-view-shot';
import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

const PAGES = { a4: { w: 595, h: 842 }, letter: { w: 612, h: 792 } };

// Captures the design and writes a REAL file (PDF for resumes, PNG/JPG for cards & invitations).
export async function exportDesign(viewRef, design, settings) {
  const dir = FileSystem.documentDirectory + 'exports/';
  await FileSystem.makeDirectoryAsync(dir, { intermediates: true }).catch(() => {});
  const safe = (design.name || 'design').replace(/[^a-z0-9]+/gi, '_');
  const size = { width: Math.round(design.width * 3), height: Math.round(design.height * 3) };
  if (design.appType === 'resume') {
    const b64 = await captureRef(viewRef, { format: 'png', result: 'base64', ...size });
    const p = PAGES[settings.pageSize] || PAGES.a4;
    const html = `<html><head><meta name="viewport" content="width=device-width"/><style>@page{size:${p.w}pt ${p.h}pt;margin:0}html,body{margin:0;padding:0;width:${p.w}pt;height:${p.h}pt}img{width:${p.w}pt;height:${p.h}pt;object-fit:contain;display:block}</style></head><body><img src="data:image/png;base64,${b64}"/></body></html>`;
    const { uri } = await Print.printToFileAsync({ html, width: p.w, height: p.h });
    const dest = dir + safe + '_' + settings.pageSize + '_' + Date.now() + '.pdf';
    await FileSystem.moveAsync({ from: uri, to: dest });
    return { uri: dest, mime: 'application/pdf', ext: 'pdf' };
  }
  const fmt = settings.imageFormat === 'jpg' ? 'jpg' : 'png';
  const tmp = await captureRef(viewRef, { format: fmt, quality: 1, result: 'tmpfile', ...size });
  const dest = dir + safe + '_' + Date.now() + '.' + fmt;
  await FileSystem.copyAsync({ from: tmp, to: dest });
  return { uri: dest, mime: fmt === 'jpg' ? 'image/jpeg' : 'image/png', ext: fmt };
}

export async function shareFile(file) {
  if (!(await Sharing.isAvailableAsync())) throw new Error('Sharing is not available on this device.');
  await Sharing.shareAsync(file.uri, { mimeType: file.mime, dialogTitle: 'Share design' });
}
