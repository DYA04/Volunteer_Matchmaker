'use client';

import Button from '@/components/ui/Button';

interface HeroSectionProps {
  onGetStarted: () => void;
}

export default function HeroSection({ onGetStarted }: HeroSectionProps) {
  return (
    <section className="pt-24 pb-16 md:pt-32 md:pb-24 bg-gradient-to-b from-primary-light to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Connect Your Passion with{' '}
            <span className="text-primary">Purpose</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8">
            Volunteer Matchmaker uses smart matching to connect volunteers with opportunities
            that align with their skills, interests, and availability. Make a difference
            in your community today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" onClick={onGetStarted} className="text-lg px-8 py-3">
              Get Started
            </Button>
            <Button variant="outline" className="text-lg px-8 py-3">
              Learn More
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary">5,000+</div>
              <div className="text-gray-600 mt-1">Active Volunteers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary">500+</div>
              <div className="text-gray-600 mt-1">Organizations</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary">25,000+</div>
              <div className="text-gray-600 mt-1">Hours Matched</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
