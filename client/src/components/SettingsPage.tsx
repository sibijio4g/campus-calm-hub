import { useState } from 'react';
import { Settings, Calendar, User, Database, Bell, Shield } from 'lucide-react';
import { OutlookIntegration } from './OutlookIntegration';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const SettingsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50/30 via-slate-50/20 to-gray-100/30 pb-24">
      <div className="bg-gradient-to-r from-slate-600/90 to-gray-700/90 backdrop-blur-sm px-6 py-8 text-white">
        <div className="flex items-center space-x-3 mb-2">
          <Settings className="w-6 h-6" />
          <h1 className="text-2xl font-bold">Settings</h1>
        </div>
        <p className="text-slate-100/90">Manage your account and application preferences</p>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Calendar Integration */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <Calendar className="w-5 h-5" />
            <span>Calendar Integration</span>
          </h2>
          <OutlookIntegration />
        </div>

        <Separator />

        {/* Account Settings */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <User className="w-5 h-5" />
            <span>Account Settings</span>
          </h2>
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Manage your personal information and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Username</label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
                    demo (Read-only for demo)
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
                    demo@university.edu (Demo account)
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator />

        {/* Database Information */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <Database className="w-5 h-5" />
            <span>Database Status</span>
          </h2>
          <Card>
            <CardHeader>
              <CardTitle>Storage Information</CardTitle>
              <CardDescription>
                Current database connection and storage details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Database Type</span>
                  <span className="text-sm font-medium">PostgreSQL</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Connection Status</span>
                  <span className="text-sm font-medium text-green-600">Connected</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Data Sync</span>
                  <span className="text-sm font-medium">Real-time</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator />

        {/* Notifications */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <Bell className="w-5 h-5" />
            <span>Notifications</span>
          </h2>
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Configure when and how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">Assignment Reminders</div>
                    <div className="text-xs text-gray-500">Get notified before assignment due dates</div>
                  </div>
                  <div className="text-sm text-blue-600">Enabled</div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">Lecture Notifications</div>
                    <div className="text-xs text-gray-500">Receive alerts for upcoming lectures</div>
                  </div>
                  <div className="text-sm text-blue-600">Enabled</div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">Calendar Sync Updates</div>
                    <div className="text-xs text-gray-500">Notifications when calendar syncs complete</div>
                  </div>
                  <div className="text-sm text-gray-500">Disabled</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator />

        {/* Privacy & Security */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span>Privacy & Security</span>
          </h2>
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage your privacy and security preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">Data Encryption</div>
                    <div className="text-xs text-gray-500">All data is encrypted in transit and at rest</div>
                  </div>
                  <div className="text-sm text-green-600">Active</div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">Third-party Integrations</div>
                    <div className="text-xs text-gray-500">Microsoft Outlook calendar access</div>
                  </div>
                  <div className="text-sm text-gray-500">Configure above</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;