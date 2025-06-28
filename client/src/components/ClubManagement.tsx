import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Star, Users, Calendar, Plus, ChevronRight, Target, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { apiRequest } from '@/lib/queryClient';
import type { Club, Activity } from '@shared/schema';

interface ClubManagementProps {
  onAddActivity: (clubId?: number) => void;
}

export const ClubManagement = ({ onAddActivity }: ClubManagementProps) => {
  const [selectedClub, setSelectedClub] = useState<number | null>(null);

  // Fetch user's clubs
  const { data: clubs = [] } = useQuery<Club[]>({
    queryKey: ['/api/clubs'],
    queryFn: () => apiRequest('/api/clubs'),
  });

  // Fetch activities for selected club
  const { data: clubActivities = [] } = useQuery<Activity[]>({
    queryKey: ['/api/activities/club', selectedClub],
    queryFn: () => apiRequest(`/api/activities/club/${selectedClub}`),
    enabled: !!selectedClub,
  });

  const selectedClubData = clubs.find(c => c.id === selectedClub);

  const getRoleColor = (role: string) => {
    const colors = {
      'president': 'bg-purple-100 text-purple-800',
      'vice-president': 'bg-blue-100 text-blue-800',
      'secretary': 'bg-green-100 text-green-800',
      'treasurer': 'bg-yellow-100 text-yellow-800',
      'officer': 'bg-orange-100 text-orange-800',
      'member': 'bg-gray-100 text-gray-800',
    };
    return colors[role.toLowerCase() as keyof typeof colors] || colors.member;
  };

  const getActivityTypeIcon = (type: string) => {
    switch (type) {
      case 'meeting':
        return <Users className="w-4 h-4" />;
      case 'event':
        return <Calendar className="w-4 h-4" />;
      case 'practice':
        return <Target className="w-4 h-4" />;
      case 'competition':
        return <Trophy className="w-4 h-4" />;
      default:
        return <Star className="w-4 h-4" />;
    }
  };

  if (selectedClub && selectedClubData) {
    return (
      <div className="space-y-6">
        {/* Club Header */}
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <button 
            onClick={() => setSelectedClub(null)}
            className="hover:text-gray-900"
          >
            Clubs
          </button>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium">{selectedClubData.name}</span>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-purple-600" />
                  <span>{selectedClubData.name}</span>
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  {selectedClubData.description}
                </p>
                {selectedClubData.meetingDay && selectedClubData.meetingTime && (
                  <p className="text-sm text-gray-500 mt-2">
                    Regular meetings: {selectedClubData.meetingDay}s at {selectedClubData.meetingTime}
                    {selectedClubData.location && ` in ${selectedClubData.location}`}
                  </p>
                )}
              </div>
              <Badge className={getRoleColor(selectedClubData.role)}>
                {selectedClubData.role}
              </Badge>
            </div>
          </CardHeader>
        </Card>

        <Tabs defaultValue="activities" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="activities">Activities</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
          </TabsList>

          <TabsContent value="activities" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Club Activities</h3>
              <Button 
                onClick={() => onAddActivity(selectedClub)}
                size="sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Activity
              </Button>
            </div>
            
            <div className="space-y-3">
              {clubActivities.map((activity) => (
                <Card key={activity.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className="mt-1 text-purple-600">
                          {getActivityTypeIcon(activity.type)}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{activity.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {new Date(activity.startTime).toLocaleDateString()} • {new Date(activity.startTime).toLocaleTimeString()}
                          </p>
                          {activity.location && (
                            <p className="text-sm text-gray-500">{activity.location}</p>
                          )}
                          {activity.description && (
                            <p className="text-sm text-gray-500 mt-2">{activity.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{activity.type}</Badge>
                        {activity.priority && (
                          <Badge 
                            variant={activity.priority === 'high' ? 'destructive' : 'secondary'}
                          >
                            {activity.priority}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {clubActivities.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Star className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No activities scheduled yet. Add your first club activity!</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-4">
            <h3 className="text-lg font-semibold">Upcoming Schedule</h3>
            
            <div className="space-y-3">
              {clubActivities
                .filter(activity => new Date(activity.startTime) >= new Date())
                .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
                .map((activity) => (
                <Card key={activity.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-purple-600" />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{activity.title}</h4>
                        <p className="text-sm text-gray-600">
                          {new Date(activity.startTime).toLocaleDateString()} at {new Date(activity.startTime).toLocaleTimeString()}
                        </p>
                        {activity.location && (
                          <p className="text-sm text-gray-500">{activity.location}</p>
                        )}
                      </div>
                      <Badge variant="outline">{activity.type}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {clubActivities.filter(activity => new Date(activity.startTime) >= new Date()).length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No upcoming activities scheduled.</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="members" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Club Members</h3>
              <Button size="sm" variant="outline">
                <Users className="w-4 h-4 mr-2" />
                Invite Members
              </Button>
            </div>
            
            <div className="text-center py-8 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Member management coming soon!</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  // Clubs overview
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">My Clubs & Activities</h2>
        <Button size="sm" variant="outline">
          <Plus className="w-4 h-4 mr-2" />
          Join Club
        </Button>
      </div>

      <div className="grid gap-4">
        {clubs.map((club) => (
          <Card 
            key={club.id} 
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelectedClub(club.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Star className="w-5 h-5 text-purple-600" />
                  <div>
                    <h3 className="font-semibold text-gray-900">{club.name}</h3>
                    {club.description && (
                      <p className="text-sm text-gray-600">{club.description}</p>
                    )}
                    {club.meetingDay && club.meetingTime && (
                      <p className="text-sm text-gray-500">
                        {club.meetingDay}s at {club.meetingTime}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getRoleColor(club.role)}>
                    {club.role}
                  </Badge>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {clubs.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Star className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg mb-2">No clubs joined yet</p>
            <p className="text-sm">Join your first club to get involved in campus life!</p>
          </div>
        )}
      </div>
    </div>
  );
};