import type { Metadata } from "next";
import Link from "next/link";
import { CardFilterBar } from "@/components/card-filter-bar";
import { CardGrid } from "@/components/card-grid";
import {
  filterCards,
  hasActiveFilters,
  parseCardFilters,
} from "@/lib/cards/card-filters";
import {
  deriveKindOptions,
  deriveRarityOptions,
  deriveSetOptions,
  toCardTileView,
} from "@/lib/cards/card-view";
import { getAllCards } from "@/lib/cards/catalog";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Cards",
  description: "Browse and filter the Pokémon TCG Pocket card database.",
};

type CardsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function resultCountLabel(count: number): string {
  return count === 1 ? "1 card" : `${count} cards`;
}

/**
 * Server-rendered `/cards` route: reads the URL search params, parses them into
 * validated filter criteria, filters the catalog, and renders the filter bar
 * with either the card grid or the empty state. The page sits inside the root
 * layout's content column, so it renders a section rather than its own `main`.
 */
export default async function CardsPage({ searchParams }: CardsPageProps) {
  const rawParams = await searchParams;
  const cards = getAllCards();
  const rarityOptions = deriveRarityOptions(cards);
  const kindOptions = deriveKindOptions(cards);
  const setOptions = deriveSetOptions(cards);
  const criteria = parseCardFilters(rawParams, {
    rarityCodes: rarityOptions.map((option) => option.code),
    setCodes: setOptions.map((option) => option.code),
  });

  const filtered = filterCards(cards, criteria);
  const views = filtered.map(toCardTileView);

  return (
    <div className={styles.page} data-testid="cards-page">
      <header className={styles.intro}>
        <h1 className={styles.heading}>Cards</h1>
        <p className={styles.lede}>
          Browse and filter every Pokémon TCG Pocket card. Select a card to see
          its full details.
        </p>
      </header>

      <CardFilterBar
        criteria={criteria}
        rarityOptions={rarityOptions}
        kindOptions={kindOptions}
        setOptions={setOptions}
      />

      <p
        className={styles.resultCount}
        data-testid="card-result-count"
        aria-live="polite"
      >
        {resultCountLabel(views.length)}
      </p>

      {views.length > 0 ? (
        <CardGrid cards={views} />
      ) : (
        <div className={styles.empty} data-testid="cards-empty-state">
          <p className={styles.emptyMessage}>No cards match these filters.</p>
          {hasActiveFilters(criteria) ? (
            <Link
              className={styles.emptyAction}
              href="/cards"
              data-testid="cards-empty-clear"
            >
              Clear filters
            </Link>
          ) : null}
        </div>
      )}
    </div>
  );
}
