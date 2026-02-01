'use client';

import {
  VolunteerRank as VolunteerRankType,
  RANK_INFO,
  getRankFromPoints,
  getRankProgress,
  getPointsToNextRank,
} from '@/lib/mock/badgeData';

const RANK_ORDER: VolunteerRankType[] = ['bronze', 'silver', 'gold', 'platinum', 'diamond'];

// Unique SVG elements for each rank icon
const RANK_ICONS: Record<VolunteerRankType, { content: React.ReactNode; stroke: boolean }> = {
  // Shield (filled so it renders at all sizes)
  bronze: {
    content: (
      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-1.5 12.06l-3.18-3.18 1.42-1.42L10.5 10.22l4.76-4.76 1.42 1.42-6.18 6.18z" />
    ),
    stroke: false,
  },
  // Medal with ribbon
  silver: {
    content: (
      <>
        <circle cx="12" cy="8" r="6" />
        <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
      </>
    ),
    stroke: false,
  },
  // Trophy
  gold: {
    content: <path d="M6 9H4.5a2.5 2.5 0 010-5H6m12 5h1.5a2.5 2.5 0 000-5H18M4 22h16M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20 7 22m10 0c0-2-.85-3.25-2.03-3.79A1.07 1.07 0 0114 17v-2.34M18 2H6v7a6 6 0 1012 0V2z" />,
    stroke: true,
  },
  // Crown
  platinum: {
    content: <path d="M2 20h20L19 9l-4 5-3-7-3 7-4-5-3 11zM2 20h20v2H2v-2z" />,
    stroke: false,
  },
  // Diamond (gem with facets)
  diamond: {
    content: <path d="M6 3h12l4 6-10 13L2 9l4-6zm0 0l6 6m6-6l-6 6m-8 0h16M12 9v13" />,
    stroke: true,
  },
};

function RankIcon({ rank, size = 'sm', unlocked }: { rank: VolunteerRankType; size?: 'sm' | 'lg'; unlocked: boolean }) {
  const info = RANK_INFO[rank];
  const dim = size === 'lg' ? 'w-12 h-12' : 'w-8 h-8';
  const iconDim = size === 'lg' ? 'w-7 h-7' : 'w-4 h-4';
  const { content, stroke } = RANK_ICONS[rank];

  return (
    <div
      className={`${dim} rounded-full flex items-center justify-center border-2 ${
        unlocked
          ? `bg-gradient-to-br ${info.color.gradient} border-white shadow-md`
          : 'bg-gray-100 border-gray-200'
      }`}
    >
      <svg
        className={`${iconDim} ${unlocked ? 'text-white' : 'text-gray-400'}`}
        fill={stroke ? 'none' : 'currentColor'}
        stroke={stroke ? 'currentColor' : 'none'}
        strokeWidth={stroke ? 1.5 : undefined}
        strokeLinecap={stroke ? 'round' : undefined}
        strokeLinejoin={stroke ? 'round' : undefined}
        viewBox="0 0 24 24"
      >
        {content}
      </svg>
    </div>
  );
}

interface VolunteerRankProps {
  totalPoints: number;
}

export default function VolunteerRank({ totalPoints }: VolunteerRankProps) {
  const currentRank = getRankFromPoints(totalPoints);
  const progress = getRankProgress(totalPoints);
  const pointsToNext = getPointsToNextRank(totalPoints);
  const info = RANK_INFO[currentRank];
  const isMaxRank = currentRank === 'diamond';
  const currentRankIndex = RANK_ORDER.indexOf(currentRank);

  return (
    <div className={`rounded-xl border ${info.color.border} ${info.color.bg} p-5 mb-5`}>
      {/* Top row: rank icon + name + points */}
      <div className="flex items-center gap-4 mb-4">
        <RankIcon rank={currentRank} size="lg" unlocked />
        <div className="flex-1">
          <h4 className={`text-xl font-bold ${info.color.text}`}>{info.name} Rank</h4>
          <p className="text-sm text-gray-600">{totalPoints} total points</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-1">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>{isMaxRank ? 'Max Rank!' : `${pointsToNext} pts to next rank`}</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full h-2.5 bg-white/60 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${info.color.progressBar}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Rank milestone icons */}
      <div className="flex items-center justify-between mt-4">
        {RANK_ORDER.map((rank, idx) => (
          <div key={rank} className="flex flex-col items-center gap-1">
            <RankIcon rank={rank} size="sm" unlocked={idx <= currentRankIndex} />
            <span className={`text-xs font-medium ${idx <= currentRankIndex ? RANK_INFO[rank].color.text : 'text-gray-400'}`}>
              {RANK_INFO[rank].name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
