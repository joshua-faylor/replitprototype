import { sql } from "drizzle-orm";
import {
  boolean,
  date,
  integer,
  numeric,
  pgTable,
  smallint,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const savingsProgress = pgTable("savings_progress", {
  id: varchar("id").primaryKey(),
  goalAmount: integer("goal_amount").notNull().default(150000),
  currentAmount: integer("current_amount").notNull().default(0),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const homeStyles = pgTable("home_styles", {
  styleId: uuid("style_id").primaryKey().defaultRandom(),
  styleName: varchar("style_name", { length: 255 }).notNull().unique(),
  imageUrl: varchar("image_url", { length: 255 }),
  sortOrder: integer("sort_order"),
});

export const savingsGoals = pgTable("savings_goals", {
  goalId: uuid("goal_id").primaryKey().defaultRandom(),
  userId: varchar("user_id")
    .notNull()
    .references(() => users.id),
  goalName: varchar("goal_name", { length: 255 }).notNull(),
  targetAmount: numeric("target_amount", { precision: 15, scale: 2 }),
  currentAmount: numeric("current_amount", { precision: 15, scale: 2 })
    .notNull()
    .default("0"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const buildPlans = pgTable("build_plans", {
  planId: uuid("plan_id").primaryKey().defaultRandom(),
  goalId: uuid("goal_id")
    .notNull()
    .references(() => savingsGoals.goalId),
  styleId: uuid("style_id")
    .notNull()
    .references(() => homeStyles.styleId),
  squareFootage: integer("square_footage"),
  yardSize: integer("yard_size"),
  sizeCategory: varchar("size_category", { length: 50 }),
  hasBasement: boolean("has_basement"),
  hasPool: boolean("has_pool"),
  hasSolar: boolean("has_solar"),
  bedrooms: smallint("bedrooms"),
  bathrooms: smallint("bathrooms"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const savingsEntries = pgTable("savings_entries", {
  entryId: uuid("entry_id").primaryKey().defaultRandom(),
  goalId: uuid("goal_id")
    .notNull()
    .references(() => savingsGoals.goalId),
  userId: varchar("user_id")
    .notNull()
    .references(() => users.id),
  entryDate: date("entry_date"),
  amount: numeric("amount", { precision: 15, scale: 2 }),
  note: varchar("note", { length: 255 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const goalMilestones = pgTable("goal_milestones", {
  milestoneId: uuid("milestone_id").primaryKey().defaultRandom(),
  goalId: uuid("goal_id")
    .notNull()
    .references(() => savingsGoals.goalId),
  title: varchar("title", { length: 255 }),
  thresholdAmount: numeric("threshold_amount", { precision: 15, scale: 2 }),
  iconUrl: varchar("icon_url", { length: 255 }),
  sortOrder: integer("sort_order"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type SavingsProgress = typeof savingsProgress.$inferSelect;
export type HomeStyle = typeof homeStyles.$inferSelect;
export type SavingsGoal = typeof savingsGoals.$inferSelect;
export type BuildPlan = typeof buildPlans.$inferSelect;
export type SavingsEntry = typeof savingsEntries.$inferSelect;
export type GoalMilestone = typeof goalMilestones.$inferSelect;
