import { Star, Users, Calendar } from 'lucide-react';
import FloatingAddButton from './FloatingAddButton';

const ClubsPage = () => {
  const myClubs = [
    { name: 'Drama Club', role: 'Member', nextMeeting: 'Tomorrow 6:00 PM', members: 28 },
    { name: 'Chess Society', role: 'Secretary', nextMeeting: 'Friday 4:00 PM', members: 15 },
    { name: 'Environmental Club', role: 'Volunteer', nextMeeting: 'Monday 5:30 PM', members: 42 },
    { name: 'Photography Club', role: 'Member', nextMeeting: 'Thursday 7:00 PM', members: 19 },
    { name: 'Debate Society', role: 'Treasurer', nextMeeting: 'Sunday 3:00 PM', members: 25 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50/30 via-indigo-50/20 to-blue-50/30 pb-24">
      <div className="bg-gradient-to-r from-purple-600/90 to-indigo-600/90 backdrop-blur-sm px-6 py-8 text-white">
        <h1 className="text-2xl font-bold mb-2">Clubs & Activities</h1>
        <p className="text-purple-100/90">Get involved in campus life</p>
      </div>

      <div className="px-6 py-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">My Clubs</h2>
          <div className="space-y-3">
            {myClubs.map((club) => (
              <div key={club.name} className="bg-white/20 backdrop-blur-md rounded-xl p-4 border border-white/30 hover:bg-white/30 transition-all duration-200">
                <div className="flex items-start space-x-3">
                  <Star className="w-5 h-5 text-purple-600 mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{club.name}</h3>
                      <span className="px-2 py-1 bg-purple-100/50 text-purple-800 text-xs font-medium rounded-full backdrop-blur-sm">
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
      </div>

      <FloatingAddButton />
    </div>
  );
};

export default ClubsPage;
