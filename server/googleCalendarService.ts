import { google, Auth } from 'googleapis';
import { storage } from './storage';
import type { Activity, InsertActivity } from '@shared/schema';

interface GoogleCalendarConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

interface GoogleCalendar {
  id: string;
  summary: string;
  description?: string;
  primary?: boolean;
  accessRole: string;
}

interface GoogleEvent {
  id: string;
  summary: string;
  description?: string;
  start: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  location?: string;
}

export class GoogleCalendarService {
  private config: GoogleCalendarConfig;

  constructor(config: GoogleCalendarConfig) {
    this.config = config;
  }

  private createOAuth2Client() {
    return new google.auth.OAuth2(
      this.config.clientId,
      this.config.clientSecret,
      this.config.redirectUri
    );
  }

  getAuthUrl(userId: number): string {
    const oauth2Client = this.createOAuth2Client();
    const scopes = [
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/calendar.events'
    ];

    return oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      state: userId.toString(),
    });
  }

  async handleAuthCallback(code: string, userId: number): Promise<void> {
    try {
      const oauth2Client = this.createOAuth2Client();
      const { tokens } = await oauth2Client.getToken(code);
      
      if (tokens.access_token && tokens.refresh_token) {
        const expiry = tokens.expiry_date ? new Date(tokens.expiry_date) : new Date(Date.now() + 3600000);
        await storage.updateUserGoogleTokens(
          userId,
          tokens.access_token,
          tokens.refresh_token,
          expiry
        );
      }
    } catch (error) {
      console.error('Error handling Google auth callback:', error);
      throw error;
    }
  }

  async refreshToken(userId: number): Promise<string | null> {
    try {
      const user = await storage.getUser(userId);
      if (!user?.googleRefreshToken) {
        return null;
      }

      const oauth2Client = this.createOAuth2Client();
      oauth2Client.setCredentials({
        refresh_token: user.googleRefreshToken,
      });

      const { credentials } = await oauth2Client.refreshAccessToken();
      
      if (credentials.access_token) {
        const expiry = credentials.expiry_date ? new Date(credentials.expiry_date) : new Date(Date.now() + 3600000);
        await storage.updateUserGoogleTokens(
          userId,
          credentials.access_token,
          user.googleRefreshToken,
          expiry
        );
        return credentials.access_token;
      }
      
      return null;
    } catch (error) {
      console.error('Error refreshing Google token:', error);
      return null;
    }
  }

  async getValidToken(userId: number): Promise<string | null> {
    const user = await storage.getUser(userId);
    if (!user?.googleAccessToken) {
      return null;
    }

    // Check if token is expired
    if (user.googleTokenExpiry && new Date() >= user.googleTokenExpiry) {
      return await this.refreshToken(userId);
    }

    return user.googleAccessToken;
  }

  async getUserCalendars(userId: number): Promise<GoogleCalendar[]> {
    try {
      const accessToken = await this.getValidToken(userId);
      if (!accessToken) {
        throw new Error('No valid access token available');
      }

      const oauth2Client = this.createOAuth2Client();
      oauth2Client.setCredentials({ access_token: accessToken });

      const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
      const response = await calendar.calendarList.list();

      return (response.data.items || []).map(cal => ({
        id: cal.id || '',
        summary: cal.summary || '',
        description: cal.description || undefined,
        primary: cal.primary || false,
        accessRole: cal.accessRole || ''
      }));
    } catch (error) {
      console.error('Error fetching Google calendars:', error);
      throw error;
    }
  }

  async syncToGoogleCalendar(userId: number, activity: Activity, calendarId: string = 'primary'): Promise<string | null> {
    try {
      const accessToken = await this.getValidToken(userId);
      if (!accessToken) {
        return null;
      }

      const oauth2Client = this.createOAuth2Client();
      oauth2Client.setCredentials({ access_token: accessToken });

      const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

      const event = {
        summary: activity.title,
        description: activity.description || undefined,
        location: activity.location || undefined,
        start: {
          dateTime: activity.startTime.toISOString(),
          timeZone: 'UTC',
        },
        end: {
          dateTime: activity.endTime ? activity.endTime.toISOString() : new Date(activity.startTime.getTime() + 3600000).toISOString(),
          timeZone: 'UTC',
        },
      };

      const response = await calendar.events.insert({
        calendarId,
        requestBody: event,
      });

      if (response.data.id) {
        // Update activity with Google event ID
        await storage.updateActivity(activity.id, {
          googleEventId: response.data.id,
          googleCalendarId: calendarId
        });
        return response.data.id;
      }

      return null;
    } catch (error) {
      console.error('Error syncing to Google Calendar:', error);
      return null;
    }
  }

  async updateGoogleEvent(userId: number, activity: Activity, calendarId: string = 'primary'): Promise<void> {
    try {
      if (!activity.googleEventId) {
        return;
      }

      const accessToken = await this.getValidToken(userId);
      if (!accessToken) {
        return;
      }

      const oauth2Client = this.createOAuth2Client();
      oauth2Client.setCredentials({ access_token: accessToken });

      const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

      const event = {
        summary: activity.title,
        description: activity.description || undefined,
        location: activity.location || undefined,
        start: {
          dateTime: activity.startTime.toISOString(),
          timeZone: 'UTC',
        },
        end: {
          dateTime: activity.endTime ? activity.endTime.toISOString() : new Date(activity.startTime.getTime() + 3600000).toISOString(),
          timeZone: 'UTC',
        },
      };

      await calendar.events.update({
        calendarId,
        eventId: activity.googleEventId,
        requestBody: event,
      });
    } catch (error) {
      console.error('Error updating Google event:', error);
      throw error;
    }
  }

  async deleteGoogleEvent(userId: number, googleEventId: string, calendarId: string = 'primary'): Promise<void> {
    try {
      const accessToken = await this.getValidToken(userId);
      if (!accessToken) {
        return;
      }

      const oauth2Client = this.createOAuth2Client();
      oauth2Client.setCredentials({ access_token: accessToken });

      const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

      await calendar.events.delete({
        calendarId,
        eventId: googleEventId,
      });
    } catch (error) {
      console.error('Error deleting Google event:', error);
      throw error;
    }
  }

  async syncFromGoogleCalendar(userId: number, calendarId: string = 'primary'): Promise<void> {
    try {
      const accessToken = await this.getValidToken(userId);
      if (!accessToken) {
        return;
      }

      const oauth2Client = this.createOAuth2Client();
      oauth2Client.setCredentials({ access_token: accessToken });

      const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

      const now = new Date();
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const oneMonthFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

      const response = await calendar.events.list({
        calendarId,
        timeMin: oneWeekAgo.toISOString(),
        timeMax: oneMonthFromNow.toISOString(),
        singleEvents: true,
        orderBy: 'startTime',
      });

      const events = response.data.items || [];

      for (const event of events) {
        if (!event.id || !event.summary || !event.start?.dateTime) {
          continue;
        }

        // Check if this event is already in our database
        const existingActivities = await storage.getActivities(userId);
        const existingActivity = existingActivities.find(a => a.googleEventId === event.id);

        if (!existingActivity) {
          const newActivity: InsertActivity = {
            userId,
            title: event.summary,
            description: event.description || null,
            type: 'event',
            startTime: new Date(event.start.dateTime),
            endTime: event.end?.dateTime ? new Date(event.end.dateTime) : null,
            location: event.location || null,
            priority: 'medium',
            status: 'pending',
            googleEventId: event.id,
            googleCalendarId: calendarId
          };

          await storage.createActivity(newActivity);
        }
      }
    } catch (error) {
      console.error('Error syncing from Google Calendar:', error);
      throw error;
    }
  }
}

// Create and export service instance
export const googleCalendarService = new GoogleCalendarService({
  clientId: process.env.GOOGLE_CLIENT_ID || '',
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  redirectUri: process.env.GOOGLE_REDIRECT_URI || 'http://localhost:5000/api/auth/google/callback'
});