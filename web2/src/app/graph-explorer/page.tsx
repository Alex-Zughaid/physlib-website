import type { Metadata } from "next";
import { ButtonLink } from "@/components/button-link";

export const metadata: Metadata = {
  title: "Graph Explorer | Physlib",
  description:
    "An interactive explorer for Physlib's dependency graph. Coming soon.",
};

export default function GraphExplorerPage() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center px-5 sm:px-8 py-24 md:py-32 text-center">
      <p className="label-mono text-muted mb-5">AI Tools</p>
      <h1
        className="text-4xl font-medium text-foreground mb-4 md:text-5xl"
        style={{ letterSpacing: "-0.04em", lineHeight: 1.06 }}
      >
        Graph Explorer
      </h1>
      <p
        className="text-lg text-muted mb-10 leading-snug"
        style={{ letterSpacing: "-0.01em", lineHeight: 1.4 }}
      >
        An interactive way to explore Physlib&apos;s dependency graph is
        coming soon.
      </p>
      <ButtonLink href="/">Back to Home</ButtonLink>
    </div>
  );
}
