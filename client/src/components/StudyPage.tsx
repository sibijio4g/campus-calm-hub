import { useState } from 'react';
import { AcademicStructure } from './AcademicStructure';
import { EnhancedAddActivityForm } from './EnhancedAddActivityForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';

const StudyPage = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<number | undefined>();

  const handleAddActivity = (courseId?: number) => {
    setSelectedCourseId(courseId);
    setShowAddForm(true);
  };

  const handleCloseForm = () => {
    setShowAddForm(false);
    setSelectedCourseId(undefined);
  };

  const isMobile = window.innerWidth < 768;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-indigo-50/20 to-cyan-50/30 pb-24">
      <div className="bg-gradient-to-r from-blue-600/90 to-purple-600/90 backdrop-blur-sm px-6 py-8 text-white">
        <h1 className="text-2xl font-bold mb-2">Academic Dashboard</h1>
        <p className="text-blue-100/90">Manage your courses and academic activities</p>
      </div>

      <div className="px-6 py-6">
        <AcademicStructure onAddActivity={handleAddActivity} />
      </div>

      {/* Add Activity Modal/Drawer */}
      {isMobile ? (
        <Drawer open={showAddForm} onOpenChange={setShowAddForm}>
          <DrawerContent className="bg-white/80 backdrop-blur-md border-gray-300">
            <DrawerHeader>
              <DrawerTitle className="text-center text-gray-900">
                Add Academic Activity
              </DrawerTitle>
            </DrawerHeader>
            <EnhancedAddActivityForm 
              onClose={handleCloseForm}
              initialCourseId={selectedCourseId}
              initialCategory="academic"
            />
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
          <DialogContent className="bg-white/80 backdrop-blur-md border-gray-300 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-center text-gray-900">
                Add Academic Activity
              </DialogTitle>
            </DialogHeader>
            <EnhancedAddActivityForm 
              onClose={handleCloseForm}
              initialCourseId={selectedCourseId}
              initialCategory="academic"
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default StudyPage;