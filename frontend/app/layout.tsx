import type { Metadata } from 'next';
import './globals.css';

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
      <body>{children}</body>
    </html>
  );
}
