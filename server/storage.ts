import { users, activities, subjects, type User, type InsertUser, type Activity, type InsertActivity, type Subject, type InsertSubject } from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserGoogleTokens(userId: number, accessToken: string, refreshToken: string, expiry: Date): Promise<void>;
  
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
    if (!db) throw new Error('Database not available');
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    if (!db) throw new Error('Database not available');
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    if (!db) throw new Error('Database not available');
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUserGoogleTokens(userId: number, accessToken: string, refreshToken: string, expiry: Date): Promise<void> {
    if (!db) throw new Error('Database not available');
    await db
      .update(users)
      .set({
        googleAccessToken: accessToken,
        googleRefreshToken: refreshToken,
        googleTokenExpiry: expiry,
      })
      .where(eq(users.id, userId));
  }

  async getActivities(userId: number): Promise<Activity[]> {
    if (!db) throw new Error('Database not available');
    return await db.select().from(activities).where(eq(activities.userId, userId));
  }

  async getActivity(id: number): Promise<Activity | undefined> {
    if (!db) throw new Error('Database not available');
    const [activity] = await db.select().from(activities).where(eq(activities.id, id));
    return activity || undefined;
  }

  async createActivity(activity: InsertActivity): Promise<Activity> {
    if (!db) throw new Error('Database not available');
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
    if (!db) throw new Error('Database not available');
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
    if (!db) throw new Error('Database not available');
    const result = await db.delete(activities).where(eq(activities.id, id));
    return (result.rowCount || 0) > 0;
  }

  async getSubjects(userId: number): Promise<Subject[]> {
    if (!db) throw new Error('Database not available');
    return await db.select().from(subjects).where(eq(subjects.userId, userId));
  }

  async createSubject(subject: InsertSubject): Promise<Subject> {
    if (!db) throw new Error('Database not available');
    const [newSubject] = await db
      .insert(subjects)
      .values(subject)
      .returning();
    return newSubject;
  }
}

// In-memory storage implementation for development
export class InMemoryStorage implements IStorage {
  private users: User[] = [
    {
      id: 1,
      username: 'demo_user',
      password: 'password',
      googleAccessToken: null,
      googleRefreshToken: null,
      googleTokenExpiry: null,
      selectedCalendarId: null,
    }
  ];
  
  private activities: Activity[] = [
    {
      id: 1,
      userId: 1,
      title: 'Mathematics Lecture',
      description: 'Calculus fundamentals',
      type: 'lecture',
      startTime: new Date('2024-12-28T14:00:00'),
      endTime: new Date('2024-12-28T15:30:00'),
      location: 'Room 101',
      priority: 'medium',
      status: 'pending',
      googleEventId: null,
      googleCalendarId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      userId: 1,
      title: 'Physics Assignment Due',
      description: 'Complete problem set 5',
      type: 'task',
      startTime: new Date('2024-12-28T23:59:00'),
      endTime: null,
      location: null,
      priority: 'high',
      status: 'pending',
      googleEventId: null,
      googleCalendarId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 3,
      userId: 1,
      title: 'Study Group',
      description: 'Mathematics study session',
      type: 'social',
      startTime: new Date('2024-12-28T16:30:00'),
      endTime: new Date('2024-12-28T18:00:00'),
      location: 'Library',
      priority: 'low',
      status: 'pending',
      googleEventId: null,
      googleCalendarId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  ];
  
  private subjects: Subject[] = [
    { id: 1, userId: 1, name: 'Mathematics', color: 'blue', code: 'MATH101' },
    { id: 2, userId: 1, name: 'Physics', color: 'purple', code: 'PHYS101' },
    { id: 3, userId: 1, name: 'Chemistry', color: 'green', code: 'CHEM101' },
    { id: 4, userId: 1, name: 'History', color: 'orange', code: 'HIST101' }
  ];
  
  private nextUserId = 2;
  private nextActivityId = 4;
  private nextSubjectId = 5;

  async getUser(id: number): Promise<User | undefined> {
    return this.users.find(u => u.id === id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return this.users.find(u => u.username === username);
  }

  async createUser(user: InsertUser): Promise<User> {
    const newUser: User = {
      id: this.nextUserId++,
      ...user,
      googleAccessToken: null,
      googleRefreshToken: null,
      googleTokenExpiry: null,
      selectedCalendarId: null,
    };
    this.users.push(newUser);
    return newUser;
  }

  async updateUserGoogleTokens(userId: number, accessToken: string, refreshToken: string, expiry: Date): Promise<void> {
    const user = this.users.find(u => u.id === userId);
    if (user) {
      user.googleAccessToken = accessToken;
      user.googleRefreshToken = refreshToken;
      user.googleTokenExpiry = expiry;
    }
  }

  async getActivities(userId: number): Promise<Activity[]> {
    return this.activities.filter(a => a.userId === userId);
  }

  async getActivity(id: number): Promise<Activity | undefined> {
    return this.activities.find(a => a.id === id);
  }

  async createActivity(activity: InsertActivity): Promise<Activity> {
    const newActivity: Activity = {
      id: this.nextActivityId++,
      ...activity,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.activities.push(newActivity);
    return newActivity;
  }

  async updateActivity(id: number, updates: Partial<Activity>): Promise<Activity | undefined> {
    const index = this.activities.findIndex(a => a.id === id);
    if (index === -1) return undefined;
    
    this.activities[index] = {
      ...this.activities[index],
      ...updates,
      updatedAt: new Date(),
    };
    return this.activities[index];
  }

  async deleteActivity(id: number): Promise<boolean> {
    const index = this.activities.findIndex(a => a.id === id);
    if (index === -1) return false;
    
    this.activities.splice(index, 1);
    return true;
  }

  async getSubjects(userId: number): Promise<Subject[]> {
    return this.subjects.filter(s => s.userId === userId);
  }

  async createSubject(subject: InsertSubject): Promise<Subject> {
    const newSubject: Subject = {
      id: this.nextSubjectId++,
      ...subject,
    };
    this.subjects.push(newSubject);
    return newSubject;
  }
}

// Use database storage if available, otherwise fall back to in-memory
export const storage: IStorage = db ? new DatabaseStorage() : new InMemoryStorage();

console.log(`Using ${db ? 'PostgreSQL database' : 'in-memory'} storage`);