import type { MDXComponents } from "mdx/types";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import styles from "@/components/prose.module.css";

function Prose({ children }: { children: ReactNode }) {
  return (
    <article className={styles.prose} data-testid="prose">
      {children}
    </article>
  );
}

function Table(props: ComponentPropsWithoutRef<"table">) {
  return (
    <div className={styles.tableWrapper}>
      <table {...props} />
    </div>
  );
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    wrapper: Prose,
    table: Table,
    ...components,
  };
}
