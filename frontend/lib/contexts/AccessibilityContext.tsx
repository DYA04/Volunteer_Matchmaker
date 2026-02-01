'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

export interface AccessibilityPreferences {
  screenReaderOptimized: boolean;
  highContrast: boolean;
  reducedMotion: boolean;
  largeText: boolean;
  colorBlindMode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
}

const DEFAULT_PREFERENCES: AccessibilityPreferences = {
  screenReaderOptimized: false,
  highContrast: false,
  reducedMotion: false,
  largeText: false,
  colorBlindMode: 'none',
};

const STORAGE_KEY = 'accessibility-preferences';

interface AccessibilityContextType {
  preferences: AccessibilityPreferences;
  updatePreference: <K extends keyof AccessibilityPreferences>(
    key: K,
    value: AccessibilityPreferences[K]
  ) => void;
  updatePreferences: (updates: Partial<AccessibilityPreferences>) => void;
  resetPreferences: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | null>(null);

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider');
  }
  return context;
}

// Helper to safely access localStorage
function getStoredPreferences(): AccessibilityPreferences {
  if (typeof window === 'undefined') return DEFAULT_PREFERENCES;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...DEFAULT_PREFERENCES, ...JSON.parse(stored) };
    }
  } catch (e) {
    console.warn('Failed to load accessibility preferences:', e);
  }
  return DEFAULT_PREFERENCES;
}

function savePreferences(prefs: AccessibilityPreferences): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch (e) {
    console.warn('Failed to save accessibility preferences:', e);
  }
}

// Apply CSS classes to document
function applyPreferencesToDOM(prefs: AccessibilityPreferences): void {
  if (typeof document === 'undefined') return;

  const html = document.documentElement;
  const body = document.body;

  // High Contrast
  html.classList.toggle('high-contrast', prefs.highContrast);

  // Reduced Motion
  html.classList.toggle('reduced-motion', prefs.reducedMotion);

  // Large Text
  html.classList.toggle('large-text', prefs.largeText);

  // Screen Reader Optimized
  html.classList.toggle('sr-optimized', prefs.screenReaderOptimized);

  // Color Blind Mode
  html.classList.remove('colorblind-protanopia', 'colorblind-deuteranopia', 'colorblind-tritanopia');
  if (prefs.colorBlindMode !== 'none') {
    html.classList.add(`colorblind-${prefs.colorBlindMode}`);
  }

  // Also set data attribute for more specific CSS targeting
  html.dataset.colorblindMode = prefs.colorBlindMode;
}

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [preferences, setPreferences] = useState<AccessibilityPreferences>(DEFAULT_PREFERENCES);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = getStoredPreferences();
    setPreferences(stored);
    applyPreferencesToDOM(stored);
    setIsHydrated(true);
  }, []);

  // Apply changes to DOM whenever preferences change
  useEffect(() => {
    if (isHydrated) {
      applyPreferencesToDOM(preferences);
      savePreferences(preferences);
    }
  }, [preferences, isHydrated]);

  // Also respect system preference for reduced motion
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const handleChange = (e: MediaQueryListEvent) => {
      if (e.matches && !preferences.reducedMotion) {
        // System prefers reduced motion, suggest enabling it
        console.log('System prefers reduced motion');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [preferences.reducedMotion]);

  const updatePreference = useCallback(<K extends keyof AccessibilityPreferences>(
    key: K,
    value: AccessibilityPreferences[K]
  ) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  }, []);

  const updatePreferences = useCallback((updates: Partial<AccessibilityPreferences>) => {
    setPreferences(prev => ({ ...prev, ...updates }));
  }, []);

  const resetPreferences = useCallback(() => {
    setPreferences(DEFAULT_PREFERENCES);
  }, []);

  return (
    <AccessibilityContext.Provider
      value={{
        preferences,
        updatePreference,
        updatePreferences,
        resetPreferences,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}
