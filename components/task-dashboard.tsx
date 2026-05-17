"use client";

import { FormEvent, useMemo, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input, Select, Textarea } from "@/components/ui/field";

type Task = Doc<"tasks">;
type TeamMember = Doc<"teamMembers">;
type TaskStatus = Task["status"];
type TaskPriority = Task["priority"];
type TaskUpdatePatch = {
  dueAt?: number;
  priority?: TaskPriority;
  assigneeEmail?: string;
  clearAssignee?: boolean;
};

const statusLabels: Record<TaskStatus, string> = {
  open: "Open",
  in_progress: "In progress",
  blocked: "Blocked",
  complete: "Complete",
};

const priorityLabels: Record<TaskPriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  urgent: "Urgent",
};

const priorityTone: Record<TaskPriority, "neutral" | "blue" | "amber" | "red"> =
  {
    low: "neutral",
    medium: "blue",
    high: "amber",
    urgent: "red",
  };

function toDateTimeLocal(timestamp: number) {
  const date = new Date(timestamp);
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

function fromDateTimeLocal(value: string) {
  return new Date(value).getTime();
}

function defaultDueAt() {
  const date = new Date();
  date.setHours(date.getHours() + 1, 0, 0, 0);
  return toDateTimeLocal(date.getTime());
}

function sameLocalDay(first: number, second: number) {
  const a = new Date(first);
  const b = new Date(second);
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function formatDueAt(timestamp: number) {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(timestamp));
}

function groupTasks(tasks: Task[]) {
  const now = Date.now();
  return {
    overdue: tasks.filter(
      (task) => task.status !== "complete" && task.dueAt < now,
    ),
    today: tasks.filter(
      (task) =>
        task.status !== "complete" &&
        task.dueAt >= now &&
        sameLocalDay(task.dueAt, now),
    ),
    upcoming: tasks.filter(
      (task) =>
        task.status !== "complete" &&
        task.dueAt >= now &&
        !sameLocalDay(task.dueAt, now),
    ),
    completed: tasks.filter((task) => task.status === "complete"),
  };
}

export function TasksPage() {
  const queriedTasks = useQuery(api.tasks.listActive);
  const queriedMembers = useQuery(api.teamMembers.list);
  const tasks = useMemo(() => queriedTasks ?? [], [queriedTasks]);
  const members = useMemo(() => queriedMembers ?? [], [queriedMembers]);
  const createTask = useMutation(api.tasks.create);
  const updateTask = useMutation(api.tasks.update);
  const setTaskStatus = useMutation(api.tasks.setStatus);
  const archiveTask = useMutation(api.tasks.archive);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueAt, setDueAt] = useState(defaultDueAt);
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [assignee, setAssignee] = useState("team");
  const [error, setError] = useState<string | null>(null);
  const groups = useMemo(() => groupTasks(tasks), [tasks]);
  const blockedCount = tasks.filter((task) => task.status === "blocked").length;

  async function run(action: () => Promise<unknown>) {
    setError(null);
    try {
      await action();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  async function handleTaskSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await run(async () => {
      await createTask({
        title,
        description,
        dueAt: fromDateTimeLocal(dueAt),
        priority,
        assigneeEmail: assignee === "team" ? undefined : assignee,
      });
      setTitle("");
      setDescription("");
      setDueAt(defaultDueAt());
      setPriority("medium");
      setAssignee("team");
    });
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-6">
      <ErrorBanner message={error} />
      <header className="grid gap-4 border-b border-outline-variant pb-5 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-on-surface">
            Tasks
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-on-surface-variant">
            Capture work quickly, assign it clearly, and keep attention on the
            next deadline.
          </p>
        </div>
        <div className="grid grid-cols-4 gap-2 text-sm">
          <Metric label="Total" value={tasks.length} tone="blue" />
          <Metric label="Overdue" value={groups.overdue.length} tone="red" />
          <Metric label="Today" value={groups.today.length} tone="blue" />
          <Metric label="Blocked" value={blockedCount} tone="amber" />
        </div>
      </header>

      <Card className="p-4">
        <form className="grid gap-3" onSubmit={handleTaskSubmit}>
          <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_180px_180px_140px_auto] lg:items-end">
            <Field label="Task">
              <Input
                required
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Follow up with investor"
              />
            </Field>
            <Field label="Owner">
              <Select
                value={assignee}
                onChange={(event) => setAssignee(event.target.value)}
              >
                <option value="team">Whole team</option>
                {members.map((member) => (
                  <option key={member._id} value={member.email}>
                    {member.name}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Due">
              <Input
                required
                type="datetime-local"
                value={dueAt}
                onChange={(event) => setDueAt(event.target.value)}
                onInput={(event) => setDueAt(event.currentTarget.value)}
              />
            </Field>
            <Field label="Priority">
              <Select
                value={priority}
                onChange={(event) =>
                  setPriority(event.target.value as TaskPriority)
                }
              >
                {Object.entries(priorityLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Select>
            </Field>
            <Button type="submit" className="lg:mb-0">
              Add
            </Button>
          </div>
          <Textarea
            aria-label="Task context"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className="min-h-16"
            placeholder="Optional context, source, or next-step detail."
          />
        </form>
      </Card>

      <section className="grid gap-5 xl:grid-cols-2">
        <TaskSection
          title="Needs attention"
          groups={[
            { label: "Overdue", tasks: groups.overdue },
            { label: "Due today", tasks: groups.today },
          ]}
          empty="No urgent work right now."
          members={members}
          onUpdate={(taskId, patch) =>
            run(() => updateTask({ taskId, ...patch }))
          }
          onStatus={(taskId, status) =>
            run(() => setTaskStatus({ taskId, status }))
          }
          onArchive={(taskId) => run(() => archiveTask({ taskId }))}
        />
        <TaskSection
          title="Planned work"
          groups={[
            { label: "Upcoming", tasks: groups.upcoming },
            { label: "Completed", tasks: groups.completed },
          ]}
          empty="Create a task to start building the plan."
          members={members}
          onUpdate={(taskId, patch) =>
            run(() => updateTask({ taskId, ...patch }))
          }
          onStatus={(taskId, status) =>
            run(() => setTaskStatus({ taskId, status }))
          }
          onArchive={(taskId) => run(() => archiveTask({ taskId }))}
        />
      </section>
    </div>
  );
}

export function TaskSettingsPage() {
  const queriedMembers = useQuery(api.teamMembers.list);
  const members = useMemo(() => queriedMembers ?? [], [queriedMembers]);
  const createMember = useMutation(api.teamMembers.create);
  const archiveMember = useMutation(api.teamMembers.archive);

  const [memberName, setMemberName] = useState("");
  const [memberEmail, setMemberEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function run(action: () => Promise<unknown>) {
    setError(null);
    try {
      await action();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  async function handleMemberSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await run(async () => {
      await createMember({ name: memberName, email: memberEmail });
      setMemberName("");
      setMemberEmail("");
    });
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-6">
      <ErrorBanner message={error} />
      <header className="border-b border-outline-variant pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-on-surface">
          Task settings
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-on-surface-variant">
          Manage the small team list that agents use when routing work by name
          or email.
        </p>
      </header>

      <div className="grid gap-5 xl:grid-cols-[420px_1fr]">
        <Card className="p-5">
          <h2 className="text-base font-bold text-on-surface">Team members</h2>
          <form className="mt-4 grid gap-3" onSubmit={handleMemberSubmit}>
            <Field label="Name">
              <Input
                required
                value={memberName}
                onChange={(event) => setMemberName(event.target.value)}
                placeholder="Jad"
              />
            </Field>
            <Field label="Email">
              <Input
                required
                type="email"
                value={memberEmail}
                onChange={(event) => setMemberEmail(event.target.value)}
                placeholder="jad@example.com"
              />
            </Field>
            <Button type="submit" variant="secondary">
              Add member
            </Button>
          </form>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-base font-bold text-on-surface">
              Assignment directory
            </h2>
            <Badge tone="neutral">{members.length}</Badge>
          </div>
          <div className="mt-4 grid gap-2">
            {members.length === 0 ? (
              <p className="rounded-md bg-surface-container-low p-4 text-sm leading-6 text-on-surface-variant">
                Add the people AI should be able to assign work to. Email is
                the stable identifier.
              </p>
            ) : null}
            {members.map((member) => (
              <div
                key={member._id}
                className="flex items-center justify-between gap-3 rounded-md border border-outline-variant px-3 py-2"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-on-surface">
                    {member.name}
                  </p>
                  <p className="truncate text-xs text-on-surface-variant">
                    {member.email}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => run(() => archiveMember({ memberId: member._id }))}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-5">
        <h2 className="text-base font-bold text-on-surface">Task defaults</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <SettingSummary label="Default owner" value="Whole team" />
          <SettingSummary label="Default priority" value="Medium" />
          <SettingSummary label="Removal" value="Archived, not deleted" />
        </div>
      </Card>
    </div>
  );
}

function ErrorBanner({ message }: { message: string | null }) {
  if (!message) return null;

  return (
    <div className="rounded-md border border-danger-soft bg-danger-soft px-4 py-3 text-sm font-semibold text-danger">
      {message}
    </div>
  );
}

function Metric({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "blue" | "amber" | "red";
}) {
  return (
    <div className="rounded-md border border-outline-variant bg-surface-container-lowest px-3 py-2">
      <p className={`text-xl font-bold ${toneClass(tone)}`}>{value}</p>
      <p className="text-xs font-semibold text-on-surface-variant">{label}</p>
    </div>
  );
}

function TaskSection({
  title,
  groups,
  empty,
  members,
  onUpdate,
  onStatus,
  onArchive,
}: {
  title: string;
  groups: Array<{ label: string; tasks: Task[] }>;
  empty: string;
  members: TeamMember[];
  onUpdate: (taskId: Task["_id"], patch: TaskUpdatePatch) => Promise<void>;
  onStatus: (taskId: Task["_id"], status: TaskStatus) => Promise<void>;
  onArchive: (taskId: Task["_id"]) => Promise<void>;
}) {
  const totalTasks = groups.reduce((count, group) => count + group.tasks.length, 0);

  return (
    <Card>
      <div className="flex items-center justify-between border-b border-outline-variant px-5 py-4">
        <h2 className="text-base font-bold text-on-surface">{title}</h2>
        <Badge tone="neutral">{totalTasks}</Badge>
      </div>
      <div className="grid gap-4 p-4">
        {totalTasks === 0 ? (
          <p className="rounded-md bg-surface-container-low p-4 text-sm text-on-surface-variant">
            {empty}
          </p>
        ) : null}
        {groups.map((group) =>
          group.tasks.length > 0 ? (
            <div key={group.label} className="grid gap-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase text-on-surface-variant">
                  {group.label}
                </h3>
                <span className="text-xs font-bold text-on-surface-variant">
                  {group.tasks.length}
                </span>
              </div>
              {group.tasks.map((task) => (
                <TaskRow
                  key={task._id}
                  task={task}
                  members={members}
                  onUpdate={onUpdate}
                  onStatus={onStatus}
                  onArchive={onArchive}
                />
              ))}
            </div>
          ) : null,
        )}
      </div>
    </Card>
  );
}

function TaskRow({
  task,
  members,
  onUpdate,
  onStatus,
  onArchive,
}: {
  task: Task;
  members: TeamMember[];
  onUpdate: (taskId: Task["_id"], patch: TaskUpdatePatch) => Promise<void>;
  onStatus: (taskId: Task["_id"], status: TaskStatus) => Promise<void>;
  onArchive: (taskId: Task["_id"]) => Promise<void>;
}) {
  const assigneeValue =
    task.assigneeType === "member" ? (task.assigneeEmail ?? "team") : "team";

  return (
    <article
      data-testid={`task-row-${task._id}`}
      data-task-title={task.title}
      className="grid gap-3 rounded-md border border-outline-variant bg-surface-container-lowest p-3"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="text-sm font-bold text-on-surface">{task.title}</h4>
            <Badge tone={priorityTone[task.priority]}>
              {priorityLabels[task.priority]}
            </Badge>
            {task.status === "blocked" ? <Badge tone="amber">Blocked</Badge> : null}
          </div>
          {task.description ? (
            <p className="mt-1 text-sm leading-5 text-on-surface-variant">
              {task.description}
            </p>
          ) : null}
          <p className="mt-2 text-xs font-semibold text-on-surface-variant">
            {task.assigneeType === "member"
              ? `${task.assigneeName} - ${task.assigneeEmail}`
              : "Whole team"}{" "}
            - Due {formatDueAt(task.dueAt)}
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={() => onArchive(task._id)}>
          Archive
        </Button>
      </div>

      <div className="grid gap-2 md:grid-cols-4">
        <Select
          aria-label={`Status for ${task.title}`}
          value={task.status}
          onChange={(event) =>
            onStatus(task._id, event.target.value as TaskStatus)
          }
        >
          {Object.entries(statusLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
        <Select
          aria-label={`Priority for ${task.title}`}
          value={task.priority}
          onChange={(event) =>
            onUpdate(task._id, {
              priority: event.target.value as TaskPriority,
            })
          }
        >
          {Object.entries(priorityLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
        <Select
          aria-label={`Assignee for ${task.title}`}
          value={assigneeValue}
          onChange={(event) =>
            event.target.value === "team"
              ? onUpdate(task._id, { clearAssignee: true })
              : onUpdate(task._id, { assigneeEmail: event.target.value })
          }
        >
          <option value="team">Whole team</option>
          {members.map((member) => (
            <option key={member._id} value={member.email}>
              {member.name}
            </option>
          ))}
        </Select>
        <Input
          aria-label={`Due date for ${task.title}`}
          type="datetime-local"
          value={toDateTimeLocal(task.dueAt)}
          onInput={(event) =>
            onUpdate(task._id, {
              dueAt: fromDateTimeLocal(event.currentTarget.value),
            })
          }
          onChange={(event) =>
            onUpdate(task._id, {
              dueAt: fromDateTimeLocal(event.target.value),
            })
          }
        />
      </div>
    </article>
  );
}

function SettingSummary({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-outline-variant bg-surface-container-low px-3 py-3">
      <p className="text-xs font-bold text-on-surface-variant">{label}</p>
      <p className="mt-1 text-sm font-bold text-on-surface">{value}</p>
    </div>
  );
}

function toneClass(tone: "blue" | "amber" | "red") {
  if (tone === "red") return "text-danger";
  if (tone === "amber") return "text-amber-700";
  return "text-primary";
}
