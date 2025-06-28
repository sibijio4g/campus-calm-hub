import { pgTable, text, serial, integer, boolean, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  googleAccessToken: text("google_access_token"),
  googleRefreshToken: text("google_refresh_token"),
  googleTokenExpiry: timestamp("google_token_expiry"),
  selectedCalendarId: text("selected_calendar_id"),
});

export const terms = pgTable("terms", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  isActive: boolean("is_active").default(false),
});

export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  termId: integer("term_id").notNull(),
  name: text("name").notNull(),
  code: text("code").notNull(),
  color: text("color").notNull().default('blue'),
  instructor: text("instructor"),
  credits: integer("credits"),
});

export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  courseId: integer("course_id"), // Optional - for academic activities
  clubId: integer("club_id"), // Optional - for club activities
  title: text("title").notNull(),
  description: text("description"),
  type: text("type").notNull(), // 'lecture', 'assignment', 'quiz', 'exam', 'social', 'club', 'practice'
  category: text("category"), // 'academic', 'social', 'club'
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time"),
  location: text("location"),
  priority: text("priority"), // 'high', 'medium', 'low'
  status: text("status").notNull().default('pending'), // 'pending', 'in-progress', 'completed', 'cancelled'
  googleEventId: text("google_event_id"),
  googleCalendarId: text("google_calendar_id"),
  isRecurring: boolean("is_recurring").default(false),
  recurringPattern: text("recurring_pattern"), // 'daily', 'weekly', 'monthly'
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const clubs = pgTable("clubs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull(), // 'member', 'officer', 'president', etc.
  color: text("color").notNull().default('purple'),
  description: text("description"),
  meetingDay: text("meeting_day"),
  meetingTime: text("meeting_time"),
  location: text("location"),
});

export const studyPlans = pgTable("study_plans", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").notNull(),
  userId: integer("user_id").notNull(),
  topic: text("topic").notNull(),
  notes: text("notes"),
  progress: integer("progress").default(0), // 0-100
  targetDate: timestamp("target_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const socialConnections = pgTable("social_connections", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  friendId: integer("friend_id").notNull(),
  status: text("status").notNull().default('pending'), // 'pending', 'accepted', 'blocked'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const sharedCalendars = pgTable("shared_calendars", {
  id: serial("id").primaryKey(),
  ownerId: integer("owner_id").notNull(),
  sharedWithId: integer("shared_with_id").notNull(),
  permissions: text("permissions").notNull().default('view'), // 'view', 'edit'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  activities: many(activities),
  terms: many(terms),
  courses: many(courses),
  clubs: many(clubs),
  studyPlans: many(studyPlans),
  socialConnections: many(socialConnections, { relationName: "userConnections" }),
  friendConnections: many(socialConnections, { relationName: "friendConnections" }),
  ownedSharedCalendars: many(sharedCalendars, { relationName: "ownedCalendars" }),
  accessibleSharedCalendars: many(sharedCalendars, { relationName: "accessibleCalendars" }),
}));

export const termsRelations = relations(terms, ({ one, many }) => ({
  user: one(users, {
    fields: [terms.userId],
    references: [users.id],
  }),
  courses: many(courses),
}));

export const coursesRelations = relations(courses, ({ one, many }) => ({
  user: one(users, {
    fields: [courses.userId],
    references: [users.id],
  }),
  term: one(terms, {
    fields: [courses.termId],
    references: [terms.id],
  }),
  activities: many(activities),
  studyPlans: many(studyPlans),
}));

export const activitiesRelations = relations(activities, ({ one }) => ({
  user: one(users, {
    fields: [activities.userId],
    references: [users.id],
  }),
  course: one(courses, {
    fields: [activities.courseId],
    references: [courses.id],
  }),
  club: one(clubs, {
    fields: [activities.clubId],
    references: [clubs.id],
  }),
}));

export const clubsRelations = relations(clubs, ({ one, many }) => ({
  user: one(users, {
    fields: [clubs.userId],
    references: [users.id],
  }),
  activities: many(activities),
}));

export const studyPlansRelations = relations(studyPlans, ({ one }) => ({
  course: one(courses, {
    fields: [studyPlans.courseId],
    references: [courses.id],
  }),
  user: one(users, {
    fields: [studyPlans.userId],
    references: [users.id],
  }),
}));

export const socialConnectionsRelations = relations(socialConnections, ({ one }) => ({
  user: one(users, {
    fields: [socialConnections.userId],
    references: [users.id],
    relationName: "userConnections",
  }),
  friend: one(users, {
    fields: [socialConnections.friendId],
    references: [users.id],
    relationName: "friendConnections",
  }),
}));

export const sharedCalendarsRelations = relations(sharedCalendars, ({ one }) => ({
  owner: one(users, {
    fields: [sharedCalendars.ownerId],
    references: [users.id],
    relationName: "ownedCalendars",
  }),
  sharedWith: one(users, {
    fields: [sharedCalendars.sharedWithId],
    references: [users.id],
    relationName: "accessibleCalendars",
  }),
}));

// Schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertTermSchema = createInsertSchema(terms).omit({
  id: true,
});

export const insertCourseSchema = createInsertSchema(courses).omit({
  id: true,
});

export const insertActivitySchema = createInsertSchema(activities).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertClubSchema = createInsertSchema(clubs).omit({
  id: true,
});

export const insertStudyPlanSchema = createInsertSchema(studyPlans).omit({
  id: true,
  createdAt: true,
});

export const insertSocialConnectionSchema = createInsertSchema(socialConnections).omit({
  id: true,
  createdAt: true,
});

export const insertSharedCalendarSchema = createInsertSchema(sharedCalendars).omit({
  id: true,
  createdAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Term = typeof terms.$inferSelect;
export type InsertTerm = z.infer<typeof insertTermSchema>;
export type Course = typeof courses.$inferSelect;
export type InsertCourse = z.infer<typeof insertCourseSchema>;
export type Activity = typeof activities.$inferSelect;
export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type Club = typeof clubs.$inferSelect;
export type InsertClub = z.infer<typeof insertClubSchema>;
export type StudyPlan = typeof studyPlans.$inferSelect;
export type InsertStudyPlan = z.infer<typeof insertStudyPlanSchema>;
export type SocialConnection = typeof socialConnections.$inferSelect;
export type InsertSocialConnection = z.infer<typeof insertSocialConnectionSchema>;
export type SharedCalendar = typeof sharedCalendars.$inferSelect;
export type InsertSharedCalendar = z.infer<typeof insertSharedCalendarSchema>;