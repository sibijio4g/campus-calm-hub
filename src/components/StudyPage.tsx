
import { BookOpen, Clock, Target } from 'lucide-react';

const StudyPage = () => {
  const subjects = [
    { name: 'Mathematics', progress: 75, sessions: 12, nextSession: 'Today 3:00 PM' },
    { name: 'Physics', progress: 60, sessions: 8, nextSession: 'Tomorrow 1:00 PM' },
    { name: 'Chemistry', progress: 85, sessions: 15, nextSession: 'Friday 10:00 AM' },
    { name: 'History', progress: 45, sessions: 6, nextSession: 'Monday 2:00 PM' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8 text-white">
        <h1 className="text-2xl font-bold mb-2">Study Dashboard</h1>
        <p className="text-blue-100">Track your academic progress</p>
      </div>

      <div className="px-6 py-6 space-y-4">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm text-center">
            <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">24h</p>
            <p className="text-sm text-gray-600">This week</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm text-center">
            <Target className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">8/10</p>
            <p className="text-sm text-gray-600">Goals met</p>
          </div>
        </div>

        <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Subjects</h2>
        
        {subjects.map((subject) => (
          <div key={subject.name} className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <BookOpen className="w-5 h-5 text-gray-600" />
                <h3 className="font-semibold text-gray-900">{subject.name}</h3>
              </div>
              <span className="text-sm text-gray-600">{subject.sessions} sessions</span>
            </div>
            
            <div className="mb-3">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-600">Progress</span>
                <span className="text-sm font-medium text-gray-900">{subject.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${subject.progress}%` }}
                ></div>
              </div>
            </div>
            
            <p className="text-sm text-gray-600">Next: {subject.nextSession}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudyPage;
