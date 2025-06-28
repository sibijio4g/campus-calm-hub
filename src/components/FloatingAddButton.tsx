
import { useState } from 'react';
import { Plus, Type, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { AddActivityForm } from './AddActivityForm';

const FloatingAddButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showOptions, setShowOptions] = useState(true);
  const [selectedMode, setSelectedMode] = useState<'type' | 'speak' | null>(null);

  const handleModeSelect = (mode: 'type' | 'speak') => {
    setSelectedMode(mode);
    setShowOptions(false);
    
    if (mode === 'speak') {
      // TODO: Implement speech-to-text functionality
      console.log('Speech mode selected - to be implemented');
      setIsOpen(false);
      resetState();
    }
  };

  const resetState = () => {
    setShowOptions(true);
    setSelectedMode(null);
  };

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(resetState, 300); // Reset after animation
  };

  // Use Drawer on mobile, Dialog on desktop
  const isMobile = window.innerWidth < 768;

  const OptionsContent = () => (
    <div className="space-y-4 p-4">
      <Button
        onClick={() => handleModeSelect('type')}
        className="w-full h-16 text-lg bg-blue-600/80 hover:bg-blue-700/80 backdrop-blur-sm text-white"
        size="lg"
      >
        <Type className="w-6 h-6 mr-3" />
        Type Activity
      </Button>
      <Button
        onClick={() => handleModeSelect('speak')}
        className="w-full h-16 text-lg bg-green-600/80 hover:bg-green-700/80 backdrop-blur-sm text-white"
        size="lg"
        variant="secondary"
      >
        <Mic className="w-6 h-6 mr-3" />
        Speak Activity
      </Button>
    </div>
  );

  const FormContent = () => (
    <AddActivityForm onClose={handleClose} />
  );

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-6 w-14 h-14 bg-gradient-to-r from-blue-600/90 to-purple-600/90 backdrop-blur-md hover:from-blue-700/90 hover:to-purple-700/90 text-white rounded-full shadow-lg transition-all duration-200 flex items-center justify-center z-40 border border-white/20"
      >
        <Plus className="w-6 h-6" />
      </button>

      {isMobile ? (
        <Drawer open={isOpen} onOpenChange={handleClose}>
          <DrawerContent className="bg-white/80 backdrop-blur-md border-gray-300">
            <DrawerHeader>
              <DrawerTitle className="text-center text-gray-900">
                {showOptions ? 'Add New Activity' : 'Create Activity'}
              </DrawerTitle>
            </DrawerHeader>
            {showOptions ? <OptionsContent /> : <FormContent />}
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={isOpen} onOpenChange={handleClose}>
          <DialogContent className="bg-white/80 backdrop-blur-md border-gray-300 max-w-md">
            <DialogHeader>
              <DialogTitle className="text-center text-gray-900">
                {showOptions ? 'Add New Activity' : 'Create Activity'}
              </DialogTitle>
            </DialogHeader>
            {showOptions ? <OptionsContent /> : <FormContent />}
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default FloatingAddButton;
