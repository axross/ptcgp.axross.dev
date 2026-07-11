import Link from "next/link";
import { GitHubLink } from "@/components/github-link";
import { NavLink } from "@/components/nav-link";
import styles from "./site-header.module.css";

export function SiteHeader() {
  return (
    <header className={styles.header} data-testid="site-header">
      <div className={styles.inner}>
        <Link className={styles.wordmark} href="/" data-testid="wordmark">
          ptcgp.axross.dev
        </Link>

        <nav aria-label="Site" className={styles.nav} data-testid="nav">
          <NavLink
            className={styles.navLink}
            href="/guides/getting-started"
            data-testid="guides"
          >
            Guides
          </NavLink>

          <GitHubLink />
        </nav>
      </div>
    </header>
  );
}
