import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import type { Id } from "./_generated/dataModel";
import {
  taskPriorityValidator,
  taskSourceTypeValidator,
  taskStatusValidator,
} from "./schema";
import {
  assertTaskExists,
  cleanOptionalText,
  resolveAssignee,
} from "./taskService";

export const listActive = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("tasks")
      .withIndex("by_isArchived_and_dueAt", (q) => q.eq("isArchived", false))
      .order("asc")
      .take(200);
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    dueAt: v.number(),
    priority: v.optional(taskPriorityValidator),
    assigneeEmail: v.optional(v.string()),
    assigneeName: v.optional(v.string()),
    relatedPerson: v.optional(v.string()),
    relatedCompany: v.optional(v.string()),
    sourceType: v.optional(taskSourceTypeValidator),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const title = args.title.trim();
    if (!title) {
      throw new Error("Title is required");
    }
    if (!Number.isFinite(args.dueAt)) {
      throw new Error("Due date is required");
    }

    const assignee = await resolveAssignee(ctx, args);
    const now = Date.now();

    return await ctx.db.insert("tasks", {
      title,
      description: cleanOptionalText(args.description),
      dueAt: args.dueAt,
      status: "open",
      priority: args.priority ?? "medium",
      ...assignee,
      relatedPerson: cleanOptionalText(args.relatedPerson),
      relatedCompany: cleanOptionalText(args.relatedCompany),
      sourceType: args.sourceType ?? "manual",
      notes: cleanOptionalText(args.notes),
      isArchived: false,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const update = mutation({
  args: {
    taskId: v.id("tasks"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    dueAt: v.optional(v.number()),
    priority: v.optional(taskPriorityValidator),
    status: v.optional(taskStatusValidator),
    assigneeEmail: v.optional(v.string()),
    assigneeName: v.optional(v.string()),
    clearAssignee: v.optional(v.boolean()),
    relatedPerson: v.optional(v.string()),
    relatedCompany: v.optional(v.string()),
    sourceType: v.optional(taskSourceTypeValidator),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await assertTaskExists(ctx, args.taskId);
    const patch: {
      title?: string;
      description?: string;
      dueAt?: number;
      priority?: "low" | "medium" | "high" | "urgent";
      status?: "open" | "in_progress" | "blocked" | "complete";
      assigneeType?: "team" | "member";
      assigneeMemberId?: Id<"teamMembers">;
      assigneeName?: string;
      assigneeEmail?: string;
      relatedPerson?: string;
      relatedCompany?: string;
      sourceType?:
        | "manual"
        | "gmail"
        | "calendar"
        | "slack"
        | "instantly"
        | "drive"
        | "ai";
      notes?: string;
      completedAt?: number;
      updatedAt: number;
    } = {
      updatedAt: Date.now(),
    };

    if (args.title !== undefined) {
      const title = args.title.trim();
      if (!title) {
        throw new Error("Title is required");
      }
      patch.title = title;
    }
    if (args.description !== undefined) {
      patch.description = cleanOptionalText(args.description);
    }
    if (args.dueAt !== undefined) {
      if (!Number.isFinite(args.dueAt)) {
        throw new Error("Due date is required");
      }
      patch.dueAt = args.dueAt;
    }
    if (args.priority !== undefined) {
      patch.priority = args.priority;
    }
    if (args.status !== undefined) {
      patch.status = args.status;
      patch.completedAt = args.status === "complete" ? Date.now() : undefined;
    }
    if (
      args.clearAssignee ||
      args.assigneeEmail !== undefined ||
      args.assigneeName !== undefined
    ) {
      const assignee = args.clearAssignee
        ? await resolveAssignee(ctx, {})
        : await resolveAssignee(ctx, args);
      patch.assigneeType = assignee.assigneeType;
      patch.assigneeMemberId = assignee.assigneeMemberId;
      patch.assigneeName = assignee.assigneeName;
      patch.assigneeEmail = assignee.assigneeEmail;
    }
    if (args.relatedPerson !== undefined) {
      patch.relatedPerson = cleanOptionalText(args.relatedPerson);
    }
    if (args.relatedCompany !== undefined) {
      patch.relatedCompany = cleanOptionalText(args.relatedCompany);
    }
    if (args.sourceType !== undefined) {
      patch.sourceType = args.sourceType;
    }
    if (args.notes !== undefined) {
      patch.notes = cleanOptionalText(args.notes);
    }

    await ctx.db.patch(args.taskId, patch);
    return args.taskId;
  },
});

export const setStatus = mutation({
  args: {
    taskId: v.id("tasks"),
    status: taskStatusValidator,
  },
  handler: async (ctx, args) => {
    await assertTaskExists(ctx, args.taskId);
    await ctx.db.patch(args.taskId, {
      status: args.status,
      completedAt: args.status === "complete" ? Date.now() : undefined,
      updatedAt: Date.now(),
    });
    return args.taskId;
  },
});

export const archive = mutation({
  args: {
    taskId: v.id("tasks"),
  },
  handler: async (ctx, args) => {
    await assertTaskExists(ctx, args.taskId);
    const now = Date.now();
    await ctx.db.patch(args.taskId, {
      isArchived: true,
      deletedAt: now,
      updatedAt: now,
    });
    return args.taskId;
  },
});
