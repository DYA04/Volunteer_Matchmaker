// Badge system types and mock data for the 4-track badge system

export type BadgeTrack = 'specialist' | 'firefighter' | 'anchor' | 'inclusionist';
export type BadgeLevel = 'bronze' | 'silver' | 'gold';

export interface TrackBadge {
  id: string;
  track: BadgeTrack;
  name: string;
  level: BadgeLevel;
  currentPoints: number;
  pointsToNextLevel: number;
  maxPoints: number; // Points needed for Gold
  description: string;
  earnedAt: string;
}

export interface BadgeData {
  badges: TrackBadge[];
  accessibilityChampion: boolean;
  accessibilityChampionEarnedAt?: string;
  totalPoints: number;
}

// Track metadata
export const TRACK_INFO: Record<BadgeTrack, {
  name: string;
  description: string;
  icon: string;
  color: { bg: string; text: string; border: string; gradient: string };
}> = {
  specialist: {
    name: 'Specialist',
    description: 'Deep expertise in specific volunteer areas',
    icon: 'star',
    color: {
      bg: 'bg-purple-50',
      text: 'text-purple-700',
      border: 'border-purple-200',
      gradient: 'from-purple-500 to-purple-600',
    },
  },
  firefighter: {
    name: 'Firefighter',
    description: 'Quick response to urgent volunteer needs',
    icon: 'fire',
    color: {
      bg: 'bg-red-50',
      text: 'text-red-700',
      border: 'border-red-200',
      gradient: 'from-red-500 to-orange-500',
    },
  },
  anchor: {
    name: 'Anchor',
    description: 'Consistent and reliable volunteer presence',
    icon: 'anchor',
    color: {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200',
      gradient: 'from-blue-500 to-blue-600',
    },
  },
  inclusionist: {
    name: 'Inclusionist',
    description: 'Champion of accessible and inclusive volunteering',
    icon: 'heart-handshake',
    color: {
      bg: 'bg-green-50',
      text: 'text-green-700',
      border: 'border-green-200',
      gradient: 'from-green-500 to-teal-500',
    },
  },
};

// Level metadata
export const LEVEL_INFO: Record<BadgeLevel, {
  name: string;
  minPoints: number;
  color: string;
  bgColor: string;
  borderColor: string;
}> = {
  bronze: {
    name: 'Bronze',
    minPoints: 0,
    color: 'text-amber-700',
    bgColor: 'bg-amber-100',
    borderColor: 'border-amber-300',
  },
  silver: {
    name: 'Silver',
    minPoints: 100,
    color: 'text-gray-600',
    bgColor: 'bg-gray-200',
    borderColor: 'border-gray-400',
  },
  gold: {
    name: 'Gold',
    minPoints: 250,
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-100',
    borderColor: 'border-yellow-400',
  },
};

// Helper to determine level from points
export function getLevelFromPoints(points: number): BadgeLevel {
  if (points >= LEVEL_INFO.gold.minPoints) return 'gold';
  if (points >= LEVEL_INFO.silver.minPoints) return 'silver';
  return 'bronze';
}

// Helper to get points needed for next level
export function getPointsToNextLevel(currentPoints: number): number {
  if (currentPoints >= LEVEL_INFO.gold.minPoints) return 0; // Already at max
  if (currentPoints >= LEVEL_INFO.silver.minPoints) {
    return LEVEL_INFO.gold.minPoints - currentPoints;
  }
  return LEVEL_INFO.silver.minPoints - currentPoints;
}

// Helper to get progress percentage within current level
export function getLevelProgress(currentPoints: number): number {
  const level = getLevelFromPoints(currentPoints);

  if (level === 'gold') return 100;

  if (level === 'silver') {
    const levelPoints = currentPoints - LEVEL_INFO.silver.minPoints;
    const levelRange = LEVEL_INFO.gold.minPoints - LEVEL_INFO.silver.minPoints;
    return Math.round((levelPoints / levelRange) * 100);
  }

  // Bronze
  const levelRange = LEVEL_INFO.silver.minPoints;
  return Math.round((currentPoints / levelRange) * 100);
}

// Mock badge data
export const mockBadgeData: BadgeData = {
  badges: [
    {
      id: 'badge-specialist',
      track: 'specialist',
      name: 'Specialist',
      level: 'silver',
      currentPoints: 175,
      pointsToNextLevel: 75,
      maxPoints: 250,
      description: 'Completed 15+ jobs in your specialty areas',
      earnedAt: '2024-10-15T00:00:00Z',
    },
    {
      id: 'badge-firefighter',
      track: 'firefighter',
      name: 'Firefighter',
      level: 'gold',
      currentPoints: 280,
      pointsToNextLevel: 0,
      maxPoints: 250,
      description: 'Responded to 25+ urgent requests within 24 hours',
      earnedAt: '2024-12-01T00:00:00Z',
    },
    {
      id: 'badge-anchor',
      track: 'anchor',
      name: 'Anchor',
      level: 'silver',
      currentPoints: 200,
      pointsToNextLevel: 50,
      maxPoints: 250,
      description: 'Maintained 95%+ reliability over 30+ commitments',
      earnedAt: '2024-11-01T00:00:00Z',
    },
    {
      id: 'badge-inclusionist',
      track: 'inclusionist',
      name: 'Inclusionist',
      level: 'bronze',
      currentPoints: 65,
      pointsToNextLevel: 35,
      maxPoints: 250,
      description: 'Supported 5+ accessibility-focused initiatives',
      earnedAt: '2024-09-20T00:00:00Z',
    },
  ],
  accessibilityChampion: true,
  accessibilityChampionEarnedAt: '2024-11-15T00:00:00Z',
  totalPoints: 720,
};

// Simulates API call to /badges
export async function fetchBadgeData(userId?: string): Promise<BadgeData> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return mockBadgeData;
}
