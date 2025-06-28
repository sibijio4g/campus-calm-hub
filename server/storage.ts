import { users, activities, subjects, type User, type InsertUser, type Activity, type InsertActivity, type Subject, type InsertSubject } from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserOutlookTokens(userId: number, accessToken: string, refreshToken: string, expiry: Date): Promise<void>;
  
  // Activity methods
  getActivities(userId: number): Promise<Activity[]>;
  getActivity(id: number): Promise<Activity | undefined>;
  createActivity(activity: InsertActivity): Promise<Activity>;
  updateActivity(id: number, activity: Partial<Activity>): Promise<Activity | undefined>;
  deleteActivity(id: number): Promise<boolean>;
  
  // Subject methods
  getSubjects(userId: number): Promise<Subject[]>;
  createSubject(subject: InsertSubject): Promise<Subject>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUserOutlookTokens(userId: number, accessToken: string, refreshToken: string, expiry: Date): Promise<void> {
    await db
      .update(users)
      .set({
        outlookAccessToken: accessToken,
        outlookRefreshToken: refreshToken,
        outlookTokenExpiry: expiry,
      })
      .where(eq(users.id, userId));
  }

  async getActivities(userId: number): Promise<Activity[]> {
    return await db.select().from(activities).where(eq(activities.userId, userId));
  }

  async getActivity(id: number): Promise<Activity | undefined> {
    const [activity] = await db.select().from(activities).where(eq(activities.id, id));
    return activity || undefined;
  }

  async createActivity(activity: InsertActivity): Promise<Activity> {
    const [newActivity] = await db
      .insert(activities)
      .values({
        ...activity,
        updatedAt: new Date(),
      })
      .returning();
    return newActivity;
  }

  async updateActivity(id: number, activity: Partial<Activity>): Promise<Activity | undefined> {
    const [updatedActivity] = await db
      .update(activities)
      .set({
        ...activity,
        updatedAt: new Date(),
      })
      .where(eq(activities.id, id))
      .returning();
    return updatedActivity || undefined;
  }

  async deleteActivity(id: number): Promise<boolean> {
    const result = await db.delete(activities).where(eq(activities.id, id));
    return (result.rowCount || 0) > 0;
  }

  async getSubjects(userId: number): Promise<Subject[]> {
    return await db.select().from(subjects).where(eq(subjects.userId, userId));
  }

  async createSubject(subject: InsertSubject): Promise<Subject> {
    const [newSubject] = await db
      .insert(subjects)
      .values(subject)
      .returning();
    return newSubject;
  }
}

export const storage = new DatabaseStorage();
