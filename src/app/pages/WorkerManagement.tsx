import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { AdminLayout } from '../components/AdminLayout';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Search, Plus, UserCheck, UserX, Mail, Phone, Briefcase } from 'lucide-react';
import { toast } from 'sonner';

export function WorkerManagement() {
  const navigate = useNavigate();
  const { user, workers, createWorkerAccount } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newWorker, setNewWorker] = useState({
    name: '',
    email: '',
    password: '',
    phoneNumber: '',
    jobTitle: '',
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) return null;

  const filteredWorkers = workers.filter(worker => 
    worker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    worker.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (worker.role || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddWorker = async () => {
    if (!newWorker.name || !newWorker.email || !newWorker.password || !newWorker.phoneNumber || !newWorker.jobTitle) {
      toast.error('Please fill in all fields');
      return;
    }

    if (newWorker.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setIsSaving(true);
    try {
      await createWorkerAccount({
        name: newWorker.name,
        email: newWorker.email,
        password: newWorker.password,
        phoneNumber: newWorker.phoneNumber,
        jobTitle: newWorker.jobTitle,
      });
      toast.success(`Worker ${newWorker.name} added: Auth user + profile + directory row.`);
      setIsAddDialogOpen(false);
      setNewWorker({ name: '', email: '', password: '', phoneNumber: '', jobTitle: '' });
    } catch (e) {
      console.error(e);
      toast.error(e instanceof Error ? e.message : 'Could not save worker. Check Supabase policies and table columns.');
    } finally {
      setIsSaving(false);
    }
  };

  const activeWorkers = workers.filter(w => w.isActive);
  const inactiveWorkers = workers.filter(w => !w.isActive);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Worker Management</h2>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Manage company workers and their access
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card className="p-4 border-slate-200 dark:border-slate-800">
            <p className="text-sm text-slate-600 dark:text-slate-400">Total Workers</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{workers.length}</p>
          </Card>
          <Card className="p-4 border-slate-200 dark:border-slate-800">
            <p className="text-sm text-slate-600 dark:text-slate-400">Active</p>
            <p className="text-2xl font-bold text-green-600">{activeWorkers.length}</p>
          </Card>
          <Card className="p-4 border-slate-200 dark:border-slate-800">
            <p className="text-sm text-slate-600 dark:text-slate-400">Inactive</p>
            <p className="text-2xl font-bold text-red-600">{inactiveWorkers.length}</p>
          </Card>
          <Card className="p-4 border-slate-200 dark:border-slate-800">
            <p className="text-sm text-slate-600 dark:text-slate-400">Total Entries</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              {workers.reduce((sum, w) => sum + w.totalEntries, 0)}
            </p>
          </Card>
        </div>

        {/* Search and Add */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search workers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-900 hover:bg-blue-800">
                <Plus className="w-4 h-4 mr-2" />
                Add New Worker
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white dark:bg-slate-900">
              <DialogHeader>
                <DialogTitle className="text-slate-900 dark:text-white">Add New Worker</DialogTitle>
                <DialogDescription className="text-slate-600 dark:text-slate-400">
                  Add a new worker to the S.S. Translift team
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter full name"
                    value={newWorker.name}
                    onChange={(e) => setNewWorker({ ...newWorker, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="worker@example.com"
                    value={newWorker.email}
                    onChange={(e) => setNewWorker({ ...newWorker, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Temporary password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Min. 6 characters"
                    value={newWorker.password}
                    onChange={(e) => setNewWorker({ ...newWorker, password: e.target.value })}
                    autoComplete="new-password"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    placeholder="+91 98765 43210"
                    value={newWorker.phoneNumber}
                    onChange={(e) => setNewWorker({ ...newWorker, phoneNumber: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jobTitle">Job title</Label>
                  <Input
                    id="jobTitle"
                    placeholder="e.g., Transport Coordinator, Field Officer"
                    value={newWorker.jobTitle}
                    onChange={(e) => setNewWorker({ ...newWorker, jobTitle: e.target.value })}
                  />
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Creates a real Supabase Auth user, a <code className="text-xs">profiles</code> row with role{' '}
                    <strong>worker</strong>, and a <code className="text-xs">workers</code> row. Requires the{' '}
                    <code className="text-xs">create-worker</code> Edge Function deployed.
                  </p>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => void handleAddWorker()} className="bg-blue-900 hover:bg-blue-800" disabled={isSaving}>
                  {isSaving ? 'Saving…' : 'Add Worker'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Workers Table */}
        <Card className="border-slate-200 dark:border-slate-800">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Worker ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Total Entries</TableHead>
                  <TableHead>Joined Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredWorkers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12 text-slate-500">
                      No workers found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredWorkers.map((worker) => (
                    <TableRow key={worker.id}>
                      <TableCell className="font-medium">{worker.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium text-blue-900 dark:text-blue-400">
                              {worker.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <span className="font-medium text-slate-900 dark:text-white">{worker.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                          <Mail className="w-4 h-4" />
                          {worker.email}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                          <Phone className="w-4 h-4" />
                          {worker.phoneNumber || worker.phone || '-'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm">
                          <Briefcase className="w-4 h-4 text-slate-400" />
                          {worker.role}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-200">
                          {worker.totalEntries} entries
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-slate-600 dark:text-slate-400">
                        {new Date(worker.joinedDate).toLocaleDateString('en-IN')}
                      </TableCell>
                      <TableCell>
                        {worker.isActive ? (
                          <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            <UserCheck className="w-3 h-3 mr-1" />
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                            <UserX className="w-3 h-3 mr-1" />
                            Inactive
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
