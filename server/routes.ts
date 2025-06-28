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

  // Outlook integration routes (placeholder for now)
  app.get("/api/outlook/auth", async (req, res) => {
    try {
      // This would redirect to Microsoft OAuth
      res.json({ 
        message: "Outlook integration setup required", 
        authUrl: "https://login.microsoftonline.com/common/oauth2/v2.0/authorize"
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to initiate Outlook auth" });
    }
  });

  app.post("/api/outlook/sync", async (req, res) => {
    try {
      // This would trigger sync with Outlook calendar
      res.json({ message: "Outlook sync feature ready for configuration" });
    } catch (error) {
      res.status(500).json({ error: "Failed to sync with Outlook" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
