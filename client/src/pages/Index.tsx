
import { useState } from 'react';
import HomePage from '@/components/HomePage';
import StudyPage from '@/components/StudyPage';
import SocialPage from '@/components/SocialPage';
import ClubsPage from '@/components/ClubsPage';
import SettingsPage from '@/components/SettingsPage';
import BottomNavigation from '@/components/BottomNavigation';

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');

  const renderPage = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage />;
      case 'study':
        return <StudyPage />;
      case 'social':
        return <SocialPage />;
      case 'clubs':
        return <ClubsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {renderPage()}
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
