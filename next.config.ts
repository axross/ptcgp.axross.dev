import createMDX from "@next/mdx";
import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "mdx"],
};

const withMDX = createMDX({
  options: {
    // Plugins are referenced by name (not imported) so the options stay
    // serializable for Turbopack.
    remarkPlugins: [["remark-gfm"]],
  },
});

export default withSentryConfig(withMDX(nextConfig), {
  // Source maps are uploaded only when SENTRY_AUTH_TOKEN is provided (CI);
  // local builds proceed without it.
  silent: true,
  disableLogger: true,
});
