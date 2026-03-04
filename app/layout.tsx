import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Specter | Enterprise Infrastructure Monitoring",
  description: "Real-time attack surface and uptime monitoring for modern software teams.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-black text-white selection:bg-neutral-800 selection:text-white">
        {children}
      </body>
    </html>
  );
}
