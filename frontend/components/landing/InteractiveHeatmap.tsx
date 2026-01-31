'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import {
  fetchHeatmapData,
  HeatmapResponse,
  HeatmapPoint,
  HeatmapZone,
  DEFAULT_CENTER,
  DEFAULT_ZOOM,
} from '@/lib/mock/heatmapData';

// Dynamically import the map component to avoid SSR issues with Leaflet
const MapContainer = dynamic(
  () => import('./HeatmapMap'),
  {
    ssr: false,
    loading: () => <MapLoadingPlaceholder />,
  }
);

function MapLoadingPlaceholder() {
  return (
    <div className="aspect-[16/9] md:aspect-[21/9] flex flex-col items-center justify-center bg-gray-100 rounded-lg animate-pulse">
      <div className="w-16 h-16 text-gray-300 mb-4">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
          />
        </svg>
      </div>
      <p className="text-gray-400 text-lg font-medium">Loading map...</p>
    </div>
  );
}

type ViewMode = 'all' | 'nearMe';

export default function InteractiveHeatmap() {
  const [viewMode, setViewMode] = useState<ViewMode>('all');
  const [heatmapData, setHeatmapData] = useState<HeatmapResponse | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLocating, setIsLocating] = useState(false);

  // Fetch initial data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchHeatmapData();
        setHeatmapData(data);
      } catch (error) {
        console.error('Failed to fetch heatmap data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // Request user location
  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      return;
    }

    setIsLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setIsLocating(false);
      },
      (error) => {
        let message = 'Unable to get your location';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = 'Location permission denied';
            break;
          case error.POSITION_UNAVAILABLE:
            message = 'Location information unavailable';
            break;
          case error.TIMEOUT:
            message = 'Location request timed out';
            break;
        }
        setLocationError(message);
        setIsLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // Cache for 5 minutes
      }
    );
  }, []);

  // Handle view mode change
  const handleViewModeChange = useCallback(
    async (mode: ViewMode) => {
      setViewMode(mode);
      setIsLoading(true);

      try {
        if (mode === 'nearMe') {
          if (!userLocation) {
            // Try to get location first
            requestLocation();
            setIsLoading(false);
            return;
          }
          const data = await fetchHeatmapData({ lat: userLocation.lat, lng: userLocation.lng, radius: 10 });
          setHeatmapData(data);
        } else {
          const data = await fetchHeatmapData();
          setHeatmapData(data);
        }
      } catch (error) {
        console.error('Failed to fetch heatmap data:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [userLocation, requestLocation]
  );

  // Refetch when user location becomes available and in "nearMe" mode
  useEffect(() => {
    if (userLocation && viewMode === 'nearMe') {
      handleViewModeChange('nearMe');
    }
  }, [userLocation, viewMode, handleViewModeChange]);

  // Compute map center
  const mapCenter = useMemo((): [number, number] => {
    if (viewMode === 'nearMe' && userLocation) {
      return [userLocation.lat, userLocation.lng];
    }
    return DEFAULT_CENTER;
  }, [viewMode, userLocation]);

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Volunteer Opportunities Near You
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore volunteer opportunities in your area with our interactive map.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
          <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1">
            <button
              onClick={() => handleViewModeChange('all')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'all'
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              All Activity
            </button>
            <button
              onClick={() => handleViewModeChange('nearMe')}
              disabled={isLocating}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                viewMode === 'nearMe'
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              } ${isLocating ? 'opacity-50 cursor-wait' : ''}`}
            >
              {isLocating ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Locating...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Near Me
                </>
              )}
            </button>
          </div>

          {locationError && viewMode === 'nearMe' && (
            <span className="text-sm text-red-500">{locationError}</span>
          )}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-6 text-sm">
          <span className="text-gray-600">Activity Level:</span>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded bg-green-500" />
            <span className="text-gray-700">Low</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded bg-orange-500" />
            <span className="text-gray-700">Medium</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded bg-red-500" />
            <span className="text-gray-700">High</span>
          </div>
        </div>

        {/* Map Container */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="aspect-[16/9] md:aspect-[21/9]">
            {isLoading && !heatmapData ? (
              <MapLoadingPlaceholder />
            ) : (
              <MapContainer
                center={mapCenter}
                zoom={viewMode === 'nearMe' ? 13 : DEFAULT_ZOOM}
                zones={heatmapData?.zones || []}
                points={heatmapData?.points || []}
                userLocation={userLocation}
                showUserLocation={viewMode === 'nearMe'}
              />
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Active Opportunities', value: heatmapData?.stats.totalOpportunities ?? '--' },
            { label: 'Organizations', value: heatmapData?.stats.totalOrganizations ?? '--' },
            { label: 'Volunteers Needed', value: heatmapData?.stats.totalVolunteersNeeded ?? '--' },
            { label: 'Cities Covered', value: heatmapData?.stats.citiesCovered ?? '--' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-lg p-4 text-center border border-gray-200 shadow-sm"
            >
              <div className="text-2xl font-bold text-primary">
                {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
              </div>
              <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
