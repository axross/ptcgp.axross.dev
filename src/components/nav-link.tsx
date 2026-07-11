"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { isActiveRoute } from "@/lib/routes";

export function NavLink({
  href,
  children,
  ...rest
}: {
  href: string;
  children: ReactNode;
  className?: string;
  "data-testid"?: string;
}) {
  const pathname = usePathname();

  return (
    <Link
      href={href}
      aria-current={isActiveRoute(pathname, href) ? "page" : undefined}
      {...rest}
    >
      {children}
    </Link>
  );
}
