
import { useState } from 'react';
import { Calendar, BookOpen, Users, Star } from 'lucide-react';

const HomePage = () => {
  const [selectedDay, setSelectedDay] = useState('today');
  
  const dayOptions = [
    { id: 'today', label: 'Today' },
    { id: 'tomorrow', label: 'Tomorrow' },
    { id: 'this-week', label: 'This Week' }
  ];

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
      { id: 6, type: 'assignment', title: 'History Project', time: 'Friday', priority: 'high' },
      { id: 7, type: 'social', title: 'Campus Festival', time: 'Saturday', priority: 'low' }
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
        return 'border-l-red-400 bg-red-50';
      case 'medium':
        return 'border-l-yellow-400 bg-yellow-50';
      case 'low':
        return 'border-l-green-400 bg-green-50';
      default:
        return 'border-l-gray-400 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - Top 35% */}
      <div 
        className="relative h-[35vh] bg-gradient-to-br from-emerald-600 via-green-700 to-teal-800 overflow-hidden"
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
            <p className="text-green-100 text-lg opacity-90">Ready to make today productive?</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
            <h2 className="text-xl font-semibold mb-3">Today's Summary</h2>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-green-100">Tasks due</span>
                <span className="font-semibold">3</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-green-100">Classes</span>
                <span className="font-semibold">1</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-green-100">Events</span>
                <span className="font-semibold">1</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Day Toggle Row */}
      <div className="px-6 py-4 bg-white shadow-sm">
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {dayOptions.map((day) => (
            <button
              key={day.id}
              onClick={() => setSelectedDay(day.id)}
              className={`px-6 py-3 rounded-full whitespace-nowrap transition-all duration-200 ${
                selectedDay === day.id
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {day.label}
            </button>
          ))}
        </div>
      </div>

      {/* Task Cards */}
      <div className="px-6 py-4 space-y-3 pb-24">
        {tasks[selectedDay as keyof typeof tasks]?.map((task) => (
          <div
            key={task.id}
            className={`bg-white rounded-xl p-4 border-l-4 shadow-sm ${getPriorityColor(task.priority)}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className="mt-1 text-gray-600">
                  {getTaskIcon(task.type)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{task.title}</h3>
                  <p className="text-sm text-gray-600">{task.time}</p>
                </div>
              </div>
              <div className="flex items-center">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  task.priority === 'high' ? 'bg-red-100 text-red-800' :
                  task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {task.priority}
                </span>
              </div>
            </div>
          </div>
        )) || (
          <div className="text-center py-8">
            <p className="text-gray-500">No tasks scheduled for {selectedDay}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
