import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { PromptsClient } from "./prompts-client";
import { PreambleSection } from "./preamble-section";

export const metadata: Metadata = {
  title: "Prompts | Physlib",
  description:
    "Ready-made prompts for common Physlib tasks, filled in with the Lean subfolder you're working on.",
};

export default function PromptsPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-5 sm:px-8 py-12 md:py-16">
      <p className="label-mono text-muted mb-5">AI Tools</p>
      <h1
        className="text-4xl font-medium text-foreground mb-4 md:text-5xl"
        style={{ letterSpacing: "-0.04em", lineHeight: 1.06 }}
      >
        Prompts
      </h1>
      <p
        className="text-lg max-w-2xl mb-2 leading-snug"
        style={{ letterSpacing: "-0.01em", lineHeight: 1.4, color: "color-mix(in srgb, var(--foreground) 80%, var(--accent))" }}
      >
        Here is a list of prompts ready for you to copy-paste into your agent, giving you a head-start when it comes to understanding the specific area of Physlib you are interested in.
      </p>
      <p
        className="text-lg max-w-2xl mb-12 leading-snug"
        style={{ letterSpacing: "-0.01em", lineHeight: 1.4, color: "color-mix(in srgb, var(--foreground) 80%, var(--accent))" }}
      >
        Make sure your agent can access your local copy of Physlib and then paste one of these
      </p>

      <section className="mb-12">
        <PageHeader id="prompt-library" title="Prompt library" />
        <PromptsClient />
      </section>

      <section>
        <PageHeader id="about-the-preamble" title="About the preamble" />
        <PreambleSection />
      </section>
    </div>
  );
}
