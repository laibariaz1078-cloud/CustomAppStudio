import React, { useCallback, useState } from 'react';
import { Alert, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { C, Label, Primary } from '../components/ui';
import BottomTabs from '../components/BottomTabs';
import { clearProfile, DEFAULT_PROFILE, getProfile, saveProfile } from '../storage/designs';
import { pickImage } from '../utils/media';
import * as FileSystem from 'expo-file-system';

const FIELDS = [
  { key: 'name', label: 'Full name', icon: 'person-outline', placeholder: 'Your name' },
  { key: 'email', label: 'Email', icon: 'mail-outline', placeholder: 'you@example.com', keyboardType: 'email-address' },
  { key: 'phone', label: 'Phone', icon: 'call-outline', placeholder: '+1 555 000 0000', keyboardType: 'phone-pad' },
  { key: 'jobTitle', label: 'Job title', icon: 'briefcase-outline', placeholder: 'Product designer' },
];

export default function ProfileScreen({ navigation }) {
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [busy, setBusy] = useState(false);
  useFocusEffect(useCallback(() => {
    getProfile().then(setProfile).catch((error) => Alert.alert('Could not load profile', error.message));
  }, []));
  const update = (key, value) => setProfile((old) => ({ ...old, [key]: value }));
  const choosePhoto = async () => {
    try {
      const uri = await pickImage();
      if (uri) update('photoUri', uri);
    } catch (error) {
      Alert.alert('Photo unavailable', error.message || String(error));
    }
  };
  const save = async () => {
    try {
      setBusy(true);
      await saveProfile(profile);
      Alert.alert('Profile saved', 'Your profile is stored on this device and can fill in new designs.');
    } catch (error) {
      Alert.alert('Could not save profile', error.message || String(error));
    } finally {
      setBusy(false);
    }
  };
  const remove = () => Alert.alert('Delete local profile?', 'Your saved profile details and photo will be removed from this device.', [
    { text: 'Cancel', style: 'cancel' },
    { text: 'Delete profile', style: 'destructive', onPress: async () => {
      try {
        if (profile.photoUri) {
          const info = await FileSystem.getInfoAsync(profile.photoUri);
          if (info.exists) await FileSystem.deleteAsync(profile.photoUri, { idempotent: true });
        }
        await clearProfile();
        setProfile(DEFAULT_PROFILE);
      } catch (error) {
        Alert.alert('Could not delete profile', error.message || String(error));
      }
    } },
  ]);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: 18, paddingBottom: 24 }}>
        <Text style={{ color: C.muted, marginBottom: 18 }}>Your details stay on this device and are only used when you choose Autofill.</Text>
        <TouchableOpacity accessibilityRole="button" accessibilityLabel="Choose profile photo" onPress={choosePhoto} style={{ alignSelf: 'center', minWidth: 100, minHeight: 100, alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
          {profile.photoUri ? <Image source={{ uri: profile.photoUri }} style={{ width: 86, height: 86, borderRadius: 43 }} /> : <View style={{ width: 86, height: 86, borderRadius: 43, backgroundColor: '#E8E9FB', alignItems: 'center', justifyContent: 'center' }}><Ionicons name="camera-outline" size={30} color={C.primary} /></View>}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}><Ionicons name="camera-outline" size={13} color={C.primary} /><Text style={{ color: C.primary, fontSize: 12, fontWeight: '700', marginLeft: 3 }}>Change photo</Text></View>
        </TouchableOpacity>
        {FIELDS.map((field) => (
          <View key={field.key}>
            <Label>{field.label}</Label>
            <View style={{ flexDirection: 'row', alignItems: 'center', minHeight: 48, borderWidth: 1, borderColor: C.border, borderRadius: 11, paddingHorizontal: 12, backgroundColor: '#fff' }}>
              <Ionicons name={field.icon} size={18} color={C.muted} />
              <TextInput accessibilityLabel={field.label} value={profile[field.key]} onChangeText={(value) => update(field.key, value)} placeholder={field.placeholder} keyboardType={field.keyboardType || 'default'} autoCapitalize={field.key === 'email' ? 'none' : 'words'} style={{ flex: 1, padding: 10, color: C.text }} />
            </View>
          </View>
        ))}
        <Primary title={busy ? 'Saving profile' : 'Save profile'} icon="checkmark-circle-outline" loading={busy} style={{ marginTop: 20 }} onPress={save} />
        <Primary title="Account & Plan" icon="ribbon-outline" style={{ marginTop: 10, backgroundColor: '#374151' }} onPress={() => navigation.navigate('Account')} />
        <Primary title="Delete local profile" icon="trash-outline" color={C.danger} style={{ marginTop: 10 }} onPress={remove} />
      </ScrollView>
      <BottomTabs navigation={navigation} active="Profile" />
    </View>
  );
}
