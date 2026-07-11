"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    // global-error replaces the root layout, so it must render its own
    // <html> and <body>.
    <html lang="en">
      <body>
        <h1>Something went wrong</h1>
        <p>An unexpected error occurred. Please try again.</p>
      </body>
    </html>
  );
}
