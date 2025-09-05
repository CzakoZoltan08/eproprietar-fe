import "./style.css";

import AppInitializer from "@/common/initializer/AppInitializer";
import { Inter } from "next/font/google";
import type { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Eproprietar",
  description: "Platformă pentru gestionarea anunțurilor imobiliare",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ro">
      <body className={inter.className}>
        <AppInitializer>
          {children}
        </AppInitializer>
      </body>
    </html>
  );
}