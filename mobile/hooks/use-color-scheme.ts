import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';

export type ThemePreference = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'dealo.themePreference';

let hydrated = false;
let preference: ThemePreference = 'system';
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((l) => l());
}

async function hydrateOnce() {
  if (hydrated) return;
  hydrated = true;
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (raw === 'light' || raw === 'dark' || raw === 'system') {
      preference = raw;
      notify();
    }
  } catch {
    // ignore
  }
}

export async function setThemePreference(next: ThemePreference) {
  preference = next;
  notify();
  try {
    await AsyncStorage.setItem(STORAGE_KEY, next);
  } catch {
    // ignore
  }
}

export function getThemePreference(): ThemePreference {
  return preference;
}

export function useThemePreference(): ThemePreference {
  const [, force] = React.useState(0);

  React.useEffect(() => {
    hydrateOnce();
    const l = () => force((v) => v + 1);
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  }, []);

  return preference;
}

export function useColorScheme(): 'light' | 'dark' {
  const system = useSystemColorScheme() ?? 'light';
  const pref = useThemePreference();
  return pref === 'system' ? system : pref;
}
