import { useState } from 'react';
import { ClubManagement } from './ClubManagement';
import { EnhancedAddActivityForm } from './EnhancedAddActivityForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';

const ClubsPage = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedClubId, setSelectedClubId] = useState<number | undefined>();

  const handleAddActivity = (clubId?: number) => {
    setSelectedClubId(clubId);
    setShowAddForm(true);
  };

  const handleCloseForm = () => {
    setShowAddForm(false);
    setSelectedClubId(undefined);
  };

  const isMobile = window.innerWidth < 768;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50/30 via-indigo-50/20 to-blue-50/30 pb-24">
      <div className="bg-gradient-to-r from-purple-600/90 to-indigo-600/90 backdrop-blur-sm px-6 py-8 text-white">
        <h1 className="text-2xl font-bold mb-2">Clubs & Activities</h1>
        <p className="text-purple-100/90">Get involved in campus life and manage club activities</p>
      </div>

      <div className="px-6 py-6">
        <ClubManagement onAddActivity={handleAddActivity} />
      </div>

      {/* Add Activity Modal/Drawer */}
      {isMobile ? (
        <Drawer open={showAddForm} onOpenChange={setShowAddForm}>
          <DrawerContent className="bg-white/80 backdrop-blur-md border-gray-300">
            <DrawerHeader>
              <DrawerTitle className="text-center text-gray-900">
                Add Club Activity
              </DrawerTitle>
            </DrawerHeader>
            <EnhancedAddActivityForm 
              onClose={handleCloseForm}
              initialClubId={selectedClubId}
              initialCategory="club"
            />
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
          <DialogContent className="bg-white/80 backdrop-blur-md border-gray-300 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-center text-gray-900">
                Add Club Activity
              </DialogTitle>
            </DialogHeader>
            <EnhancedAddActivityForm 
              onClose={handleCloseForm}
              initialClubId={selectedClubId}
              initialCategory="club"
            />
          </DrawerContent>
        </Dialog>
      )}
    </div>
  );
};

export default ClubsPage;