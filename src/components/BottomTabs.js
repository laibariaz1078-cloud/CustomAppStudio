import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { C } from './ui';

const TABS = [
  { name: 'Home', label: 'Home', icon: 'home-outline' },
  { name: 'MyDesigns', label: 'My Designs', icon: 'albums-outline' },
  { name: 'Profile', label: 'Profile', icon: 'person-circle-outline' },
  { name: 'Settings', label: 'Settings', icon: 'settings-outline' },
];

export default function BottomTabs({ navigation, active }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ minHeight: 62 + insets.bottom, flexDirection: 'row', backgroundColor: '#fff', borderTopWidth: 1, borderColor: C.border, paddingBottom: Math.max(2, insets.bottom) }}>
      {TABS.map((tab) => (
        <TouchableOpacity
          key={tab.name}
          accessibilityRole="button"
          accessibilityLabel={tab.label}
          accessibilityState={{ selected: active === tab.name }}
          onPress={() => navigation.navigate(tab.name)}
          style={{ minHeight: 60, minWidth: 64, flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
          <Ionicons name={tab.icon} size={21} color={active === tab.name ? C.primary : C.muted} />
          <Text style={{ color: active === tab.name ? C.primary : C.muted, fontSize: 10, fontWeight: active === tab.name ? '700' : '500', marginTop: 2 }}>{tab.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
