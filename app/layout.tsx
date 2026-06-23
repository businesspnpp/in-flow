import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'inFlow',
  description: 'Modular workspace dashboard for small businesses',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="h-[100dvh] overflow-hidden bg-zinc-50">
        {children}
      </body>
    </html>
  );
}
