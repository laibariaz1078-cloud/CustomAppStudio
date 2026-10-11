import React, { useMemo, useState } from 'react';
import { FlatList, ScrollView, Text, TextInput, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { C, Empty } from '../components/ui';
import { DesignView } from '../components/DesignView';
import { templatesFor, createFromTemplate } from '../templates';

export default function TemplateGalleryScreen({ route, navigation }) {
  const { width } = useWindowDimensions();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const gap = 12;
  const cw = (width - gap * 3) / 2;
  const maxH = cw * 1.45;
  const templates = useMemo(() => templatesFor(route.params.appType), [route.params.appType]);
  const categories = useMemo(() => ['All', ...new Set(templates.map((template) => template.category || template.name.split(' ')[0]))], [templates]);
  const galleryItems = useMemo(() => templates.map((template) => ({ template, design: createFromTemplate(template.id) })), [templates]);
  const items = useMemo(() => galleryItems
    .filter((item) => category === 'All' || item.template.category === category)
    .filter((item) => item.template.name.toLowerCase().includes(query.trim().toLowerCase()) || (item.template.category || '').toLowerCase().includes(query.trim().toLowerCase())), [galleryItems, category, query]);

  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item.template.id}
      numColumns={2}
      contentContainerStyle={{ padding: gap, paddingBottom: 24 }}
      columnWrapperStyle={{ gap }}
      ItemSeparatorComponent={() => <View style={{ height: gap }} />}
      ListHeaderComponent={(
        <View>
          <View style={{ minHeight: 48, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: C.border, borderRadius: 12, paddingHorizontal: 12, backgroundColor: '#fff', marginBottom: 12 }}>
            <Ionicons name="search" size={19} color={C.muted} />
            <TextInput accessibilityLabel="Search templates" value={query} onChangeText={setQuery} placeholder="Search templates" returnKeyType="search" style={{ flex: 1, minHeight: 44, marginLeft: 8, color: C.text }} />
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <Ionicons name="filter" size={18} color={C.muted} />
            <Text style={{ marginLeft: 5, color: C.muted, fontSize: 12, fontWeight: '700' }}>CATEGORY</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 10 }}>
            {categories.map((name) => (
              <TouchableOpacity key={name} accessibilityRole="button" accessibilityLabel={`Filter ${name}`} accessibilityState={{ selected: category === name }} onPress={() => setCategory(name)} style={{ minHeight: 44, paddingHorizontal: 12, borderRadius: 22, marginRight: 7, justifyContent: 'center', flexDirection: 'row', alignItems: 'center', backgroundColor: category === name ? C.primary : '#fff', borderWidth: 1, borderColor: category === name ? C.primary : C.border }}>
                <Ionicons name={category === name ? 'checkmark-circle' : 'pricetag-outline'} size={15} color={category === name ? '#fff' : C.text} />
                <Text style={{ marginLeft: 5, color: category === name ? '#fff' : C.text, fontSize: 12, fontWeight: '600' }}>{name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <Text style={{ color: C.muted, marginBottom: 10 }}>{items.length} of {templates.length} templates</Text>
        </View>
      )}
      ListEmptyComponent={<Empty icon="search-outline" title="No matching templates" sub="Try another search or category." />}
      renderItem={({ item }) => {
        const scale = Math.min(cw / item.design.width, maxH / item.design.height);
        return (
          <TouchableOpacity accessibilityRole="button" accessibilityLabel={`Open ${item.template.name} template`} style={{ width: cw }} onPress={() => navigation.navigate('Editor', { templateId: item.template.id })}>
            <View style={{ height: maxH, backgroundColor: '#E9EBF3', borderRadius: 12, alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderWidth: 1, borderColor: C.border }}>
              <DesignView design={item.design} scale={scale} />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}><Ionicons name="create-outline" size={14} color={C.primary} /><Text numberOfLines={1} style={{ marginLeft: 4, flex: 1, fontWeight: '700', color: C.text, fontSize: 13 }}>{item.template.name}</Text></View>
            <Text numberOfLines={1} style={{ color: C.muted, fontSize: 11, marginTop: 2 }}>{item.template.category}</Text>
          </TouchableOpacity>
        );
      }}
    />
  );
}
