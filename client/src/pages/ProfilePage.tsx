import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { User, Settings, Calendar, RefreshCw, CheckCircle, AlertCircle, Plus, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

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

const ProfilePage = () => {
  const [selectedCalendarId, setSelectedCalendarId] = useState<string>('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch user profile
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['/api/profile'],
    queryFn: () => apiRequest('/api/profile'),
  });

  // Fetch Google calendars if connected
  const { data: calendars = [], isLoading: calendarsLoading } = useQuery({
    queryKey: ['/api/google/calendars'],
    queryFn: () => apiRequest('/api/google/calendars'),
    enabled: profile?.googleConnected,
  });

  // Connect to Google Calendar
  const connectMutation = useMutation({
    mutationFn: () => apiRequest('/api/google/auth'),
    onSuccess: (data) => {
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

  // Disconnect Google Calendar
  const disconnectMutation = useMutation({
    mutationFn: () => apiRequest('/api/google/disconnect', { method: 'POST' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/profile'] });
      toast({
        title: "Disconnected",
        description: "Google Calendar has been disconnected.",
      });
    },
  });

  // Update selected calendar
  const updateCalendarMutation = useMutation({
    mutationFn: (calendarId: string) => 
      apiRequest('/api/google/calendar', {
        method: 'PUT',
        body: JSON.stringify({ calendarId }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/profile'] });
      toast({
        title: "Calendar Updated",
        description: "Your default calendar has been updated.",
      });
    },
  });

  // Sync with Google Calendar
  const syncMutation = useMutation({
    mutationFn: (calendarId: string) => 
      apiRequest('/api/google/sync', {
        method: 'POST',
        body: JSON.stringify({ calendarId }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/activities'] });
      toast({
        title: "Sync Complete",
        description: "Your calendar events have been synchronized.",
      });
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 pb-24">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Profile Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl">{profile?.username}</CardTitle>
                <CardDescription>University Student Account</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Google Calendar Integration */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-green-600" />
                <CardTitle>Google Calendar Integration</CardTitle>
              </div>
              <Badge variant={profile?.googleConnected ? "default" : "secondary"}>
                {profile?.googleConnected ? "Connected" : "Disconnected"}
              </Badge>
            </div>
            <CardDescription>
              Sync your university activities with Google Calendar for seamless scheduling across all your devices.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {profile?.googleConnected ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-800">Connected to Google Calendar</span>
                </div>

                {/* Calendar Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Default Calendar</label>
                  <Select 
                    value={selectedCalendarId || profile?.selectedCalendarId} 
                    onValueChange={handleCalendarSelect}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a calendar" />
                    </SelectTrigger>
                    <SelectContent>
                      {calendarsLoading ? (
                        <SelectItem value="loading" disabled>Loading calendars...</SelectItem>
                      ) : (
                        calendars.map((calendar: GoogleCalendar) => (
                          <SelectItem key={calendar.id} value={calendar.id}>
                            <div className="flex items-center space-x-2">
                              <span>{calendar.summary}</span>
                              {calendar.primary && (
                                <Badge variant="outline" className="text-xs">Primary</Badge>
                              )}
                            </div>
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {/* Sync Controls */}
                <div className="flex space-x-2">
                  <Button 
                    onClick={handleSync} 
                    disabled={syncMutation.isPending}
                    className="flex items-center space-x-2"
                  >
                    <RefreshCw className={`w-4 h-4 ${syncMutation.isPending ? 'animate-spin' : ''}`} />
                    <span>{syncMutation.isPending ? 'Syncing...' : 'Sync Now'}</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={() => disconnectMutation.mutate()}
                    disabled={disconnectMutation.isPending}
                  >
                    Disconnect
                  </Button>
                </div>

                {/* Sync Features */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Sync Features:</h4>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• Activities automatically sync to your Google Calendar</li>
                    <li>• Google Calendar events import as social activities</li>
                    <li>• Changes made in either location sync both ways</li>
                    <li>• Choose which calendar to sync with</li>
                    <li>• Automatic sync every 15 minutes</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center space-x-2 p-3 bg-yellow-50 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm text-yellow-800">
                    Connect your Google account to enable calendar synchronization
                  </span>
                </div>

                <Button 
                  onClick={() => connectMutation.mutate()} 
                  disabled={connectMutation.isPending}
                  className="w-full flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Connect Google Calendar</span>
                  <ExternalLink className="w-4 h-4" />
                </Button>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">What you'll get:</h4>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• Automatic two-way sync with your Google Calendar</li>
                    <li>• All your university activities appear in Google Calendar</li>
                    <li>• Import existing calendar events as activities</li>
                    <li>• Access your schedule across all devices</li>
                    <li>• Choose which Google Calendar to sync with</li>
                    <li>• Never miss important deadlines or lectures</li>
                  </ul>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Account Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Settings className="w-5 h-5 text-gray-600" />
              <CardTitle>Account Settings</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2">
                <span className="text-sm">Username</span>
                <span className="text-sm text-gray-600">{profile?.username}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm">Account Type</span>
                <Badge variant="outline">Student</Badge>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm">Calendar Integration</span>
                <Badge variant={profile?.googleConnected ? "default" : "secondary"}>
                  {profile?.googleConnected ? "Google Calendar" : "None"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;