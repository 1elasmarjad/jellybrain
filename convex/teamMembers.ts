import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import {
  cleanOptionalText,
  normalizeName,
  requireEmail,
  requireText,
} from "./taskService";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("teamMembers")
      .withIndex("by_isActive_and_nameKey", (q) => q.eq("isActive", true))
      .order("asc")
      .take(100);
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const name = requireText(args.name, "Name");
    const email = requireEmail(args.email);
    const emailKey = email;
    const existing = await ctx.db
      .query("teamMembers")
      .withIndex("by_emailKey", (q) => q.eq("emailKey", emailKey))
      .unique();

    const now = Date.now();
    if (existing) {
      if (existing.isActive) {
        throw new Error("A team member with this email already exists");
      }

      await ctx.db.patch(existing._id, {
        name,
        nameKey: normalizeName(name),
        email,
        emailKey,
        isActive: true,
        updatedAt: now,
        archivedAt: undefined,
      });
      return existing._id;
    }

    return await ctx.db.insert("teamMembers", {
      name,
      nameKey: normalizeName(name),
      email,
      emailKey,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const update = mutation({
  args: {
    memberId: v.id("teamMembers"),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const member = await ctx.db.get(args.memberId);
    if (!member || !member.isActive) {
      throw new Error("Team member not found");
    }

    const name = cleanOptionalText(args.name) ?? member.name;
    const email = args.email ? requireEmail(args.email) : member.email;
    const emailKey = email;
    const duplicate = await ctx.db
      .query("teamMembers")
      .withIndex("by_emailKey", (q) => q.eq("emailKey", emailKey))
      .unique();

    if (duplicate && duplicate._id !== args.memberId && duplicate.isActive) {
      throw new Error("A team member with this email already exists");
    }

    await ctx.db.patch(args.memberId, {
      name,
      nameKey: normalizeName(name),
      email,
      emailKey,
      updatedAt: Date.now(),
    });

    return args.memberId;
  },
});

export const archive = mutation({
  args: {
    memberId: v.id("teamMembers"),
  },
  handler: async (ctx, args) => {
    const member = await ctx.db.get(args.memberId);
    if (!member || !member.isActive) {
      throw new Error("Team member not found");
    }

    const now = Date.now();
    await ctx.db.patch(args.memberId, {
      isActive: false,
      updatedAt: now,
      archivedAt: now,
    });

    return args.memberId;
  },
});
