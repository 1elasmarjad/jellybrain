"use client";

import { useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { useQuery } from "convex/react";
import {
  Bell,
  CheckCircle2,
  Folder,
  MessageCircle,
  MoreVertical,
  Settings2,
  UsersRound,
} from "lucide-react";
import { api } from "@/convex/_generated/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/ui/nav-link";

function sameLocalDay(first: number, second: number) {
  const a = new Date(first);
  const b = new Date(second);
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const queriedTasks = useQuery(api.tasks.listActive);
  const queriedMembers = useQuery(api.teamMembers.list);
  const tasks = useMemo(() => queriedTasks ?? [], [queriedTasks]);
  const members = useMemo(() => queriedMembers ?? [], [queriedMembers]);
  const [renderedAt] = useState(() => Date.now());
  const dueTodayCount = tasks.filter(
    (task) =>
      task.status !== "complete" &&
      task.dueAt >= renderedAt &&
      sameLocalDay(task.dueAt, renderedAt),
  ).length;
  const taskSettingsActive = pathname.startsWith("/tasks/settings");

  return (
    <main className="min-h-screen bg-surface-container-low text-foreground">
      <div className="grid min-h-screen lg:grid-cols-[304px_1fr]">
        <aside className="border-b border-outline-variant bg-surface-container-lowest lg:border-b-0 lg:border-r">
          <div className="flex h-full flex-col">
            <div className="flex min-h-24 items-center justify-between gap-4 border-b border-outline-variant px-6">
              <div className="flex min-w-0 items-center gap-4">
                <div
                  className="grid size-12 shrink-0 place-items-center rounded-2xl bg-on-surface text-xl font-black text-on-primary"
                  aria-hidden="true"
                >
                  J
                </div>
                <div className="min-w-0">
                  <p className="truncate text-xl font-black tracking-tight text-on-surface">
                    Jellybrain
                  </p>
                  <p className="mt-1 text-xs font-semibold text-on-surface-variant">
                    Command center
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Open workspace menu"
                className="text-on-surface-variant"
              >
                <MoreVertical className="size-5" aria-hidden="true" />
              </Button>
            </div>

            <nav className="grid gap-2 px-4 py-6" aria-label="Primary">
              <SidebarNavLink
                href="/tasks"
                active={!taskSettingsActive}
                icon={<CheckCircle2 className="size-7" aria-hidden="true" />}
                label="Tasks"
                description="Today, overdue, upcoming"
                badge={dueTodayCount > 0 ? String(dueTodayCount) : undefined}
              />
              <SidebarNavLink
                href="/tasks/settings"
                active={taskSettingsActive}
                icon={<Settings2 className="size-7" aria-hidden="true" />}
                label="Task settings"
                description="Members and defaults"
              />

              <div className="mt-4 grid gap-2 border-t border-outline-variant pt-4">
                <SidebarPlaceholder
                  icon={<MessageCircle className="size-7" aria-hidden="true" />}
                  label="Inbox"
                />
                <SidebarPlaceholder
                  icon={<Folder className="size-7" aria-hidden="true" />}
                  label="Projects"
                />
                <SidebarPlaceholder
                  icon={<Bell className="size-7" aria-hidden="true" />}
                  label="Notifications"
                />
                <SidebarPlaceholder
                  icon={<UsersRound className="size-7" aria-hidden="true" />}
                  label="Team"
                />
              </div>
            </nav>

            <div className="mt-auto px-4 pb-5">
              <div className="rounded-xl border border-outline-variant bg-surface-container-low px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-bold text-on-surface">Routing</p>
                  <Badge tone="blue">{tasks.length}</Badge>
                </div>
                <p className="mt-2 text-xs leading-5 text-on-surface-variant">
                  {members.length === 0
                    ? "Add members so work can be assigned by name or email."
                    : `${members.length} active members available for assignment.`}
                </p>
              </div>
            </div>
          </div>
        </aside>
        <section className="min-w-0 bg-background px-4 py-5 sm:px-6 lg:px-8">
          {children}
        </section>
      </div>
    </main>
  );
}

function SidebarNavLink({
  href,
  active,
  icon,
  label,
  description,
  badge,
}: {
  href: string;
  active: boolean;
  icon: React.ReactNode;
  label: string;
  description: string;
  badge?: string;
}) {
  return (
    <NavLink href={href} active={active}>
      <span className="flex min-w-0 items-center gap-4">
        <span
          className={[
            "grid size-10 shrink-0 place-items-center rounded-lg",
            active
              ? "bg-primary/10 text-primary"
              : "text-on-surface-variant group-hover:text-primary",
          ].join(" ")}
        >
          {icon}
        </span>
        <span className="min-w-0">
          <span className="block truncate text-base font-bold">{label}</span>
          <span className="mt-1 block truncate text-xs font-semibold text-on-surface-variant">
            {description}
          </span>
        </span>
      </span>
      {badge ? (
        <span className="grid size-7 shrink-0 place-items-center rounded-full bg-danger text-sm font-black text-on-primary">
          {badge}
        </span>
      ) : null}
    </NavLink>
  );
}

function SidebarPlaceholder({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div
      className="flex min-h-14 items-center gap-4 rounded-xl border border-transparent px-4 py-3 text-on-surface-variant/70"
      aria-disabled="true"
    >
      <span className="grid size-10 shrink-0 place-items-center rounded-lg">
        {icon}
      </span>
      <span className="truncate text-base font-bold">{label}</span>
    </div>
  );
}
