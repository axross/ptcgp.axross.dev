/**
 * Returns whether `href` should be highlighted as the current navigation
 * item for the given pathname. A nav item is active on its own route and on
 * any route nested under it; the root href matches only itself.
 */
export function isActiveRoute(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}
