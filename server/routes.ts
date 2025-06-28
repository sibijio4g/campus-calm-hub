import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertActivitySchema, insertTermSchema, insertCourseSchema, insertClubSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  const userId = 1; // Demo user ID

  // Terms routes
  app.get("/api/terms", async (req, res) => {
    try {
      const terms = await storage.getTerms(userId);
      res.json(terms);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch terms" });
    }
  });

  app.post("/api/terms", async (req, res) => {
    try {
      const termData = insertTermSchema.parse({ ...req.body, userId });
      const term = await storage.createTerm(termData);
      res.json(term);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid term data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create term" });
      }
    }
  });

  // Courses routes
  app.get("/api/courses", async (req, res) => {
    try {
      const termId = req.query.termId ? parseInt(req.query.termId as string) : undefined;
      const courses = await storage.getCourses(userId, termId);
      res.json(courses);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch courses" });
    }
  });

  app.get("/api/courses/all", async (req, res) => {
    try {
      const courses = await storage.getCourses(userId);
      res.json(courses);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch courses" });
    }
  });

  app.post("/api/courses", async (req, res) => {
    try {
      const courseData = insertCourseSchema.parse({ ...req.body, userId });
      const course = await storage.createCourse(courseData);
      res.json(course);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid course data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create course" });
      }
    }
  });

  // Activities routes
  app.get("/api/activities", async (req, res) => {
    try {
      const activities = await storage.getActivities(userId);
      res.json(activities);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch activities" });
    }
  });

  app.get("/api/activities/social", async (req, res) => {
    try {
      const activities = await storage.getActivitiesByCategory(userId, 'social');
      res.json(activities);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch social activities" });
    }
  });

  app.get("/api/activities/course/:courseId", async (req, res) => {
    try {
      const courseId = parseInt(req.params.courseId);
      const activities = await storage.getActivitiesByCourse(courseId);
      res.json(activities);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch course activities" });
    }
  });

  app.get("/api/activities/club/:clubId", async (req, res) => {
    try {
      const clubId = parseInt(req.params.clubId);
      const activities = await storage.getActivitiesByClub(clubId);
      res.json(activities);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch club activities" });
    }
  });

  app.post("/api/activities", async (req, res) => {
    try {
      const activityData = insertActivitySchema.parse({
        ...req.body,
        userId,
      });
      
      const activity = await storage.createActivity(activityData);
      res.json(activity);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid activity data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create activity" });
      }
    }
  });

  app.put("/api/activities/:id", async (req, res) => {
    try {
      const activityId = parseInt(req.params.id);
      const updateData = req.body;
      
      // Convert date strings back to Date objects
      if (updateData.startTime) {
        updateData.startTime = new Date(updateData.startTime);
      }
      if (updateData.endTime) {
        updateData.endTime = new Date(updateData.endTime);
      }
      
      const activity = await storage.updateActivity(activityId, updateData);
      
      if (!activity) {
        return res.status(404).json({ error: "Activity not found" });
      }
      
      res.json(activity);
    } catch (error) {
      res.status(500).json({ error: "Failed to update activity" });
    }
  });

  app.delete("/api/activities/:id", async (req, res) => {
    try {
      const activityId = parseInt(req.params.id);
      const success = await storage.deleteActivity(activityId);
      
      if (!success) {
        return res.status(404).json({ error: "Activity not found" });
      }
      
      res.json({ message: "Activity deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete activity" });
    }
  });

  // Clubs routes
  app.get("/api/clubs", async (req, res) => {
    try {
      const clubs = await storage.getClubs(userId);
      res.json(clubs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch clubs" });
    }
  });

  app.post("/api/clubs", async (req, res) => {
    try {
      const clubData = insertClubSchema.parse({ ...req.body, userId });
      const club = await storage.createClub(clubData);
      res.json(club);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid club data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create club" });
      }
    }
  });

  // Study plans routes
  app.get("/api/study-plans", async (req, res) => {
    try {
      const courseId = req.query.courseId ? parseInt(req.query.courseId as string) : undefined;
      const studyPlans = await storage.getStudyPlans(userId, courseId);
      res.json(studyPlans);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch study plans" });
    }
  });

  // Social connections routes
  app.get("/api/social/connections", async (req, res) => {
    try {
      const connections = await storage.getSocialConnections(userId);
      res.json(connections);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch social connections" });
    }
  });

  // Shared calendars routes
  app.get("/api/social/shared-calendars", async (req, res) => {
    try {
      const sharedCalendars = await storage.getSharedCalendars(userId);
      res.json(sharedCalendars);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch shared calendars" });
    }
  });

  // Google Calendar integration routes (existing)
  app.get("/api/google/auth", async (req, res) => {
    try {
      const authUrl = `https://accounts.google.com/oauth/authorize?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.GOOGLE_REDIRECT_URI}&scope=https://www.googleapis.com/auth/calendar&response_type=code&access_type=offline&state=${userId}`;
      res.json({ authUrl });
    } catch (error) {
      res.status(500).json({ error: "Failed to generate Google auth URL" });
    }
  });

  app.get("/api/google/callback", async (req, res) => {
    try {
      const { code, state } = req.query;
      const userId = parseInt(state as string) || 1;
      
      // For demo: just mark user as connected
      const user = await storage.getUser(userId);
      if (user) {
        await storage.updateUserGoogleTokens(userId, "demo_token", "demo_refresh", new Date(Date.now() + 3600000));
      }
      
      res.redirect('/profile?connected=true');
    } catch (error) {
      res.status(500).json({ error: "Failed to handle Google auth callback" });
    }
  });

  app.get("/api/google/calendars", async (req, res) => {
    try {
      const user = await storage.getUser(userId);
      
      if (!user?.googleAccessToken) {
        return res.status(401).json({ error: "User not connected to Google Calendar" });
      }
      
      // For demo: return sample calendars
      const calendars = [
        { id: 'primary', summary: 'Primary Calendar', primary: true, accessRole: 'owner' },
        { id: 'university', summary: 'University Schedule', primary: false, accessRole: 'writer' }
      ];
      
      res.json(calendars);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch calendars" });
    }
  });

  app.post("/api/google/sync", async (req, res) => {
    try {
      const { calendarId } = req.body;
      
      // For demo: just return success
      res.json({ message: "Calendar sync completed", calendarId });
    } catch (error) {
      res.status(500).json({ error: "Failed to sync with Google Calendar" });
    }
  });

  app.get("/api/profile", async (req, res) => {
    try {
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      res.json({
        id: user.id,
        username: user.username,
        googleConnected: !!user.googleAccessToken,
        selectedCalendarId: user.selectedCalendarId
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch profile" });
    }
  });

  app.put("/api/profile/calendar", async (req, res) => {
    try {
      const { calendarId } = req.body;
      
      await storage.updateUserGoogleTokens(userId, "demo_token", "demo_refresh", new Date(Date.now() + 3600000));
      
      res.json({ message: "Calendar selection updated", calendarId });
    } catch (error) {
      res.status(500).json({ error: "Failed to update calendar selection" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}