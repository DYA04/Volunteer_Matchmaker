export interface Job {
  id: string;
  title: string;
  short_description: string;
  description: string;
  skill_tags: string[];
  location_label: string;  // Privacy-safe location display (e.g., "Lansing, MI")
  shift_start: string;
  shift_end: string;
  is_urgent: boolean;
  distance: number | null;
  distance_display: string | null;  // Formatted distance (e.g., "~5 mi")
  score: number;
  poster_username: string;
  accessibility_requirements: string[];
  status: 'open' | 'filled' | 'cancelled' | 'completed';
}

export interface MatchingInterestPayload {
  job_id: string;
  interested: boolean;
}

export interface MatchingInterestResponse {
  status: string;
  created: boolean;
}
