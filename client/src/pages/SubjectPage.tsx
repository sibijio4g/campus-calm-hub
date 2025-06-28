
import { useState } from 'react';
import { useRoute, useLocation } from 'wouter';
import { ArrowLeft, Calendar, BookOpen, Clock } from 'lucide-react';

const SubjectPage = () => {
  const [match, params] = useRoute('/subject/:subjectName');
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState('lectures');
  
  const subjectName = params?.subjectName;

  const subjectData = {
    mathematics: {
      name: 'Mathematics',
      color: 'blue',
      lectures: [
        { id: 1, title: 'Calculus I', date: 'Today 2:00 PM', location: 'Room 101', status: 'upcoming' },
        { id: 2, title: 'Linear Algebra', date: 'Tomorrow 10:00 AM', location: 'Room 205', status: 'upcoming' },
        { id: 3, title: 'Statistics', date: 'Friday 3:00 PM', location: 'Room 301', status: 'upcoming' }
      ],
      tasks: [
        { id: 1, title: 'Problem Set 5', dueDate: 'Today 11:59 PM', priority: 'high', status: 'pending' },
        { id: 2, title: 'Midterm Exam', dueDate: 'Next Monday 9:00 AM', priority: 'high', status: 'upcoming' },
        { id: 3, title: 'Group Project', dueDate: 'Next Friday', priority: 'medium', status: 'in-progress' }
      ]
    },
    physics: {
      name: 'Physics',
      color: 'purple',
      lectures: [
        { id: 1, title: 'Quantum Mechanics', date: 'Today 4:30 PM', location: 'Lab 205', status: 'upcoming' },
        { id: 2, title: 'Thermodynamics', date: 'Wednesday 1:00 PM', location: 'Room 401', status: 'upcoming' }
      ],
      tasks: [
        { id: 1, title: 'Lab Report', dueDate: 'Tomorrow 9:00 AM', priority: 'high', status: 'pending' },
        { id: 2, title: 'Essay on Relativity', dueDate: 'Friday', priority: 'medium', status: 'in-progress' }
      ]
    },
    chemistry: {
      name: 'Chemistry',
      color: 'green',
      lectures: [
        { id: 1, title: 'Organic Chemistry', date: 'Tomorrow 10:00 AM', location: 'Room 305', status: 'upcoming' },
        { id: 2, title: 'Lab Session', date: 'Thursday 2:00 PM', location: 'Lab 101', status: 'upcoming' }
      ],
      tasks: [
        { id: 1, title: 'Lab Report', dueDate: 'Next Week', priority: 'medium', status: 'pending' },
        { id: 2, title: 'Chemical Analysis', dueDate: 'Friday', priority: 'high', status: 'upcoming' }
      ]
    },
    history: {
      name: 'History',
      color: 'orange',
      lectures: [
        { id: 1, title: 'Medieval History', date: 'Friday 1:00 PM', location: 'Room 201', status: 'upcoming' },
        { id: 2, title: 'World Wars', date: 'Monday 11:00 AM', location: 'Room 301', status: 'upcoming' }
      ],
      tasks: [
        { id: 1, title: 'Research Paper', dueDate: 'Next Friday', priority: 'high', status: 'in-progress' },
        { id: 2, title: 'Book Review', dueDate: 'Next Monday', priority: 'medium', status: 'pending' }
      ]
    }
  };

  const subject = subjectData[subjectName as keyof typeof subjectData];

  if (!subject) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Subject not found</h1>
          <button
            onClick={() => setLocation('/')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Back to Study
          </button>
        </div>
      </div>
    );
  }

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'from-blue-600/90 to-blue-700/90 text-blue-600',
      purple: 'from-purple-600/90 to-purple-700/90 text-purple-600',
      green: 'from-green-600/90 to-green-700/90 text-green-600',
      orange: 'from-orange-600/90 to-orange-700/90 text-orange-600'
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100/50 text-red-800';
      case 'medium':
        return 'bg-yellow-100/50 text-yellow-800';
      case 'low':
        return 'bg-green-100/50 text-green-800';
      default:
        return 'bg-gray-100/50 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50/30 via-white/20 to-gray-100/30 pb-24">
      <div className={`bg-gradient-to-r ${getColorClasses(subject.color).split(' ')[0]} ${getColorClasses(subject.color).split(' ')[1]} backdrop-blur-sm px-6 py-8 text-white`}>
        <div className="flex items-center mb-4">
          <button
            onClick={() => setLocation('/')}
            className="mr-4 p-2 rounded-lg bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">{subject.name}</h1>
            <p className="text-white/80">All lectures and tasks</p>
          </div>
        </div>
      </div>

      <div className="px-6 py-6">
        {/* Tab Navigation */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-2 border border-white/20 mb-6">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('lectures')}
              className={`flex-1 py-2 px-4 rounded-lg transition-all duration-200 ${
                activeTab === 'lectures'
                  ? `bg-${subject.color}-600/80 text-white backdrop-blur-sm`
                  : 'text-gray-700 hover:bg-white/20'
              }`}
            >
              Lectures
            </button>
            <button
              onClick={() => setActiveTab('tasks')}
              className={`flex-1 py-2 px-4 rounded-lg transition-all duration-200 ${
                activeTab === 'tasks'
                  ? `bg-${subject.color}-600/80 text-white backdrop-blur-sm`
                  : 'text-gray-700 hover:bg-white/20'
              }`}
            >
              Tasks
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'lectures' ? (
          <div className="space-y-3">
            {subject.lectures.map((lecture) => (
              <div key={lecture.id} className="bg-white/20 backdrop-blur-md rounded-xl p-4 border border-white/30">
                <div className="flex items-start space-x-3">
                  <Calendar className={`w-5 h-5 mt-1 ${getColorClasses(subject.color).split(' ')[2]}`} />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{lecture.title}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{lecture.date}</span>
                      </div>
                      <span>{lecture.location}</span>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${
                    lecture.status === 'upcoming' ? 'bg-blue-100/50 text-blue-800' : 'bg-gray-100/50 text-gray-800'
                  }`}>
                    {lecture.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {subject.tasks.map((task) => (
              <div key={task.id} className="bg-white/20 backdrop-blur-md rounded-xl p-4 border border-white/30">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <BookOpen className={`w-5 h-5 mt-1 ${getColorClasses(subject.color).split(' ')[2]}`} />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{task.title}</h3>
                      <p className="text-sm text-gray-600">Due: {task.dueDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${
                      task.status === 'pending' ? 'bg-red-100/50 text-red-800' :
                      task.status === 'in-progress' ? 'bg-yellow-100/50 text-yellow-800' :
                      'bg-blue-100/50 text-blue-800'
                    }`}>
                      {task.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SubjectPage;
