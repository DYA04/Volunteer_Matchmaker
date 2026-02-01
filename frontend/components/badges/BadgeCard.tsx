'use client';

import {
  TrackBadge,
  BadgeData,
  TRACK_INFO,
  LEVEL_INFO,
  getLevelProgress,
} from '@/lib/mock/badgeData';

// Track icons
function TrackIcon({ track, className = 'w-6 h-6' }: { track: string; className?: string }) {
  const icons: Record<string, React.ReactNode> = {
    star: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
    fire: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
      </svg>
    ),
    anchor: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8V4m0 4a2 2 0 100-4 2 2 0 000 4zm0 0v12m0 0c-4.418 0-8-1.79-8-4m8 4c4.418 0 8-1.79 8-4M4 16c0-2.21 3.582-4 8-4s8 1.79 8 4" />
      </svg>
    ),
    'heart-handshake': (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  };

  return <>{icons[track] || icons.star}</>;
}

// Level badge component
function LevelBadge({ level, size = 'md' }: { level: string; size?: 'sm' | 'md' }) {
  const levelInfo = LEVEL_INFO[level as keyof typeof LEVEL_INFO];
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm';

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full ${levelInfo.bgColor} ${levelInfo.color} ${levelInfo.borderColor} border ${sizeClasses}`}
    >
      {levelInfo.name}
    </span>
  );
}

// Single badge card - Compact variant
interface BadgeCardCompactProps {
  badge: TrackBadge;
  className?: string;
}

export function BadgeCardCompact({ badge, className = '' }: BadgeCardCompactProps) {
  const trackInfo = TRACK_INFO[badge.track];
  const progress = getLevelProgress(badge.currentPoints);

  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-lg border ${trackInfo.color.border} ${trackInfo.color.bg} ${className}`}
    >
      <div className={`p-2 rounded-lg bg-white ${trackInfo.color.text}`}>
        <TrackIcon track={trackInfo.icon} className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className={`font-medium ${trackInfo.color.text} truncate`}>
            {trackInfo.name}
          </span>
          <LevelBadge level={badge.level} size="sm" />
        </div>
        <div className="mt-1.5">
          <div className="h-1.5 bg-white rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${trackInfo.color.gradient} transition-all duration-500`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Single badge card - Expanded variant
interface BadgeCardExpandedProps {
  badge: TrackBadge;
  className?: string;
}

export function BadgeCardExpanded({ badge, className = '' }: BadgeCardExpandedProps) {
  const trackInfo = TRACK_INFO[badge.track];
  const progress = getLevelProgress(badge.currentPoints);
  const isMaxLevel = badge.level === 'gold';

  return (
    <div
      className={`p-5 rounded-xl border ${trackInfo.color.border} ${trackInfo.color.bg} ${className}`}
    >
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-xl bg-white shadow-sm ${trackInfo.color.text}`}>
          <TrackIcon track={trackInfo.icon} className="w-7 h-7" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <h4 className={`text-lg font-semibold ${trackInfo.color.text}`}>
              {trackInfo.name}
            </h4>
            <LevelBadge level={badge.level} />
          </div>
          <p className="text-sm text-gray-600 mt-1">{badge.description}</p>

          {/* Progress section */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm mb-1.5">
              <span className="text-gray-600">
                {isMaxLevel ? 'Max level reached!' : `${badge.pointsToNextLevel} points to next level`}
              </span>
              <span className={`font-medium ${trackInfo.color.text}`}>
                {badge.currentPoints} pts
              </span>
            </div>
            <div className="h-2.5 bg-white rounded-full overflow-hidden shadow-inner">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${trackInfo.color.gradient} transition-all duration-500`}
                style={{ width: `${progress}%` }}
              />
            </div>
            {/* Level markers */}
            <div className="flex justify-between mt-1 text-xs text-gray-400">
              <span>Bronze</span>
              <span>Silver</span>
              <span>Gold</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Accessibility Champion badge
interface AccessibilityChampionBadgeProps {
  earnedAt?: string;
  variant?: 'compact' | 'expanded';
  className?: string;
}

export function AccessibilityChampionBadge({
  earnedAt,
  variant = 'expanded',
  className = '',
}: AccessibilityChampionBadgeProps) {
  const earnedDate = earnedAt
    ? new Date(earnedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : null;

  if (variant === 'compact') {
    return (
      <div
        className={`flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-primary to-orange-500 text-white ${className}`}
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        <span className="font-semibold text-sm">Accessibility Champion</span>
      </div>
    );
  }

  return (
    <div
      className={`p-5 rounded-xl bg-gradient-to-br from-primary via-orange-500 to-yellow-500 text-white shadow-lg ${className}`}
    >
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm">
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="flex-1">
          <h4 className="text-xl font-bold">Accessibility Champion</h4>
          <p className="text-white/90 text-sm mt-1">
            Recognized for outstanding commitment to inclusive volunteering and accessibility advocacy.
          </p>
          {earnedDate && (
            <p className="text-white/70 text-xs mt-3">
              Earned {earnedDate}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// Combined badge display component
interface BadgeDisplayProps {
  badgeData: BadgeData;
  variant?: 'compact' | 'expanded';
  showAccessibilityChampion?: boolean;
  className?: string;
}

export default function BadgeDisplay({
  badgeData,
  variant = 'expanded',
  showAccessibilityChampion = true,
  className = '',
}: BadgeDisplayProps) {
  const { badges, accessibilityChampion, accessibilityChampionEarnedAt } = badgeData;

  if (variant === 'compact') {
    return (
      <div className={`space-y-2 ${className}`}>
        {showAccessibilityChampion && accessibilityChampion && (
          <AccessibilityChampionBadge
            earnedAt={accessibilityChampionEarnedAt}
            variant="compact"
          />
        )}
        <div className="grid grid-cols-2 gap-2">
          {badges.map((badge) => (
            <BadgeCardCompact key={badge.id} badge={badge} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {showAccessibilityChampion && accessibilityChampion && (
        <AccessibilityChampionBadge
          earnedAt={accessibilityChampionEarnedAt}
          variant="expanded"
        />
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {badges.map((badge) => (
          <BadgeCardExpanded key={badge.id} badge={badge} />
        ))}
      </div>
    </div>
  );
}
