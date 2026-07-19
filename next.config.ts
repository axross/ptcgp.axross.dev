import createMDX from "@next/mdx";
import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";
import { CARD_IMAGE_BASE_URL } from "./src/lib/cards/card-images";

const cardImageCdn = new URL(CARD_IMAGE_BASE_URL);

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "mdx"],
  images: {
    // Card artwork host, derived from the single provider constant so a
    // provider swap cannot leave this allowlist stale; tightly scoped to the
    // Pocket path. See src/lib/cards/card-images.ts.
    remotePatterns: [
      {
        protocol: "https",
        hostname: cardImageCdn.hostname,
        pathname: `${cardImageCdn.pathname}/**`,
      },
    ],
  },
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
