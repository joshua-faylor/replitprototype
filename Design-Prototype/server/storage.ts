import {
  type InsertUser,
  type SavingsContribution,
  type SavingsProgress,
  type User,
  savingsContributions,
  savingsProgress,
} from "@shared/schema";
import { randomUUID } from "crypto";
import { db } from "./db";
import { desc, eq, sql } from "drizzle-orm";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getSavingsProgress(): Promise<SavingsProgress>;
  addContribution(amount: number): Promise<SavingsSummary>;
  getSavingsSummary(): Promise<SavingsSummary>;
  getRecentContributions(limit?: number): Promise<SavingsContribution[]>;
}

export type SavingsSummary = {
  currentAmount: number;
  goalAmount: number;
  progressPercent: number;
};

export class MemStorage implements IStorage {
  private users: Map<string, User>;

  constructor() {
    this.users = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  private async ensureSavingsTables(): Promise<void> {
    await db.execute(sql`
      create table if not exists savings_progress (
        id varchar primary key,
        goal_amount integer not null default 150000,
        current_amount integer not null default 0,
        updated_at timestamp not null default now()
      )
    `);

    await db.execute(sql`
      create table if not exists savings_contributions (
        id serial primary key,
        amount integer not null,
        created_at timestamp not null default now()
      )
    `);
  }

  async getSavingsProgress(): Promise<SavingsProgress> {
    await this.ensureSavingsTables();

    await db
      .insert(savingsProgress)
      .values({
        id: "default",
        goalAmount: 150000,
        currentAmount: 0,
      })
      .onConflictDoNothing();

    const [progress] = await db
      .select()
      .from(savingsProgress)
      .where(eq(savingsProgress.id, "default"))
      .limit(1);

    if (!progress) {
      throw new Error("Unable to load savings progress");
    }

    return progress;
  }

  private toSummary(progress: SavingsProgress): SavingsSummary {
    return {
      currentAmount: progress.currentAmount,
      goalAmount: progress.goalAmount,
      progressPercent:
        progress.goalAmount > 0
          ? Number(((progress.currentAmount / progress.goalAmount) * 100).toFixed(2))
          : 0,
    };
  }

  async getSavingsSummary(): Promise<SavingsSummary> {
    const progress = await this.getSavingsProgress();
    return this.toSummary(progress);
  }

  async addContribution(amount: number): Promise<SavingsSummary> {
    await this.ensureSavingsTables();

    await db
      .insert(savingsProgress)
      .values({
        id: "default",
        goalAmount: 150000,
        currentAmount: 0,
      })
      .onConflictDoNothing();

    const [updatedProgress] = await db
      .update(savingsProgress)
      .set({
        currentAmount: sql`${savingsProgress.currentAmount} + ${amount}`,
        updatedAt: sql`now()`,
      })
      .where(eq(savingsProgress.id, "default"))
      .returning();

    if (!updatedProgress) {
      throw new Error("Unable to update savings progress");
    }

    await db.insert(savingsContributions).values({ amount });

    return this.toSummary(updatedProgress);
  }

  async getRecentContributions(limit = 6): Promise<SavingsContribution[]> {
    await this.ensureSavingsTables();

    const safeLimit = Number.isFinite(limit) ? Math.min(Math.max(limit, 1), 100) : 6;
    return db
      .select()
      .from(savingsContributions)
      .orderBy(desc(savingsContributions.createdAt))
      .limit(safeLimit);
  }
}

export const storage = new MemStorage();
