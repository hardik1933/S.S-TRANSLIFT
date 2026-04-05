import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useEffect, useState } from 'react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { 
  Plus, 
  TruckIcon, 
  FileText, 
  Clock, 
  CheckCircle,
  ArrowLeft,
  Package,
  Download,
  BarChart3,
} from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';

export function WorkerDashboard() {
  const navigate = useNavigate();
  const { user, requests, logout } = useApp();

  useEffect(() => {
    if (!user || user.role !== 'worker') {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) return null;

  const myRequests = requests.filter(r => r.addedBy === user.name);
  const pendingRequests = myRequests.filter(r => r.status === 'Pending');
  const approvedRequests = myRequests.filter(r => r.status === 'Approved' || r.status === 'In Progress');
  const completedRequests = myRequests.filter(r => r.status === 'Completed');

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; className: string }> = {
      'Pending': { variant: 'secondary', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' },
      'Approved': { variant: 'secondary', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
      'In Progress': { variant: 'secondary', className: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' },
      'Completed': { variant: 'secondary', className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
    };
    const style = variants[status] || variants['Pending'];
    return <Badge variant={style.variant} className={style.className}>{status}</Badge>;
  };

  const exportToExcel = () => {
    try {
      if (myRequests.length === 0) {
        toast.error('No requests to export');
        return;
      }

      const excelData = myRequests.map(request => ({
        'Request ID': request.id,
        'Date': request.date || new Date(request.serviceDate).toLocaleDateString('en-IN'),
        'Bill Number': request.billNumber || 'N/A',
        'Party Name': request.partyName || request.customerName,
        'Broker Name': request.brokerName || 'N/A',
        'Company Name': request.companyName,
        'Phone Number': request.phoneNumber,
        'From Location': request.pickupLocation,
        'To Location': request.dropLocation,
        'Port Name': request.portName || 'N/A',
        'Container Type': request.containerType,
        'Vehicle Number': request.vehicleNumber || 'N/A',
        'Container Number': request.containerNumber || 'N/A',
        'Cargo Description': request.cargoDescription || 'N/A',
        'Load Weight': request.loadWeight,
        'Parking Charges': request.parkingCharges || 0,
        'Freight Amount': request.freightAmount || 0,
        'Truck Freight': request.truckFreight || 0,
        'Company Margin': request.companyMargin || 0,
        'Advance Payment': request.advancePayment || 0,
        'Balance Payment': request.balancePayment || 0,
        'Payment Mode': request.paymentMode || 'N/A',
        'Status': request.status,
        'Remarks': request.notes || 'N/A',
      }));

      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(excelData);
      
      const columnWidths = [
        { wch: 12 }, { wch: 12 }, { wch: 15 }, { wch: 20 }, { wch: 20 },
        { wch: 25 }, { wch: 15 }, { wch: 30 }, { wch: 30 }, { wch: 15 },
        { wch: 18 }, { wch: 18 }, { wch: 18 }, { wch: 12 }, { wch: 15 },
        { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 },
        { wch: 12 }, { wch: 12 }, { wch: 40 },
      ];
      worksheet['!cols'] = columnWidths;
      
      XLSX.utils.book_append_sheet(workbook, worksheet, 'My Transport Entries');
      
      const currentDate = new Date().toISOString().split('T')[0];
      const filename = `${user.name.replace(/\s+/g, '_')}_Transport_Entries_${currentDate}.xlsx`;
      
      XLSX.writeFile(workbook, filename);
      toast.success(`Successfully exported ${myRequests.length} entry(s) to Excel!`);
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      toast.error('Failed to export to Excel. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-900 to-blue-700 rounded-lg flex items-center justify-center">
                <TruckIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-xl text-slate-900 dark:text-white">S.S. Translift</h1>
                <p className="text-xs text-slate-600 dark:text-slate-400">Worker Portal</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-slate-900 dark:text-white">{user.name}</p>
                <p className="text-xs text-slate-600 dark:text-slate-400">Worker Account</p>
              </div>
              <Button variant="outline" onClick={() => { logout(); navigate('/'); }}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Welcome back, {user.name}!
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Add transport entries and track your submissions
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-900 dark:text-blue-400" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{myRequests.length}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">Total Entries</p>
          </Card>

          <Card className="p-6 border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-900 dark:text-yellow-400" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{pendingRequests.length}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">Pending Approval</p>
          </Card>

          <Card className="p-6 border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-purple-900 dark:text-purple-400" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{approvedRequests.length}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">Approved</p>
          </Card>

          <Card className="p-6 border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-900 dark:text-green-400" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{completedRequests.length}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">Completed</p>
          </Card>
        </div>

        {/* Quick Action */}
        <div className="mb-8">
          <Button 
            size="lg" 
            className="bg-blue-900 hover:bg-blue-800"
            onClick={() => navigate('/worker-dashboard/new-entry')}
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New Transport Entry
          </Button>
        </div>

        {/* Pending Approval */}
        <Card className="mb-8 border-slate-200 dark:border-slate-800">
          <div className="p-6 border-b border-slate-200 dark:border-slate-800">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">Pending Approval</h3>
          </div>
          <div className="overflow-x-auto">
            {pendingRequests.length === 0 ? (
              <div className="p-12 text-center">
                <Package className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                <p className="text-slate-600 dark:text-slate-400">No pending entries</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Request ID</TableHead>
                    <TableHead>Bill Number</TableHead>
                    <TableHead>Party Name</TableHead>
                    <TableHead>Pickup → Drop</TableHead>
                    <TableHead>Freight Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">{request.id}</TableCell>
                      <TableCell>{request.billNumber || 'N/A'}</TableCell>
                      <TableCell>{request.partyName || request.customerName}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {request.pickupLocation} → {request.dropLocation}
                      </TableCell>
                      <TableCell>₹{request.freightAmount || 0}</TableCell>
                      <TableCell>{new Date(request.serviceDate).toLocaleDateString('en-IN')}</TableCell>
                      <TableCell>{getStatusBadge(request.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </Card>

        {/* My Entries */}
        <Card className="border-slate-200 dark:border-slate-800">
          <div className="p-6 border-b border-slate-200 dark:border-slate-800">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">My Transport Entries</h3>
          </div>
          <div className="overflow-x-auto">
            {myRequests.length === 0 ? (
              <div className="p-12 text-center">
                <FileText className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                <p className="text-slate-600 dark:text-slate-400">No entries yet</p>
                <Button className="mt-4" onClick={() => navigate('/worker-dashboard/new-entry')}>
                  Add Your First Entry
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Request ID</TableHead>
                    <TableHead>Bill Number</TableHead>
                    <TableHead>Party Name</TableHead>
                    <TableHead>Vehicle Number</TableHead>
                    <TableHead>Freight Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {myRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">{request.id}</TableCell>
                      <TableCell>{request.billNumber || 'N/A'}</TableCell>
                      <TableCell>{request.partyName || request.customerName}</TableCell>
                      <TableCell>{request.vehicleNumber || 'N/A'}</TableCell>
                      <TableCell>₹{request.freightAmount || 0}</TableCell>
                      <TableCell>{new Date(request.serviceDate).toLocaleDateString('en-IN')}</TableCell>
                      <TableCell>{getStatusBadge(request.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
          <div className="p-6">
            <Button variant="outline" onClick={exportToExcel} disabled={myRequests.length === 0}>
              <Download className="w-4 h-4 mr-2" />
              Export My Entries to Excel
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}