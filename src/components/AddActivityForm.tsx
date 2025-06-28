
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
              <Label htmlFor="course">Course</Label>
              <Select value={formData.course} onValueChange={(value) => setFormData({...formData, course: value})}>
                <SelectTrigger className="bg-white/10 backdrop-blur-sm border-white/20">
                  <SelectValue placeholder="Select a course" />
                </SelectTrigger>
                <SelectContent className="bg-white/90 backdrop-blur-md">
                  {courses.map((course) => (
                    <SelectItem key={course} value={course}>{course}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                <SelectTrigger className="bg-white/10 backdrop-blur-sm border-white/20">
                  <SelectValue placeholder="Select activity type" />
                </SelectTrigger>
                <SelectContent className="bg-white/90 backdrop-blur-md">
                  {studyTypes.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                  className="bg-white/10 backdrop-blur-sm border-white/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueTime">Due Time</Label>
                <Input
                  id="dueTime"
                  type="time"
                  value={formData.dueTime}
                  onChange={(e) => setFormData({...formData, dueTime: e.target.value})}
                  className="bg-white/10 backdrop-blur-sm border-white/20"
                />
              </div>
            </div>
          </>
        );
      
      case 'social':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="type">Event Type</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                <SelectTrigger className="bg-white/10 backdrop-blur-sm border-white/20">
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent className="bg-white/90 backdrop-blur-md">
                  {socialTypes.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dueDate">Event Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                  className="bg-white/10 backdrop-blur-sm border-white/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueTime">Event Time</Label>
                <Input
                  id="dueTime"
                  type="time"
                  value={formData.dueTime}
                  onChange={(e) => setFormData({...formData, dueTime: e.target.value})}
                  className="bg-white/10 backdrop-blur-sm border-white/20"
                />
              </div>
            </div>
          </>
        );
      
      case 'clubs':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="club">Club</Label>
              <Select value={formData.club} onValueChange={(value) => setFormData({...formData, club: value})}>
                <SelectTrigger className="bg-white/10 backdrop-blur-sm border-white/20">
                  <SelectValue placeholder="Select a club" />
                </SelectTrigger>
                <SelectContent className="bg-white/90 backdrop-blur-md">
                  {clubs.map((club) => (
                    <SelectItem key={club} value={club}>{club}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Activity Type</Label>
              <Input
                id="type"
                placeholder="e.g., Meeting, Event, Workshop"
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                className="bg-white/10 backdrop-blur-sm border-white/20"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dueDate">Activity Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                  className="bg-white/10 backdrop-blur-sm border-white/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueTime">Activity Time</Label>
                <Input
                  id="dueTime"
                  type="time"
                  value={formData.dueTime}
                  onChange={(e) => setFormData({...formData, dueTime: e.target.value})}
                  className="bg-white/10 backdrop-blur-sm border-white/20"
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
        <Label htmlFor="activityType">Activity Category</Label>
        <Select value={activityType} onValueChange={(value: 'study' | 'social' | 'clubs') => setActivityType(value)}>
          <SelectTrigger className="bg-white/10 backdrop-blur-sm border-white/20">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent className="bg-white/90 backdrop-blur-md">
            <SelectItem value="study">Study</SelectItem>
            <SelectItem value="social">Social</SelectItem>
            <SelectItem value="clubs">Clubs</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {activityType && (
        <>
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="Enter activity title"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="bg-white/10 backdrop-blur-sm border-white/20"
              required
            />
          </div>

          {renderDynamicFields()}

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Add any additional details..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="bg-white/10 backdrop-blur-sm border-white/20 min-h-[80px]"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-blue-600/80 hover:bg-blue-700/80 backdrop-blur-sm"
            >
              Add Activity
            </Button>
          </div>
        </>
      )}
    </form>
  );
};
