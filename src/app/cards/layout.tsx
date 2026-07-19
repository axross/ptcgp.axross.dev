import type { ReactNode } from "react";

/**
 * Layout for the card routes (`/cards`, `/cards/[id]`). It renders a
 * `data-cards-scope` marker so the shared content column in the root layout
 * widens to `--card-max-width` for these routes only (see the `:has()` rule in
 * layout.module.css); the prose pages keep the narrower 46rem column. The
 * marker is a full-width block with no styling of its own, so it does not
 * affect the routes' layout.
 */
export default function CardsLayout({ children }: { children: ReactNode }) {
  return <div data-cards-scope>{children}</div>;
}
