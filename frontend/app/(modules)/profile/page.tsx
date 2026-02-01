'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/viewmodels/auth.viewmodel';
import {
  fetchUserProfile,
  UserProfile,
  AccessibilityPreferences as AccessibilityPrefsType,
} from '@/lib/mock/profileData';
import {
  ProfileHeader,
  ViewToggle,
  ProfileView,
  RequesterView,
  HelperView,
  AccessibilityPreferences,
} from '@/components/profile';

function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      {/* Header skeleton */}
      <div className="bg-white rounded-xl p-6 md:p-8">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gray-200" />
          <div className="flex-1 space-y-3">
            <div className="h-8 bg-gray-200 rounded w-48" />
            <div className="h-4 bg-gray-200 rounded w-24" />
            <div className="h-4 bg-gray-200 rounded w-64" />
            <div className="h-16 bg-gray-200 rounded w-full mt-4" />
          </div>
        </div>
      </div>

      {/* Toggle skeleton */}
      <div className="flex justify-center">
        <div className="h-12 bg-gray-200 rounded-lg w-64" />
      </div>

      {/* Stats skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-xl p-5 h-28">
            <div className="h-4 bg-gray-200 rounded w-20 mb-2" />
            <div className="h-8 bg-gray-200 rounded w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activeView, setActiveView] = useState<ProfileView>('helper');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In production, redirect to auth if not authenticated
    // For dev, we'll show mock data regardless
    const loadProfile = async () => {
      setIsLoading(true);
      try {
        const data = await fetchUserProfile();
        setProfile(data);
      } catch (error) {
        console.error('Failed to load profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleAccessibilityUpdate = (updates: Partial<AccessibilityPrefsType>) => {
    if (!profile) return;
    setProfile({
      ...profile,
      accessibilityPreferences: { ...profile.accessibilityPreferences, ...updates },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <span className="text-xl font-bold text-gray-900">Volunteer Matchmaker</span>
            </Link>

            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="text-gray-600 hover:text-gray-900 text-sm font-medium"
              >
                Home
              </Link>
              {profile && (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium">
                    {profile.firstName[0]}{profile.lastName[0]}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {isLoading ? (
            <LoadingSkeleton />
          ) : profile ? (
            <div className="space-y-6">
              {/* Profile Header */}
              <ProfileHeader profile={profile} />

              {/* View Toggle */}
              <ViewToggle activeView={activeView} onViewChange={setActiveView} />

              {/* View Content */}
              {activeView === 'requester' ? (
                <RequesterView stats={profile.requesterStats} />
              ) : (
                <HelperView
                  stats={profile.helperStats}
                  badges={profile.badges}
                  skills={profile.skills}
                  impactBulletPoints={profile.impactBulletPoints}
                />
              )}

              {/* Shared: Accessibility Preferences */}
              <AccessibilityPreferences
                preferences={profile.accessibilityPreferences}
                onUpdate={handleAccessibilityUpdate}
              />
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">Failed to load profile. Please try again.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
