import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { C } from '../components/ui';
import Splash from '../screens/SplashScreen';
import Home from '../screens/HomeScreen';
import MiniApps from '../screens/MiniAppSelectionScreen';
import Gallery from '../screens/TemplateGalleryScreen';
import Editor from '../screens/DesignEditorScreen';
import MyDesigns from '../screens/MyDesignsScreen';
import Preview from '../screens/SavedDesignPreviewScreen';
import Settings from '../screens/SettingsScreen';

const Stack = createNativeStackNavigator();
export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerTintColor: C.text, headerStyle: { backgroundColor: C.bg }, headerShadowVisible: false, contentStyle: { backgroundColor: C.bg } }}>
      <Stack.Screen name="Splash" component={Splash} options={{ headerShown: false }} />
      <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
      <Stack.Screen name="MiniApps" component={MiniApps} options={{ title: 'Choose a Mini-App' }} />
      <Stack.Screen name="Gallery" component={Gallery} options={({ route }) => ({ title: route.params?.title || 'Templates' })} />
      <Stack.Screen name="Editor" component={Editor} options={{ title: 'Editor' }} />
      <Stack.Screen name="MyDesigns" component={MyDesigns} options={{ title: 'My Designs' }} />
      <Stack.Screen name="Preview" component={Preview} options={{ title: 'Preview' }} />
      <Stack.Screen name="Settings" component={Settings} />
    </Stack.Navigator>
  );
}
