
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface AddActivityFormProps {
  onClose: () => void;
}

export const AddActivityForm = ({ onClose }: AddActivityFormProps) => {
  const [activityType, setActivityType] = useState<'study' | 'social' | 'clubs' | ''>('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    course: '',
    type: '',
    club: '',
    dueDate: '',
    dueTime: '',
  });
  const { toast } = useToast();

  // Mock data - in real app, this would come from user's data
  const courses = ['Mathematics', 'Physics', 'Chemistry', 'History'];
  const studyTypes = ['Assignment', 'Task', 'Lecture', 'Exam', 'Project'];
  const socialTypes = ['Birthday Party', 'Get Together', 'Trip', 'Trivia Night', 'Movie Night', 'Study Group'];
  const clubs = ['Drama Club', 'Chess Society', 'Environmental Club', 'Photography Club', 'Debate Society'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!activityType || !formData.title) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Here you would typically save the data
    console.log('Saving activity:', { activityType, ...formData });
    
    toast({
      title: "Activity Added!",
      description: `Your ${activityType} activity has been created successfully.`,
    });
    
    onClose();
  };

  const renderDynamicFields = () => {
    switch (activityType) {
      case 'study':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="course" className="text-gray-900 font-medium">Course</Label>
              <Select value={formData.course} onValueChange={(value) => setFormData({...formData, course: value})}>
                <SelectTrigger className="bg-white/60 backdrop-blur-sm border-gray-300 text-gray-900">
                  <SelectValue placeholder="Select a course" />
                </SelectTrigger>
                <SelectContent className="bg-white/95 backdrop-blur-md border-gray-300">
                  {courses.map((course) => (
                    <SelectItem key={course} value={course} className="text-gray-900">{course}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="type" className="text-gray-900 font-medium">Type</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                <SelectTrigger className="bg-white/60 backdrop-blur-sm border-gray-300 text-gray-900">
                  <SelectValue placeholder="Select activity type" />
                </SelectTrigger>
                <SelectContent className="bg-white/95 backdrop-blur-md border-gray-300">
                  {studyTypes.map((type) => (
                    <SelectItem key={type} value={type} className="text-gray-900">{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dueDate" className="text-gray-900 font-medium">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                  className="bg-white/60 backdrop-blur-sm border-gray-300 text-gray-900"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueTime" className="text-gray-900 font-medium">Due Time</Label>
                <Input
                  id="dueTime"
                  type="time"
                  value={formData.dueTime}
                  onChange={(e) => setFormData({...formData, dueTime: e.target.value})}
                  className="bg-white/60 backdrop-blur-sm border-gray-300 text-gray-900"
                />
              </div>
            </div>
          </>
        );
      
      case 'social':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="type" className="text-gray-900 font-medium">Event Type</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                <SelectTrigger className="bg-white/60 backdrop-blur-sm border-gray-300 text-gray-900">
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent className="bg-white/95 backdrop-blur-md border-gray-300">
                  {socialTypes.map((type) => (
                    <SelectItem key={type} value={type} className="text-gray-900">{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dueDate" className="text-gray-900 font-medium">Event Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                  className="bg-white/60 backdrop-blur-sm border-gray-300 text-gray-900"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueTime" className="text-gray-900 font-medium">Event Time</Label>
                <Input
                  id="dueTime"
                  type="time"
                  value={formData.dueTime}
                  onChange={(e) => setFormData({...formData, dueTime: e.target.value})}
                  className="bg-white/60 backdrop-blur-sm border-gray-300 text-gray-900"
                />
              </div>
            </div>
          </>
        );
      
      case 'clubs':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="club" className="text-gray-900 font-medium">Club</Label>
              <Select value={formData.club} onValueChange={(value) => setFormData({...formData, club: value})}>
                <SelectTrigger className="bg-white/60 backdrop-blur-sm border-gray-300 text-gray-900">
                  <SelectValue placeholder="Select a club" />
                </SelectTrigger>
                <SelectContent className="bg-white/95 backdrop-blur-md border-gray-300">
                  {clubs.map((club) => (
                    <SelectItem key={club} value={club} className="text-gray-900">{club}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="type" className="text-gray-900 font-medium">Activity Type</Label>
              <Input
                id="type"
                placeholder="e.g., Meeting, Event, Workshop"
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                className="bg-white/60 backdrop-blur-sm border-gray-300 text-gray-900"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dueDate" className="text-gray-900 font-medium">Activity Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                  className="bg-white/60 backdrop-blur-sm border-gray-300 text-gray-900"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueTime" className="text-gray-900 font-medium">Activity Time</Label>
                <Input
                  id="dueTime"
                  type="time"
                  value={formData.dueTime}
                  onChange={(e) => setFormData({...formData, dueTime: e.target.value})}
                  className="bg-white/60 backdrop-blur-sm border-gray-300 text-gray-900"
                />
              </div>
            </div>
          </>
        );
      
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <div className="space-y-2">
        <Label htmlFor="activityType" className="text-gray-900 font-medium">Activity Category</Label>
        <Select value={activityType} onValueChange={(value: 'study' | 'social' | 'clubs') => setActivityType(value)}>
          <SelectTrigger className="bg-white/60 backdrop-blur-sm border-gray-300 text-gray-900">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent className="bg-white/95 backdrop-blur-md border-gray-300">
            <SelectItem value="study" className="text-gray-900">Study</SelectItem>
            <SelectItem value="social" className="text-gray-900">Social</SelectItem>
            <SelectItem value="clubs" className="text-gray-900">Clubs</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {activityType && (
        <>
          <div className="space-y-2">
            <Label htmlFor="title" className="text-gray-900 font-medium">Title *</Label>
            <Input
              id="title"
              placeholder="Enter activity title"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="bg-white/60 backdrop-blur-sm border-gray-300 text-gray-900"
              required
            />
          </div>

          {renderDynamicFields()}

          <div className="space-y-2">
            <Label htmlFor="description" className="text-gray-900 font-medium">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Add any additional details..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="bg-white/60 backdrop-blur-sm border-gray-300 text-gray-900 min-h-[80px]"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 bg-white/60 backdrop-blur-sm border-gray-300 hover:bg-white/80 text-gray-900"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-blue-600/90 hover:bg-blue-700/90 backdrop-blur-sm text-white"
            >
              Add Activity
            </Button>
          </div>
        </>
      )}
    </form>
  );
};
