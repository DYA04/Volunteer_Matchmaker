'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import { profileService, LocationResponse } from '@/lib/services/profile.service';

interface LocationSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  initialLocation?: LocationResponse;
}

export default function LocationSettings({
  isOpen,
  onClose,
  onSave,
  initialLocation,
}: LocationSettingsProps) {
  const [locationSource, setLocationSource] = useState<'gps' | 'manual'>('manual');
  const [manualLocation, setManualLocation] = useState('');
  const [maxDistance, setMaxDistance] = useState(25);
  const [locationLabel, setLocationLabel] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [gpsStatus, setGpsStatus] = useState<'idle' | 'requesting' | 'success' | 'denied'>('idle');

  useEffect(() => {
    if (initialLocation) {
      setLocationSource(initialLocation.location_source);
      setLocationLabel(initialLocation.location_label || initialLocation.display_location);
      setMaxDistance(initialLocation.max_distance_miles);
    }
  }, [initialLocation]);

  const handleUseGPS = async () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setGpsStatus('requesting');
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        setGpsStatus('success');
        try {
          setIsLoading(true);
          const result = await profileService.updateLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            location_source: 'gps',
            max_distance_miles: maxDistance,
          });
          setLocationLabel(result.location_label);
          setLocationSource('gps');
          onSave();
        } catch (err) {
          setError('Failed to update location');
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      },
      (err) => {
        setGpsStatus('denied');
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError('Location permission denied. You can enter your location manually below.');
            break;
          case err.POSITION_UNAVAILABLE:
            setError('Location unavailable. Please try again or enter manually.');
            break;
          case err.TIMEOUT:
            setError('Location request timed out. Please try again.');
            break;
          default:
            setError('Unable to get location. Please enter manually.');
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleManualSubmit = async () => {
    if (!manualLocation.trim()) {
      setError('Please enter a city, ZIP code, or address');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await profileService.updateLocation({
        location_source: 'manual',
        manual_location: manualLocation,
        max_distance_miles: maxDistance,
      });
      setLocationLabel(result.location_label);
      setLocationSource('manual');
      onSave();
      onClose();
    } catch (err) {
      setError('Could not find that location. Try a city name or ZIP code.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDistanceChange = async (newDistance: number) => {
    setMaxDistance(newDistance);
  };

  const handleSaveDistance = async () => {
    setIsLoading(true);
    try {
      await profileService.updateProfile({ max_distance_miles: maxDistance });
      onSave();
      onClose();
    } catch (err) {
      setError('Failed to save distance preference');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRevokeLocation = async () => {
    if (!confirm('Remove your location data? You can set it again anytime.')) return;

    setIsLoading(true);
    try {
      await profileService.revokeLocation();
      setLocationLabel('');
      setLocationSource('manual');
      onSave();
    } catch (err) {
      setError('Failed to remove location');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div
        className="bg-white rounded-xl p-6 max-w-lg w-full mx-4 shadow-xl max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Location Settings</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Current Location Display */}
        {locationLabel && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="font-medium text-green-800">Current Location</span>
            </div>
            <p className="text-green-700">{locationLabel}</p>
            <p className="text-xs text-green-600 mt-1">
              Source: {locationSource === 'gps' ? 'GPS' : 'Manual entry'}
            </p>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* GPS Button */}
        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-3">
            Share your location for better job matching. We only show your city/area, never exact coordinates.
          </p>
          <Button
            onClick={handleUseGPS}
            disabled={isLoading || gpsStatus === 'requesting'}
            className="w-full flex items-center justify-center gap-2"
          >
            {gpsStatus === 'requesting' ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Getting Location...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Use My Current Location
              </>
            )}
          </Button>
        </div>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">or enter manually</span>
          </div>
        </div>

        {/* Manual Location Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            City, ZIP code, or address
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={manualLocation}
              onChange={(e) => setManualLocation(e.target.value)}
              placeholder="e.g., Lansing, MI or 48823"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <Button onClick={handleManualSubmit} disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Set'}
            </Button>
          </div>
        </div>

        {/* Distance Slider */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Maximum distance willing to travel
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="1"
              max="100"
              value={maxDistance}
              onChange={(e) => handleDistanceChange(Number(e.target.value))}
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <span className="w-16 text-center font-medium text-gray-900">
              {maxDistance} mi
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            You&apos;ll only see opportunities within this distance
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-between">
          {locationLabel && (
            <button
              onClick={handleRevokeLocation}
              className="text-sm text-red-600 hover:text-red-700"
              disabled={isLoading}
            >
              Remove Location
            </button>
          )}
          <div className="flex gap-3 ml-auto">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSaveDistance} disabled={isLoading}>
              Save Preferences
            </Button>
          </div>
        </div>

        {/* Privacy Notice */}
        <div className="mt-6 p-3 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-1">Privacy Notice</h4>
          <p className="text-xs text-gray-500">
            Your exact coordinates are stored securely for distance calculations but are never shown publicly.
            Other users only see your city/area (e.g., &quot;Lansing, MI&quot;) and approximate distance.
            You can remove your location anytime.
          </p>
        </div>
      </div>
    </div>
  );
}
