// Mock GeoJSON data mimicking Person 2's /heatmap API response
// Activity levels: 'low' | 'medium' | 'high'

export interface HeatmapZone {
  id: string;
  type: 'Feature';
  properties: {
    name: string;
    activityLevel: 'low' | 'medium' | 'high';
    opportunityCount: number;
    volunteersNeeded: number;
    topCategories: string[];
  };
  geometry: {
    type: 'Polygon';
    coordinates: number[][][];
  };
}

export interface HeatmapPoint {
  id: string;
  lat: number;
  lng: number;
  intensity: number; // 0-1 scale
  title: string;
  category: string;
  volunteersNeeded: number;
}

export interface HeatmapResponse {
  zones: HeatmapZone[];
  points: HeatmapPoint[];
  stats: {
    totalOpportunities: number;
    totalOrganizations: number;
    totalVolunteersNeeded: number;
    citiesCovered: number;
  };
}

// Default center: East Lansing, MI (near Michigan State University for SpartaHack)
export const DEFAULT_CENTER: [number, number] = [42.7370, -84.4839];
export const DEFAULT_ZOOM = 12;

// Mock zones representing different areas with varying activity levels
export const mockHeatmapData: HeatmapResponse = {
  zones: [
    {
      id: 'zone-1',
      type: 'Feature',
      properties: {
        name: 'Downtown East Lansing',
        activityLevel: 'high',
        opportunityCount: 45,
        volunteersNeeded: 120,
        topCategories: ['Food Bank', 'Education', 'Community'],
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-84.4950, 42.7420],
          [-84.4800, 42.7420],
          [-84.4800, 42.7320],
          [-84.4950, 42.7320],
          [-84.4950, 42.7420],
        ]],
      },
    },
    {
      id: 'zone-2',
      type: 'Feature',
      properties: {
        name: 'MSU Campus Area',
        activityLevel: 'high',
        opportunityCount: 62,
        volunteersNeeded: 180,
        topCategories: ['Education', 'Research', 'Mentoring'],
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-84.4900, 42.7300],
          [-84.4700, 42.7300],
          [-84.4700, 42.7150],
          [-84.4900, 42.7150],
          [-84.4900, 42.7300],
        ]],
      },
    },
    {
      id: 'zone-3',
      type: 'Feature',
      properties: {
        name: 'Lansing Downtown',
        activityLevel: 'medium',
        opportunityCount: 28,
        volunteersNeeded: 75,
        topCategories: ['Healthcare', 'Homeless Services', 'Legal Aid'],
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-84.5600, 42.7350],
          [-84.5400, 42.7350],
          [-84.5400, 42.7200],
          [-84.5600, 42.7200],
          [-84.5600, 42.7350],
        ]],
      },
    },
    {
      id: 'zone-4',
      type: 'Feature',
      properties: {
        name: 'Old Town Lansing',
        activityLevel: 'medium',
        opportunityCount: 18,
        volunteersNeeded: 45,
        topCategories: ['Arts', 'Community Events', 'Youth Programs'],
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-84.5500, 42.7500],
          [-84.5350, 42.7500],
          [-84.5350, 42.7400],
          [-84.5500, 42.7400],
          [-84.5500, 42.7500],
        ]],
      },
    },
    {
      id: 'zone-5',
      type: 'Feature',
      properties: {
        name: 'Okemos',
        activityLevel: 'low',
        opportunityCount: 12,
        volunteersNeeded: 30,
        topCategories: ['Senior Care', 'Library', 'Parks'],
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-84.4300, 42.7250],
          [-84.4100, 42.7250],
          [-84.4100, 42.7100],
          [-84.4300, 42.7100],
          [-84.4300, 42.7250],
        ]],
      },
    },
    {
      id: 'zone-6',
      type: 'Feature',
      properties: {
        name: 'Haslett',
        activityLevel: 'low',
        opportunityCount: 8,
        volunteersNeeded: 20,
        topCategories: ['Environment', 'Animal Shelter', 'Youth Sports'],
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-84.4100, 42.7550],
          [-84.3900, 42.7550],
          [-84.3900, 42.7400],
          [-84.4100, 42.7400],
          [-84.4100, 42.7550],
        ]],
      },
    },
  ],
  points: [
    // High activity area points (Downtown East Lansing)
    { id: 'p1', lat: 42.7370, lng: -84.4839, intensity: 0.9, title: 'Food Bank of South Michigan', category: 'Food Bank', volunteersNeeded: 15 },
    { id: 'p2', lat: 42.7385, lng: -84.4855, intensity: 0.85, title: 'East Lansing Public Library', category: 'Education', volunteersNeeded: 8 },
    { id: 'p3', lat: 42.7360, lng: -84.4870, intensity: 0.8, title: 'Community Kitchen', category: 'Food Bank', volunteersNeeded: 12 },
    { id: 'p4', lat: 42.7395, lng: -84.4825, intensity: 0.75, title: 'Youth Mentoring Center', category: 'Education', volunteersNeeded: 20 },
    { id: 'p5', lat: 42.7350, lng: -84.4890, intensity: 0.88, title: 'Habitat for Humanity', category: 'Housing', volunteersNeeded: 25 },

    // MSU Campus points
    { id: 'p6', lat: 42.7230, lng: -84.4810, intensity: 0.95, title: 'MSU Service Learning', category: 'Education', volunteersNeeded: 30 },
    { id: 'p7', lat: 42.7250, lng: -84.4780, intensity: 0.82, title: 'STEM Outreach Program', category: 'Education', volunteersNeeded: 15 },
    { id: 'p8', lat: 42.7210, lng: -84.4850, intensity: 0.78, title: 'Campus Food Pantry', category: 'Food Bank', volunteersNeeded: 10 },
    { id: 'p9', lat: 42.7270, lng: -84.4750, intensity: 0.7, title: 'Research Volunteer Program', category: 'Research', volunteersNeeded: 8 },

    // Lansing Downtown points
    { id: 'p10', lat: 42.7280, lng: -84.5520, intensity: 0.65, title: 'City Rescue Mission', category: 'Homeless Services', volunteersNeeded: 18 },
    { id: 'p11', lat: 42.7300, lng: -84.5480, intensity: 0.6, title: 'Free Legal Clinic', category: 'Legal Aid', volunteersNeeded: 5 },
    { id: 'p12', lat: 42.7260, lng: -84.5500, intensity: 0.55, title: 'Downtown Health Center', category: 'Healthcare', volunteersNeeded: 12 },

    // Old Town points
    { id: 'p13', lat: 42.7450, lng: -84.5420, intensity: 0.5, title: 'Arts Council', category: 'Arts', volunteersNeeded: 8 },
    { id: 'p14', lat: 42.7470, lng: -84.5400, intensity: 0.45, title: 'Youth Theater', category: 'Arts', volunteersNeeded: 10 },

    // Okemos points
    { id: 'p15', lat: 42.7180, lng: -84.4200, intensity: 0.35, title: 'Senior Center', category: 'Senior Care', volunteersNeeded: 6 },
    { id: 'p16', lat: 42.7200, lng: -84.4150, intensity: 0.3, title: 'Meridian Library', category: 'Library', volunteersNeeded: 4 },

    // Haslett points
    { id: 'p17', lat: 42.7480, lng: -84.4000, intensity: 0.25, title: 'Lake Lansing Park', category: 'Environment', volunteersNeeded: 8 },
    { id: 'p18', lat: 42.7500, lng: -84.3950, intensity: 0.2, title: 'Animal Rescue', category: 'Animal Shelter', volunteersNeeded: 5 },
  ],
  stats: {
    totalOpportunities: 173,
    totalOrganizations: 48,
    totalVolunteersNeeded: 470,
    citiesCovered: 6,
  },
};

// Simulates API call - replace with actual API call when backend is ready
export async function fetchHeatmapData(nearMe?: { lat: number; lng: number; radius?: number }): Promise<HeatmapResponse> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  if (nearMe) {
    // Filter points within radius (default 5km)
    const radius = nearMe.radius || 5;
    const filteredPoints = mockHeatmapData.points.filter((point) => {
      const distance = getDistanceKm(nearMe.lat, nearMe.lng, point.lat, point.lng);
      return distance <= radius;
    });

    // Recalculate stats based on filtered points
    const totalVolunteersNeeded = filteredPoints.reduce((sum, p) => sum + p.volunteersNeeded, 0);

    return {
      ...mockHeatmapData,
      points: filteredPoints,
      stats: {
        totalOpportunities: filteredPoints.length,
        totalOrganizations: Math.ceil(filteredPoints.length * 0.6),
        totalVolunteersNeeded,
        citiesCovered: 1,
      },
    };
  }

  return mockHeatmapData;
}

// Haversine formula for distance calculation
function getDistanceKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}
