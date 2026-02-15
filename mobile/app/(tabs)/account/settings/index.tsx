import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { type Href, useRouter } from 'expo-router';

function FilterGlyph() {
  return (
    <View style={[styles.filterGlyph, styles.filterGlyphFlipped]}>
      <View style={[styles.filterLine, styles.filterLine1]} />
      <View style={[styles.filterLine, styles.filterLine2]} />
      <View style={[styles.filterLine, styles.filterLine3]} />
    </View>
  );
}

export default function Settings() {
  const router = useRouter();

  const settingsTiles = [
    { id: 'about', icon: 'information-circle-outline', name: 'About' },
    { id: 'preferences', icon: 'preferences', name: 'Preferences' },
    { id: 'account', icon: 'person-outline', name: 'Account & Login' },
    { id: 'privacy', icon: 'shield-outline', name: 'Privacy' },
    { id: 'notifications', icon: 'notifications-outline', name: 'Notifications' },
    { id: 'appearance', icon: 'color-palette-outline', name: 'Appearance' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.tilesContainer}>
          {settingsTiles.map((tile, index) => (
            <TouchableOpacity
              key={tile.id}
              style={styles.tile}
              onPress={() => {
                if (tile.id === 'about') router.push('/account/settings/about' as Href);
                if (tile.id === 'preferences') router.push('/account/settings/preferences' as Href);
                if (tile.id === 'account') router.push('/account/settings/accountLogin' as Href);
                if (tile.id === 'privacy') router.push('/account/settings/privacy' as Href);
                if (tile.id === 'notifications') router.push('/account/settings/notifications' as Href);
                if (tile.id === 'appearance') router.push('/account/settings/appearance' as Href);
              }}
            >
              {tile.id === 'preferences' ? <FilterGlyph /> : <Ionicons name={tile.icon as any} size={24} color="#000000" />}
              <Text style={styles.tileText}>{tile.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.bottomSection}>
          <TouchableOpacity style={styles.signOutTextButton}>
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
          <Text style={styles.versionText}>Version 1.0.0</Text>
          <View style={styles.linksRow}>
            <TouchableOpacity style={styles.linkButton}>
              <Text style={styles.linkText}>Terms</Text>
            </TouchableOpacity>
            <Text style={styles.separator}>•</Text>
            <TouchableOpacity style={styles.linkButton}>
              <Text style={styles.linkText}>Privacy</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  tilesContainer: {
    padding: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  tile: {
    width: '48%',
    height: 100,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tileText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
    textAlign: 'center',
    marginTop: 8,
  },
  bottomSection: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    marginTop: 20,
    alignItems: 'center',
  },
  signOutTextButton: {
    paddingVertical: 12,
  },
  signOutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  versionText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 16,
  },
  linksRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  linkButton: {
    paddingVertical: 4,
  },
  linkText: {
    fontSize: 14,
    color: '#6B7280',
  },
  separator: {
    fontSize: 14,
    color: '#6B7280',
    marginHorizontal: 12,
  },
  filterGlyph: {
    width: 18,
    height: 14,
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap: 2,
  },
  filterGlyphFlipped: {
    transform: [{ scaleX: -1 }],
  },
  filterLine: {
    height: 2,
    borderRadius: 0,
    backgroundColor: '#111827',
    opacity: 0.75,
  },
  filterLine1: {
    width: 18,
  },
  filterLine2: {
    width: 13,
  },
  filterLine3: {
    width: 10,
  },
});