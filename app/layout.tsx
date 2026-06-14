import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'inFlow',
  description: 'Modular workspace dashboard for small businesses',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
