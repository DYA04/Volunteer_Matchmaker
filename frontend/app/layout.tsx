import type { Metadata } from 'next';
import './globals.css';
import { AccessibilityProvider } from '@/lib/contexts/AccessibilityContext';

export const metadata: Metadata = {
  title: 'Volunteer Matchmaker',
  description: 'Connect your passion with purpose. Find volunteer opportunities that match your skills and interests.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AccessibilityProvider>
          {/* Skip link for keyboard users */}
          <a
            href="#main-content"
            className="skip-link sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-[9999] focus:bg-black focus:text-white focus:p-4"
          >
            Skip to main content
          </a>
          {children}
        </AccessibilityProvider>
      </body>
    </html>
  );
}
