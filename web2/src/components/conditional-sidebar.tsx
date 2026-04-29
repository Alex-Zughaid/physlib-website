"use client";

import { usePathname } from "next/navigation";
import { SidebarNav } from "./sidebar-nav";

export function ConditionalSidebar() {
  const pathname = usePathname();
  if (pathname === "/") return null;
  return <SidebarNav />;
}
