// app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { AuthProvider } from "@/components/providers/AuthProvider";
import ClientLayout from "./ClientLayout";
import { MainNav } from "@/components/navigation/main-nav";
import { Footer } from "@/components/navigation/footer";

const inter = Inter({ subsets: ["latin"] });

// -----------------------------
// Correct Viewport Export
// -----------------------------
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

// -----------------------------
// Correct Metadata Export
// -----------------------------
export const metadata: Metadata = {
  title: "SoundSync - Premier Music Platform",
  description:
    "Connect with artists, fans, merchants, and influencers. Global platform with ZAR pricing.",
  keywords: "music, streaming, artists, fans, merchants, influencers, ZAR",
  authors: [{ name: "SoundSync" }],
};

// -----------------------------
// Root Layout
// -----------------------------
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ClientLayout>
            <div className="min-h-screen flex flex-col">
              <MainNav />
              <main className="flex-1 pt-16">{children}</main>
              <Footer />
            </div>
          </ClientLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
