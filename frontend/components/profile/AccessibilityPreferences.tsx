'use client';

import { useState } from 'react';
import { useAccessibility, AccessibilityPreferences as AccessibilityPrefsType } from '@/lib/contexts/AccessibilityContext';

export default function AccessibilityPreferences() {
  const { preferences, updatePreference, resetPreferences } = useAccessibility();
  const [isExpanded, setIsExpanded] = useState(false);

  const togglePreference = (key: keyof Omit<AccessibilityPrefsType, 'colorBlindMode'>) => {
    updatePreference(key, !preferences[key]);
  };

  const setColorBlindMode = (mode: AccessibilityPrefsType['colorBlindMode']) => {
    updatePreference('colorBlindMode', mode);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
        aria-expanded={isExpanded}
        aria-controls="accessibility-panel"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-100 rounded-lg text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-gray-900">Accessibility Preferences</h3>
            <p className="text-sm text-gray-500">Customize your experience</p>
          </div>
        </div>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isExpanded && (
        <div id="accessibility-panel" className="px-6 pb-6 border-t border-gray-100">
          <div className="space-y-4 mt-4">
            {/* Active Preferences Indicator */}
            {(preferences.highContrast || preferences.reducedMotion || preferences.largeText || preferences.screenReaderOptimized || preferences.colorBlindMode !== 'none') && (
              <div className="flex items-center justify-between py-2 px-3 bg-green-50 border border-green-200 rounded-lg">
                <span className="text-sm text-green-700 font-medium">
                  Accessibility features active
                </span>
                <button
                  onClick={resetPreferences}
                  className="text-xs text-green-600 hover:text-green-800 underline"
                >
                  Reset all
                </button>
              </div>
            )}

            {/* Toggle Options */}
            {[
              {
                key: 'screenReaderOptimized' as const,
                label: 'Screen Reader Optimized',
                description: 'Enhanced focus indicators and ARIA support',
              },
              {
                key: 'highContrast' as const,
                label: 'High Contrast',
                description: 'Increase contrast for better visibility',
              },
              {
                key: 'reducedMotion' as const,
                label: 'Reduced Motion',
                description: 'Minimize animations and transitions',
              },
              {
                key: 'largeText' as const,
                label: 'Large Text',
                description: 'Increase text size throughout the app',
              },
            ].map((option) => (
              <div key={option.key} className="flex items-center justify-between py-2">
                <div>
                  <label
                    htmlFor={`toggle-${option.key}`}
                    className="font-medium text-gray-900 cursor-pointer"
                  >
                    {option.label}
                  </label>
                  <p className="text-sm text-gray-500">{option.description}</p>
                </div>
                <button
                  id={`toggle-${option.key}`}
                  role="switch"
                  aria-checked={preferences[option.key]}
                  onClick={() => togglePreference(option.key)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                    preferences[option.key] ? 'bg-primary' : 'bg-gray-200'
                  }`}
                >
                  <span className="sr-only">
                    {preferences[option.key] ? 'Disable' : 'Enable'} {option.label}
                  </span>
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                      preferences[option.key] ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}

            {/* Color Blind Mode Select */}
            <div className="py-2">
              <label htmlFor="colorblind-select" className="font-medium text-gray-900 mb-1 block">
                Color Blind Mode
              </label>
              <p className="text-sm text-gray-500 mb-3">Adjust colors for color vision deficiency</p>
              <select
                id="colorblind-select"
                value={preferences.colorBlindMode}
                onChange={(e) => setColorBlindMode(e.target.value as AccessibilityPrefsType['colorBlindMode'])}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="none">None</option>
                <option value="protanopia">Protanopia (Red-blind)</option>
                <option value="deuteranopia">Deuteranopia (Green-blind)</option>
                <option value="tritanopia">Tritanopia (Blue-blind)</option>
              </select>
            </div>

            {/* Info notice */}
            <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-lg">
              <p className="text-xs text-blue-700">
                Changes are saved automatically and will persist across sessions.
                These preferences apply to all pages in the app.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
