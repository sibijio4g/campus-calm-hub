
import { Users, Calendar, MessageCircle } from 'lucide-react';

const SocialPage = () => {
  const events = [
    { id: 1, title: 'Study Group - Mathematics', time: 'Today 4:30 PM', attendees: 5, type: 'study' },
    { id: 2, title: 'Campus Movie Night', time: 'Friday 7:00 PM', attendees: 23, type: 'fun' },
    { id: 3, title: 'Physics Lab Partners', time: 'Monday 2:00 PM', attendees: 3, type: 'study' }
  ];

  const friends = [
    { name: 'Sarah Chen', status: 'Studying for Chemistry', online: true },
    { name: 'Mike Johnson', status: 'At library', online: true },
    { name: 'Emma Davis', status: 'In class', online: false },
    { name: 'Alex Rodriguez', status: 'Available', online: true }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-gradient-to-r from-pink-600 to-rose-600 px-6 py-8 text-white">
        <h1 className="text-2xl font-bold mb-2">Social Hub</h1>
        <p className="text-pink-100">Connect with your study buddies</p>
      </div>

      <div className="px-6 py-6 space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Events</h2>
          <div className="space-y-3">
            {events.map((event) => (
              <div key={event.id} className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <Calendar className="w-5 h-5 text-pink-600 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{event.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{event.time}</p>
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{event.attendees} attending</span>
                      </div>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    event.type === 'study' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                  }`}>
                    {event.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Friends</h2>
          <div className="space-y-3">
            {friends.map((friend) => (
              <div key={friend.name} className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${friend.online ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{friend.name}</h3>
                      <p className="text-sm text-gray-600">{friend.status}</p>
                    </div>
                  </div>
                  <button className="p-2 text-gray-400 hover:text-pink-600 transition-colors">
                    <MessageCircle className="w-5 h-5" />
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

export default SocialPage;
