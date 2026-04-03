import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { AdminLayout } from '../components/AdminLayout';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { Separator } from '../components/ui/separator';
import { 
  User, 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Bell, 
  Moon,
  Save,
} from 'lucide-react';
import { toast } from 'sonner';

export function SettingsPage() {
  const navigate = useNavigate();
  const { user, darkMode, toggleDarkMode } = useApp();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) return null;

  const handleSaveSettings = () => {
    toast.success('Settings saved successfully!');
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Settings</h2>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Manage your account and application preferences
          </p>
        </div>

        {/* Company Information */}
        <Card className="p-6 border-slate-200 dark:border-slate-800">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-6">Company Information</h3>
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="companyName">Company Name</Label>
                <div className="relative mt-1">
                  <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="companyName"
                    defaultValue="S.S. Translift"
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="registrationNumber">Registration Number</Label>
                <Input
                  id="registrationNumber"
                  defaultValue="MH-2024-SS-001"
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="address">Address</Label>
              <div className="relative mt-1">
                <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <Input
                  id="address"
                  defaultValue="Kalamboli, Navi Mumbai, Maharashtra, India"
                  className="pl-10"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative mt-1">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="phone"
                    defaultValue="+91 98765 43210"
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    defaultValue="info@sstranslift.com"
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* User Profile */}
        <Card className="p-6 border-slate-200 dark:border-slate-800">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-6">Admin Profile</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-900 to-blue-700 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <Button variant="outline" size="sm">Change Photo</Button>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">JPG, PNG or GIF. Max 2MB.</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="adminName">Full Name</Label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="adminName"
                    defaultValue={user.name}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="adminEmail">Email</Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="adminEmail"
                    type="email"
                    defaultValue={user.email}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Preferences */}
        <Card className="p-6 border-slate-200 dark:border-slate-800">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-6">Preferences</h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
                  <Moon className="w-5 h-5 text-slate-900 dark:text-white" />
                </div>
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">Dark Mode</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Use dark theme across the app</p>
                </div>
              </div>
              <Switch checked={darkMode} onCheckedChange={toggleDarkMode} />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
                  <Bell className="w-5 h-5 text-slate-900 dark:text-white" />
                </div>
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">Email Notifications</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Receive email updates for new requests</p>
                </div>
              </div>
              <Switch defaultChecked />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
                  <Bell className="w-5 h-5 text-slate-900 dark:text-white" />
                </div>
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">SMS Notifications</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Get SMS alerts for urgent updates</p>
                </div>
              </div>
              <Switch defaultChecked />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
                  <Bell className="w-5 h-5 text-slate-900 dark:text-white" />
                </div>
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">Auto Excel Export</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Automatically sync new requests to Excel</p>
                </div>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </Card>

        {/* Operational Areas */}
        <Card className="p-6 border-slate-200 dark:border-slate-800">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-6">Operational Areas</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-orange-600" />
              <span className="text-sm text-slate-900 dark:text-white">Kalamboli, Navi Mumbai</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-orange-600" />
              <span className="text-sm text-slate-900 dark:text-white">Nhava Sheva Port</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-orange-600" />
              <span className="text-sm text-slate-900 dark:text-white">Turbhe MIDC</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-orange-600" />
              <span className="text-sm text-slate-900 dark:text-white">JNPT Port</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-orange-600" />
              <span className="text-sm text-slate-900 dark:text-white">Panvel Industrial Zone</span>
            </div>
          </div>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end gap-3">
          <Button variant="outline">Cancel</Button>
          <Button onClick={handleSaveSettings} className="bg-blue-900 hover:bg-blue-800">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
}
