import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SiteHeader } from "@/components/site-header";
import styles from "./layout.module.css";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://ptcgp.axross.dev"),
  title: {
    default: "ptcgp.axross.dev",
    template: "%s · ptcgp.axross.dev",
  },
  description:
    "A documentation website for Pokémon TCG Pocket: guides and reference material, authored in MDX.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SiteHeader />

        <main className={styles.main} data-testid="main">
          {children}
        </main>

        <footer className={styles.footer} data-testid="footer">
          <p>
            Unofficial fan content. Not affiliated with or endorsed by Nintendo,
            Creatures, GAME FREAK, or The Pokémon Company.
          </p>
        </footer>
      </body>
    </html>
  );
}
