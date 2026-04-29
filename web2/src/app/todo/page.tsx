import type { Metadata } from "next";
import { getTodo } from "@/lib/yaml";
import { TodoClient } from "./todo-client";

export const metadata: Metadata = {
  title: "TODO List | Physlib",
  description:
    "The TODO list for Physlib — automatically generated from the Lean files. Filterable by category and item type.",
};

export default async function TodoPage() {
  const data = await getTodo();
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 md:py-14">
      <h1 className="text-4xl font-bold tracking-tight mb-2">TODO List</h1>
      <p className="text-muted mb-6">
        This TODO list is automatically created from the Lean files.
      </p>

      <div className="flex flex-wrap gap-2 mb-8">
        {legend.map((item) => (
          <span
            key={item.label}
            className={`px-3 py-1 rounded-full text-xs font-medium border ${item.className}`}
          >
            {item.label}
          </span>
        ))}
      </div>

      <TodoClient data={data} />
    </div>
  );
}

const legend = [
  {
    label: "Informal Definition",
    className: "bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400",
  },
  {
    label: "Informal Lemma",
    className: "bg-orange-500/10 text-orange-600 border-orange-500/20 dark:text-orange-400",
  },
  {
    label: "Semiformal Result",
    className: "bg-sky-500/10 text-sky-600 border-sky-500/20 dark:text-sky-400",
  },
  {
    label: "Sorryful Result",
    className: "bg-purple-500/10 text-purple-700 border-purple-500/20 dark:text-purple-400",
  },
  {
    label: "TODO Item",
    className: "bg-teal-500/10 text-teal-700 border-teal-500/20 dark:text-teal-400",
  },
];
