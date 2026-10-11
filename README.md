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

## Local-only behavior
- Designs, settings, profile details and export counts use AsyncStorage. Picked images and generated files are stored in the app's local document directory.
- The Free plan permits five saved designs. Exporting and sharing use the device file system and native share sheet; no account or network service is used.
- Resume exports are PDFs sized for A4 or US Letter. Taller custom resumes are split into sequential PDF pages. Card and invitation exports are PNG or JPEG.
- There are 20 configuration-driven templates per mini-app. Resume and card layouts include alternate compositions and orientations; invitation templates cover distinct occasions.

## Editor notes
- Drag and resize use React Native PanResponder. Rotation is adjusted with the property controls rather than a multi-touch gesture.
- Profile autofill is an explicit editor action. Review the inserted text and image and adjust their placement before saving.
