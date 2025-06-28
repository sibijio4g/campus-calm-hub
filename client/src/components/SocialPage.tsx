import { useState } from 'react';
import { SocialCalendar } from './SocialCalendar';
import { EnhancedAddActivityForm } from './EnhancedAddActivityForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';

const SocialPage = () => {
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddEvent = () => {
    setShowAddForm(true);
  };

  const handleCloseForm = () => {
    setShowAddForm(false);
  };

  const isMobile = window.innerWidth < 768;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50/30 via-rose-50/20 to-purple-50/30 pb-24">
      <div className="bg-gradient-to-r from-pink-600/90 to-rose-600/90 backdrop-blur-sm px-6 py-8 text-white">
        <h1 className="text-2xl font-bold mb-2">Social Hub</h1>
        <p className="text-pink-100/90">Connect with friends and manage social events</p>
      </div>

      <div className="px-6 py-6">
        <SocialCalendar onAddEvent={handleAddEvent} />
      </div>

      {/* Add Event Modal/Drawer */}
      {isMobile ? (
        <Drawer open={showAddForm} onOpenChange={setShowAddForm}>
          <DrawerContent className="bg-white/80 backdrop-blur-md border-gray-300">
            <DrawerHeader>
              <DrawerTitle className="text-center text-gray-900">
                Add Social Event
              </DrawerTitle>
            </DrawerHeader>
            <EnhancedAddActivityForm 
              onClose={handleCloseForm}
              initialCategory="social"
            />
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
          <DialogContent className="bg-white/80 backdrop-blur-md border-gray-300 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-center text-gray-900">
                Add Social Event
              </DialogTitle>
            </DialogHeader>
            <EnhancedAddActivityForm 
              onClose={handleCloseForm}
              initialCategory="social"
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default SocialPage;