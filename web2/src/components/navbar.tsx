"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { site } from "@/lib/site";
import { ThemeToggle } from "./theme-toggle";

const links = [
  { label: "Docs", href: site.docs },
  { label: "Todo list", href: "/todo" },
  { label: "Get Involved", href: "/get-involved" },
  { label: "Trackers", href: "/api-tracker" },
  { label: "Sponsor", href: "/sponsor" },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isHome = pathname === "/";

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-200 ${
          isHome
            ? "bg-transparent"
            : "bg-background/90 backdrop-blur-md border-b border-border"
        }`}
      >
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-5 sm:px-8">

          {/* Wordmark */}
          <Link
            href="/"
            className="text-xl font-semibold text-accent transition-opacity hover:opacity-70"
            style={{ letterSpacing: "-0.025em" }}
          >
            {site.name}
          </Link>

          {/* Desktop nav — centered */}
          <nav className="hidden absolute left-1/2 -translate-x-1/2 items-center md:flex">
            {links.map((item) => {
              const active =
                item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-1.5 text-sm transition-colors ${
                    active ? "text-foreground" : "text-muted hover:text-foreground"
                  }`}
                  style={{ letterSpacing: "-0.01em" }}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right */}
          <div className="flex items-center gap-2">
            <a
              href={site.search}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 h-8 rounded px-3 text-xs font-medium transition-opacity hover:opacity-80"
              style={{
                background: "var(--accent)",
                color: "var(--accent-foreground)",
                letterSpacing: "-0.01em",
              }}
            >
              Search
            </a>
            <a
              href={site.github}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 h-8 rounded px-3 text-xs font-medium transition-opacity hover:opacity-80"
              style={{
                background: "var(--section-emphasis)",
                color: "var(--section-emphasis-fg)",
                letterSpacing: "-0.01em",
              }}
            >
              <GitHubIcon />
              GitHub
            </a>
            <ThemeToggle />
            <button
              onClick={() => setOpen((v: boolean) => !v)}
              aria-label="Toggle menu"
              className="inline-flex md:hidden items-center justify-center size-8 rounded border border-border text-muted hover:text-foreground transition-colors"
            >
              {open ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile fullscreen */}
      {open && (
        <div className="fixed inset-0 z-40 flex flex-col bg-background pt-14 md:hidden">
          <nav className="flex flex-col px-5 py-6 border-t border-border">
            {links.map((item) => {
              const active =
                item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`py-3 text-base border-b border-border transition-colors ${
                    active ? "text-foreground" : "text-muted hover:text-foreground"
                  }`}
                  style={{ letterSpacing: "-0.01em" }}
                >
                  {item.label}
                </Link>
              );
            })}
            <div className="mt-6 flex flex-col gap-3">
              <a
                href={site.search}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="inline-flex items-center gap-2 h-11 rounded px-4 text-sm font-medium w-full justify-center transition-opacity hover:opacity-80"
                style={{ background: "var(--accent)", color: "var(--accent-foreground)" }}
              >
                Search Physlib
              </a>
              <a
                href={site.github}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="inline-flex items-center gap-2 h-11 rounded px-4 text-sm font-medium w-full justify-center transition-opacity hover:opacity-80"
                style={{ background: "var(--section-emphasis)", color: "var(--section-emphasis-fg)" }}
              >
                <GitHubIcon />
                GitHub
              </a>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}

function GitHubIcon() {
  return (
    <svg aria-hidden className="size-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56 0-.27-.01-1.17-.02-2.13-3.2.7-3.88-1.36-3.88-1.36-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.76 2.69 1.25 3.35.96.1-.74.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.18-3.09-.12-.29-.51-1.45.11-3.02 0 0 .96-.31 3.15 1.18a10.93 10.93 0 0 1 5.74 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.57.23 2.73.11 3.02.74.8 1.18 1.83 1.18 3.09 0 4.42-2.69 5.4-5.25 5.68.41.36.78 1.06.78 2.13 0 1.54-.01 2.78-.01 3.16 0 .31.21.67.8.55C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg aria-hidden className="size-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg aria-hidden className="size-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}
