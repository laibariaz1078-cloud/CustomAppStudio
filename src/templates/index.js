// Configuration-driven template system. Every template is a plain JS object; build() returns its element list.
let n = 0;
export const uid = () => 'e' + Date.now().toString(36) + (n++).toString(36) + Math.random().toString(36).slice(2, 5);
const base = { opacity: 1, rotation: 0, visible: true, locked: false };
export const txt = (text, x, y, w, h, o = {}) => ({ id: uid(), type: 'text', x, y, w, h, text, color: '#1b1b2f', fontSize: 14, fontWeight: '400', fontStyle: 'normal', fontFamily: 'System', align: 'left', ...base, ...o });
export const shp = (x, y, w, h, bg, o = {}) => ({ id: uid(), type: 'shape', x, y, w, h, bg, radius: 0, borderWidth: 0, borderColor: '#000000', shadow: false, ...base, ...o });
export const img = (x, y, w, h, o = {}) => ({ id: uid(), type: 'image', x, y, w, h, uri: null, radius: 0, borderWidth: 0, borderColor: '#ffffff', shadow: false, ...base, ...o });

export const APPS = [
  { key: 'resume', title: 'Resume Builder', icon: 'document-text', color: '#5B5BD6', desc: 'ATS-friendly resumes, export as PDF (A4 / Letter)' },
  { key: 'card', title: 'Business Card Maker', icon: 'card', color: '#0F766E', desc: 'Professional cards, export as PNG / JPEG' },
  { key: 'invite', title: 'Invitations & Greetings', icon: 'gift', color: '#DB2777', desc: 'Wedding, Nikkah, Eid, birthday and more' },
];

/* ============================ RESUME ============================ */
const W = 595, H = 842;
const R = {
  name: 'Your Name', title: 'Professional Title',
  contact: 'you@email.com\n+92 300 0000000\nCity, Country', line: 'you@email.com  •  +92 300 0000000  •  City, Country',
  summary: 'Motivated professional with hands-on experience building reliable products. Tap to edit this summary and describe your strengths.',
  exp: 'Company Name — Role (2023–Present)\n• Describe your key responsibility\n• Add a measurable result\n\nCompany Name — Role (2021–2023)\n• Describe your key responsibility',
  edu: 'University Name\nBS Computer Science (2021–2025)',
  skills: 'JavaScript • React • Node.js\nMongoDB • Git • REST APIs', proj: 'Project Name — what you built, the tech used and the result.\nProject Name — short description.',
  cert: 'Certification Name — Issuer (2025)', lang: 'English • Urdu', ach: 'Add an award or achievement here.',
};
const sec = (x, y, w, title, body, bh, hc, bc, f = 'System') => {
  const sectionId = uid();
  return [
    { ...txt(title.toUpperCase(), x, y, w, 18, { fontSize: 12, fontWeight: '700', color: hc, fontFamily: f }), sectionId, sectionRole: 'heading' },
    { ...shp(x, y + 19, w, 1.5, hc, { opacity: 0.5 }), sectionId, sectionRole: 'divider' },
    { ...txt(body, x, y + 26, w, bh, { fontSize: 11, color: bc, fontFamily: f }), sectionId, sectionRole: 'body' },
  ];
};
const resumeLayouts = [
  { name: 'Sidebar', bg: () => '#ffffff', build: (P) => [
    shp(0, 0, 200, H, P.pri), img(50, 40, 100, 100, { radius: 50, borderWidth: 3, borderColor: '#ffffff' }),
    txt(R.name, 15, 155, 170, 60, { fontSize: 22, fontWeight: '700', color: '#ffffff', align: 'center' }),
    txt(R.title, 15, 218, 170, 20, { fontSize: 12, color: '#ffffff', align: 'center' }),
    ...sec(18, 262, 166, 'Contact', R.contact, 55, '#ffffff', '#ffffff'),
    ...sec(18, 350, 166, 'Skills', R.skills, 45, '#ffffff', '#ffffff'),
    ...sec(18, 430, 166, 'Languages', R.lang, 25, '#ffffff', '#ffffff'),
    ...sec(225, 40, 345, 'Profile', R.summary, 55, P.pri, P.txt),
    ...sec(225, 140, 345, 'Experience', R.exp, 130, P.pri, P.txt),
    ...sec(225, 305, 345, 'Education', R.edu, 35, P.pri, P.txt),
    ...sec(225, 385, 345, 'Projects', R.proj, 60, P.pri, P.txt),
    ...sec(225, 490, 345, 'Certifications', R.cert, 25, P.pri, P.txt),
    ...sec(225, 560, 345, 'Achievements', R.ach, 25, P.pri, P.txt),
  ] },
  { name: 'Header Band', bg: () => '#ffffff', build: (P) => [
    shp(0, 0, W, 170, P.pri), img(465, 35, 100, 100, { radius: 50, borderWidth: 3, borderColor: '#ffffff' }),
    txt(R.name, 40, 45, 400, 44, { fontSize: 34, fontWeight: '700', color: '#ffffff' }),
    txt(R.title, 40, 92, 400, 22, { fontSize: 15, color: '#ffffff' }), txt(R.line, 40, 128, 410, 18, { fontSize: 10, color: '#ffffff' }),
    ...sec(40, 195, 320, 'Profile', R.summary, 55, P.pri, P.txt), ...sec(40, 295, 320, 'Experience', R.exp, 130, P.pri, P.txt),
    ...sec(40, 470, 320, 'Projects', R.proj, 60, P.pri, P.txt), ...sec(40, 575, 320, 'Achievements', R.ach, 25, P.pri, P.txt),
    shp(385, 185, 170, 640, P.sec, { radius: 8 }),
    ...sec(397, 200, 146, 'Skills', R.skills, 50, P.pri, P.txt), ...sec(397, 300, 146, 'Education', R.edu, 50, P.pri, P.txt),
    ...sec(397, 400, 146, 'Languages', R.lang, 25, P.pri, P.txt), ...sec(397, 470, 146, 'Certifications', R.cert, 40, P.pri, P.txt),
  ] },
  { name: 'Minimal Serif', bg: () => '#ffffff', build: (P) => [
    txt(R.name, 40, 36, 515, 46, { fontSize: 36, fontWeight: '700', color: P.pri, fontFamily: 'Serif' }),
    txt(R.title, 40, 84, 515, 22, { fontSize: 15, color: P.txt, fontFamily: 'Serif', fontStyle: 'italic' }),
    txt(R.line, 40, 112, 515, 16, { fontSize: 10, color: P.txt, fontFamily: 'Serif' }), shp(40, 138, 515, 3, P.pri),
    ...sec(40, 155, 515, 'Profile', R.summary, 40, P.pri, P.txt, 'Serif'), ...sec(40, 235, 515, 'Experience', R.exp, 125, P.pri, P.txt, 'Serif'),
    ...sec(40, 400, 515, 'Education', R.edu, 35, P.pri, P.txt, 'Serif'), ...sec(40, 475, 515, 'Projects', R.proj, 50, P.pri, P.txt, 'Serif'),
    ...sec(40, 565, 515, 'Skills', R.skills, 35, P.pri, P.txt, 'Serif'), ...sec(40, 640, 515, 'Certifications & Languages', R.cert + '\n' + R.lang, 35, P.pri, P.txt, 'Serif'),
  ] },
  { name: 'Right Rail', bg: () => '#ffffff', build: (P) => [
    shp(395, 0, 200, H, P.sec), img(445, 40, 100, 100, { radius: 12, borderWidth: 2, borderColor: P.pri }),
    txt(R.name, 40, 40, 330, 44, { fontSize: 32, fontWeight: '700', color: P.pri }), txt(R.title, 40, 88, 330, 22, { fontSize: 15, color: P.txt }), shp(40, 118, 60, 4, P.pri),
    ...sec(40, 145, 325, 'Profile', R.summary, 55, P.pri, P.txt), ...sec(40, 245, 325, 'Experience', R.exp, 130, P.pri, P.txt),
    ...sec(40, 410, 325, 'Projects', R.proj, 60, P.pri, P.txt), ...sec(40, 515, 325, 'Achievements', R.ach, 25, P.pri, P.txt),
    ...sec(412, 165, 166, 'Contact', R.contact, 55, P.pri, P.txt), ...sec(412, 255, 166, 'Skills', R.skills, 45, P.pri, P.txt),
    ...sec(412, 335, 166, 'Education', R.edu, 45, P.pri, P.txt), ...sec(412, 415, 166, 'Languages', R.lang, 25, P.pri, P.txt), ...sec(412, 485, 166, 'Certifications', R.cert, 40, P.pri, P.txt),
  ] },
  { name: 'Centered', bg: () => '#ffffff', build: (P) => [
    shp(0, 0, W, 8, P.pri), img(247, 30, 100, 100, { radius: 50, borderWidth: 3, borderColor: P.pri }),
    txt(R.name, 40, 142, 515, 40, { fontSize: 32, fontWeight: '700', color: P.pri, align: 'center' }), txt(R.title, 40, 184, 515, 20, { fontSize: 14, color: P.txt, align: 'center' }),
    txt(R.line, 40, 210, 515, 16, { fontSize: 10, color: P.txt, align: 'center' }), shp(40, 236, 515, 1.5, P.pri),
    ...sec(40, 255, 515, 'Profile', R.summary, 40, P.pri, P.txt),
    ...sec(40, 335, 245, 'Experience', R.exp, 160, P.pri, P.txt), ...sec(310, 335, 245, 'Education', R.edu, 40, P.pri, P.txt),
    ...sec(310, 420, 245, 'Skills', R.skills, 40, P.pri, P.txt), ...sec(310, 505, 245, 'Languages', R.lang, 25, P.pri, P.txt),
    ...sec(40, 540, 245, 'Projects', R.proj, 70, P.pri, P.txt), ...sec(310, 575, 245, 'Certifications', R.cert, 30, P.pri, P.txt), ...sec(40, 650, 515, 'Achievements', R.ach, 25, P.pri, P.txt),
  ] },
];
const resumePalettes = [
  { n: 'Ocean', pri: '#1F4E79', sec: '#E8F0F8', txt: '#222222' }, { n: 'Emerald', pri: '#0B6E4F', sec: '#E6F4EE', txt: '#222222' },
  { n: 'Crimson', pri: '#9B1D20', sec: '#FBEAEA', txt: '#222222' }, { n: 'Mono', pri: '#222222', sec: '#EFEFEF', txt: '#333333' },
];

/* ========================= BUSINESS CARDS ========================= */
const B = { name: 'Your Name', role: 'Designation', company: 'Company Name', phone: '+92 300 0000000', email: 'you@company.com', web: 'www.company.com', addr: 'City, Country', social: '@yourhandle' };
const info = B.phone + '\n' + B.email + '\n' + B.web + '\n' + B.addr;
const cardLayouts = [
  { name: 'Split', w: 350, h: 200, bg: (P) => P.bg, build: (P) => [
    shp(0, 0, 120, 200, P.pri), img(25, 35, 70, 70, { radius: 35, borderWidth: 2, borderColor: '#ffffff' }),
    txt(B.company, 8, 120, 104, 40, { fontSize: 12, fontWeight: '700', color: '#ffffff', align: 'center' }),
    txt(B.name, 140, 28, 195, 28, { fontSize: 20, fontWeight: '700', color: P.pri }), txt(B.role, 140, 58, 195, 18, { fontSize: 12, color: '#444444' }),
    shp(140, 86, 40, 2, P.sec), txt(info, 140, 98, 195, 68, { fontSize: 11, color: '#333333' }), txt(B.social, 140, 172, 195, 16, { fontSize: 10, color: P.pri }),
  ] },
  { name: 'Minimal Center', w: 350, h: 200, bg: (P) => P.bg, build: (P) => [
    txt(B.company.toUpperCase(), 20, 22, 310, 16, { fontSize: 10, color: P.pri, align: 'center', fontWeight: '700' }),
    txt(B.name, 20, 52, 310, 34, { fontSize: 25, fontFamily: 'Serif', fontWeight: '700', color: '#111111', align: 'center' }),
    txt(B.role, 20, 88, 310, 18, { fontSize: 12, color: '#555555', align: 'center' }), shp(155, 118, 40, 2, P.pri),
    txt(B.phone + '  •  ' + B.email, 20, 134, 310, 16, { fontSize: 10, color: '#333333', align: 'center' }), txt(B.web + '  •  ' + B.addr, 20, 152, 310, 16, { fontSize: 10, color: '#333333', align: 'center' }),
  ] },
  { name: 'Corporate Bar', w: 350, h: 200, bg: () => '#ffffff', build: (P) => [
    shp(0, 0, 350, 56, P.pri), txt(B.company, 16, 16, 220, 24, { fontSize: 16, fontWeight: '700', color: '#ffffff' }),
    img(268, 28, 64, 64, { radius: 32, borderWidth: 3, borderColor: '#ffffff' }),
    txt(B.name, 16, 74, 240, 26, { fontSize: 19, fontWeight: '700', color: P.pri }), txt(B.role, 16, 102, 240, 18, { fontSize: 12, color: '#444444' }),
    txt(info, 16, 128, 250, 62, { fontSize: 10, color: '#333333' }), shp(0, 190, 350, 10, P.sec),
  ] },
  { name: 'Luxury Dark', w: 350, h: 200, bg: (P) => P.dark, build: (P) => [
    shp(10, 10, 330, 180, 'transparent', { borderWidth: 1.5, borderColor: P.acc }), txt(B.company.toUpperCase(), 20, 28, 310, 16, { fontSize: 10, color: P.acc, align: 'center', fontWeight: '700' }),
    txt(B.name, 20, 56, 310, 36, { fontSize: 26, fontFamily: 'Serif', color: P.acc, align: 'center', fontWeight: '700' }), txt(B.role, 20, 96, 310, 18, { fontSize: 12, color: '#ffffff', align: 'center' }),
    shp(150, 124, 50, 1.5, P.acc), txt(B.phone + '   ' + B.email, 20, 138, 310, 16, { fontSize: 10, color: '#dddddd', align: 'center' }), txt(B.web, 20, 156, 310, 16, { fontSize: 10, color: '#dddddd', align: 'center' }),
  ] },
  { name: 'Portrait', w: 200, h: 350, bg: (P) => P.bg, build: (P) => [
    shp(0, 0, 200, 120, P.pri), img(60, 70, 80, 80, { radius: 40, borderWidth: 3, borderColor: '#ffffff' }),
    txt(B.name, 10, 162, 180, 28, { fontSize: 20, fontWeight: '700', color: P.pri, align: 'center' }), txt(B.role, 10, 192, 180, 18, { fontSize: 12, color: '#444444', align: 'center' }),
    shp(80, 220, 40, 2, P.sec), txt(info, 10, 232, 180, 66, { fontSize: 10, color: '#333333', align: 'center' }),
    shp(0, 310, 200, 40, P.pri), txt(B.company, 10, 322, 180, 18, { fontSize: 12, fontWeight: '700', color: '#ffffff', align: 'center' }),
  ] },
];
const cardPalettes = [
  { n: 'Navy', pri: '#10243E', sec: '#9CB4D4', bg: '#ffffff', dark: '#0B1B33', acc: '#C9A24B' }, { n: 'Teal', pri: '#0F766E', sec: '#99E0D6', bg: '#F0FDFA', dark: '#06302C', acc: '#E2C37E' },
  { n: 'Sunset', pri: '#EA580C', sec: '#FDBA74', bg: '#FFF7ED', dark: '#3A1A0A', acc: '#F4A261' }, { n: 'Graphite', pri: '#27272A', sec: '#A1A1AA', bg: '#ffffff', dark: '#18181B', acc: '#D4D4D8' },
];

/* ========================= INVITATIONS ========================= */
const occasions = [
  { n: 'Birthday Bash', head: 'You are Invited!', e: '🎂', a: '#DB2777', bg: '#FFF1F7', msg: 'Join us to celebrate a very special birthday with cake, music and fun.' },
  { n: 'Wedding', head: 'Wedding Invitation', e: '💍', a: '#9A6B2F', bg: '#FFFBF2', msg: 'Together with their families, request the honour of your presence at their wedding.' },
  { n: 'Nikkah', head: 'Nikkah Ceremony', e: '🕌', a: '#0F766E', bg: '#F0FDFA', msg: 'With the blessings of Allah, we invite you to witness the Nikkah.' },
  { n: 'Walima', head: 'Walima Reception', e: '🌙', a: '#7C3AED', bg: '#F5F3FF', msg: 'Please join us for the Walima dinner and share our happiness.' },
  { n: 'Eid Mubarak', head: 'Eid Mubarak', e: '🌙', a: '#16A34A', bg: '#F0FDF4', msg: 'Wishing you and your family joy, peace and blessings this Eid.' },
  { n: 'Anniversary', head: 'Happy Anniversary', e: '❤️', a: '#BE123C', bg: '#FFF1F2', msg: 'Celebrating years of love, laughter and togetherness.' },
  { n: 'Engagement', head: 'We Are Engaged!', e: '💎', a: '#2563EB', bg: '#EFF6FF', msg: 'Join us for an evening to celebrate our engagement.' },
  { n: 'Baby Shower', head: 'Baby Shower', e: '🍼', a: '#0EA5E9', bg: '#F0F9FF', msg: 'A little one is on the way! Come shower the parents-to-be with love.' },
  { n: 'Graduation', head: 'Graduation Party', e: '🎓', a: '#1E3A8A', bg: '#F8FAFC', msg: 'We did it! Celebrate this milestone with us.' },
  { n: 'Party Night', head: "Let's Party!", e: '🎉', a: '#F59E0B', bg: '#FFFBEB', msg: 'Great food, great music, great company. Do not miss it!' },
  { n: 'Congratulations', head: 'Congratulations!', e: '🏆', a: '#CA8A04', bg: '#FEFCE8', msg: 'Wishing you every success. So proud of what you have achieved.' },
  { n: 'Thank You', head: 'Thank You', e: '🙏', a: '#0D9488', bg: '#F0FDFA', msg: 'Your kindness and support mean the world to us.' },
  { n: 'Housewarming', head: 'Housewarming', e: '🏠', a: '#B45309', bg: '#FFF7ED', msg: 'Come see our new home and celebrate with us.' },
  { n: 'Get Well Soon', head: 'Get Well Soon', e: '🌻', a: '#EAB308', bg: '#FEFCE8', msg: 'Sending warm wishes and prayers for a speedy recovery.' },
  { n: 'New Year', head: 'Happy New Year', e: '🎆', a: '#C9A24B', bg: '#0F172A', dark: true, msg: 'Cheers to new beginnings and a wonderful year ahead.' },
  { n: 'Ramadan Kareem', head: 'Ramadan Kareem', e: '☪️', a: '#E2C37E', bg: '#052E2B', dark: true, msg: 'May this blessed month bring you peace, mercy and forgiveness.' },
  { n: 'Mehndi Night', head: 'Mehndi Night', e: '🌿', a: '#16A34A', bg: '#FEFCE8', msg: 'Music, colours and henna — join us for the Mehndi celebration.' },
  { n: 'Farewell', head: 'Farewell Party', e: '👋', a: '#6366F1', bg: '#EEF2FF', msg: 'Join us to wish a colleague and friend the very best.' },
  { n: 'Welcome', head: 'Welcome!', e: '🤝', a: '#0891B2', bg: '#ECFEFF', msg: 'We are so happy to have you with us.' },
  { n: 'Aqiqah', head: 'Aqiqah Invitation', e: '🌸', a: '#DB2777', bg: '#FDF2F8', msg: 'Join us in celebrating the blessing of our newborn.' },
];
const det = 'Saturday, 12 December 2026\n7:00 PM onwards\nVenue Name, City';
const rsvp = 'RSVP: +92 300 0000000';
const inviteLayouts = [
  { w: 360, h: 500, name: 'Framed', build: (O, tc, mc) => [
    shp(14, 14, 332, 472, 'transparent', { borderWidth: 2, borderColor: O.a }), txt(O.e, 20, 36, 320, 50, { fontSize: 38, align: 'center' }),
    txt(O.head, 30, 96, 300, 44, { fontSize: 29, fontFamily: 'Serif', fontWeight: '700', color: O.a, align: 'center' }), txt(O.msg, 40, 150, 280, 54, { fontSize: 13, color: mc, align: 'center' }),
    txt('Host Name', 30, 218, 300, 30, { fontSize: 22, fontFamily: 'Script', color: tc, align: 'center' }), shp(160, 266, 40, 2, O.a),
    txt(det, 30, 284, 300, 76, { fontSize: 14, color: tc, align: 'center', fontWeight: '600' }), txt(rsvp, 30, 420, 300, 20, { fontSize: 12, color: mc, align: 'center' }),
  ] },
  { w: 400, h: 400, name: 'Bold Square', build: (O, tc, mc) => [
    shp(-60, -60, 220, 220, '#ffffff', { opacity: 0.15, radius: 110 }), shp(280, 270, 200, 200, '#ffffff', { opacity: 0.15, radius: 100 }),
    txt(O.e, 20, 24, 360, 50, { fontSize: 38, align: 'center' }), txt(O.head, 20, 78, 360, 48, { fontSize: 32, fontWeight: '800', color: '#ffffff', align: 'center' }),
    txt(O.msg, 50, 134, 300, 50, { fontSize: 13, color: '#ffffff', align: 'center' }), txt('Host Name', 20, 200, 360, 30, { fontSize: 22, fontFamily: 'Script', color: '#ffffff', align: 'center' }),
    shp(70, 248, 260, 100, '#ffffff', { radius: 16, opacity: 0.95 }), txt(det, 80, 258, 240, 76, { fontSize: 13, color: O.a, align: 'center', fontWeight: '700' }), txt(rsvp, 20, 362, 360, 18, { fontSize: 11, color: '#ffffff', align: 'center' }),
  ], solid: true },
  { w: 500, h: 350, name: 'Landscape Split', build: (O, tc, mc) => [
    shp(0, 0, 190, 350, O.a), txt(O.e, 10, 60, 170, 60, { fontSize: 48, align: 'center' }), txt(O.head, 14, 130, 162, 90, { fontSize: 24, fontWeight: '800', color: '#ffffff', align: 'center' }),
    txt(O.msg, 215, 34, 260, 66, { fontSize: 13, color: mc }), txt('Host Name', 215, 116, 260, 30, { fontSize: 22, fontFamily: 'Script', color: tc }), shp(215, 156, 50, 2, O.a),
    txt(det, 215, 172, 260, 76, { fontSize: 14, color: tc, fontWeight: '600' }), txt(rsvp, 215, 300, 260, 20, { fontSize: 12, color: mc }),
  ] },
  { w: 360, h: 640, name: 'Story', build: (O, tc, mc) => [
    shp(0, 0, 360, 300, O.a), shp(200, -40, 220, 220, '#ffffff', { opacity: 0.12, radius: 110 }), txt(O.e, 20, 50, 320, 70, { fontSize: 56, align: 'center' }),
    txt(O.head, 20, 135, 320, 90, { fontSize: 34, fontWeight: '800', color: '#ffffff', align: 'center' }), txt(O.msg, 30, 335, 300, 70, { fontSize: 14, color: mc, align: 'center' }),
    txt('Host Name', 20, 420, 320, 34, { fontSize: 26, fontFamily: 'Script', color: O.a, align: 'center' }), txt(det, 20, 470, 320, 80, { fontSize: 15, color: tc, align: 'center', fontWeight: '600' }),
    shp(60, 570, 240, 44, O.a, { radius: 22 }), txt(rsvp, 60, 583, 240, 20, { fontSize: 13, color: '#ffffff', align: 'center', fontWeight: '700' }),
  ] },
  { w: 360, h: 500, name: 'Band', build: (O, tc, mc) => [
    txt(O.e, 20, 24, 80, 50, { fontSize: 32 }), txt(O.e, 260, 24, 80, 50, { fontSize: 32, align: 'right' }), txt(O.head, 20, 80, 320, 50, { fontSize: 30, fontFamily: 'Serif', fontWeight: '700', color: O.a, align: 'center' }),
    txt(O.msg, 36, 140, 288, 56, { fontSize: 13, color: mc, align: 'center' }), txt('Host Name', 20, 210, 320, 30, { fontSize: 22, fontFamily: 'Script', color: tc, align: 'center' }),
    shp(0, 300, 360, 200, O.a), txt(det, 20, 322, 320, 80, { fontSize: 15, color: '#ffffff', align: 'center', fontWeight: '700' }), shp(130, 420, 100, 1.5, '#ffffff'), txt(rsvp, 20, 436, 320, 20, { fontSize: 12, color: '#ffffff', align: 'center' }),
  ] },
];

const resumeNames = ['Professional', 'Modern', 'Minimal', 'Corporate', 'Creative', 'Academic', 'Executive', 'Technical', 'Fresher', 'Two-column', 'Single-column', 'Colorful', 'Monochrome', 'Editorial', 'Classic', 'Contemporary', 'Portfolio', 'Clean', 'Bold', 'ATS-friendly'];
const cardNames = ['Minimalist', 'Corporate', 'Luxury', 'Creative', 'Elegant', 'Colorful', 'Tech', 'Photography', 'Modern', 'Classic', 'Studio', 'Executive', 'Artisan', 'Monogram', 'Founder', 'Consultant', 'Architect', 'Designer', 'Editorial', 'Signature'];
function variantElements(elements, variant, kind, width, height, primary, secondary) {
  if (variant === 0) return elements;
  if (kind === 'card' && variant === 1) {
    const landscape = width > height;
    const nextWidth = landscape ? height : width;
    const nextHeight = landscape ? width : height;
    const sx = nextWidth / height;
    const sy = nextHeight / width;
    const mapped = elements.map((e) => ({ ...e, x: Math.round(e.y * sx), y: Math.round(e.x * sy), w: Math.round(e.h * sx), h: Math.round(e.w * sy) }));
    return [{ id: uid(), type: 'shape', x: 0, y: 0, w: nextWidth, h: 8, bg: primary, ...base }, ...mapped];
  }
  if (variant === 1) {
    const mirrored = elements.map((e) => ({
      ...e,
      x: Math.round(width - e.x - e.w),
      align: e.type === 'text' ? (e.align === 'left' ? 'right' : e.align === 'right' ? 'left' : e.align) : e.align,
    }));
    return kind === 'invite' ? [{ id: uid(), type: 'shape', x: 0, y: 0, w: width, h: 10, bg: primary, ...base }, ...mirrored] : mirrored;
  }
  if (variant === 2) {
    const scale = kind === 'resume' ? 0.9 : 0.84;
    const insetX = Math.round((width * (1 - scale)) / 2);
    const insetY = Math.round((height * (1 - scale)) / 2);
    const scaled = elements.map((e) => ({ ...e, x: Math.round(insetX + e.x * scale), y: Math.round(insetY + e.y * scale), w: Math.max(1, Math.round(e.w * scale)), h: Math.max(1, Math.round(e.h * scale)), ...(e.type === 'text' ? { fontSize: Math.max(6, Math.round(e.fontSize * scale)) } : {}) }));
    const frame = kind === 'resume'
      ? [{ id: uid(), type: 'shape', x: 0, y: 0, w: 8, h: height, bg: primary, ...base }, { id: uid(), type: 'shape', x: 24, y: 24, w: width - 48, h: 2, bg: secondary, ...base }]
      : [{ id: uid(), type: 'shape', x: 6, y: 6, w: width - 12, h: height - 12, bg: 'transparent', borderWidth: 2, borderColor: primary, radius: 0, ...base }];
    return [...frame, ...scaled];
  }
  if (kind === 'resume') {
    const result = elements.map((e) => e.type === 'text' && e.y < 180 && e.w > 120
      ? { ...e, x: 36, w: width - 72, align: 'center' }
      : e);
    return [{ id: uid(), type: 'shape', x: 0, y: 0, w: width, h: 8, bg: primary, ...base }, ...result];
  }
  return elements.map((e) => e.type === 'text'
    ? { ...e, x: 14, w: width - 28, align: 'center' }
    : e);
}

/* ============================ REGISTRY ============================ */
export const TEMPLATES = [];
resumeLayouts.forEach((L, i) => resumePalettes.forEach((P, j) => {
  const variant = j;
  TEMPLATES.push({
    id: `resume-${i + 1}-${j + 1}`, appType: 'resume', category: resumeNames[i * 4 + j], name: `${resumeNames[i * 4 + j]} ${L.name}`, width: W, height: H,
    background: L.bg(P), palette: { primary: P.pri, secondary: P.sec },
    build: () => variantElements(L.build(P), variant, 'resume', W, H, P.pri, P.sec),
  });
}));
cardLayouts.forEach((L, i) => cardPalettes.forEach((P, j) => {
  const variant = j;
  TEMPLATES.push({
    id: `card-${i + 1}-${j + 1}`, appType: 'card', category: cardNames[i * 4 + j], name: `${cardNames[i * 4 + j]} ${L.name}`, width: variant === 1 ? L.h : L.w, height: variant === 1 ? L.w : L.h,
    background: L.bg(P), palette: { primary: P.pri, secondary: P.sec },
    build: () => variantElements(L.build(P), variant, 'card', L.w, L.h, P.pri, P.sec),
  });
}));
occasions.forEach((O, i) => {
  const L = inviteLayouts[i % 5]; const tc = O.dark ? '#ffffff' : '#222222'; const mc = O.dark ? '#cbd5e1' : '#555555';
  const variant = Math.floor(i / inviteLayouts.length);
  TEMPLATES.push({
    id: `invite-${i + 1}`, appType: 'invite', category: O.n, name: `${O.n} · ${L.name}`, width: L.w, height: L.h,
    background: L.solid ? O.a : O.bg, palette: { primary: O.a, secondary: O.bg },
    build: () => variantElements(L.build(O, tc, mc), variant, 'invite', L.w, L.h, O.a, O.bg),
  });
});

export const templatesFor = (appType) => TEMPLATES.filter((t) => t.appType === appType);
export function createFromTemplate(id) {
  const t = TEMPLATES.find((x) => x.id === id);
  if (!t) throw new Error('This template could not be found.');
  return { id: 'd' + uid(), name: t.name, appType: t.appType, templateId: t.id, width: t.width, height: t.height, background: { color: t.background, uri: null }, palette: { ...t.palette }, elements: t.build(), createdAt: Date.now(), updatedAt: Date.now() };
}
