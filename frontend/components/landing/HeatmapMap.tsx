'use client';

import { useEffect, useRef, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster';
import { HeatmapZone, HeatmapPoint } from '@/lib/mock/heatmapData';

// Fix for default marker icons in Leaflet with webpack
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface HeatmapMapProps {
  center: [number, number];
  zoom: number;
  zones: HeatmapZone[];
  points: HeatmapPoint[];
  userLocation: { lat: number; lng: number } | null;
  showUserLocation: boolean;
}

// Color mapping for activity levels
const ZONE_COLORS = {
  low: { fill: '#22c55e', stroke: '#16a34a' },      // green
  medium: { fill: '#f97316', stroke: '#ea580c' },   // orange
  high: { fill: '#ef4444', stroke: '#dc2626' },     // red
};

// Get marker color based on intensity
function getMarkerColor(intensity: number): string {
  if (intensity >= 0.7) return '#ef4444'; // red
  if (intensity >= 0.4) return '#f97316'; // orange
  return '#22c55e'; // green
}

// Create custom marker icon
function createMarkerIcon(intensity: number): L.DivIcon {
  const color = getMarkerColor(intensity);
  const size = 12 + intensity * 8; // Size varies with intensity (12-20px)

  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        background-color: ${color};
        border: 2px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        transition: transform 0.2s ease;
      "></div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

// Create user location icon
function createUserLocationIcon(): L.DivIcon {
  return L.divIcon({
    className: 'user-location-marker',
    html: `
      <div style="
        width: 20px;
        height: 20px;
        background-color: #3b82f6;
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 0 0 8px rgba(59, 130, 246, 0.2), 0 2px 4px rgba(0,0,0,0.3);
        animation: pulse 2s infinite;
      "></div>
      <style>
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 8px rgba(59, 130, 246, 0.2), 0 2px 4px rgba(0,0,0,0.3); }
          50% { box-shadow: 0 0 0 16px rgba(59, 130, 246, 0.1), 0 2px 4px rgba(0,0,0,0.3); }
        }
      </style>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
}

export default function HeatmapMap({
  center,
  zoom,
  zones,
  points,
  userLocation,
  showUserLocation,
}: HeatmapMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersClusterRef = useRef<L.MarkerClusterGroup | null>(null);
  const zonesLayerRef = useRef<L.LayerGroup | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center,
      zoom,
      zoomControl: true,
      scrollWheelZoom: true,
      doubleClickZoom: true,
      dragging: true,
    });

    // Add tile layer (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    // Create layer groups
    zonesLayerRef.current = L.layerGroup().addTo(map);
    markersClusterRef.current = L.markerClusterGroup({
      maxClusterRadius: 50,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
      disableClusteringAtZoom: 16,
      iconCreateFunction: (cluster) => {
        const count = cluster.getChildCount();
        const markers = cluster.getAllChildMarkers();
        const avgIntensity = markers.reduce((sum, m) => {
          const intensity = (m.options as { intensity?: number }).intensity || 0;
          return sum + intensity;
        }, 0) / markers.length;

        const color = getMarkerColor(avgIntensity);
        const size = count < 10 ? 30 : count < 50 ? 40 : 50;

        return L.divIcon({
          html: `
            <div style="
              width: ${size}px;
              height: ${size}px;
              background-color: ${color};
              border: 3px solid white;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-weight: bold;
              font-size: ${size < 40 ? '12px' : '14px'};
              box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            ">${count}</div>
          `,
          className: 'marker-cluster-custom',
          iconSize: L.point(size, size),
        });
      },
    }).addTo(map);

    mapInstanceRef.current = map;

    // Cleanup
    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update map center and zoom
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.setView(center, zoom, { animate: true, duration: 0.5 });
  }, [center, zoom]);

  // Render zones
  useEffect(() => {
    if (!zonesLayerRef.current) return;

    zonesLayerRef.current.clearLayers();

    zones.forEach((zone) => {
      const colors = ZONE_COLORS[zone.properties.activityLevel];

      // Convert coordinates from GeoJSON format [lng, lat] to Leaflet format [lat, lng]
      const latLngs = zone.geometry.coordinates[0].map(
        (coord) => [coord[1], coord[0]] as [number, number]
      );

      const polygon = L.polygon(latLngs, {
        color: colors.stroke,
        fillColor: colors.fill,
        fillOpacity: 0.25,
        weight: 2,
      });

      polygon.bindPopup(`
        <div style="min-width: 180px;">
          <h3 style="font-weight: bold; font-size: 14px; margin-bottom: 8px;">${zone.properties.name}</h3>
          <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">
            <span style="
              display: inline-block;
              padding: 2px 8px;
              border-radius: 9999px;
              font-size: 11px;
              font-weight: 500;
              color: white;
              background-color: ${colors.fill};
            ">${zone.properties.activityLevel.toUpperCase()} ACTIVITY</span>
          </div>
          <p style="font-size: 13px; color: #666; margin: 4px 0;">
            <strong>${zone.properties.opportunityCount}</strong> opportunities
          </p>
          <p style="font-size: 13px; color: #666; margin: 4px 0;">
            <strong>${zone.properties.volunteersNeeded}</strong> volunteers needed
          </p>
          <p style="font-size: 12px; color: #888; margin-top: 8px;">
            ${zone.properties.topCategories.join(' • ')}
          </p>
        </div>
      `);

      zonesLayerRef.current!.addLayer(polygon);
    });
  }, [zones]);

  // Render points with clustering
  useEffect(() => {
    if (!markersClusterRef.current) return;

    markersClusterRef.current.clearLayers();

    points.forEach((point) => {
      const marker = L.marker([point.lat, point.lng], {
        icon: createMarkerIcon(point.intensity),
        // Store intensity for cluster calculation
        ...({ intensity: point.intensity } as L.MarkerOptions),
      });

      marker.bindPopup(`
        <div style="min-width: 200px;">
          <h3 style="font-weight: bold; font-size: 14px; margin-bottom: 4px;">${point.title}</h3>
          <p style="
            display: inline-block;
            padding: 2px 8px;
            border-radius: 9999px;
            font-size: 11px;
            background-color: #f3f4f6;
            color: #4b5563;
            margin-bottom: 8px;
          ">${point.category}</p>
          <p style="font-size: 13px; color: #666; margin-top: 8px;">
            <strong>${point.volunteersNeeded}</strong> volunteers needed
          </p>
        </div>
      `);

      markersClusterRef.current!.addLayer(marker);
    });
  }, [points]);

  // User location marker
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Remove existing user marker
    if (userMarkerRef.current) {
      userMarkerRef.current.remove();
      userMarkerRef.current = null;
    }

    // Add user location marker if available and should show
    if (userLocation && showUserLocation) {
      userMarkerRef.current = L.marker([userLocation.lat, userLocation.lng], {
        icon: createUserLocationIcon(),
        zIndexOffset: 1000,
      })
        .addTo(mapInstanceRef.current)
        .bindPopup('<strong>Your Location</strong>');
    }
  }, [userLocation, showUserLocation]);

  return <div ref={mapRef} className="w-full h-full" />;
}
