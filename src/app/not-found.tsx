import Link from "next/link";

export const metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <div data-testid="not-found">
      <h1>Page not found</h1>
      <p>The page you are looking for does not exist or has moved.</p>
      <p>
        <Link href="/" data-testid="home-link">
          Back to the home page
        </Link>
      </p>
    </div>
  );
}
