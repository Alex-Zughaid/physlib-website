"use client";

import { useEffect, useState } from "react";
import { site } from "@/lib/site";

type MonthEntry = {
  month: string; // "2026-01"
  label: string; // "Jan 2026"
  contributors: string[];
  linesChanged: number;
  diffFile: string; // "2026-01.diff"
};

async function fetchMonths(): Promise<MonthEntry[]> {
  const res = await fetch(`${site.monthlyDiffsRepo}/index.json`);
  if (!res.ok) throw new Error(`Failed to fetch index.json: ${res.status}`);
  return (await res.json()) as MonthEntry[];
}

export function MonthlyUpdatesClient() {
  const [months, setMonths] = useState<MonthEntry[]>([]);
  const [status, setStatus] = useState<"loading" | "error" | "ok">("loading");

  useEffect(() => {
    fetchMonths()
      .then((data) => {
        setMonths([...data].sort((a, b) => a.month.localeCompare(b.month)));
        setStatus("ok");
      })
      .catch(() => setStatus("error"));
  }, []);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center py-20 text-muted">
        Loading monthly updates…
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex items-center justify-center py-20 text-danger">
        Failed to load monthly updates. Please try refreshing the page.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-surface-secondary">
            <th className="px-4 py-3 text-left font-semibold border-b border-border" style={{ width: "15%" }}>
              Month
            </th>
            <th className="px-4 py-3 text-left font-semibold border-b border-border" style={{ width: "40%" }}>
              Contributors
            </th>
            <th className="px-4 py-3 text-left font-semibold border-b border-border" style={{ width: "20%" }}>
              Lines changed
            </th>
            <th className="px-4 py-3 text-left font-semibold border-b border-border" style={{ width: "25%" }}>
              Diff
            </th>
          </tr>
        </thead>
        <tbody>
          {months.length === 0 && (
            <tr>
              <td colSpan={4} className="px-4 py-8 text-center text-muted">
                No monthly updates yet.
              </td>
            </tr>
          )}
          {months.map((m) => (
            <tr
              key={m.month}
              className="border-b border-border last:border-0 hover:bg-surface-secondary/50 transition-colors align-top"
            >
              <td className="px-4 py-3 font-medium">{m.label}</td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-1">
                  {m.contributors.map((c) => (
                    <span
                      key={c}
                      className="px-2 py-0.5 rounded-full text-xs font-medium bg-accent/10 text-accent"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </td>
              <td className="px-4 py-3 font-mono text-xs text-muted">
                {m.linesChanged.toLocaleString()}
              </td>
              <td className="px-4 py-3">
                <a
                  href={`${site.monthlyDiffsRepo}/${m.diffFile}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline underline-offset-2"
                >
                  View diff ↗
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
