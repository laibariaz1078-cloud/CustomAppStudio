# CustomApp Studio (React Native + Expo, frontend only)

## Run
```
npm install
npx expo install --fix     # aligns native package versions with your Expo SDK
npx expo start             # scan QR with Expo Go, or press a / i
```
Native modules used (view-shot, print, sharing, file-system, image-picker) work in Expo Go. If you use a bare RN project instead, install the same packages and run `npx pod-install`.

## Structure
src/screens, src/components, src/navigation, src/templates (config objects), src/editor (state + property panel), src/storage (AsyncStorage), src/utils (export, fonts, media).

## Known limits
- Resume export is single page (scaled to A4/Letter); no automatic multi-page flow yet.
- Drag/resize use React Native PanResponder (no Gesture Handler/Reanimated dependency). Rotation is via stepper (15° steps), not two-finger gesture.
- Templates: 20 per mini-app (5 layout families × 4 colourways for resume & cards; 20 occasions over 5 layouts/sizes for invitations).
