import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Calendar, CheckCircle, AlertCircle, RefreshCw, ExternalLink } from 'lucide-react';

interface GoogleCalendar {
  id: string;
  summary: string;
  description?: string;
  primary?: boolean;
  accessRole: string;
}

interface UserProfile {
  id: number;
  username: string;
  googleConnected: boolean;
  selectedCalendarId?: string;
}

export const GoogleCalendarIntegration = () => {
  const [selectedCalendarId, setSelectedCalendarId] = useState<string>('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch user profile
  const { data: profile, isLoading: profileLoading } = useQuery<UserProfile>({
    queryKey: ['/api/profile'],
    queryFn: () => apiRequest('/api/profile'),
  });

  // Fetch Google calendars if connected
  const { data: calendars = [], isLoading: calendarsLoading } = useQuery<GoogleCalendar[]>({
    queryKey: ['/api/google/calendars'],
    queryFn: () => apiRequest('/api/google/calendars'),
    enabled: profile?.googleConnected,
  });

  // Connect to Google Calendar
  const connectMutation = useMutation({
    mutationFn: () => apiRequest('/api/google/auth'),
    onSuccess: (data: { authUrl: string }) => {
      window.location.href = data.authUrl;
    },
    onError: () => {
      toast({
        title: "Connection Failed",
        description: "Unable to connect to Google Calendar. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Sync calendar
  const syncMutation = useMutation({
    mutationFn: (calendarId: string) => 
      apiRequest('/api/google/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ calendarId }),
      }),
    onSuccess: () => {
      toast({
        title: "Sync Complete",
        description: "Your calendar has been synchronized successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/activities'] });
    },
    onError: () => {
      toast({
        title: "Sync Failed",
        description: "Unable to sync calendar. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Update calendar selection
  const updateCalendarMutation = useMutation({
    mutationFn: (calendarId: string) =>
      apiRequest('/api/profile/calendar', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ calendarId }),
      }),
    onSuccess: () => {
      toast({
        title: "Calendar Updated",
        description: "Your default calendar has been updated.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/profile'] });
    },
  });

  const handleCalendarSelect = (calendarId: string) => {
    setSelectedCalendarId(calendarId);
    updateCalendarMutation.mutate(calendarId);
  };

  const handleSync = () => {
    const calendarId = selectedCalendarId || profile?.selectedCalendarId || 'primary';
    syncMutation.mutate(calendarId);
  };

  if (profileLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Google Calendar Integration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Google Calendar Integration
        </CardTitle>
        <CardDescription>
          Connect your Google Calendar to sync events and activities
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!profile?.googleConnected ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-amber-500" />
              <span className="text-sm text-muted-foreground">
                Not connected to Google Calendar
              </span>
            </div>
            <Button
              onClick={() => connectMutation.mutate()}
              disabled={connectMutation.isPending}
              className="w-full"
            >
              {connectMutation.isPending ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Connect Google Calendar
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Connected to Google Calendar</span>
              <Badge variant="secondary">Active</Badge>
            </div>

            {calendarsLoading ? (
              <div className="flex items-center justify-center py-4">
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span className="ml-2 text-sm">Loading calendars...</span>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium">Select Calendar</label>
                  <Select
                    value={selectedCalendarId || profile.selectedCalendarId || ''}
                    onValueChange={handleCalendarSelect}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choose a calendar" />
                    </SelectTrigger>
                    <SelectContent>
                      {calendars.map((calendar: GoogleCalendar) => (
                        <SelectItem key={calendar.id} value={calendar.id}>
                          <div className="flex items-center gap-2">
                            <span>{calendar.summary}</span>
                            {calendar.primary && (
                              <Badge variant="outline" className="text-xs">
                                Primary
                              </Badge>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={handleSync}
                  disabled={syncMutation.isPending}
                  variant="outline"
                  className="w-full"
                >
                  {syncMutation.isPending ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Syncing...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Sync Calendar
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};