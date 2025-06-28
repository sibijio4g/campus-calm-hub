import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ChevronRight, Plus, BookOpen, Calendar, FileText, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { apiRequest } from '@/lib/queryClient';
import type { Term, Course, Activity, StudyPlan } from '@shared/schema';

interface AcademicStructureProps {
  onAddActivity: (courseId?: number) => void;
}

export const AcademicStructure = ({ onAddActivity }: AcademicStructureProps) => {
  const [selectedTerm, setSelectedTerm] = useState<number | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
  const queryClient = useQueryClient();

  // Fetch terms
  const { data: terms = [] } = useQuery<Term[]>({
    queryKey: ['/api/terms'],
    queryFn: () => apiRequest('/api/terms'),
  });

  // Fetch courses for selected term
  const { data: courses = [] } = useQuery<Course[]>({
    queryKey: ['/api/courses', selectedTerm],
    queryFn: () => apiRequest(`/api/courses?termId=${selectedTerm}`),
    enabled: !!selectedTerm,
  });

  // Fetch activities for selected course
  const { data: courseActivities = [] } = useQuery<Activity[]>({
    queryKey: ['/api/activities/course', selectedCourse],
    queryFn: () => apiRequest(`/api/activities/course/${selectedCourse}`),
    enabled: !!selectedCourse,
  });

  // Fetch study plans for selected course
  const { data: studyPlans = [] } = useQuery<StudyPlan[]>({
    queryKey: ['/api/study-plans', selectedCourse],
    queryFn: () => apiRequest(`/api/study-plans?courseId=${selectedCourse}`),
    enabled: !!selectedCourse,
  });

  const selectedCourseData = courses.find(c => c.id === selectedCourse);

  if (selectedCourse && selectedCourseData) {
    return (
      <div className="space-y-6">
        {/* Course Header */}
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <button 
            onClick={() => setSelectedCourse(null)}
            className="hover:text-gray-900"
          >
            Courses
          </button>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium">{selectedCourseData.name}</span>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <div className={`w-4 h-4 rounded-full bg-${selectedCourseData.color}-500`}></div>
                  <span>{selectedCourseData.name}</span>
                </CardTitle>
                <p className="text-sm text-gray-600">
                  {selectedCourseData.code} • {selectedCourseData.instructor}
                </p>
              </div>
              <Badge variant="outline">{selectedCourseData.credits} Credits</Badge>
            </div>
          </CardHeader>
        </Card>

        <Tabs defaultValue="assignments" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="study-plan">Study Plan</TabsTrigger>
          </TabsList>

          <TabsContent value="assignments" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Assignments & Tasks</h3>
              <Button 
                onClick={() => onAddActivity(selectedCourse)}
                size="sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Assignment
              </Button>
            </div>
            
            <div className="space-y-3">
              {courseActivities
                .filter(activity => ['assignment', 'quiz', 'exam', 'project'].includes(activity.type))
                .map((activity) => (
                <Card key={activity.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{activity.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Due: {new Date(activity.startTime).toLocaleDateString()} at {new Date(activity.startTime).toLocaleTimeString()}
                        </p>
                        {activity.description && (
                          <p className="text-sm text-gray-500 mt-2">{activity.description}</p>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge 
                          variant={activity.priority === 'high' ? 'destructive' : 'secondary'}
                        >
                          {activity.priority}
                        </Badge>
                        <Badge variant="outline">{activity.type}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {courseActivities.filter(activity => ['assignment', 'quiz', 'exam', 'project'].includes(activity.type)).length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No assignments yet. Add your first assignment!</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-4">
            <h3 className="text-lg font-semibold">Class Schedule</h3>
            
            <div className="space-y-3">
              {courseActivities
                .filter(activity => activity.type === 'lecture')
                .map((activity) => (
                <Card key={activity.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{activity.title}</h4>
                        <p className="text-sm text-gray-600">
                          {new Date(activity.startTime).toLocaleDateString()} • {new Date(activity.startTime).toLocaleTimeString()}
                        </p>
                        {activity.location && (
                          <p className="text-sm text-gray-500">{activity.location}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {courseActivities.filter(activity => activity.type === 'lecture').length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No scheduled classes yet.</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="study-plan" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Study Plan & Notes</h3>
              <Button size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Add Topic
              </Button>
            </div>
            
            <div className="space-y-3">
              {studyPlans.map((plan) => (
                <Card key={plan.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{plan.topic}</h4>
                        {plan.notes && (
                          <p className="text-sm text-gray-600 mt-1">{plan.notes}</p>
                        )}
                        {plan.targetDate && (
                          <p className="text-sm text-gray-500 mt-2">
                            Target: {new Date(plan.targetDate).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="text-right">
                          <div className="text-sm font-medium">{plan.progress}%</div>
                          <div className="w-16 h-2 bg-gray-200 rounded-full">
                            <div 
                              className="h-2 bg-green-500 rounded-full transition-all"
                              style={{ width: `${plan.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {studyPlans.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No study topics yet. Start planning your studies!</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  if (selectedTerm) {
    return (
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <button 
            onClick={() => setSelectedTerm(null)}
            className="hover:text-gray-900"
          >
            Terms
          </button>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium">
            {terms.find(t => t.id === selectedTerm)?.name}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Courses</h2>
          <Button size="sm" variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Add Course
          </Button>
        </div>

        <div className="grid gap-4">
          {courses.map((course) => (
            <Card 
              key={course.id} 
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedCourse(course.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full bg-${course.color}-500`}></div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{course.name}</h3>
                      <p className="text-sm text-gray-600">{course.code}</p>
                      {course.instructor && (
                        <p className="text-sm text-gray-500">{course.instructor}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{course.credits} Credits</Badge>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {courses.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg mb-2">No courses yet</p>
              <p className="text-sm">Add your first course to get started!</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Terms view
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Academic Terms</h2>
        <Button size="sm" variant="outline">
          <Plus className="w-4 h-4 mr-2" />
          Add Term
        </Button>
      </div>

      <div className="grid gap-4">
        {terms.map((term) => (
          <Card 
            key={term.id} 
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelectedTerm(term.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 flex items-center space-x-2">
                    <span>{term.name}</span>
                    {term.isActive && <Badge variant="default">Current</Badge>}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {new Date(term.startDate).toLocaleDateString()} - {new Date(term.endDate).toLocaleDateString()}
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        ))}
        
        {terms.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg mb-2">No academic terms yet</p>
            <p className="text-sm">Add your first term to organize your courses!</p>
          </div>
        )}
      </div>
    </div>
  );
};