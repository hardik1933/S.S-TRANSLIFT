import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Search, Download, Eye, Edit, Upload } from 'lucide-react';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';

export function RequestManagement() {
  const navigate = useNavigate();
  const { user, requests, updateRequestStatus, bulkImportRequests } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) return null;

  const filteredRequests = requests.filter(request => {
    const matchesSearch = 
      request.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.pickupLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.dropLocation.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

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

  const handleStatusChange = (requestId: string, newStatus: any) => {
    updateRequestStatus(requestId, newStatus);
    toast.success(`Request ${requestId} status updated to ${newStatus}`);
  };

  const handleExportToExcel = () => {
    try {
      // Check if there are any requests to export
      if (filteredRequests.length === 0) {
        toast.error('No requests to export');
        return;
      }

      // Prepare data for Excel export based on filtered results with ALL transport diary fields
      const excelData = filteredRequests.map(request => ({
        'Date': request.date || new Date(request.serviceDate).toLocaleDateString('en-IN'),
        'Bill Number': request.billNumber || 'N/A',
        'Party Name': request.partyName || request.customerName,
        'Broker Name': request.brokerName || 'N/A',
        'From Location': request.pickupLocation,
        'To Location': request.dropLocation,
        'Port Name': request.portName || 'N/A',
        'Container Type': request.containerType || 'N/A',
        'Vehicle Number': request.vehicleNumber || 'N/A',
        'Container Number': request.containerNumber || 'N/A',
        'Cargo Description': request.cargoDescription || 'N/A',
        'Parking Charges': request.parkingCharges || 0,
        'Weight': request.loadWeight,
        'Freight Amount': request.freightAmount || 0,
        'Truck Freight': request.truckFreight || 0,
        'Company Margin': request.companyMargin || 0,
        'Advance Payment': request.advancePayment || 0,
        'Balance Payment': request.balancePayment || 0,
        'Payment Mode': request.paymentMode || 'N/A',
        'Status': request.status,
        'Remarks': request.notes || 'N/A',
        'Customer Name': request.customerName,
        'Company Name': request.companyName,
      }));

      // Create a new workbook
      const workbook = XLSX.utils.book_new();
      
      // Create worksheet from data
      const worksheet = XLSX.utils.json_to_sheet(excelData);
      
      // Set column widths for better readability
      const columnWidths = [
        { wch: 12 }, // Date
        { wch: 15 }, // Bill Number
        { wch: 20 }, // Party Name
        { wch: 20 }, // Broker Name
        { wch: 30 }, // From Location
        { wch: 30 }, // To Location
        { wch: 15 }, // Container Type
        { wch: 18 }, // Vehicle Number
        { wch: 18 }, // Container Number
        { wch: 15 }, // Parking Charges
        { wch: 12 }, // Weight
        { wch: 15 }, // Freight Amount
        { wch: 15 }, // Truck Freight
        { wch: 15 }, // Company Margin
        { wch: 15 }, // Advance Payment
        { wch: 15 }, // Balance Payment
        { wch: 12 }, // Payment Mode
        { wch: 12 }, // Status
        { wch: 40 }, // Remarks
        { wch: 18 }, // Crane Type
        { wch: 15 }, // Container Type
        { wch: 15 }, // Port Name
        { wch: 30 }, // Cargo Description
        { wch: 20 }, // Customer Name
        { wch: 25 }, // Company Name
      ];
      worksheet['!cols'] = columnWidths;
      
      // Append worksheet to workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Transport Diary');

      // Generate filename with current date and filter info
      const currentDate = new Date().toISOString().split('T')[0];
      const filterSuffix = statusFilter !== 'all' ? `_${statusFilter}` : '';
      const searchSuffix = searchQuery ? '_Filtered' : '';
      const filename = `SS_Translift_Transport_Diary${filterSuffix}${searchSuffix}_${currentDate}.xlsx`;

      // Write the workbook and trigger download
      XLSX.writeFile(workbook, filename);

      toast.success(`Successfully exported ${filteredRequests.length} request(s) to Excel!`);
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      toast.error('Failed to export to Excel. Please try again.');
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        // Assuming the first row is the header
        const headers = json[0] as string[];
        const requestsData = json.slice(1) as string[][];

        const parsedRequests = requestsData.map(row => {
          const request: any = {};
          headers.forEach((header, index) => {
            request[header] = row[index];
          });
          return request;
        });

        bulkImportRequests(parsedRequests);
        toast.success(`Successfully imported ${parsedRequests.length} request(s)!`);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Request Management</h2>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Manage and track all transport requests
          </p>
        </div>

        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search requests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              onClick={handleExportToExcel} 
              className="bg-green-600 hover:bg-green-700"
              disabled={filteredRequests.length === 0}
            >
              <Download className="w-4 h-4 mr-2" />
              Export {filteredRequests.length > 0 && `(${filteredRequests.length})`}
            </Button>
            <Button 
              onClick={() => fileInputRef.current?.click()} 
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Upload className="w-4 h-4 mr-2" />
              Import
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".xlsx, .xls"
            />
          </div>
        </div>

        {/* Requests Table */}
        <Card className="border-slate-200 dark:border-slate-800">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Request ID</TableHead>
                  <TableHead>Customer Name</TableHead>
                  <TableHead>Pickup</TableHead>
                  <TableHead>Drop</TableHead>
                  <TableHead>Container Type</TableHead>
                  <TableHead>Weight</TableHead>
                  <TableHead>Service Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-12 text-slate-500">
                      No requests found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">{request.id}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">{request.customerName}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{request.companyName}</p>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[150px] truncate">{request.pickupLocation}</TableCell>
                      <TableCell className="max-w-[150px] truncate">{request.dropLocation}</TableCell>
                      <TableCell>{request.containerType}</TableCell>
                      <TableCell>{request.loadWeight}</TableCell>
                      <TableCell>{new Date(request.serviceDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Select
                          value={request.status}
                          onValueChange={(value) => handleStatusChange(request.id, value)}
                        >
                          <SelectTrigger className="w-[140px]">
                            {getStatusBadge(request.status)}
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="Approved">Approved</SelectItem>
                            <SelectItem value="In Progress">In Progress</SelectItem>
                            <SelectItem value="Completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost" onClick={() => toast.info(`Viewing ${request.id}`)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => toast.info(`Editing ${request.id}`)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* Summary Stats */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card className="p-4 border-slate-200 dark:border-slate-800">
            <p className="text-sm text-slate-600 dark:text-slate-400">Total Requests</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{requests.length}</p>
          </Card>
          <Card className="p-4 border-slate-200 dark:border-slate-800">
            <p className="text-sm text-slate-600 dark:text-slate-400">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">
              {requests.filter(r => r.status === 'Pending').length}
            </p>
          </Card>
          <Card className="p-4 border-slate-200 dark:border-slate-800">
            <p className="text-sm text-slate-600 dark:text-slate-400">In Progress</p>
            <p className="text-2xl font-bold text-purple-600">
              {requests.filter(r => r.status === 'In Progress' || r.status === 'Approved').length}
            </p>
          </Card>
          <Card className="p-4 border-slate-200 dark:border-slate-800">
            <p className="text-sm text-slate-600 dark:text-slate-400">Completed</p>
            <p className="text-2xl font-bold text-green-600">
              {requests.filter(r => r.status === 'Completed').length}
            </p>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}