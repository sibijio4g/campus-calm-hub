import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Calendar, Users, Share2, UserPlus, Eye, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { apiRequest } from '@/lib/queryClient';
import type { Activity, SocialConnection, SharedCalendar } from '@shared/schema';

interface SocialCalendarProps {
  onAddEvent: () => void;
}

export const SocialCalendar = ({ onAddEvent }: SocialCalendarProps) => {
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Fetch social activities
  const { data: socialActivities = [] } = useQuery<Activity[]>({
    queryKey: ['/api/activities/social'],
    queryFn: () => apiRequest('/api/activities/social'),
  });

  // Fetch social connections (friends)
  const { data: friends = [] } = useQuery<SocialConnection[]>({
    queryKey: ['/api/social/connections'],
    queryFn: () => apiRequest('/api/social/connections'),
  });

  // Fetch shared calendars
  const { data: sharedCalendars = [] } = useQuery<SharedCalendar[]>({
    queryKey: ['/api/social/shared-calendars'],
    queryFn: () => apiRequest('/api/social/shared-calendars'),
  });

  const getEventTypeColor = (type: string) => {
    const colors = {
      'party': 'bg-pink-100 text-pink-800',
      'study-group': 'bg-blue-100 text-blue-800',
      'networking': 'bg-purple-100 text-purple-800',
      'trip': 'bg-green-100 text-green-800',
      'movie': 'bg-orange-100 text-orange-800',
      'sports': 'bg-red-100 text-red-800',
      'other': 'bg-gray-100 text-gray-800',
    };
    return colors[type as keyof typeof colors] || colors.other;
  };

  const formatEventTime = (startTime: string, endTime?: string) => {
    const start = new Date(startTime);
    const end = endTime ? new Date(endTime) : null;
    
    const timeStr = start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (end) {
      const endTimeStr = end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      return `${timeStr} - ${endTimeStr}`;
    }
    return timeStr;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Social Calendar</h2>
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            List
          </Button>
          <Button
            variant={viewMode === 'calendar' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('calendar')}
          >
            Calendar
          </Button>
          <Button onClick={onAddEvent} size="sm">
            Add Event
          </Button>
        </div>
      </div>

      <Tabs defaultValue="events" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="friends">Friends</TabsTrigger>
          <TabsTrigger value="shared">Shared Calendars</TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="space-y-4">
          {viewMode === 'list' ? (
            <div className="space-y-3">
              {socialActivities.map((event) => (
                <Card key={event.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-gray-900">{event.title}</h3>
                          <Badge className={getEventTypeColor(event.type)}>
                            {event.type.replace('-', ' ')}
                          </Badge>
                        </div>
                        
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {new Date(event.startTime).toLocaleDateString()} • {formatEventTime(event.startTime, event.endTime || undefined)}
                            </span>
                          </div>
                          
                          {event.location && (
                            <div className="flex items-center space-x-2">
                              <span className="w-4 h-4 flex items-center justify-center">📍</span>
                              <span>{event.location}</span>
                            </div>
                          )}
                          
                          <div className="flex items-center space-x-2">
                            <Users className="w-4 h-4" />
                            <span>5 attending</span>
                          </div>
                        </div>
                        
                        {event.description && (
                          <p className="text-sm text-gray-500 mt-2">{event.description}</p>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline">
                          <Share2 className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {socialActivities.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg mb-2">No social events yet</p>
                  <p className="text-sm">Add your first social event to get started!</p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-lg border p-4">
              <div className="text-center py-12 text-gray-500">
                <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg mb-2">Calendar View</p>
                <p className="text-sm">Interactive calendar view coming soon!</p>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="friends" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Friends & Connections</h3>
            <Button size="sm" variant="outline">
              <UserPlus className="w-4 h-4 mr-2" />
              Add Friend
            </Button>
          </div>
          
          <div className="grid gap-3">
            {friends.map((connection) => (
              <Card key={connection.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarFallback>
                          {connection.friendId.toString().slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium text-gray-900">Friend {connection.friendId}</h4>
                        <p className="text-sm text-gray-600">University Student</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant={connection.status === 'accepted' ? 'default' : 'secondary'}
                      >
                        {connection.status}
                      </Badge>
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {friends.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No friends connected yet. Start building your network!</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="shared" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Shared Calendars</h3>
            <Button size="sm" variant="outline">
              <Share2 className="w-4 h-4 mr-2" />
              Share Calendar
            </Button>
          </div>
          
          <div className="grid gap-3">
            {sharedCalendars.map((shared) => (
              <Card key={shared.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        Shared by User {shared.ownerId}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Access level: {shared.permissions}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{shared.permissions}</Badge>
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {sharedCalendars.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Share2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No shared calendars yet. Share your calendar with friends!</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};