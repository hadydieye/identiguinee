import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "IdentiGuinée — Identité numérique citoyenne",
  description: "Plateforme d'identité numérique pour les citoyens guinéens",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${geist.variable} h-full`}>
      <body className="min-h-full bg-[#06090F] text-white antialiased">{children}</body>
    </html>
  );
}
