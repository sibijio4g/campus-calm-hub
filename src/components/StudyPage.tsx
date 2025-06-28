
import { useState } from 'react';
import { BookOpen, Clock, Target, Calendar, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StudyPage = () => {
  const [selectedLectureDay, setSelectedLectureDay] = useState('today');
  const [selectedTaskDay, setSelectedTaskDay] = useState('today');
  const navigate = useNavigate();
  
  const dayOptions = [
    { id: 'today', label: 'Today' },
    { id: 'tomorrow', label: 'Tomorrow' },
    { id: 'this-week', label: 'This Week' }
  ];

  const lectures = {
    today: [
      { id: 1, title: 'Mathematics Lecture', time: '2:00 PM', location: 'Room 101', professor: 'Dr. Smith' },
      { id: 2, title: 'Physics Lab', time: '4:30 PM', location: 'Lab 205', professor: 'Prof. Johnson' }
    ],
    tomorrow: [
      { id: 3, title: 'Chemistry Seminar', time: '10:00 AM', location: 'Room 305', professor: 'Dr. Brown' }
    ],
    'this-week': [
      { id: 4, title: 'History Workshop', time: 'Friday 1:00 PM', location: 'Room 201', professor: 'Prof. Davis' }
    ]
  };

  const tasks = {
    today: [
      { id: 1, title: 'Physics Essay Due', time: '11:59 PM', subject: 'Physics', priority: 'high' },
      { id: 2, title: 'Math Problem Set', time: '5:00 PM', subject: 'Mathematics', priority: 'medium' }
    ],
    tomorrow: [
      { id: 3, title: 'Chemistry Lab Report', time: '9:00 AM', subject: 'Chemistry', priority: 'high' }
    ],
    'this-week': [
      { id: 4, title: 'History Project', time: 'Friday', subject: 'History', priority: 'medium' }
    ]
  };

  const subjects = [
    { name: 'Mathematics', progress: 75, nextClass: 'Today 2:00 PM', color: 'bg-blue-500' },
    { name: 'Physics', progress: 60, nextClass: 'Today 4:30 PM', color: 'bg-purple-500' },
    { name: 'Chemistry', progress: 85, nextClass: 'Tomorrow 10:00 AM', color: 'bg-green-500' },
    { name: 'History', progress: 45, nextClass: 'Friday 1:00 PM', color: 'bg-orange-500' }
  ];

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

  const handleSubjectClick = (subjectName: string) => {
    navigate(`/subject/${subjectName.toLowerCase()}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-indigo-50/30 pb-24">
      <div className="bg-gradient-to-r from-blue-600/90 to-purple-600/90 backdrop-blur-sm px-6 py-8 text-white">
        <h1 className="text-2xl font-bold mb-2">Study Dashboard</h1>
        <p className="text-blue-100/90">Track your academic progress</p>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 border border-white/30 text-center">
            <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">24h</p>
            <p className="text-sm text-gray-600">This week</p>
          </div>
          <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 border border-white/30 text-center">
            <Target className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">8/10</p>
            <p className="text-sm text-gray-600">Goals met</p>
          </div>
        </div>

        {/* Upcoming Lectures Section */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Lectures</h2>
          
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 mb-4">
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {dayOptions.map((day) => (
                <button
                  key={day.id}
                  onClick={() => setSelectedLectureDay(day.id)}
                  className={`px-4 py-2 rounded-full whitespace-nowrap transition-all duration-200 ${
                    selectedLectureDay === day.id
                      ? 'bg-blue-600/80 text-white backdrop-blur-sm'
                      : 'bg-gray-100/50 text-gray-700 hover:bg-gray-200/50 backdrop-blur-sm'
                  }`}
                >
                  {day.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {lectures[selectedLectureDay as keyof typeof lectures]?.map((lecture) => (
              <div key={lecture.id} className="bg-white/20 backdrop-blur-md rounded-xl p-4 border border-white/30">
                <div className="flex items-start space-x-3">
                  <Calendar className="w-5 h-5 text-blue-600 mt-1" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{lecture.title}</h3>
                    <p className="text-sm text-gray-600 mb-1">{lecture.time} • {lecture.location}</p>
                    <p className="text-sm text-gray-500">{lecture.professor}</p>
                  </div>
                </div>
              </div>
            )) || (
              <div className="text-center py-4">
                <p className="text-gray-500">No lectures scheduled</p>
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Tasks Section */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Tasks</h2>
          
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 mb-4">
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {dayOptions.map((day) => (
                <button
                  key={day.id}
                  onClick={() => setSelectedTaskDay(day.id)}
                  className={`px-4 py-2 rounded-full whitespace-nowrap transition-all duration-200 ${
                    selectedTaskDay === day.id
                      ? 'bg-purple-600/80 text-white backdrop-blur-sm'
                      : 'bg-gray-100/50 text-gray-700 hover:bg-gray-200/50 backdrop-blur-sm'
                  }`}
                >
                  {day.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {tasks[selectedTaskDay as keyof typeof tasks]?.map((task) => (
              <div key={task.id} className={`bg-white/20 backdrop-blur-md rounded-xl p-4 border-l-4 border border-white/30 ${getPriorityColor(task.priority)}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <BookOpen className="w-5 h-5 text-gray-600 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{task.title}</h3>
                      <p className="text-sm text-gray-600 mb-1">{task.time}</p>
                      <p className="text-sm text-gray-500">{task.subject}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${
                    task.priority === 'high' ? 'bg-red-100/50 text-red-800' :
                    task.priority === 'medium' ? 'bg-yellow-100/50 text-yellow-800' :
                    'bg-green-100/50 text-green-800'
                  }`}>
                    {task.priority}
                  </span>
                </div>
              </div>
            )) || (
              <div className="text-center py-4">
                <p className="text-gray-500">No tasks due</p>
              </div>
            )}
          </div>
        </div>

        {/* Subjects Section */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Subjects</h2>
          <div className="space-y-3">
            {subjects.map((subject) => (
              <button
                key={subject.name}
                onClick={() => handleSubjectClick(subject.name)}
                className="w-full bg-white/20 backdrop-blur-md rounded-xl p-4 border border-white/30 hover:bg-white/30 transition-all duration-200 text-left"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full ${subject.color}`}></div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{subject.name}</h3>
                      <p className="text-sm text-gray-600">Next: {subject.nextClass}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{subject.progress}%</p>
                      <div className="w-16 bg-gray-200/50 rounded-full h-2 mt-1">
                        <div 
                          className="bg-blue-600/70 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${subject.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyPage;
