import React, { useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, useWindowDimensions } from 'react-native';
import { C, Empty } from '../components/ui';
import { DesignView } from '../components/DesignView';
import { templatesFor, createFromTemplate } from '../templates';

export default function TemplateGalleryScreen({ route, navigation }) {
  const { width } = useWindowDimensions();
  const gap = 12; const cw = (width - gap * 3) / 2; const maxH = cw * 1.45;
  const items = useMemo(() => templatesFor(route.params.appType).map((t) => ({ t, d: createFromTemplate(t.id) })), [route.params.appType]);
  return (
    <FlatList data={items} keyExtractor={(i) => i.t.id} numColumns={2} contentContainerStyle={{ padding: gap }} columnWrapperStyle={{ gap }} ItemSeparatorComponent={() => <View style={{ height: gap }} />}
      ListHeaderComponent={<Text style={{ color: C.muted, marginBottom: 10 }}>{items.length} templates — tap one to start editing</Text>}
      ListEmptyComponent={<Empty title="No templates" />}
      renderItem={({ item }) => {
        const sc = Math.min(cw / item.d.width, maxH / item.d.height);
        return (
          <TouchableOpacity accessibilityLabel={item.t.name} style={{ width: cw }} onPress={() => navigation.navigate('Editor', { templateId: item.t.id })}>
            <View style={{ height: maxH, backgroundColor: '#E9EBF3', borderRadius: 12, alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderWidth: 1, borderColor: C.border }}>
              <DesignView design={item.d} scale={sc} />
            </View>
            <Text numberOfLines={1} style={{ marginTop: 6, fontWeight: '600', color: C.text, fontSize: 13 }}>{item.t.name}</Text>
          </TouchableOpacity>
        );
      }} />
  );
}
