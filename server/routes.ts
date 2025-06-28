import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertActivitySchema, insertSubjectSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Activities routes
  app.get("/api/activities", async (req, res) => {
    try {
      const userId = 1; // For demo purposes, using fixed user ID
      const activities = await storage.getActivities(userId);
      res.json(activities);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch activities" });
    }
  });

  app.post("/api/activities", async (req, res) => {
    try {
      const userId = 1; // For demo purposes, using fixed user ID
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

  app.put("/api/activities/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = req.body;
      
      const activity = await storage.updateActivity(id, updateData);
      if (!activity) {
        res.status(404).json({ error: "Activity not found" });
        return;
      }
      
      res.json(activity);
    } catch (error) {
      res.status(500).json({ error: "Failed to update activity" });
    }
  });

  app.delete("/api/activities/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteActivity(id);
      
      if (!success) {
        res.status(404).json({ error: "Activity not found" });
        return;
      }
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete activity" });
    }
  });

  // Subjects routes
  app.get("/api/subjects", async (req, res) => {
    try {
      const userId = 1; // For demo purposes, using fixed user ID
      const subjects = await storage.getSubjects(userId);
      res.json(subjects);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch subjects" });
    }
  });

  app.post("/api/subjects", async (req, res) => {
    try {
      const userId = 1; // For demo purposes, using fixed user ID
      const subjectData = insertSubjectSchema.parse({
        ...req.body,
        userId,
      });
      
      const subject = await storage.createSubject(subjectData);
      res.json(subject);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid subject data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create subject" });
      }
    }
  });

  // Google Calendar integration routes
  app.get("/api/google/auth", async (req, res) => {
    try {
      const userId = 1; // For demo purposes, using fixed user ID
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
      const userId = 1; // For demo purposes
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
      const userId = 1; // For demo purposes
      const { calendarId } = req.body;
      
      // For demo: just return success
      res.json({ message: "Calendar sync completed", calendarId });
    } catch (error) {
      res.status(500).json({ error: "Failed to sync with Google Calendar" });
    }
  });

  app.get("/api/profile", async (req, res) => {
    try {
      const userId = 1; // For demo purposes
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
      const userId = 1; // For demo purposes
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
