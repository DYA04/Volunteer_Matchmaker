'use client';

export default function HeatmapPlaceholder() {
  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Volunteer Opportunities Near You
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore volunteer opportunities in your area with our interactive map.
          </p>
        </div>

        {/* Placeholder for heatmap - to be wired up in task 10 */}
        <div
          className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-8 md:p-12"
          data-testid="heatmap-placeholder"
        >
          <div className="aspect-[16/9] md:aspect-[21/9] flex flex-col items-center justify-center bg-gray-100 rounded-lg">
            {/* Map placeholder icon */}
            <div className="w-16 h-16 text-gray-400 mb-4">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                />
              </svg>
            </div>
            <p className="text-gray-500 text-lg font-medium mb-2">
              Interactive Heatmap Coming Soon
            </p>
            <p className="text-gray-400 text-sm text-center max-w-md">
              This area will display an interactive map showing volunteer opportunity density
              across different locations.
            </p>
          </div>
        </div>

        {/* Placeholder stats below map */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Active Opportunities', value: '--' },
            { label: 'Organizations', value: '--' },
            { label: 'Volunteers Needed', value: '--' },
            { label: 'Cities Covered', value: '--' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-lg p-4 text-center border border-gray-200"
            >
              <div className="text-2xl font-bold text-gray-300">{stat.value}</div>
              <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
