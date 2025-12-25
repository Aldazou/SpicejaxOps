"use client";

/**
 * Settings Manager for n8n Configuration
 * Stores settings in localStorage
 */

export interface N8NSettings {
  n8nUrl: string;
  apiKey?: string;
}

const SETTINGS_KEY = 'spicejax_settings';

const DEFAULT_SETTINGS: N8NSettings = {
  n8nUrl: '',
  apiKey: '',
};

export function getSettings(): N8NSettings {
  if (typeof window === 'undefined') {
    return DEFAULT_SETTINGS;
  }

  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (stored) {
      return {
        ...DEFAULT_SETTINGS,
        ...(JSON.parse(stored) as N8NSettings),
      };
    }
  } catch (error) {
    console.error('Error loading settings:', error);
  }

  return DEFAULT_SETTINGS;
}

export function saveSettings(settings: N8NSettings): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    // Trigger a custom event so other components can react
    window.dispatchEvent(new CustomEvent('settingsChanged', { detail: settings }));
  } catch (error) {
    console.error('Error saving settings:', error);
  }
}

export function clearSettings(): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.removeItem(SETTINGS_KEY);
    window.dispatchEvent(new CustomEvent('settingsChanged', { detail: DEFAULT_SETTINGS }));
  } catch (error) {
    console.error('Error clearing settings:', error);
  }
}
