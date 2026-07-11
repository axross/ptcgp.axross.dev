import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  enabled: process.env.NODE_ENV === "production",
  // Keep events free of personal data; see the application-security skill
  // before changing this or adding user/request context.
  sendDefaultPii: false,
  tracesSampleRate: 0.1,
});
