import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card } from '../components/ui/card';
import { TruckIcon, ArrowLeft } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { toast } from 'sonner';

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (role: 'worker' | 'admin') => {
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    
    const success = login(email, password, role);
    if (success) {
      toast.success('Login successful!');
      if (role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/worker/dashboard');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Button 
          variant="ghost" 
          className="mb-4 text-white hover:bg-white/10"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>
        
        <Card className="p-8 shadow-2xl border-slate-700 bg-white dark:bg-slate-900">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-900 to-blue-700 rounded-lg flex items-center justify-center mx-auto mb-4">
              <TruckIcon className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">S.S. Translift</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">Transport Operations - Navi Mumbai, Maharashtra</p>
          </div>

          <Tabs defaultValue="worker" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="worker">Worker Login</TabsTrigger>
              <TabsTrigger value="admin">Admin Login</TabsTrigger>
            </TabsList>

            <TabsContent value="worker">
              <form onSubmit={(e) => { e.preventDefault(); handleLogin('worker'); }} className="space-y-4">
                <div>
                  <Label htmlFor="worker-email">Email</Label>
                  <Input
                    id="worker-email"
                    type="email"
                    placeholder="your.email@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="worker-password">Password</Label>
                  <Input
                    id="worker-password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <a href="#" className="text-blue-900 dark:text-blue-400 hover:underline">Forgot password?</a>
                </div>
                <Button type="submit" className="w-full bg-blue-900 hover:bg-blue-800">
                  Login as Worker
                </Button>
                <div className="text-center text-sm text-slate-600 dark:text-slate-400">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => navigate('/signup')}
                    className="text-blue-900 dark:text-blue-400 hover:underline font-medium"
                  >
                    Sign up
                  </button>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="admin">
              <form onSubmit={(e) => { e.preventDefault(); handleLogin('admin'); }} className="space-y-4">
                <div>
                  <Label htmlFor="admin-email">Admin Email</Label>
                  <Input
                    id="admin-email"
                    type="email"
                    placeholder="admin@sstranslift.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="admin-password">Admin Password</Label>
                  <Input
                    id="admin-password"
                    type="password"
                    placeholder="Enter admin password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <a href="#" className="text-blue-900 dark:text-blue-400 hover:underline">Forgot password?</a>
                </div>
                <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700">
                  Login as Admin
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </Card>

        <p className="text-center text-white/70 text-sm mt-6">
          Secure logistics management platform for S.S. Translift
        </p>
      </div>
    </div>
  );
}