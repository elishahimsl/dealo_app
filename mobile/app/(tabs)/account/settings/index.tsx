import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export default function Settings() {
  const router = useRouter();

  const settingsTiles = [
    { id: 'notifications', icon: 'notifications-outline', name: 'Notifications' },
    { id: 'personalization', icon: 'palette-outline', name: 'Personalization' },
    { id: 'account', icon: 'person-outline', name: 'Account and Login' },
    { id: 'privacy', icon: 'shield-outline', name: 'Data and Privacy' },
    { id: 'appearance', icon: 'color-palette-outline', name: 'Appearance' },
    { id: 'help', icon: 'help-circle-outline', name: 'Help Center' },
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
            <TouchableOpacity key={tile.id} style={styles.tile}>
              <Ionicons name={tile.icon as any} size={24} color="#000000" />
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
});