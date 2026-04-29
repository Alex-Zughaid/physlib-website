import type { Metadata } from "next";
import { APITrackerClient } from "./api-tracker-client";

export const metadata: Metadata = {
  title: "API Tracker | Physlib",
  description:
    "Visualize the API dependency graph for Physlib based on GitHub issues.",
};

export default function APITrackerPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 md:py-14">
      <h1 className="text-4xl font-bold tracking-tight mb-2">API Tracker</h1>
      <p className="text-muted mb-8 leading-relaxed">
        This graph visualizes the API-related issues for Physlib. Feel free to
        explore the issues and help where you can! This graph does not currently
        show progress of the APIs being built, as some issues have not yet
        defined their requirements, even though the requirements may already
        exist in Physlib.
      </p>
      <APITrackerClient />
    </div>
  );
}
