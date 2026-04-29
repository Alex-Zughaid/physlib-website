import { readFile } from "node:fs/promises";
import path from "node:path";
import yaml from "js-yaml";

const dataDir = path.join(process.cwd(), "data");

async function loadYaml<T>(file: string): Promise<T> {
  const raw = await readFile(path.join(dataDir, file), "utf8");
  return yaml.load(raw) as T;
}

export type Maintainer = {
  name: string;
  summary: string;
};

export async function getMaintainers(): Promise<Maintainer[]> {
  return loadYaml<Maintainer[]>("Maintainers.yml");
}

export type NewsItem = {
  date: string;
  content: string;
};

export async function getNews(): Promise<NewsItem[]> {
  return loadYaml<NewsItem[]>("News.yml");
}

export type ApiStatus = "Complete" | "NeedsWork" | "StartedSoon" | "NotStarted";

export type ApiEntry = {
  title: string;
  content: string;
  status: ApiStatus;
  link?: string;
};

export async function getAPIs(): Promise<ApiEntry[]> {
  return loadYaml<ApiEntry[]>("APIs.yml");
}

export type TodoCategory = {
  name: string;
  num: number;
  emoji: string;
};

export type TodoItem = {
  file: string;
  githubLink: string;
  line: number;
  isInformalDef: boolean;
  isInformalLemma: boolean;
  isSemiFormalResult: boolean;
  isSorryfulResult: boolean;
  category: string;
  name: string;
  tag: string;
  content: string;
};

export type TodoData = {
  Category: TodoCategory[];
  TODOItem: TodoItem[];
};

export async function getTodo(): Promise<TodoData> {
  return loadYaml<TodoData>("TODO.yml");
}
