import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { CardImage } from "@/components/card-image";
import { CardKindIcon } from "@/components/card-kind-icon";
import { EnergyIcon } from "@/components/energy-icon";
import { getCardImageUrl } from "@/lib/cards/card-images";
import {
  cardKindLabel,
  cardTypeLabel,
  formatAttackDamage,
} from "@/lib/cards/card-view";
import { getAllCards, getCard } from "@/lib/cards/catalog";
import { getRarity } from "@/lib/cards/rarity-registry";
import type { EnergyType } from "@/lib/cards/schema";
import { getSet } from "@/lib/cards/set-registry";
import styles from "./page.module.css";

type CardDetailPageProps = {
  params: Promise<{ id: string }>;
};

/** Pre-render every catalog card at build time (ids are globally unique). */
export function generateStaticParams(): { id: string }[] {
  return getAllCards().map((card) => ({ id: card.id }));
}

export async function generateMetadata({
  params,
}: CardDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const card = getCard(id);
  if (card === null) {
    return { title: "Card not found" };
  }
  const set = getSet(card.setCode);
  const setLabel = set ? `${set.name} · ` : "";
  return {
    title: card.name.en,
    description: `${card.name.en} — ${setLabel}${card.setCode} #${card.number}, ${getRarity(card.rarity).label}.`,
  };
}

/** A row of energy pictograms for an attack or retreat cost, named for readers. */
function EnergyCost({
  cost,
  label,
}: {
  cost: readonly EnergyType[];
  label: string;
}) {
  if (cost.length === 0) {
    return <span className={styles.costFree}>Free</span>;
  }
  // Pre-key the pips so the JSX map does not derive a React key from the array
  // index: a cost is a fixed-length multiset of identical-type pips with no
  // identity of their own, so position is the only thing that distinguishes
  // two same-type pips.
  const pips = cost.map((type, index) => ({ type, key: `${type}-${index}` }));
  return (
    <span className={styles.cost}>
      {pips.map((pip) => (
        <EnergyIcon key={pip.key} type={pip.type} className={styles.costIcon} />
      ))}
      <span className={styles.srOnly}>
        {label}: {cost.join(", ")}
      </span>
    </span>
  );
}

function StatRow({ term, children }: { term: string; children: ReactNode }) {
  return (
    <div className={styles.statRow}>
      <dt className={styles.statTerm}>{term}</dt>
      <dd className={styles.statValue}>{children}</dd>
    </div>
  );
}

const ruleBoxLabels: Record<"ex" | "MegaEx", string> = {
  ex: "ex",
  MegaEx: "Mega ex",
};

/**
 * Server-rendered `/cards/[id]` route: the full detail view for one card —
 * artwork plus every attribute the catalog carries. Unknown ids fall through
 * to the not-found page. The page renders inside the root layout's content
 * column, so it returns an `article` rather than its own `main`.
 */
export default async function CardDetailPage({ params }: CardDetailPageProps) {
  const { id } = await params;
  const card = getCard(id);
  if (card === null) {
    notFound();
  }

  const set = getSet(card.setCode);
  const rarity = getRarity(card.rarity);
  const paddedNumber = String(card.number).padStart(3, "0");

  return (
    <article
      className={styles.detail}
      data-testid="card-detail"
      data-card-id={card.id}
    >
      <Link
        className={styles.back}
        href="/cards"
        data-testid="card-detail-back"
      >
        ← All cards
      </Link>

      <div className={styles.top}>
        <div className={styles.art}>
          <CardImage
            src={getCardImageUrl(card)}
            alt={card.name.en}
            priority
            fallback={{
              name: card.name.en,
              typeLabel: cardTypeLabel(card),
              kindLabel: cardKindLabel(card),
              hp: card.category === "Pokemon" ? card.pokemon.hp : null,
            }}
          />
        </div>

        <div className={styles.info}>
          <header className={styles.head}>
            <h1 className={styles.name} data-testid="card-detail-name">
              {card.name.en}
            </h1>
            <p className={styles.identity}>
              {set ? `${set.name} · ` : ""}
              {card.setCode} #{paddedNumber} ·{" "}
              <span title={rarity.label}>{rarity.symbol}</span> {rarity.label}
            </p>
          </header>

          {card.category === "Pokemon" ? (
            <dl className={styles.stats} data-testid="card-detail-stats">
              <StatRow term="Type">
                <span className={styles.typeValue}>
                  <EnergyIcon
                    type={card.pokemon.type}
                    className={styles.statIcon}
                  />
                  {card.pokemon.type}
                </span>
              </StatRow>
              <StatRow term="HP">{card.pokemon.hp}</StatRow>
              <StatRow term="Stage">
                <span className={styles.typeValue}>
                  <CardKindIcon
                    kind={card.pokemon.stage}
                    className={styles.statIcon}
                  />
                  {cardKindLabel(card)}
                  {card.pokemon.evolvesFrom !== null
                    ? ` — evolves from ${card.pokemon.evolvesFrom}`
                    : ""}
                </span>
              </StatRow>
              <StatRow term="Weakness">
                {card.pokemon.weakness !== null ? (
                  <span className={styles.typeValue}>
                    <EnergyIcon
                      type={card.pokemon.weakness}
                      className={styles.statIcon}
                    />
                    {card.pokemon.weakness}
                  </span>
                ) : (
                  "None"
                )}
              </StatRow>
              <StatRow term="Retreat cost">
                {card.pokemon.retreatCost > 0 ? (
                  <EnergyCost
                    cost={Array.from(
                      { length: card.pokemon.retreatCost },
                      () => "Colorless" as const,
                    )}
                    label="Retreat cost"
                  />
                ) : (
                  <span className={styles.costFree}>Free</span>
                )}
              </StatRow>
              {card.pokemon.ruleBox !== "None" ? (
                <StatRow term="Rule box">
                  {ruleBoxLabels[card.pokemon.ruleBox]}
                </StatRow>
              ) : null}
              {card.pokemon.classification !== null ? (
                <StatRow term="Classification">
                  {card.pokemon.classification}
                </StatRow>
              ) : null}
              {card.pokemon.isBaby ? <StatRow term="Baby">Yes</StatRow> : null}
            </dl>
          ) : (
            <dl className={styles.stats} data-testid="card-detail-stats">
              <StatRow term="Category">
                <span className={styles.typeValue}>
                  <CardKindIcon
                    kind={card.trainer.subtype}
                    className={styles.statIcon}
                  />
                  Trainer — {cardKindLabel(card)}
                </span>
              </StatRow>
            </dl>
          )}

          {card.category === "Pokemon" && card.pokemon.abilities.length > 0 ? (
            <section
              className={styles.section}
              data-testid="card-detail-abilities"
            >
              <h2 className={styles.sectionHeading}>Abilities</h2>
              {card.pokemon.abilities.map((ability) => (
                <div className={styles.block} key={ability.name.en}>
                  <p className={styles.blockName}>{ability.name.en}</p>
                  <p className={styles.blockText}>{ability.text}</p>
                </div>
              ))}
            </section>
          ) : null}

          {card.category === "Pokemon" && card.pokemon.attacks.length > 0 ? (
            <section
              className={styles.section}
              data-testid="card-detail-attacks"
            >
              <h2 className={styles.sectionHeading}>Attacks</h2>
              {card.pokemon.attacks.map((attack) => {
                const damage = formatAttackDamage(
                  attack.damage,
                  attack.damageSuffix,
                );
                return (
                  <div className={styles.block} key={attack.name.en}>
                    <p className={styles.attackHead}>
                      <EnergyCost cost={attack.cost} label="Cost" />
                      <span className={styles.blockName}>{attack.name.en}</span>
                      {damage !== null ? (
                        <span className={styles.damage}>{damage}</span>
                      ) : null}
                    </p>
                    {attack.text !== null ? (
                      <p className={styles.blockText}>{attack.text}</p>
                    ) : null}
                  </div>
                );
              })}
            </section>
          ) : null}

          {card.category === "Trainer" ? (
            <section
              className={styles.section}
              data-testid="card-detail-effect"
            >
              <h2 className={styles.sectionHeading}>Effect</h2>
              <p className={styles.blockText}>{card.trainer.text}</p>
            </section>
          ) : null}

          {card.flavorText !== null ? (
            <p className={styles.flavor}>{card.flavorText}</p>
          ) : null}

          <dl className={styles.meta} data-testid="card-detail-meta">
            <StatRow term="Illustrator">
              {card.illustrator ?? "Unknown"}
            </StatRow>
            {card.boosterPacks !== null && card.boosterPacks.length > 0 ? (
              <StatRow term="Booster packs">
                {card.boosterPacks.join(", ")}
              </StatRow>
            ) : null}
            {card.shop.packPoints !== null ? (
              <StatRow term="Pack points">{card.shop.packPoints}</StatRow>
            ) : null}
            {card.shop.dupeShinedust !== null ? (
              <StatRow term="Dust (duplicate)">
                {card.shop.dupeShinedust}
              </StatRow>
            ) : null}
          </dl>
        </div>
      </div>
    </article>
  );
}
