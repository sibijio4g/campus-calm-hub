
import { useState } from 'react';
import { Calendar, BookOpen, Users, Star, Database, Edit3 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import FloatingAddButton from './FloatingAddButton';
import { EditEventModal } from './EditEventModal';

import type { Activity } from '@shared/schema';

const HomePage = () => {
  const [selectedDay, setSelectedDay] = useState('today');
  const [editingEvent, setEditingEvent] = useState<Activity | null>(null);
  
  // Fetch activities from database
  const { data: activities = [], isLoading } = useQuery<Activity[]>({
    queryKey: ['/api/activities'],
    queryFn: async () => {
      const response = await fetch('/api/activities');
      if (!response.ok) throw new Error('Failed to fetch activities');
      return response.json();
    }
  });
  
  const dayOptions = [
    { id: 'today', label: 'Today' },
    { id: 'tomorrow', label: 'Tomorrow' },
    { id: 'this-week', label: 'This Week' }
  ];

  const formatDate = (dateString: string) => {
    if (dateString === 'Today' || dateString === 'Tomorrow') {
      return dateString;
    }
    
    // For other dates, format as "14 Jun (Mon)"
    const date = new Date();
    if (dateString === 'Friday') {
      date.setDate(date.getDate() + ((5 - date.getDay() + 7) % 7)); // Next Friday
    } else if (dateString === 'Saturday') {
      date.setDate(date.getDate() + ((6 - date.getDay() + 7) % 7)); // Next Saturday
    }
    
    const options: Intl.DateTimeFormatOptions = { 
      day: 'numeric', 
      month: 'short', 
      weekday: 'short' 
    };
    return date.toLocaleDateString('en-GB', options).replace(',', '');
  };

  const tasks = {
    today: [
      { id: 1, type: 'assignment', title: 'Physics Essay Due', time: '11:59 PM', priority: 'high' },
      { id: 2, type: 'class', title: 'Mathematics Lecture', time: '2:00 PM', priority: 'medium' },
      { id: 3, type: 'social', title: 'Study Group', time: '4:30 PM', priority: 'low' }
    ],
    tomorrow: [
      { id: 4, type: 'exam', title: 'Chemistry Midterm', time: '9:00 AM', priority: 'high' },
      { id: 5, type: 'club', title: 'Drama Club Meeting', time: '6:00 PM', priority: 'medium' }
    ],
    'this-week': [
      { id: 6, type: 'assignment', title: 'History Project', time: formatDate('Friday'), priority: 'high' },
      { id: 7, type: 'social', title: 'Campus Festival', time: formatDate('Saturday'), priority: 'low' }
    ]
  };

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'assignment':
      case 'exam':
        return <BookOpen className="w-4 h-4" />;
      case 'class':
        return <Calendar className="w-4 h-4" />;
      case 'social':
        return <Users className="w-4 h-4" />;
      case 'club':
        return <Star className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-400/70 bg-red-50/30';
      case 'medium':
        return 'border-l-yellow-400/70 bg-yellow-50/30';
      case 'low':
        return 'border-l-green-400/70 bg-green-50/30';
      default:
        return 'border-l-gray-400/70 bg-gray-50/30';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50/30 via-emerald-50/20 to-teal-50/30 pb-24">
      {/* Hero Section - Top 35% */}
      <div 
        className="relative h-[35vh] bg-gradient-to-br from-emerald-600/90 via-green-700/90 to-teal-800/90 overflow-hidden backdrop-blur-sm"
        style={{
          backgroundImage: `linear-gradient(rgba(6, 78, 59, 0.7), rgba(6, 78, 59, 0.8)), url('/lovable-uploads/3c343dbc-8b14-4553-bd82-82f11c25ad2e.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />
        
        <div className="relative z-10 flex flex-col justify-center h-full px-6 text-white">
          <div className="mb-4">
            <h1 className="text-3xl font-bold mb-2">Good morning, Alex!</h1>
            <p className="text-green-100/90 text-lg opacity-90">Ready to make today productive?</p>
            
            {/* Database Status */}
            <div className="mt-3 flex items-center space-x-2 text-sm">
              <Database className="w-4 h-4" />
              <span>Database connected • {activities.length} activities stored</span>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
            <h2 className="text-xl font-semibold mb-3">Today's Summary</h2>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-green-100/80">Tasks due</span>
                <span className="font-semibold">3</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-green-100/80">Classes</span>
                <span className="font-semibold">1</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-green-100/80">Events</span>
                <span className="font-semibold">1</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Day Toggle Row */}
      <div className="px-6 py-4 bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="grid grid-cols-3 gap-2">
          {dayOptions.map((day) => (
            <button
              key={day.id}
              onClick={() => setSelectedDay(day.id)}
              className={`px-6 py-3 rounded-full text-center transition-all duration-200 backdrop-blur-sm ${
                selectedDay === day.id
                  ? 'bg-emerald-600/80 text-white border border-emerald-500/30'
                  : 'bg-white/20 text-gray-700 hover:bg-white/30 border border-white/30'
              }`}
            >
              {day.label}
            </button>
          ))}
        </div>
      </div>



      {/* Activity Cards */}
      <div className="px-6 py-4 space-y-3 pb-24">
        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Loading activities...</p>
          </div>
        ) : activities.length > 0 ? (
          activities.map((activity) => (
            <div
              key={activity.id}
              className={`bg-white/20 backdrop-blur-md rounded-xl p-4 border-l-4 border border-white/30 transition-all duration-200 hover:bg-white/30 cursor-pointer group ${getPriorityColor(activity.priority || 'medium')}`}
              onClick={() => setEditingEvent(activity)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="mt-1 text-gray-600">
                    {getTaskIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{activity.title}</h3>
                    <p className="text-sm text-gray-600">
                      {new Date(activity.startTime).toLocaleString()}
                      {activity.location && ` • ${activity.location}`}
                    </p>
                    {activity.description && (
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">{activity.description}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {activity.priority && (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${
                      activity.priority === 'high' ? 'bg-red-100/50 text-red-800' :
                      activity.priority === 'medium' ? 'bg-yellow-100/50 text-yellow-800' :
                      'bg-green-100/50 text-green-800'
                    }`}>
                      {activity.priority}
                    </span>
                  )}
                  <Edit3 className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No activities scheduled</p>
          </div>
        )}
      </div>

      <FloatingAddButton />
      
      {/* Edit Event Modal */}
      {editingEvent && (
        <EditEventModal
          event={editingEvent}
          isOpen={!!editingEvent}
          onClose={() => setEditingEvent(null)}
        />
      )}
    </div>
  );
};

export default HomePage;
