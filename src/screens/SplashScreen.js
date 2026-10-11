import React, { useEffect, useRef } from 'react';
import { View, Text, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { C } from '../components/ui';

export default function SplashScreen({ navigation }) {
  const a = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(a, { toValue: 1, duration: 900, useNativeDriver: true }).start();
    const t = setTimeout(() => navigation.replace('Home'), 1800);
    return () => clearTimeout(t);
  }, []);
  return (
    <View style={{ flex: 1, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center' }}>
      <Animated.View style={{ opacity: a, transform: [{ scale: a.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1] }) }], alignItems: 'center' }}>
        <View style={{ width: 96, height: 96, borderRadius: 28, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }}><Ionicons name="color-palette" size={52} color={C.primary} /></View>
        <Text style={{ color: '#fff', fontSize: 28, fontWeight: '800', marginTop: 16 }}>CustomApp Studio</Text>
        <Text style={{ color: '#E0E0FF', marginTop: 6 }}>Resumes • Business Cards • Invitations</Text>
      </Animated.View>
    </View>
  );
}
