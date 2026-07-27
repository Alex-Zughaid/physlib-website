import { site } from "@/lib/site";

type ReviewerEntry = [string, number];
type PRLink = { number: number; title: string; url: string };
type UnreviewedPR = PRLink & { labels: string[]; linesChanged: number };
type RecentPR = PRLink & { author: string };

type Report = {
  busyThreshold: number;
  busy: ReviewerEntry[];
  moderate: ReviewerEntry[];
  quiet: ReviewerEntry[];
  unreviewedPRs: UnreviewedPR[];
  mergedRecently: RecentPR[];
  openedRecently: RecentPR[];
};

async function getReport(): Promise<Report | null> {
  try {
    const res = await fetch(site.reportApi, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as Report;
  } catch {
    return null;
  }
}

export async function GithubSummary() {
  const report = await getReport();
  if (!report) return null;

  const groups: { label: string; dot: string; entries: ReviewerEntry[] }[] = [
    { label: `Busy (≥${report.busyThreshold})`, dot: "bg-danger", entries: report.busy },
    { label: "Moderate", dot: "bg-warning", entries: report.moderate },
    { label: "Quiet", dot: "bg-accent", entries: report.quiet },
  ];

  return (
    <div className="mb-8 rounded-xl border border-border bg-surface p-5">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h2 className="text-sm font-semibold text-foreground">
          Current reviewer load
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5 mb-5">
        <Stat label="Unreviewed PRs" count={report.unreviewedPRs.length} />
        <Stat label="Busy reviewers" count={report.busy.length} />
        <Stat label="Moderate" count={report.moderate.length} />
        <Stat label="Opened (24h)" count={report.openedRecently.length} />
        <Stat label="Merged (24h)" count={report.mergedRecently.length} />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {groups.map((g) => (
          <div key={g.label}>
            <div className="flex items-center gap-2 mb-2 text-xs font-medium text-muted">
              <span className={`size-2 rounded-full ${g.dot}`} />
              {g.label} ({g.entries.length})
            </div>
            {g.entries.length === 0 ? (
              <p className="text-xs text-muted/60">none</p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {g.entries.map(([login, count]) => (
                  <a
                    key={login}
                    href={`https://github.com/${login}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2 py-0.5 rounded-full text-xs bg-surface-secondary border border-border hover:bg-foreground/5"
                  >
                    {login}
                    {count > 0 && <span className="text-muted"> ({count})</span>}
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function Stat({ label, count }: { label: string; count: number }) {
  return (
    <div className="rounded-lg border border-border px-3 py-3 text-center">
      <div className="text-xl font-bold">{count}</div>
      <div className="text-[11px] text-muted mt-0.5">{label}</div>
    </div>
  );
}
