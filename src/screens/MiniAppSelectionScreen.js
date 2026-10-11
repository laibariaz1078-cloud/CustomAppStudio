import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { C } from '../components/ui';
import { APPS, templatesFor } from '../templates';

export default function MiniAppSelectionScreen({ navigation }) {
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ color: C.muted, marginBottom: 14 }}>What would you like to design today?</Text>
      {APPS.map((a) => (
        <TouchableOpacity accessibilityRole="button" accessibilityLabel={`Choose ${a.title}`} key={a.key} onPress={() => navigation.navigate('Gallery', { appType: a.key, title: a.title })} style={{ backgroundColor: a.color, borderRadius: 20, padding: 20, marginBottom: 14, minHeight: 120, justifyContent: 'center' }}>
          <Ionicons name={a.icon} size={34} color="#fff" />
          <Text style={{ color: '#fff', fontSize: 20, fontWeight: '800', marginTop: 8 }}>{a.title}</Text>
          <Text style={{ color: '#ffffffdd', marginTop: 2 }}>{templatesFor(a.key).length} templates • {a.desc}</Text>
        </TouchableOpacity>))}
    </View>
  );
}
