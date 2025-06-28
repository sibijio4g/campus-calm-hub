import { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface VoiceInputProps {
  onTranscript: (transcript: string) => void;
  onClose: () => void;
  isActive: boolean;
}

export const VoiceInput = ({ onTranscript, onClose, isActive }: VoiceInputProps) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast({
        title: "Speech Recognition Not Supported",
        description: "Your browser doesn't support speech recognition. Please use manual input.",
        variant: "destructive",
      });
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      setTranscript(prev => prev + finalTranscript);
      setInterimTranscript(interimTranscript);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      toast({
        title: "Speech Recognition Error",
        description: "There was an error with speech recognition. Please try again.",
        variant: "destructive",
      });
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [toast]);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setTranscript('');
      setInterimTranscript('');
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const handleSubmit = () => {
    if (transcript.trim()) {
      onTranscript(transcript.trim());
      setTranscript('');
      setInterimTranscript('');
    }
  };

  const handleClear = () => {
    setTranscript('');
    setInterimTranscript('');
  };

  if (!isActive) return null;

  return (
    <div className="space-y-4 p-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Voice Input</h3>
        <p className="text-sm text-gray-600 mb-4">
          Say something like: "Add a math assignment due tomorrow at 11:59 PM" or "Schedule a study group for Friday at 3 PM"
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 min-h-[100px] border">
        <div className="text-sm text-gray-900">
          {transcript}
          <span className="text-gray-500 italic">{interimTranscript}</span>
          {!transcript && !interimTranscript && (
            <span className="text-gray-400">Your speech will appear here...</span>
          )}
        </div>
      </div>

      <div className="flex items-center justify-center space-x-4">
        <Button
          onClick={isListening ? stopListening : startListening}
          className={`w-16 h-16 rounded-full ${
            isListening 
              ? 'bg-red-600 hover:bg-red-700 animate-pulse' 
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isListening ? (
            <MicOff className="w-8 h-8 text-white" />
          ) : (
            <Mic className="w-8 h-8 text-white" />
          )}
        </Button>
      </div>

      <div className="text-center">
        <p className="text-sm text-gray-600">
          {isListening ? 'Listening... Click to stop' : 'Click to start speaking'}
        </p>
      </div>

      {transcript && (
        <div className="flex space-x-2">
          <Button
            onClick={handleClear}
            variant="outline"
            className="flex-1"
          >
            Clear
          </Button>
          <Button
            onClick={handleSubmit}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            Process Speech
          </Button>
        </div>
      )}

      <div className="flex space-x-2">
        <Button
          onClick={onClose}
          variant="outline"
          className="flex-1"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};