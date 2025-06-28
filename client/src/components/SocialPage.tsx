
import { Calendar, Users } from 'lucide-react';
import FloatingAddButton from './FloatingAddButton';

const SocialPage = () => {
  const formatDate = (dateString: string) => {
    if (dateString === 'Today 4:30 PM' || dateString === 'Tomorrow') {
      return dateString;
    }
    
    // For other dates, format as "14 Jun (Mon) time"
    const date = new Date();
    if (dateString.includes('Friday')) {
      date.setDate(date.getDate() + ((5 - date.getDay() + 7) % 7)); // Next Friday
    } else if (dateString.includes('Monday')) {
      date.setDate(date.getDate() + ((1 - date.getDay() + 7) % 7)); // Next Monday
    } else if (dateString.includes('Wednesday')) {
      date.setDate(date.getDate() + ((3 - date.getDay() + 7) % 7)); // Next Wednesday
    } else if (dateString.includes('Saturday')) {
      date.setDate(date.getDate() + ((6 - date.getDay() + 7) % 7)); // Next Saturday
    }
    
    const options: Intl.DateTimeFormatOptions = { 
      day: 'numeric', 
      month: 'short', 
      weekday: 'short' 
    };
    const formattedDate = date.toLocaleDateString('en-GB', options).replace(',', '');
    
    // Extract time from original string
    const timeMatch = dateString.match(/\d{1,2}:\d{2}\s?(AM|PM)/i);
    const time = timeMatch ? timeMatch[0] : '';
    
    return `${formattedDate} ${time}`;
  };

  const events = [
    { id: 1, title: 'Study Group - Mathematics', time: 'Today 4:30 PM', attendees: 5, type: 'study' },
    { id: 2, title: 'Campus Movie Night', time: formatDate('Friday 7:00 PM'), attendees: 23, type: 'fun' },
    { id: 3, title: 'Physics Lab Partners', time: formatDate('Monday 2:00 PM'), attendees: 3, type: 'study' },
    { id: 4, title: 'Book Club Meeting', time: formatDate('Wednesday 6:00 PM'), attendees: 12, type: 'study' },
    { id: 5, title: 'Basketball Tournament', time: formatDate('Saturday 10:00 AM'), attendees: 8, type: 'fun' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50/30 via-rose-50/20 to-purple-50/30 pb-24">
      <div className="bg-gradient-to-r from-pink-600/90 to-rose-600/90 backdrop-blur-sm px-6 py-8 text-white">
        <h1 className="text-2xl font-bold mb-2">Social Hub</h1>
        <p className="text-pink-100/90">Connect with your study buddies</p>
      </div>

      <div className="px-6 py-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Events</h2>
          <div className="space-y-3">
            {events.map((event) => (
              <div key={event.id} className="bg-white/20 backdrop-blur-md rounded-xl p-4 border border-white/30 hover:bg-white/30 transition-all duration-200">
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
                  <span className={`px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${
                    event.type === 'study' ? 'bg-blue-100/50 text-blue-800' : 'bg-purple-100/50 text-purple-800'
                  }`}>
                    {event.type}
                  </span>
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

export default SocialPage;
