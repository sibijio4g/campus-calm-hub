import { useState } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { VoiceInput } from './VoiceInput';
import { apiRequest } from '@/lib/queryClient';
import type { Course, Club, InsertActivity } from '@shared/schema';

interface EnhancedAddActivityFormProps {
  onClose: () => void;
  initialCourseId?: number;
  initialClubId?: number;
  initialCategory?: 'academic' | 'social' | 'club';
}

export const EnhancedAddActivityForm = ({ 
  onClose, 
  initialCourseId, 
  initialClubId, 
  initialCategory 
}: EnhancedAddActivityFormProps) => {
  const [mode, setMode] = useState<'type' | 'voice'>('type');
  const [category, setCategory] = useState<'academic' | 'social' | 'club'>(initialCategory || 'academic');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '',
    courseId: initialCourseId || '',
    clubId: initialClubId || '',
    location: '',
    priority: 'medium',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    isRecurring: false,
    recurringPattern: '',
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch courses for academic activities
  const { data: courses = [] } = useQuery<Course[]>({
    queryKey: ['/api/courses/all'],
    queryFn: () => apiRequest('/api/courses/all'),
    enabled: category === 'academic',
  });

  // Fetch clubs for club activities
  const { data: clubs = [] } = useQuery<Club[]>({
    queryKey: ['/api/clubs'],
    queryFn: () => apiRequest('/api/clubs'),
    enabled: category === 'club',
  });

  // Create activity mutation
  const createActivityMutation = useMutation({
    mutationFn: async (activityData: InsertActivity) => {
      return apiRequest('/api/activities', {
        method: 'POST',
        body: JSON.stringify(activityData),
      });
    },
    onSuccess: () => {
      toast({
        title: "Activity Created!",
        description: "Your activity has been added successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/activities'] });
      onClose();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create activity. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleVoiceTranscript = (transcript: string) => {
    // Simple NLP to parse voice input
    const parsed = parseVoiceInput(transcript);
    if (parsed) {
      setFormData(prev => ({
        ...prev,
        ...parsed,
      }));
      setMode('type'); // Switch to form mode to review/edit
      toast({
        title: "Voice Input Processed",
        description: "Please review and submit your activity.",
      });
    } else {
      toast({
        title: "Could not parse input",
        description: "Please try speaking more clearly or use manual input.",
        variant: "destructive",
      });
    }
  };

  const parseVoiceInput = (transcript: string) => {
    const lower = transcript.toLowerCase();
    
    // Extract activity type and category
    let type = '';
    let detectedCategory = category;
    
    if (lower.includes('assignment') || lower.includes('homework')) {
      type = 'assignment';
      detectedCategory = 'academic';
    } else if (lower.includes('exam') || lower.includes('test')) {
      type = 'exam';
      detectedCategory = 'academic';
    } else if (lower.includes('lecture') || lower.includes('class')) {
      type = 'lecture';
      detectedCategory = 'academic';
    } else if (lower.includes('meeting')) {
      type = 'meeting';
      detectedCategory = 'club';
    } else if (lower.includes('party') || lower.includes('social')) {
      type = 'party';
      detectedCategory = 'social';
    } else if (lower.includes('study group')) {
      type = 'study-group';
      detectedCategory = 'social';
    }

    // Extract title (everything before "due" or "at" or "on")
    let title = '';
    const titleMatch = transcript.match(/^(.*?)(?:\s+(?:due|at|on|for)\s+)/i);
    if (titleMatch) {
      title = titleMatch[1].trim();
    } else {
      title = transcript.split(' ').slice(0, 5).join(' '); // First 5 words as fallback
    }

    // Extract date/time
    let startDate = '';
    let startTime = '';
    
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (lower.includes('today')) {
      startDate = today.toISOString().split('T')[0];
    } else if (lower.includes('tomorrow')) {
      startDate = tomorrow.toISOString().split('T')[0];
    } else if (lower.includes('friday')) {
      const friday = new Date(today);
      friday.setDate(today.getDate() + ((5 - today.getDay() + 7) % 7));
      startDate = friday.toISOString().split('T')[0];
    }

    // Extract time
    const timeMatch = transcript.match(/(\d{1,2}):?(\d{2})?\s*(am|pm)/i);
    if (timeMatch) {
      let hour = parseInt(timeMatch[1]);
      const minute = timeMatch[2] ? parseInt(timeMatch[2]) : 0;
      const ampm = timeMatch[3].toLowerCase();
      
      if (ampm === 'pm' && hour !== 12) hour += 12;
      if (ampm === 'am' && hour === 12) hour = 0;
      
      startTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    }

    if (title) {
      setCategory(detectedCategory);
      return {
        title,
        type,
        startDate,
        startTime,
      };
    }
    
    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.type || !formData.startDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in title, type, and start date.",
        variant: "destructive",
      });
      return;
    }

    const startDateTime = new Date(`${formData.startDate}T${formData.startTime || '00:00'}`);
    const endDateTime = formData.endDate && formData.endTime 
      ? new Date(`${formData.endDate}T${formData.endTime}`)
      : null;

    const activityData: InsertActivity = {
      userId: 1, // Demo user ID
      title: formData.title,
      description: formData.description || null,
      type: formData.type,
      category,
      courseId: category === 'academic' && formData.courseId ? parseInt(formData.courseId.toString()) : null,
      clubId: category === 'club' && formData.clubId ? parseInt(formData.clubId.toString()) : null,
      startTime: startDateTime,
      endTime: endDateTime,
      location: formData.location || null,
      priority: formData.priority as 'high' | 'medium' | 'low',
      status: 'pending',
      isRecurring: formData.isRecurring,
      recurringPattern: formData.isRecurring ? formData.recurringPattern : null,
    };

    createActivityMutation.mutate(activityData);
  };

  const getTypeOptions = () => {
    switch (category) {
      case 'academic':
        return [
          { value: 'lecture', label: 'Lecture' },
          { value: 'assignment', label: 'Assignment' },
          { value: 'quiz', label: 'Quiz' },
          { value: 'exam', label: 'Exam' },
          { value: 'project', label: 'Project' },
        ];
      case 'social':
        return [
          { value: 'party', label: 'Party' },
          { value: 'study-group', label: 'Study Group' },
          { value: 'networking', label: 'Networking' },
          { value: 'trip', label: 'Trip' },
          { value: 'movie', label: 'Movie Night' },
          { value: 'sports', label: 'Sports' },
        ];
      case 'club':
        return [
          { value: 'meeting', label: 'Meeting' },
          { value: 'event', label: 'Event' },
          { value: 'practice', label: 'Practice' },
          { value: 'competition', label: 'Competition' },
          { value: 'workshop', label: 'Workshop' },
        ];
      default:
        return [];
    }
  };

  if (mode === 'voice') {
    return (
      <VoiceInput
        onTranscript={handleVoiceTranscript}
        onClose={() => setMode('type')}
        isActive={true}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Add New Activity</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setMode('voice')}
        >
          🎤 Voice Input
        </Button>
      </div>

      {/* Category Selection */}
      <div className="space-y-2">
        <Label>Category</Label>
        <Select value={category} onValueChange={(value: 'academic' | 'social' | 'club') => setCategory(value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="academic">Academic</SelectItem>
            <SelectItem value="social">Social</SelectItem>
            <SelectItem value="club">Club</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Basic Information */}
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          placeholder="Enter activity title"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="type">Type *</Label>
        <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
          <SelectTrigger>
            <SelectValue placeholder="Select activity type" />
          </SelectTrigger>
          <SelectContent>
            {getTypeOptions().map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Category-specific fields */}
      {category === 'academic' && (
        <div className="space-y-2">
          <Label htmlFor="courseId">Course</Label>
          <Select value={formData.courseId.toString()} onValueChange={(value) => setFormData({...formData, courseId: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Select a course" />
            </SelectTrigger>
            <SelectContent>
              {courses.map((course) => (
                <SelectItem key={course.id} value={course.id.toString()}>
                  {course.name} ({course.code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {category === 'club' && (
        <div className="space-y-2">
          <Label htmlFor="clubId">Club</Label>
          <Select value={formData.clubId.toString()} onValueChange={(value) => setFormData({...formData, clubId: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Select a club" />
            </SelectTrigger>
            <SelectContent>
              {clubs.map((club) => (
                <SelectItem key={club.id} value={club.id.toString()}>
                  {club.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Date and Time */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date *</Label>
          <Input
            id="startDate"
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({...formData, startDate: e.target.value})}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="startTime">Start Time</Label>
          <Input
            id="startTime"
            type="time"
            value={formData.startTime}
            onChange={(e) => setFormData({...formData, startTime: e.target.value})}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="endDate">End Date</Label>
          <Input
            id="endDate"
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData({...formData, endDate: e.target.value})}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="endTime">End Time</Label>
          <Input
            id="endTime"
            type="time"
            value={formData.endTime}
            onChange={(e) => setFormData({...formData, endTime: e.target.value})}
          />
        </div>
      </div>

      {/* Additional Fields */}
      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          value={formData.location}
          onChange={(e) => setFormData({...formData, location: e.target.value})}
          placeholder="Enter location"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="priority">Priority</Label>
        <Select value={formData.priority} onValueChange={(value) => setFormData({...formData, priority: value})}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          placeholder="Add any additional details..."
          rows={3}
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="flex-1"
          disabled={createActivityMutation.isPending}
        >
          {createActivityMutation.isPending ? 'Creating...' : 'Create Activity'}
        </Button>
      </div>
    </form>
  );
};