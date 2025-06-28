
import { Home, BookOpen, Users, Star, User } from 'lucide-react';
import { useLocation } from 'wouter';

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const BottomNavigation = ({ activeTab, onTabChange }: BottomNavigationProps) => {
  const [, setLocation] = useLocation();
  
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'study', label: 'Study', icon: BookOpen },
    { id: 'social', label: 'Social', icon: Users },
    { id: 'clubs', label: 'Clubs', icon: Star },
    { id: 'profile', label: 'Profile', icon: User, isProfile: true }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/20 backdrop-blur-md border-t border-white/30 px-4 py-2 safe-area-pb">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => {
                if (tab.isProfile) {
                  setLocation('/profile');
                } else {
                  onTabChange(tab.id);
                }
              }}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-200 ${
                activeTab === tab.id
                  ? 'text-emerald-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <IconComponent 
                className={`w-6 h-6 mb-1 ${
                  activeTab === tab.id ? 'text-emerald-600' : 'text-gray-500'
                }`} 
              />
              <span className={`text-xs font-medium ${
                activeTab === tab.id ? 'text-emerald-600' : 'text-gray-500'
              }`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;
