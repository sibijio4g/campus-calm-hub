import { ConfidentialClientApplication, AuthenticationResult } from '@azure/msal-node';
import axios from 'axios';
import { storage } from './storage';
import type { Activity, InsertActivity } from '@shared/schema';

interface OutlookEvent {
  id: string;
  subject: string;
  body: {
    content: string;
    contentType: string;
  };
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  location: {
    displayName: string;
  };
  importance: string;
}

interface OutlookConfig {
  clientId: string;
  clientSecret: string;
  tenantId: string;
  redirectUri: string;
}

export class OutlookService {
  private msalInstance: ConfidentialClientApplication;
  private config: OutlookConfig;

  constructor(config: OutlookConfig) {
    this.config = config;
    this.msalInstance = new ConfidentialClientApplication({
      auth: {
        clientId: config.clientId,
        clientSecret: config.clientSecret,
        authority: `https://login.microsoftonline.com/${config.tenantId}`,
      },
    });
  }

  async getAuthUrl(userId: number): Promise<string> {
    const authCodeUrlParameters = {
      scopes: ['https://graph.microsoft.com/Calendars.ReadWrite'],
      redirectUri: this.config.redirectUri,
      state: userId.toString(),
    };

    return await this.msalInstance.getAuthCodeUrl(authCodeUrlParameters);
  }

  async handleAuthCallback(code: string, userId: number): Promise<void> {
    try {
      const tokenRequest = {
        code,
        scopes: ['https://graph.microsoft.com/Calendars.ReadWrite'],
        redirectUri: this.config.redirectUri,
      };

      const response: AuthenticationResult = await this.msalInstance.acquireTokenByCode(tokenRequest);
      
      if (response.accessToken) {
        const expiry = response.expiresOn ? new Date(response.expiresOn.getTime()) : new Date(Date.now() + 3600000);
        await storage.updateUserOutlookTokens(
          userId,
          response.accessToken,
          response.account?.idTokenClaims?.refresh_token || '',
          expiry
        );
      }
    } catch (error) {
      console.error('Error handling auth callback:', error);
      throw error;
    }
  }

  async refreshToken(userId: number): Promise<string | null> {
    try {
      const user = await storage.getUser(userId);
      if (!user?.outlookRefreshToken) {
        return null;
      }

      const refreshTokenRequest = {
        refreshToken: user.outlookRefreshToken,
        scopes: ['https://graph.microsoft.com/Calendars.ReadWrite'],
      };

      const response: AuthenticationResult = await this.msalInstance.acquireTokenByRefreshToken(refreshTokenRequest);
      
      if (response.accessToken && response.refreshToken) {
        const expiry = new Date(Date.now() + response.expiresOn.getTime());
        await storage.updateUserOutlookTokens(
          userId,
          response.accessToken,
          response.refreshToken,
          expiry
        );
        return response.accessToken;
      }
      
      return null;
    } catch (error) {
      console.error('Error refreshing token:', error);
      return null;
    }
  }

  async getValidToken(userId: number): Promise<string | null> {
    const user = await storage.getUser(userId);
    if (!user?.outlookAccessToken) {
      return null;
    }

    // Check if token is expired
    if (user.outlookTokenExpiry && new Date() >= user.outlookTokenExpiry) {
      return await this.refreshToken(userId);
    }

    return user.outlookAccessToken;
  }

  async syncToOutlook(userId: number, activity: Activity): Promise<string | null> {
    try {
      const accessToken = await this.getValidToken(userId);
      if (!accessToken) {
        throw new Error('No valid access token available');
      }

      const outlookEvent = {
        subject: activity.title,
        body: {
          contentType: 'Text',
          content: activity.description || '',
        },
        start: {
          dateTime: activity.startTime.toISOString(),
          timeZone: 'UTC',
        },
        end: {
          dateTime: activity.endTime?.toISOString() || new Date(activity.startTime.getTime() + 60 * 60 * 1000).toISOString(),
          timeZone: 'UTC',
        },
        location: {
          displayName: activity.location || '',
        },
        importance: activity.priority === 'high' ? 'high' : 'normal',
      };

      const response = await axios.post(
        'https://graph.microsoft.com/v1.0/me/events',
        outlookEvent,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data.id;
    } catch (error) {
      console.error('Error syncing to Outlook:', error);
      throw error;
    }
  }

  async updateOutlookEvent(userId: number, activity: Activity): Promise<void> {
    if (!activity.outlookEventId) {
      return;
    }

    try {
      const accessToken = await this.getValidToken(userId);
      if (!accessToken) {
        throw new Error('No valid access token available');
      }

      const outlookEvent = {
        subject: activity.title,
        body: {
          contentType: 'Text',
          content: activity.description || '',
        },
        start: {
          dateTime: activity.startTime.toISOString(),
          timeZone: 'UTC',
        },
        end: {
          dateTime: activity.endTime?.toISOString() || new Date(activity.startTime.getTime() + 60 * 60 * 1000).toISOString(),
          timeZone: 'UTC',
        },
        location: {
          displayName: activity.location || '',
        },
        importance: activity.priority === 'high' ? 'high' : 'normal',
      };

      await axios.patch(
        `https://graph.microsoft.com/v1.0/me/events/${activity.outlookEventId}`,
        outlookEvent,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
    } catch (error) {
      console.error('Error updating Outlook event:', error);
      throw error;
    }
  }

  async deleteOutlookEvent(userId: number, outlookEventId: string): Promise<void> {
    try {
      const accessToken = await this.getValidToken(userId);
      if (!accessToken) {
        throw new Error('No valid access token available');
      }

      await axios.delete(
        `https://graph.microsoft.com/v1.0/me/events/${outlookEventId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
    } catch (error) {
      console.error('Error deleting Outlook event:', error);
      throw error;
    }
  }

  async syncFromOutlook(userId: number): Promise<void> {
    try {
      const accessToken = await this.getValidToken(userId);
      if (!accessToken) {
        throw new Error('No valid access token available');
      }

      // Get events from the last 30 days and next 90 days
      const startTime = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      const endTime = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString();

      const response = await axios.get(
        `https://graph.microsoft.com/v1.0/me/events?$filter=start/dateTime ge '${startTime}' and end/dateTime le '${endTime}'`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const outlookEvents: OutlookEvent[] = response.data.value;
      const existingActivities = await storage.getActivities(userId);
      const existingEventIds = new Set(existingActivities.map(a => a.outlookEventId).filter(Boolean));

      for (const event of outlookEvents) {
        if (!existingEventIds.has(event.id)) {
          // Create new activity from Outlook event
          const newActivity: InsertActivity = {
            userId,
            title: event.subject,
            description: event.body.content,
            type: 'social', // Default type for imported events
            startTime: new Date(event.start.dateTime),
            endTime: new Date(event.end.dateTime),
            location: event.location.displayName,
            priority: event.importance === 'high' ? 'high' : 'medium',
            status: 'pending',
            outlookEventId: event.id,
          };

          await storage.createActivity(newActivity);
        }
      }
    } catch (error) {
      console.error('Error syncing from Outlook:', error);
      throw error;
    }
  }
}