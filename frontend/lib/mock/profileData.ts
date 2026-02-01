// Mock profile data mimicking /auth/me and /badges endpoints

export interface Badge {
  id: string;
  name: string;
  level: number; // 1-5
  maxLevel: number;
  track: 'community' | 'skills' | 'impact' | 'reliability';
  description: string;
  earnedAt: string;
  icon: string;
}

export interface SkillTag {
  id: string;
  name: string;
  verified: boolean;
  endorsements: number;
}

export interface RequesterStats {
  jobsSubmitted: number;
  jobsFulfilled: number;
  handshakeSuccessRate: number; // 0-100
  activeJobs: number;
  averageRating: number;
}

export interface HelperStats {
  jobsCompleted: number;
  hoursContributed: number;
  currentStreak: number;
  averageRating: number;
}

export interface AccessibilityPreferences {
  screenReaderOptimized: boolean;
  highContrast: boolean;
  reducedMotion: boolean;
  largeText: boolean;
  colorBlindMode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
}

export interface ImpactBulletPoint {
  id: string;
  text: string;
  category: 'community' | 'personal' | 'skills';
  generatedAt: string;
}

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  bio: string;
  location: string;
  joinedAt: string;
  requesterStats: RequesterStats;
  helperStats: HelperStats;
  badges: Badge[];
  skills: SkillTag[];
  accessibilityPreferences: AccessibilityPreferences;
  impactBulletPoints: ImpactBulletPoint[];
}

// Mock data
export const mockUserProfile: UserProfile = {
  id: 'user-123',
  email: 'alex.johnson@example.com',
  username: 'alexj',
  firstName: 'Alex',
  lastName: 'Johnson',
  avatar: undefined,
  bio: 'Passionate about making a difference in my community. Software developer by day, volunteer coordinator by heart. Always looking for ways to connect people with meaningful opportunities.',
  location: 'East Lansing, MI',
  joinedAt: '2024-03-15T00:00:00Z',
  requesterStats: {
    jobsSubmitted: 12,
    jobsFulfilled: 10,
    handshakeSuccessRate: 83,
    activeJobs: 2,
    averageRating: 4.8,
  },
  helperStats: {
    jobsCompleted: 28,
    hoursContributed: 156,
    currentStreak: 5,
    averageRating: 4.9,
  },
  badges: [
    {
      id: 'badge-1',
      name: 'Community Champion',
      level: 4,
      maxLevel: 5,
      track: 'community',
      description: 'Actively participated in 50+ community events',
      earnedAt: '2024-11-20T00:00:00Z',
      icon: 'users',
    },
    {
      id: 'badge-2',
      name: 'Skill Master',
      level: 3,
      maxLevel: 5,
      track: 'skills',
      description: 'Demonstrated expertise in 5+ skill areas',
      earnedAt: '2024-10-15T00:00:00Z',
      icon: 'star',
    },
    {
      id: 'badge-3',
      name: 'Impact Maker',
      level: 5,
      maxLevel: 5,
      track: 'impact',
      description: 'Made measurable impact in the community',
      earnedAt: '2024-12-01T00:00:00Z',
      icon: 'heart',
    },
    {
      id: 'badge-4',
      name: 'Reliable Helper',
      level: 4,
      maxLevel: 5,
      track: 'reliability',
      description: 'Maintained 95%+ completion rate over 20+ jobs',
      earnedAt: '2024-11-01T00:00:00Z',
      icon: 'check-circle',
    },
  ],
  skills: [
    { id: 'skill-1', name: 'Event Planning', verified: true, endorsements: 12 },
    { id: 'skill-2', name: 'Teaching', verified: true, endorsements: 8 },
    { id: 'skill-3', name: 'Food Service', verified: false, endorsements: 5 },
    { id: 'skill-4', name: 'First Aid', verified: true, endorsements: 15 },
    { id: 'skill-5', name: 'Transportation', verified: false, endorsements: 3 },
    { id: 'skill-6', name: 'Mentoring', verified: true, endorsements: 10 },
    { id: 'skill-7', name: 'Web Development', verified: true, endorsements: 7 },
  ],
  accessibilityPreferences: {
    screenReaderOptimized: false,
    highContrast: false,
    reducedMotion: false,
    largeText: false,
    colorBlindMode: 'none',
  },
  impactBulletPoints: [
    {
      id: 'impact-1',
      text: 'Helped serve 500+ meals at the Community Kitchen, supporting food-insecure families in the greater Lansing area.',
      category: 'community',
      generatedAt: '2024-12-15T00:00:00Z',
    },
    {
      id: 'impact-2',
      text: 'Mentored 8 high school students in STEM subjects, with 6 now pursuing college degrees in technology fields.',
      category: 'personal',
      generatedAt: '2024-12-15T00:00:00Z',
    },
    {
      id: 'impact-3',
      text: 'Contributed 40+ hours to Habitat for Humanity builds, helping complete 2 homes for families in need.',
      category: 'community',
      generatedAt: '2024-12-15T00:00:00Z',
    },
    {
      id: 'impact-4',
      text: 'Developed organizational skills and project management expertise through coordinating volunteer teams of 10-15 people.',
      category: 'skills',
      generatedAt: '2024-12-15T00:00:00Z',
    },
  ],
};

// Simulates API call to /auth/me
export async function fetchUserProfile(): Promise<UserProfile> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockUserProfile;
}

// Simulates API call to /badges
export async function fetchUserBadges(userId: string): Promise<Badge[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return mockUserProfile.badges;
}

// Simulates updating accessibility preferences
export async function updateAccessibilityPreferences(
  preferences: Partial<AccessibilityPreferences>
): Promise<AccessibilityPreferences> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return { ...mockUserProfile.accessibilityPreferences, ...preferences };
}
