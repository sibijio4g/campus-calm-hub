
import { Star, Users, Calendar } from 'lucide-react';

const ClubsPage = () => {
  const myClubs = [
    { name: 'Drama Club', role: 'Member', nextMeeting: 'Tomorrow 6:00 PM', members: 28 },
    { name: 'Chess Society', role: 'Secretary', nextMeeting: 'Friday 4:00 PM', members: 15 },
    { name: 'Environmental Club', role: 'Volunteer', nextMeeting: 'Monday 5:30 PM', members: 42 }
  ];

  const suggestedClubs = [
    { name: 'Photography Club', description: 'Capture campus life', members: 34 },
    { name: 'Book Club', description: 'Monthly reading discussions', members: 19 },
    { name: 'Coding Society', description: 'Programming workshops', members: 67 }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-8 text-white">
        <h1 className="text-2xl font-bold mb-2">Clubs & Activities</h1>
        <p className="text-purple-100">Get involved in campus life</p>
      </div>

      <div className="px-6 py-6 space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">My Clubs</h2>
          <div className="space-y-3">
            {myClubs.map((club) => (
              <div key={club.name} className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-start space-x-3">
                  <Star className="w-5 h-5 text-purple-600 mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{club.name}</h3>
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">
                        {club.role}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        Next: {club.nextMeeting}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="w-4 h-4 mr-2" />
                        {club.members} members
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Suggested for You</h2>
          <div className="space-y-3">
            {suggestedClubs.map((club) => (
              <div key={club.name} className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{club.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{club.description}</p>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="w-4 h-4 mr-1" />
                      {club.members} members
                    </div>
                  </div>
                  <button className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors">
                    Join
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClubsPage;
