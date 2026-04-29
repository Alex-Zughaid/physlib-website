"use client";

import { useCallback } from "react";
import { GraphvizView } from "@/components/graphviz-view";

async function buildDot(): Promise<string> {
  const res = await fetch(
    "https://api.github.com/repos/leanprover-community/Physlib/issues?labels=API&per_page=100",
  );
  const data = await res.json();

  if (!Array.isArray(data)) throw new Error("Unexpected API response");

  const apiIssues = data.filter((issue: { labels: { name: string }[] }) =>
    issue.labels.some((l: { name: string }) => l.name === "API"),
  );

  let dot = "digraph G {\n  rankdir=TB;\n  node [shape=box, style=filled];\n";

  for (const issue of apiIssues) {
    const needsReqs = issue.labels.some(
      (l: { name: string }) => l.name === "requirements-needed",
    );
    const body: string = issue.body ?? "";
    const total = (body.match(/- \[[ x]\]/g) ?? []).length;
    const checked = (body.match(/- \[x\]/g) ?? []).length;

    const fillColor = needsReqs ? "#FFCCCC" : "#CCFFCC";
    const rawLabel = issue.title.replace(/"/g, '\\"').replace("API: ", "");
    const subLabel = needsReqs
      ? "Next step: Specify requirements"
      : `Next step: Build requirements (${checked}/${total})`;

    dot += `  "${issue.number}" [label=<${rawLabel}<BR/><FONT POINT-SIZE="10">${subLabel}</FONT>>, fillcolor="${fillColor}", URL="${issue.html_url}"];\n`;

    const parentMatch = body.match(/## Parent APIs\s+((?:#\d+\s*)+)/);
    if (parentMatch) {
      const parents = parentMatch[1].match(/#(\d+)/g) ?? [];
      for (const p of parents) {
        dot += `  "${parseInt(p.slice(1))}" -> "${issue.number}";\n`;
      }
    }
  }

  dot += "}";
  return dot;
}

export function APITrackerClient() {
  const getDot = useCallback(() => buildDot(), []);
  return <GraphvizView getDot={getDot} />;
}
