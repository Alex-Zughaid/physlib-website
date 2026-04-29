import type { Metadata } from "next";
import type { ApiStatus } from "@/lib/yaml";
import { getAPIs } from "@/lib/yaml";

export const metadata: Metadata = {
  title: "APIs | Physlib",
  description:
    "A list of APIs in Physlib. One way to help the project is by enhancing and developing these APIs.",
};

const statusConfig: Record<
  ApiStatus,
  { label: string; className: string }
> = {
  Complete: {
    label: "Complete",
    className: "bg-success/15 text-success border-success/30",
  },
  NeedsWork: {
    label: "Needs Work",
    className: "bg-warning/15 text-warning border-warning/30",
  },
  StartedSoon: {
    label: "Could be Started",
    className: "bg-accent/10 text-accent border-accent/30 border-dashed",
  },
  NotStarted: {
    label: "Not Started",
    className: "bg-danger/10 text-danger border-danger/30",
  },
};

export default async function APIsPage() {
  const apis = await getAPIs();

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10 md:py-14">
      <h1 className="text-4xl font-bold tracking-tight mb-2">APIs in Physlib</h1>
      <p className="text-muted mb-6">
        The below is a list of APIs in Physlib. One way to help the project is
        by enhancing and developing these APIs.
      </p>

      <div className="flex flex-wrap gap-2 mb-8">
        {Object.entries(statusConfig).map(([, { label, className }]) => (
          <span
            key={label}
            className={`px-3 py-1 rounded-full text-xs font-medium border ${className}`}
          >
            {label}
          </span>
        ))}
      </div>

      <div className="rounded-xl border border-border overflow-hidden">
        <div className="grid grid-cols-[1fr_3fr] bg-surface-secondary text-sm font-semibold">
          <div className="px-4 py-3 border-b border-border">Title</div>
          <div className="px-4 py-3 border-b border-border border-l">Description</div>
        </div>
        {apis.map((api, i) => {
          const cfg = statusConfig[api.status] ?? statusConfig.NotStarted;
          return (
            <div
              key={i}
              className={`grid grid-cols-[1fr_3fr] text-sm border-b border-border last:border-0 ${cfg.className.split(" ")[0]}`}
            >
              <div className="px-4 py-3 border-r border-border flex items-start">
                {api.link ? (
                  <a
                    href={api.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline underline-offset-2 font-medium"
                  >
                    {api.title}
                  </a>
                ) : (
                  <span className="font-medium">{api.title}</span>
                )}
              </div>
              <div className="px-4 py-3 text-foreground/80 leading-relaxed">
                {api.content.trim()}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
