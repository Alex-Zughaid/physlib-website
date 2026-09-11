"use client";

import { useEffect, useState } from "react";
import { Card } from "@heroui/react";
import { CheckIcon, CopyIcon } from "@/components/monthly-updates/icons";
import { PREAMBLE } from "./preamble";

const STORAGE_KEY = "physlib-prompts-folder";

type PromptDef = {
  id: string;
  title: string;
  summary: string;
  template: (folder: string) => string;
};

const PROMPTS: PromptDef[] = [
    {
    id: "explain",
    title: "Explain",
    summary: "Get a natural language description of what the code does..",
    template: (folder) =>
      `Explain \`${folder}\` to me: what physical or mathematical topic it covers, how its main definitions and theorems relate to each other, and how it fits into the rest of Physlib. Point me to the key files/declarations to start reading.`,
  },
  {
    id: "new-ideas",
    title: "New ideas",
    summary: "Research what's missing from this area and needs formalizing.",
    template: (folder) =>
      `Research \`${folder}\` and its existing API-map.yaml (if any) against the standard textbook/reference treatment of this topic. Identify definitions, theorems, or edge cases that are missing and would be worth formalizing next, and explain why each one matters. Don't write any Lean code — just produce a prioritized list of suggestions.`,
  },
  {
    id: "sorry-finder",
    title: "Sorry finder",
    summary: "Find and attempt to close any sorrys left in the folder.",
    template: (folder) =>
      `Search \`${folder}\` for any \`sorry\` and try to complete the proof properly, without weakening the statement. If a proof genuinely can't be completed yet, leave it as \`sorry\` with a comment explaining what's missing and why it's hard.`,
  },
  {
    id: "golf",
    title: "Golf",
    summary: "Shorten proofs that are longer than they need to be.",
    template: (folder) =>
      `Look at the proofs in \`${folder}\` and golf (shorten) any that are longer than necessary, without changing what they state. Preserve declaration names, types, and docstrings — only rewrite the proof term/tactic block. Run \`lake build\` afterwards to confirm nothing broke.`,
  },
  {
    id: "rename",
    title: "Rename",
    summary: "Flag declaration names that don't match naming conventions.",
    template: (folder) =>
      `Review the declaration names in \`${folder}\` against Physlib's and mathlib's naming conventions (see the Getting Started guide). Suggest renames for anything unclear or inconsistent, and update every call site to match. Don't change the underlying statement or proof.`,
  },
  {
    id: "doc-fixer",
    title: "DocFixer",
    summary: "Write or fix docstrings for declarations that need them.",
    template: (folder) =>
      `Find declarations in \`${folder}\` that are missing a docstring, or whose docstring is inaccurate or unclear, and write concise, accurate ones. Describe what the declaration means physically or mathematically, not just its type.`,
  },
  {
    id: "api-map",
    title: "APIMap",
    summary: "Create or update the API-map.yaml describing this folder.",
    template: (folder) =>
      `Look at \`${folder}\` and either create a new \`API-map.yaml\` or update the existing one, listing each concrete requirement of the API implemented there, whether it's done, and its file/declaration location — following the schema used elsewhere in \`Physlib/**/API-map.yaml\`.`,
  },
  {
    id: "import-minimizer",
    title: "ImportMinimizer",
    summary: "Remove imports that aren't actually needed.",
    template: (folder) =>
      `Check the \`import\` statements at the top of each file in \`${folder}\` and remove any that aren't actually needed by that file, without breaking \`lake build\`.`,
  },
  {
    id: "lint-qi",
    title: "LintQI",
    summary: "Fix issues flagged by Physlib's linters.",
    template: (folder) =>
      `Run Physlib's linters over \`${folder}\` (or check its files by eye against them) and fix what they flag: missing docstrings, unused variables, \`sorry\`s, non-terminal \`simp\`, and other style violations from \`lake exe lint_qi\` / \`#lint\`.`,
  },
  {
    id: "todo",
    title: "TODO",
    summary: "Formalize an informal definition, lemma, or TODO comment.",
    template: (folder) =>
      `Look through the informal definitions, informal lemmas, semiformal results, and TODO comments in \`${folder}\` (see the TODO list) and formalize one of them properly, with a complete, sorry-free proof.`,
  }
];

// Folders aren't tracked as their own data — derive them from the import
// graph's file-level node names (e.g. "Physlib.ClassicalMechanics.Basic")
// by taking every proper dotted prefix, which is exactly the directory path.
function deriveFolders(dotText: string): string[] {
  const nodeRegex = /"([^"]+)"\s*\[/g;
  const folders = new Set<string>(["Physlib"]);
  let m: RegExpExecArray | null;
  while ((m = nodeRegex.exec(dotText)) !== null) {
    const parts = m[1].split(".");
    for (let i = 1; i < parts.length; i++) {
      folders.add(parts.slice(0, i).join("/"));
    }
  }
  return Array.from(folders).sort();
}

export function PromptsClient() {
  const [folders, setFolders] = useState<string[]>(["Physlib"]);
  const [folder, setFolder] = useState("Physlib");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    fetch("/my_graph.dot")
      .then((r) => r.text())
      .then((text) => {
        const derived = deriveFolders(text);
        setFolders(derived);
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (stored && derived.includes(stored)) setFolder(stored);
        setReady(true);
      })
      .catch(() => setReady(true));
  }, []);

  function handleFolderChange(next: string) {
    setFolder(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  }

  return (
    <div>
      <div className="mb-10 rounded-xl border border-border bg-surface-secondary/40 p-4 sm:p-5">
        <label
          htmlFor="prompts-folder"
          className="mb-2 block text-xs font-semibold uppercase tracking-wide text-muted/80"
        >
          Working folder
        </label>
        <select
          id="prompts-folder"
          value={folder}
          disabled={!ready}
          onChange={(e) => handleFolderChange(e.target.value)}
          className="h-9 w-full max-w-md rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:border-accent focus:outline-none sm:w-auto"
        >
          {folders.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
        <p className="mt-2 text-xs text-muted">
          Choose a folder to autofill the prompts below.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {PROMPTS.map((prompt) => (
          <PromptCard key={prompt.id} prompt={prompt} folder={folder} />
        ))}
      </div>
    </div>
  );
}

function PromptCard({ prompt, folder }: { prompt: PromptDef; folder: string }) {
  const [copied, setCopied] = useState<"prompt" | "preamble" | null>(null);
  const text = prompt.template(folder);

  async function onCopy(variant: "prompt" | "preamble") {
    try {
      await navigator.clipboard.writeText(variant === "preamble" ? PREAMBLE + text : text);
      setCopied(variant);
      window.setTimeout(() => setCopied(null), 1600);
    } catch {
      // Clipboard API can reject in insecure contexts or without permission;
      // the text is still visible and selectable below, so no-op.
    }
  }

  return (
    <Card variant="default">
      <Card.Header>
        <Card.Title>{prompt.title}</Card.Title>
      </Card.Header>
      <Card.Content className="text-sm text-foreground/90">
        <p className="mb-3 leading-relaxed text-muted">{prompt.summary}</p>
        <p className="mb-3 max-h-56 select-text overflow-y-auto rounded-lg border border-border bg-surface-secondary/40 p-2.5 text-xs leading-relaxed text-foreground/90">
          {text}
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onCopy("prompt")}
            className="inline-flex items-center gap-1 rounded border border-border px-2 py-1 text-xs font-medium text-muted transition-colors hover:text-accent"
          >
            {copied === "prompt" ? (
              <>
                <CheckIcon className="size-3.5" />
                Copied
              </>
            ) : (
              <>
                <CopyIcon className="size-3.5" />
                Copy prompt
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => onCopy("preamble")}
            className="inline-flex items-center gap-1 rounded border border-border px-2 py-1 text-xs font-medium text-muted transition-colors hover:text-accent"
          >
            {copied === "preamble" ? (
              <>
                <CheckIcon className="size-3.5" />
                Copied
              </>
            ) : (
              <>
                <CopyIcon className="size-3.5" />
                Copy with preamble
              </>
            )}
          </button>
        </div>
      </Card.Content>
    </Card>
  );
}
