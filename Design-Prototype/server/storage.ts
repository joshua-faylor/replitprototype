import {
  type InsertUser,
  type SavingsProgress,
  type User,
  savingsProgress,
} from "@shared/schema";
import { randomUUID } from "crypto";
import { db } from "./db";
import { eq, sql } from "drizzle-orm";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getSavingsProgress(): Promise<SavingsProgress>;
  addContribution(amount: number): Promise<SavingsProgress>;
}

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

  private async ensureSavingsProgressTable(): Promise<void> {
    await db.execute(sql`
      create table if not exists savings_progress (
        id varchar primary key,
        goal_amount integer not null default 150000,
        current_amount integer not null default 0,
        updated_at timestamp not null default now()
      )
    `);
  }

  async getSavingsProgress(): Promise<SavingsProgress> {
    await this.ensureSavingsProgressTable();

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

  async addContribution(amount: number): Promise<SavingsProgress> {
    await this.ensureSavingsProgressTable();

    await db
      .insert(savingsProgress)
      .values({
        id: "default",
        goalAmount: 150000,
        currentAmount: 0,
      })
      .onConflictDoNothing();

    const [updated] = await db
      .update(savingsProgress)
      .set({
        currentAmount: sql`${savingsProgress.currentAmount} + ${amount}`,
        updatedAt: sql`now()`,
      })
      .where(eq(savingsProgress.id, "default"))
      .returning();

    if (!updated) {
      throw new Error("Unable to update savings progress");
    }

    return updated;
  }
}

export const storage = new MemStorage();
