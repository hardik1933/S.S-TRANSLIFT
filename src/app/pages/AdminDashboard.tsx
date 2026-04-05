import { AdminLayout } from '../components/AdminLayout';
import { Card } from '../components/ui/card';
import { useApp } from '../context/AppContext';
import { FileText, Clock, CheckCircle, DollarSign, ArrowRight, Download, Users, AlertCircle, TrendingUp } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';
import { useEffect } from 'react';

export function AdminDashboard() {
  const navigate = useNavigate();
  const { user, requests } = useApp();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) return null;

  const totalRequests = requests.length;
  const activeJobs = requests.filter(r => r.status === 'In Progress' || r.status === 'Approved').length;
  const completedJobs = requests.filter(r => r.status === 'Completed').length;
  const pendingRequests = requests.filter(r => r.status === 'Pending').length;
  
  // Calculate unique customers from requests
  const uniqueCustomers = new Set(requests.map(r => r.customerName)).size;

  // Monthly bookings data
  const monthlyData = [
    { month: 'Jan', bookings: 45, revenue: 450000 },
    { month: 'Feb', bookings: 52, revenue: 520000 },
    { month: 'Mar', bookings: 38, revenue: 380000 },
    { month: 'Apr', bookings: 61, revenue: 610000 },
    { month: 'May', bookings: 55, revenue: 550000 },
    { month: 'Jun', bookings: 67, revenue: 670000 },
  ];

  // Service distribution data
  const serviceData = [
    { name: '20-Foot Standard', value: 30, color: '#1E40AF', id: 'container-20ft' },
    { name: '40-Foot Standard', value: 35, color: '#059669', id: 'container-40ft' },
    { name: 'Reefer Container', value: 15, color: '#D97706', id: 'container-reefer' },
    { name: 'Flat Rack & ODC', value: 20, color: '#7C3AED', id: 'container-flatrack' },
  ];

  const stats = [
    {
      icon: FileText,
      label: 'Total Requests',
      value: totalRequests,
      change: '+12%',
      color: 'slate',
    },
    {
      icon: Clock,
      label: 'Active Jobs',
      value: activeJobs,
      change: '+8%',
      color: 'blue',
    },
    {
      icon: CheckCircle,
      label: 'Completed Jobs',
      value: completedJobs,
      change: '+15%',
      color: 'emerald',
    },
    {
      icon: DollarSign,
      label: 'Revenue (₹)',
      value: '3.2M',
      change: '+23%',
      color: 'amber',
    },
  ];

  const exportData = () => {
    const wsData = [
      ['Month', 'Bookings', 'Revenue'],
      ...monthlyData.map(d => [d.month, d.bookings, d.revenue]),
    ];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Monthly Data');
    XLSX.writeFile(wb, 'monthly_data.xlsx');
    toast.success('Data exported successfully!');
  };

  const exportCustomers = () => {
    try {
      // Get unique customers with their details
      const customersMap = new Map();
      requests.forEach(request => {
        if (!customersMap.has(request.customerName)) {
          customersMap.set(request.customerName, {
            'Customer Name': request.customerName,
            'Company Name': request.companyName,
            'Phone Number': request.phoneNumber,
            'Total Requests': 1,
            'First Request Date': new Date(request.createdAt).toLocaleDateString('en-IN'),
          });
        } else {
          const existing = customersMap.get(request.customerName);
          existing['Total Requests'] += 1;
        }
      });

      const customersData = Array.from(customersMap.values());

      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(customersData);
      
      const columnWidths = [
        { wch: 25 }, // Customer Name
        { wch: 30 }, // Company Name
        { wch: 15 }, // Phone Number
        { wch: 15 }, // Total Requests
        { wch: 18 }, // First Request Date
      ];
      worksheet['!cols'] = columnWidths;
      
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Customers');
      
      const currentDate = new Date().toISOString().split('T')[0];
      const filename = `SS_Translift_Customers_${currentDate}.xlsx`;
      
      XLSX.writeFile(workbook, filename);
      toast.success(`Successfully exported ${customersData.length} customer(s) to Excel!`);
    } catch (error) {
      console.error('Error exporting customers:', error);
      toast.error('Failed to export customers. Please try again.');
    }
  };

  return (
    <AdminLayout>
      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const colorClasses = {
            slate: 'bg-slate-100 dark:bg-slate-900/30 text-slate-900 dark:text-slate-400',
            blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-400',
            emerald: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-900 dark:text-emerald-400',
            amber: 'bg-amber-100 dark:bg-amber-900/30 text-amber-900 dark:text-amber-400',
          }[stat.color];

          return (
            <Card key={index} className="p-6 border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-sm font-medium text-green-600 dark:text-green-400">{stat.change}</span>
              </div>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{stat.value}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{stat.label}</p>
              
              {/* Add Manage Requests button for Total Requests card */}
              {stat.label === 'Total Requests' && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-2"
                  onClick={() => navigate('/admin-dashboard/requests')}
                >
                  Manage Requests
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </Card>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Monthly Bookings Chart */}
        <Card className="p-6 border-slate-200 dark:border-slate-800">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-6">Monthly Bookings Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
              <XAxis dataKey="month" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="bookings" stroke="#1E3A8A" strokeWidth={2} name="Bookings" isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
          <Button className="mt-4" onClick={exportData}>
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
        </Card>

        {/* Service Distribution Chart */}
        <Card className="p-6 border-slate-200 dark:border-slate-800">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-6">Service Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={serviceData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {serviceData.map((entry) => (
                  <Cell key={entry.id} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Revenue Chart */}
      <Card className="p-6 mb-8 border-slate-200 dark:border-slate-800">
        <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-6">Revenue Overview</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
            <XAxis dataKey="month" className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
              }}
              formatter={(value: any) => `₹${(value / 1000).toFixed(0)}K`}
            />
            <Bar dataKey="revenue" fill="#D97706" radius={[8, 8, 0, 0]} name="Revenue (₹)" isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Quick Stats Row */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="p-6 border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total Customers</p>
              <h4 className="text-2xl font-bold text-slate-900 dark:text-white">{uniqueCustomers}</h4>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-900 dark:text-blue-400" />
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full mt-2"
            onClick={exportCustomers}
            disabled={uniqueCustomers === 0}
          >
            <Download className="w-4 h-4 mr-2" />
            Download Customers
          </Button>
        </Card>

        <Card className="p-6 border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Pending Requests</p>
              <h4 className="text-2xl font-bold text-slate-900 dark:text-white">{pendingRequests}</h4>
            </div>
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-yellow-900 dark:text-yellow-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6 border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Avg Response Time</p>
              <h4 className="text-2xl font-bold text-slate-900 dark:text-white">2.5h</h4>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-900 dark:text-green-400" />
            </div>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}