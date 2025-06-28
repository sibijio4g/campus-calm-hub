import { 
  users, activities, terms, courses, clubs, studyPlans, socialConnections, sharedCalendars,
  type User, type InsertUser, type Activity, type InsertActivity, 
  type Term, type InsertTerm, type Course, type InsertCourse,
  type Club, type InsertClub, type StudyPlan, type InsertStudyPlan,
  type SocialConnection, type InsertSocialConnection,
  type SharedCalendar, type InsertSharedCalendar
} from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserGoogleTokens(userId: number, accessToken: string, refreshToken: string, expiry: Date): Promise<void>;
  
  // Term methods
  getTerms(userId: number): Promise<Term[]>;
  createTerm(term: InsertTerm): Promise<Term>;
  
  // Course methods
  getCourses(userId: number, termId?: number): Promise<Course[]>;
  createCourse(course: InsertCourse): Promise<Course>;
  
  // Activity methods
  getActivities(userId: number): Promise<Activity[]>;
  getActivitiesByCategory(userId: number, category: string): Promise<Activity[]>;
  getActivitiesByCourse(courseId: number): Promise<Activity[]>;
  getActivitiesByClub(clubId: number): Promise<Activity[]>;
  getActivity(id: number): Promise<Activity | undefined>;
  createActivity(activity: InsertActivity): Promise<Activity>;
  updateActivity(id: number, activity: Partial<Activity>): Promise<Activity | undefined>;
  deleteActivity(id: number): Promise<boolean>;
  
  // Club methods
  getClubs(userId: number): Promise<Club[]>;
  createClub(club: InsertClub): Promise<Club>;
  
  // Study plan methods
  getStudyPlans(userId: number, courseId?: number): Promise<StudyPlan[]>;
  createStudyPlan(studyPlan: InsertStudyPlan): Promise<StudyPlan>;
  
  // Social connection methods
  getSocialConnections(userId: number): Promise<SocialConnection[]>;
  createSocialConnection(connection: InsertSocialConnection): Promise<SocialConnection>;
  
  // Shared calendar methods
  getSharedCalendars(userId: number): Promise<SharedCalendar[]>;
  createSharedCalendar(sharedCalendar: InsertSharedCalendar): Promise<SharedCalendar>;
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
    const [user] = await db.insert(users).values(insertUser).returning();
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

  async getTerms(userId: number): Promise<Term[]> {
    if (!db) throw new Error('Database not available');
    return await db.select().from(terms).where(eq(terms.userId, userId));
  }

  async createTerm(term: InsertTerm): Promise<Term> {
    if (!db) throw new Error('Database not available');
    const [newTerm] = await db.insert(terms).values(term).returning();
    return newTerm;
  }

  async getCourses(userId: number, termId?: number): Promise<Course[]> {
    if (!db) throw new Error('Database not available');
    if (termId) {
      return await db.select().from(courses).where(and(eq(courses.userId, userId), eq(courses.termId, termId)));
    }
    return await db.select().from(courses).where(eq(courses.userId, userId));
  }

  async createCourse(course: InsertCourse): Promise<Course> {
    if (!db) throw new Error('Database not available');
    const [newCourse] = await db.insert(courses).values(course).returning();
    return newCourse;
  }

  async getActivities(userId: number): Promise<Activity[]> {
    if (!db) throw new Error('Database not available');
    return await db.select().from(activities).where(eq(activities.userId, userId));
  }

  async getActivitiesByCategory(userId: number, category: string): Promise<Activity[]> {
    if (!db) throw new Error('Database not available');
    return await db.select().from(activities).where(and(eq(activities.userId, userId), eq(activities.category, category)));
  }

  async getActivitiesByCourse(courseId: number): Promise<Activity[]> {
    if (!db) throw new Error('Database not available');
    return await db.select().from(activities).where(eq(activities.courseId, courseId));
  }

  async getActivitiesByClub(clubId: number): Promise<Activity[]> {
    if (!db) throw new Error('Database not available');
    return await db.select().from(activities).where(eq(activities.clubId, clubId));
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

  async getClubs(userId: number): Promise<Club[]> {
    if (!db) throw new Error('Database not available');
    return await db.select().from(clubs).where(eq(clubs.userId, userId));
  }

  async createClub(club: InsertClub): Promise<Club> {
    if (!db) throw new Error('Database not available');
    const [newClub] = await db.insert(clubs).values(club).returning();
    return newClub;
  }

  async getStudyPlans(userId: number, courseId?: number): Promise<StudyPlan[]> {
    if (!db) throw new Error('Database not available');
    if (courseId) {
      return await db.select().from(studyPlans).where(and(eq(studyPlans.userId, userId), eq(studyPlans.courseId, courseId)));
    }
    return await db.select().from(studyPlans).where(eq(studyPlans.userId, userId));
  }

  async createStudyPlan(studyPlan: InsertStudyPlan): Promise<StudyPlan> {
    if (!db) throw new Error('Database not available');
    const [newStudyPlan] = await db.insert(studyPlans).values(studyPlan).returning();
    return newStudyPlan;
  }

  async getSocialConnections(userId: number): Promise<SocialConnection[]> {
    if (!db) throw new Error('Database not available');
    return await db.select().from(socialConnections).where(eq(socialConnections.userId, userId));
  }

  async createSocialConnection(connection: InsertSocialConnection): Promise<SocialConnection> {
    if (!db) throw new Error('Database not available');
    const [newConnection] = await db.insert(socialConnections).values(connection).returning();
    return newConnection;
  }

  async getSharedCalendars(userId: number): Promise<SharedCalendar[]> {
    if (!db) throw new Error('Database not available');
    return await db.select().from(sharedCalendars).where(eq(sharedCalendars.sharedWithId, userId));
  }

  async createSharedCalendar(sharedCalendar: InsertSharedCalendar): Promise<SharedCalendar> {
    if (!db) throw new Error('Database not available');
    const [newSharedCalendar] = await db.insert(sharedCalendars).values(sharedCalendar).returning();
    return newSharedCalendar;
  }
}

// Enhanced in-memory storage implementation
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

  private terms: Term[] = [
    {
      id: 1,
      userId: 1,
      name: 'Fall 2024',
      startDate: new Date('2024-09-01'),
      endDate: new Date('2024-12-15'),
      isActive: true,
    },
    {
      id: 2,
      userId: 1,
      name: 'Spring 2025',
      startDate: new Date('2025-01-15'),
      endDate: new Date('2025-05-15'),
      isActive: false,
    }
  ];

  private courses: Course[] = [
    {
      id: 1,
      userId: 1,
      termId: 1,
      name: 'Advanced Mathematics',
      code: 'MATH301',
      color: 'blue',
      instructor: 'Dr. Smith',
      credits: 3,
    },
    {
      id: 2,
      userId: 1,
      termId: 1,
      name: 'Physics Laboratory',
      code: 'PHYS201',
      color: 'purple',
      instructor: 'Prof. Johnson',
      credits: 4,
    },
    {
      id: 3,
      userId: 1,
      termId: 1,
      name: 'Organic Chemistry',
      code: 'CHEM301',
      color: 'green',
      instructor: 'Dr. Brown',
      credits: 3,
    }
  ];
  
  private activities: Activity[] = [
    {
      id: 1,
      userId: 1,
      courseId: 1,
      clubId: null,
      title: 'Mathematics Lecture',
      description: 'Calculus fundamentals',
      type: 'lecture',
      category: 'academic',
      startTime: new Date('2024-12-28T14:00:00'),
      endTime: new Date('2024-12-28T15:30:00'),
      location: 'Room 101',
      priority: 'medium',
      status: 'pending',
      googleEventId: null,
      googleCalendarId: null,
      isRecurring: false,
      recurringPattern: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      userId: 1,
      courseId: 2,
      clubId: null,
      title: 'Physics Assignment Due',
      description: 'Complete problem set 5',
      type: 'assignment',
      category: 'academic',
      startTime: new Date('2024-12-28T23:59:00'),
      endTime: null,
      location: null,
      priority: 'high',
      status: 'pending',
      googleEventId: null,
      googleCalendarId: null,
      isRecurring: false,
      recurringPattern: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 3,
      userId: 1,
      courseId: null,
      clubId: null,
      title: 'Study Group',
      description: 'Mathematics study session',
      type: 'study-group',
      category: 'social',
      startTime: new Date('2024-12-28T16:30:00'),
      endTime: new Date('2024-12-28T18:00:00'),
      location: 'Library',
      priority: 'low',
      status: 'pending',
      googleEventId: null,
      googleCalendarId: null,
      isRecurring: false,
      recurringPattern: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  ];

  private clubs: Club[] = [
    {
      id: 1,
      userId: 1,
      name: 'Drama Club',
      role: 'member',
      color: 'purple',
      description: 'University theater group',
      meetingDay: 'Wednesday',
      meetingTime: '18:00',
      location: 'Theater Hall',
    },
    {
      id: 2,
      userId: 1,
      name: 'Chess Society',
      role: 'secretary',
      color: 'blue',
      description: 'Strategic thinking and competition',
      meetingDay: 'Friday',
      meetingTime: '16:00',
      location: 'Student Center',
    }
  ];

  private studyPlans: StudyPlan[] = [
    {
      id: 1,
      courseId: 1,
      userId: 1,
      topic: 'Differential Equations',
      notes: 'Focus on solving linear equations',
      progress: 75,
      targetDate: new Date('2024-12-30'),
      createdAt: new Date(),
    }
  ];

  private socialConnections: SocialConnection[] = [];
  private sharedCalendars: SharedCalendar[] = [];
  
  private nextUserId = 2;
  private nextTermId = 3;
  private nextCourseId = 4;
  private nextActivityId = 4;
  private nextClubId = 3;
  private nextStudyPlanId = 2;
  private nextSocialConnectionId = 1;
  private nextSharedCalendarId = 1;

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

  async getTerms(userId: number): Promise<Term[]> {
    return this.terms.filter(t => t.userId === userId);
  }

  async createTerm(term: InsertTerm): Promise<Term> {
    const newTerm: Term = {
      id: this.nextTermId++,
      ...term,
    };
    this.terms.push(newTerm);
    return newTerm;
  }

  async getCourses(userId: number, termId?: number): Promise<Course[]> {
    let filtered = this.courses.filter(c => c.userId === userId);
    if (termId) {
      filtered = filtered.filter(c => c.termId === termId);
    }
    return filtered;
  }

  async createCourse(course: InsertCourse): Promise<Course> {
    const newCourse: Course = {
      id: this.nextCourseId++,
      ...course,
    };
    this.courses.push(newCourse);
    return newCourse;
  }

  async getActivities(userId: number): Promise<Activity[]> {
    return this.activities.filter(a => a.userId === userId);
  }

  async getActivitiesByCategory(userId: number, category: string): Promise<Activity[]> {
    return this.activities.filter(a => a.userId === userId && a.category === category);
  }

  async getActivitiesByCourse(courseId: number): Promise<Activity[]> {
    return this.activities.filter(a => a.courseId === courseId);
  }

  async getActivitiesByClub(clubId: number): Promise<Activity[]> {
    return this.activities.filter(a => a.clubId === clubId);
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

  async getClubs(userId: number): Promise<Club[]> {
    return this.clubs.filter(c => c.userId === userId);
  }

  async createClub(club: InsertClub): Promise<Club> {
    const newClub: Club = {
      id: this.nextClubId++,
      ...club,
    };
    this.clubs.push(newClub);
    return newClub;
  }

  async getStudyPlans(userId: number, courseId?: number): Promise<StudyPlan[]> {
    let filtered = this.studyPlans.filter(sp => sp.userId === userId);
    if (courseId) {
      filtered = filtered.filter(sp => sp.courseId === courseId);
    }
    return filtered;
  }

  async createStudyPlan(studyPlan: InsertStudyPlan): Promise<StudyPlan> {
    const newStudyPlan: StudyPlan = {
      id: this.nextStudyPlanId++,
      ...studyPlan,
      createdAt: new Date(),
    };
    this.studyPlans.push(newStudyPlan);
    return newStudyPlan;
  }

  async getSocialConnections(userId: number): Promise<SocialConnection[]> {
    return this.socialConnections.filter(sc => sc.userId === userId);
  }

  async createSocialConnection(connection: InsertSocialConnection): Promise<SocialConnection> {
    const newConnection: SocialConnection = {
      id: this.nextSocialConnectionId++,
      ...connection,
      createdAt: new Date(),
    };
    this.socialConnections.push(newConnection);
    return newConnection;
  }

  async getSharedCalendars(userId: number): Promise<SharedCalendar[]> {
    return this.sharedCalendars.filter(sc => sc.sharedWithId === userId);
  }

  async createSharedCalendar(sharedCalendar: InsertSharedCalendar): Promise<SharedCalendar> {
    const newSharedCalendar: SharedCalendar = {
      id: this.nextSharedCalendarId++,
      ...sharedCalendar,
      createdAt: new Date(),
    };
    this.sharedCalendars.push(newSharedCalendar);
    return newSharedCalendar;
  }
}

// Use database storage if available, otherwise fall back to in-memory
export const storage: IStorage = db ? new DatabaseStorage() : new InMemoryStorage();

console.log(`Using ${db ? 'PostgreSQL database' : 'in-memory'} storage`);