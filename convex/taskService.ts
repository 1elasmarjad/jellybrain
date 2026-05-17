import type { MutationCtx, QueryCtx } from "./_generated/server";
import type { Id } from "./_generated/dataModel";

export type TaskStatus = "open" | "in_progress" | "blocked" | "complete";
export type TaskPriority = "low" | "medium" | "high" | "urgent";
export type TaskSourceType =
  | "manual"
  | "gmail"
  | "calendar"
  | "slack"
  | "instantly"
  | "drive"
  | "ai";

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function normalizeName(name: string) {
  return name.trim().toLowerCase().replace(/\s+/g, " ");
}

export function cleanOptionalText(value: string | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

export function requireText(value: string, label: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    throw new Error(`${label} is required`);
  }
  return trimmed;
}

export function requireEmail(value: string) {
  const email = normalizeEmail(value);
  if (!email) {
    throw new Error("Email is required");
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Enter a valid email address");
  }
  return email;
}

export async function getActiveTeamMemberByEmail(
  ctx: QueryCtx | MutationCtx,
  email: string,
) {
  const emailKey = normalizeEmail(email);
  const member = await ctx.db
    .query("teamMembers")
    .withIndex("by_emailKey", (q) => q.eq("emailKey", emailKey))
    .unique();

  return member && member.isActive ? member : null;
}

export async function getActiveTeamMemberByName(
  ctx: QueryCtx | MutationCtx,
  name: string,
) {
  const nameKey = normalizeName(name);
  const members = await ctx.db
    .query("teamMembers")
    .withIndex("by_nameKey", (q) => q.eq("nameKey", nameKey))
    .take(2);

  const activeMembers = members.filter((member) => member.isActive);
  if (activeMembers.length > 1) {
    throw new Error(
      `More than one active team member matches "${name}". Use assigneeEmail instead.`,
    );
  }

  return activeMembers[0] ?? null;
}

export async function resolveAssignee(
  ctx: QueryCtx | MutationCtx,
  args: {
    assigneeEmail?: string;
    assigneeName?: string;
  },
) {
  const assigneeEmail = cleanOptionalText(args.assigneeEmail);
  if (assigneeEmail) {
    const member = await getActiveTeamMemberByEmail(ctx, assigneeEmail);
    if (!member) {
      throw new Error(`No active team member found for ${assigneeEmail}`);
    }
    return {
      assigneeType: "member" as const,
      assigneeMemberId: member._id,
      assigneeName: member.name,
      assigneeEmail: member.email,
    };
  }

  const assigneeName = cleanOptionalText(args.assigneeName);
  if (assigneeName) {
    const member = await getActiveTeamMemberByName(ctx, assigneeName);
    if (!member) {
      throw new Error(`No active team member found for ${assigneeName}`);
    }
    return {
      assigneeType: "member" as const,
      assigneeMemberId: member._id,
      assigneeName: member.name,
      assigneeEmail: member.email,
    };
  }

  return {
    assigneeType: "team" as const,
    assigneeMemberId: undefined,
    assigneeName: undefined,
    assigneeEmail: undefined,
  };
}

export async function assertTaskExists(ctx: MutationCtx, taskId: Id<"tasks">) {
  const task = await ctx.db.get(taskId);
  if (!task || task.isArchived) {
    throw new Error("Task not found");
  }
  return task;
}
