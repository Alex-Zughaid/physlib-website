import type { Metadata } from "next";
import { MonthlyUpdatesClient } from "./monthly-updates-client";

export const metadata: Metadata = {
  title: "Monthly Updates | Physlib",
  description:
    "Month-by-month summary of Physlib activity: contributors, lines changed, and a plain-text diff of every commit.",
};

export default function MonthlyUpdatesPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 md:py-14">
      <h1 className="text-4xl font-bold tracking-tight mb-2">
        Monthly Updates
      </h1>
      <p className="text-muted mb-8">
        A summary of Physlib activity by month, starting January 2026. Each
        month&apos;s diff is generated automatically once the month ends.{" "}
        <a
          href="https://github.com/leanprover-community/physlib/commits/master"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent hover:underline underline-offset-2"
        >
          View full commit history ↗
        </a>
      </p>
      <MonthlyUpdatesClient />
    </div>
  );
}
