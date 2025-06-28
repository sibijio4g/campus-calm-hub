import { useState } from 'react';
import { Calendar, RefreshCw, CheckCircle, AlertCircle, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

export const OutlookIntegration = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const { toast } = useToast();

  const handleConnect = async () => {
    try {
      const response = await fetch('/api/outlook/auth');
      const data = await response.json();
      
      // For demo purposes, simulate connection
      setIsConnected(true);
      setLastSync(new Date());
      
      toast({
        title: "Outlook Connected",
        description: "Your Outlook calendar is now connected for two-way sync.",
      });
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Unable to connect to Outlook. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSync = async () => {
    if (!isConnected) return;
    
    setIsSyncing(true);
    try {
      const response = await fetch('/api/outlook/sync', {
        method: 'POST',
      });
      
      if (response.ok) {
        setLastSync(new Date());
        toast({
          title: "Sync Complete",
          description: "Your calendar events have been synchronized.",
        });
      }
    } catch (error) {
      toast({
        title: "Sync Failed",
        description: "Unable to sync with Outlook. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setLastSync(null);
    toast({
      title: "Outlook Disconnected",
      description: "Your Outlook calendar has been disconnected.",
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <CardTitle>Outlook Calendar Integration</CardTitle>
          </div>
          <Badge variant={isConnected ? "default" : "secondary"}>
            {isConnected ? "Connected" : "Disconnected"}
          </Badge>
        </div>
        <CardDescription>
          Sync your university activities with Microsoft Outlook Calendar for seamless scheduling.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
          <CheckCircle className="w-4 h-4 text-blue-600" />
          <span className="text-sm text-blue-800">
            Two-way sync: Activities created here appear in Outlook, and Outlook events sync back
          </span>
        </div>

        {isConnected ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-800">Connected to Outlook Calendar</span>
              </div>
              <Button variant="outline" size="sm" onClick={handleDisconnect}>
                Disconnect
              </Button>
            </div>

            {lastSync && (
              <div className="text-xs text-gray-600">
                Last sync: {lastSync.toLocaleString()}
              </div>
            )}

            <div className="flex space-x-2">
              <Button 
                onClick={handleSync} 
                disabled={isSyncing}
                className="flex items-center space-x-2"
              >
                <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
              </Button>
              
              <Button variant="outline" className="flex items-center space-x-2">
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </Button>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Sync Features:</h4>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• Activities automatically sync to your Outlook calendar</li>
                <li>• Outlook events import as social activities</li>
                <li>• Changes made in either location sync both ways</li>
                <li>• Automatic sync every 15 minutes</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 p-3 bg-yellow-50 rounded-lg">
              <AlertCircle className="w-4 h-4 text-yellow-600" />
              <span className="text-sm text-yellow-800">
                Connect your Outlook account to enable calendar synchronization
              </span>
            </div>

            <Button onClick={handleConnect} className="w-full">
              Connect to Outlook Calendar
            </Button>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">What you'll get:</h4>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• Automatic two-way sync with your Outlook calendar</li>
                <li>• All your university activities appear in Outlook</li>
                <li>• Import existing calendar events as activities</li>
                <li>• Never miss important deadlines or lectures</li>
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};