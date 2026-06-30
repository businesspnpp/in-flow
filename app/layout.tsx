import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "Dock",
  description: "Modular workspace dashboard for small businesses",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
        <link rel="icon" href="/dock-icon.svg" type="image/svg+xml" />
      </head>
      <body className="min-h-screen overflow-x-hidden bg-zinc-50">
        {children}
      </body>
    </html>
  );
}
