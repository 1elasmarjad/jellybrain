import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const taskStatusValidator = v.union(
  v.literal("open"),
  v.literal("in_progress"),
  v.literal("blocked"),
  v.literal("complete"),
);

export const taskPriorityValidator = v.union(
  v.literal("low"),
  v.literal("medium"),
  v.literal("high"),
  v.literal("urgent"),
);

export const taskSourceTypeValidator = v.union(
  v.literal("manual"),
  v.literal("gmail"),
  v.literal("calendar"),
  v.literal("slack"),
  v.literal("instantly"),
  v.literal("drive"),
  v.literal("ai"),
);

export default defineSchema({
  teamMembers: defineTable({
    name: v.string(),
    nameKey: v.string(),
    email: v.string(),
    emailKey: v.string(),
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
    archivedAt: v.optional(v.number()),
  })
    .index("by_emailKey", ["emailKey"])
    .index("by_nameKey", ["nameKey"])
    .index("by_isActive_and_nameKey", ["isActive", "nameKey"]),

  tasks: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    dueAt: v.number(),
    status: taskStatusValidator,
    priority: taskPriorityValidator,
    assigneeType: v.union(v.literal("team"), v.literal("member")),
    assigneeMemberId: v.optional(v.id("teamMembers")),
    assigneeName: v.optional(v.string()),
    assigneeEmail: v.optional(v.string()),
    relatedPerson: v.optional(v.string()),
    relatedCompany: v.optional(v.string()),
    sourceType: taskSourceTypeValidator,
    notes: v.optional(v.string()),
    isArchived: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
    completedAt: v.optional(v.number()),
    deletedAt: v.optional(v.number()),
  })
    .index("by_isArchived_and_dueAt", ["isArchived", "dueAt"])
    .index("by_assigneeType_and_isArchived_and_dueAt", [
      "assigneeType",
      "isArchived",
      "dueAt",
    ])
    .index("by_assigneeMemberId_and_isArchived_and_dueAt", [
      "assigneeMemberId",
      "isArchived",
      "dueAt",
    ])
    .index("by_status_and_isArchived_and_dueAt", [
      "status",
      "isArchived",
      "dueAt",
    ]),
});
