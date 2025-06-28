import { useState } from 'react';
import { Calendar, BookOpen, Users, Star, Database, Edit3, Mic } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { EnhancedAddActivityForm } from './EnhancedAddActivityForm';
import { EditEventModal } from './EditEventModal';
import { VoiceInput } from './VoiceInput';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { apiRequest } from '@/lib/queryClient';
import type { Activity } from '@shared/schema';

const HomePage = () => {
  const [selectedDay, setSelectedDay] = useState('today');
  const [editingEvent, setEditingEvent] = useState<Activity | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showVoiceInput, setShowVoiceInput] = useState(false);
  
  // Fetch activities from database
  const { data: activities = [], isLoading } = useQuery<Activity[]>({
    queryKey: ['/api/activities'],
    queryFn: () => apiRequest('/api/activities')
  });
  
  const dayOptions = [
    { id: 'today', label: 'Today' },
    { id: 'tomorrow', label: 'Tomorrow' },
    { id: 'this-week', label: 'This Week' }
  ];

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'assignment':
      case 'exam':
      case 'lecture':
        return <BookOpen className="w-4 h-4" />;
      case 'meeting':
      case 'event':
        return <Star className="w-4 h-4" />;
      case 'party':
      case 'study-group':
      case 'social':
        return <Users className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'academic':
        return 'border-l-blue-400/70 bg-blue-50/30';
      case 'social':
        return 'border-l-green-400/70 bg-green-50/30';
      case 'club':
        return 'border-l-purple-400/70 bg-purple-50/30';
      default:
        return 'border-l-gray-400/70 bg-gray-50/30';
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

  const handleVoiceTranscript = (transcript: string) => {
    // Process voice input and show add form
    setShowVoiceInput(false);
    setShowAddForm(true);
  };

  const isMobile = window.innerWidth < 768;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50/30 via-emerald-50/20 to-teal-50/30 pb-24">
      {/* Hero Section */}
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
                <span className="text-green-100/80">Academic tasks</span>
                <span className="font-semibold">{activities.filter(a => a.category === 'academic').length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-green-100/80">Social events</span>
                <span className="font-semibold">{activities.filter(a => a.category === 'social').length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-green-100/80">Club activities</span>
                <span className="font-semibold">{activities.filter(a => a.category === 'club').length}</span>
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
              className={`bg-white/20 backdrop-blur-md rounded-xl p-4 border-l-4 border border-white/30 transition-all duration-200 hover:bg-white/30 cursor-pointer group ${
                activity.category ? getCategoryColor(activity.category) : getPriorityColor(activity.priority || 'medium')
              }`}
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
                  {activity.category && (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${
                      activity.category === 'academic' ? 'bg-blue-100/50 text-blue-800' :
                      activity.category === 'social' ? 'bg-green-100/50 text-green-800' :
                      'bg-purple-100/50 text-purple-800'
                    }`}>
                      {activity.category}
                    </span>
                  )}
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

      {/* Floating Action Buttons */}
      <div className="fixed bottom-20 right-6 flex flex-col space-y-3 z-40">
        {/* Voice Input Button */}
        <button
          onClick={() => setShowVoiceInput(true)}
          className="w-14 h-14 bg-gradient-to-r from-green-600/90 to-emerald-600/90 backdrop-blur-md hover:from-green-700/90 hover:to-emerald-700/90 text-white rounded-full shadow-lg transition-all duration-200 flex items-center justify-center border border-white/20"
          title="Voice Input"
        >
          <Mic className="w-6 h-6" />
        </button>
        
        {/* Add Activity Button */}
        <button
          onClick={() => setShowAddForm(true)}
          className="w-14 h-14 bg-gradient-to-r from-blue-600/90 to-purple-600/90 backdrop-blur-md hover:from-blue-700/90 hover:to-purple-700/90 text-white rounded-full shadow-lg transition-all duration-200 flex items-center justify-center border border-white/20"
          title="Add Activity"
        >
          <Calendar className="w-6 h-6" />
        </button>
      </div>

      {/* Voice Input Modal/Drawer */}
      {isMobile ? (
        <Drawer open={showVoiceInput} onOpenChange={setShowVoiceInput}>
          <DrawerContent className="bg-white/80 backdrop-blur-md border-gray-300">
            <DrawerHeader>
              <DrawerTitle className="text-center text-gray-900">
                Voice Input
              </DrawerTitle>
            </DrawerHeader>
            <VoiceInput
              onTranscript={handleVoiceTranscript}
              onClose={() => setShowVoiceInput(false)}
              isActive={showVoiceInput}
            />
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={showVoiceInput} onOpenChange={setShowVoiceInput}>
          <DialogContent className="bg-white/80 backdrop-blur-md border-gray-300 max-w-md">
            <DialogHeader>
              <DialogTitle className="text-center text-gray-900">
                Voice Input
              </DialogTitle>
            </DialogHeader>
            <VoiceInput
              onTranscript={handleVoiceTranscript}
              onClose={() => setShowVoiceInput(false)}
              isActive={showVoiceInput}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Add Activity Modal/Drawer */}
      {isMobile ? (
        <Drawer open={showAddForm} onOpenChange={setShowAddForm}>
          <DrawerContent className="bg-white/80 backdrop-blur-md border-gray-300">
            <DrawerHeader>
              <DrawerTitle className="text-center text-gray-900">
                Add New Activity
              </DrawerTitle>
            </DrawerHeader>
            <EnhancedAddActivityForm onClose={() => setShowAddForm(false)} />
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
          <DialogContent className="bg-white/80 backdrop-blur-md border-gray-300 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-center text-gray-900">
                Add New Activity
              </DialogTitle>
            </DialogHeader>
            <EnhancedAddActivityForm onClose={() => setShowAddForm(false)} />
          </DialogContent>
        </Dialog>
      )}
      
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