import { Card } from "@heroui/react";
import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contributing via GitHub | Physlib",
  description:
    "A step-by-step guide to contributing to Physlib via GitHub, following our best practice guidlines",
};

export default function GhGuidePage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-5 sm:px-8 py-12 md:py-16">

      <p className="label-mono text-muted mb-5">Community</p>
      <h1
        className="text-4xl font-medium text-foreground mb-4 md:text-5xl"
        style={{ letterSpacing: "-0.04em", lineHeight: 1.06 }}
      >
        Contributing via GitHub
      </h1>
      <p
        className="text-lg max-w-2xl mb-12 leading-snug"
        style={{ letterSpacing: "-0.01em", lineHeight: 1.4, color: "color-mix(in srgb, var(--foreground) 80%, var(--accent))" }}
      >
        A step-by-step guide to contributing to Physlib via GitHub, following our best practice guidlines
      </p>

      {/* Step 1 — Issues */}
      <section className="mb-12">
        <h2
          className="text-2xl font-medium text-foreground mb-4"
          style={{ letterSpacing: "-0.035em" }}
        >
          1. Open a GitHub Issue
        </h2>
        <p
          className="text-sm mb-6 leading-relaxed"
          style={{ letterSpacing: "-0.01em", color: "color-mix(in srgb, var(--foreground) 70%, var(--accent))" }}
        >
          Before starting any work, open an issue on the Physlib repository to
          describe the problem you are encountering or the feature you want to
          add. This lets maintainers and other contributors weigh in early,
          avoids duplicate work, and gives your pull request a clear reference
          point.
        </p>
        <Card variant="default">
          <Card.Header>
            <Card.Title>What to include in an issue</Card.Title>
          </Card.Header>
          <Card.Content className="text-sm text-foreground/90">
            <ul className="space-y-2 ml-4">
              {issueChecklist.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="text-accent flex-shrink-0">—</span>
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-4">
              <a
                href={`${site.github}/issues/new`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-9 items-center gap-2 rounded px-4 text-sm font-medium transition-opacity hover:opacity-80"
                style={{ background: "var(--accent)", color: "var(--accent-foreground)", letterSpacing: "-0.01em" }}
              >
                Open an Issue ↗
              </a>
            </div>
          </Card.Content>
        </Card>
      </section>

      {/* Step 2 — Work on it */}
      <section className="mb-12">
        <h2
          className="text-2xl font-medium text-foreground mb-4"
          style={{ letterSpacing: "-0.035em" }}
        >
          2. Work on the Problem
        </h2>
        <p
          className="text-sm mb-4 leading-relaxed"
          style={{ letterSpacing: "-0.01em", color: "color-mix(in srgb, var(--foreground) 70%, var(--accent))" }}
        >
          Before writing any Lean, please read the{" "}
          <a href="/getting-started" className="text-accent hover:underline underline-offset-2">
            Getting Started
          </a>{" "}
          guide for how to install Physlib and write results in Lean according to our code quality standards.
        </p>
      </section>

      {/* Step 3 — Pull Request */}
      <section className="mb-12">
        <h2
          className="text-2xl font-medium text-foreground mb-4"
          style={{ letterSpacing: "-0.035em" }}
        >
          3. Make a Pull Request
        </h2>
        <p className="text-sm mb-8 leading-relaxed" style={{ letterSpacing: "-0.01em", color: "color-mix(in srgb, var(--foreground) 70%, var(--accent))" }}>
          Small pull-requests are better than large ones — even if it&apos;s just a single result.
          Follow the PR template provided by GitHub when opening your PR.
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          <Card variant="default">
            <Card.Header>
              <Card.Title>Using Forks</Card.Title>
            </Card.Header>
            <Card.Content>
              <ol className="list-decimal ml-5 space-y-1 text-sm text-foreground/90">
                <li>Fork the Physlib repository to your GitHub account.</li>
                <li>Clone your forked repository to your local machine.</li>
                <li>Make your changes on your local version.</li>
                <li>Push your changes to your forked repository.</li>
                <li>
                  Open a pull request from your forked version to the main Physlib
                  repository.
                </li>
              </ol>
            </Card.Content>
          </Card>

          <Card variant="default">
            <Card.Header>
              <Card.Title>Using Branches</Card.Title>
            </Card.Header>
            <Card.Content>
              <ol className="list-decimal ml-5 space-y-1 text-sm text-foreground/90">
                <li>
                  Ask Joseph Tooby-Smith to add you as an outside collaborator on
                  the project.
                </li>
                <li>Clone the main GitHub repository.</li>
                <li>
                  Make your own branch (e.g.{" "}
                  <code className="font-mono text-xs">
                    feat(your-name):updating spacetime
                  </code>
                  ).
                </li>
                <li>Open a pull request from your branch to the main branch.</li>
              </ol>
            </Card.Content>
          </Card>
        </div>

        <div className="mt-8">
          <h3
            className="text-lg font-medium text-foreground mb-3"
            style={{ letterSpacing: "-0.03em" }}
          >
            Adding Labels
          </h3>
          <p className="text-sm leading-relaxed" style={{ letterSpacing: "-0.01em", color: "color-mix(in srgb, var(--foreground) 70%, var(--accent))" }}>
            When opening a pull request, labels help the mainainers manage the review process. Please add comments so the bot can add labels for you. eg. commenting &quot;awaiting-author&quot; will add the{" "}
            <span
              className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
              style={{ background: "#f5c6cb", color: "#7d1a24", border: "1px solid #e8a0a8" }}
            >
              awaiting author
            </span>{" "}
            label
          </p>
        </div>
      </section>

      <section className="mb-12">
        <h2
          className="text-2xl font-medium text-foreground mb-4"
          style={{ letterSpacing: "-0.035em" }}
        >
          4. Managing the PR
        </h2>
        <p className="text-sm leading-relaxed" style={{ letterSpacing: "-0.01em", color: "color-mix(in srgb, var(--foreground) 70%, var(--accent))" }}>
          After opening a PR, the maintainers will review the changes and provide feedback. Feel free to begin work on a separate PR in the meantime but be prepared to make changes to this one if required.
        </p>
      </section>

      <section className="mb-12">
        <h2
          className="text-2xl font-medium text-foreground mb-4"
          style={{ letterSpacing: "-0.035em" }}
        >
          5. Merging the PR
        </h2>
        <p className="text-sm leading-relaxed" style={{ letterSpacing: "-0.01em", color: "color-mix(in srgb, var(--foreground) 70%, var(--accent))" }}>
         Once the reviewer is happy with the changes, they will merge the PR into the main branch. PhysLib uses a{" "}
            <a
              href="https://github.com/leanprover-community/physlib/queue/main"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline underline-offset-2"
            >
              merge queue
            </a>{" "}
            to ensure that consecutive changes do not produce unexpected errors. This may result in your PR being rejected with errors you have not seen before.
        </p>
      </section>

    </div>
  );
}

const issueChecklist = [
  "A clear title summarising the problem or feature.",
  "A description of the current behaviour (for bugs) or the motivation (for features).",
  "Any relevant links — existing results, Mathlib analogues, or Zulip discussions.",
  "The physics or Lean context needed for a reviewer to understand the scope.",
];
