import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';
import { AdminLayout } from '../components/AdminLayout';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
  AreaChart,
  Area,
} from 'recharts';
import { Download, TrendingUp, Calendar } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';

export function ReportsPage() {
  const navigate = useNavigate();
  const { user, requests } = useApp();
  const [dateRange, setDateRange] = useState('6months');

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) return null;

  // Monthly bookings data
  const monthlyBookings = [
    { month: 'Jan', bookings: 45, revenue: 450000, expenses: 180000 },
    { month: 'Feb', bookings: 52, revenue: 520000, expenses: 210000 },
    { month: 'Mar', bookings: 38, revenue: 380000, expenses: 150000 },
    { month: 'Apr', bookings: 61, revenue: 610000, expenses: 240000 },
    { month: 'May', bookings: 55, revenue: 550000, expenses: 220000 },
    { month: 'Jun', bookings: 67, revenue: 670000, expenses: 270000 },
  ];

  // Service distribution data
  const serviceDistribution = [
    { name: '15 Ton Crane', value: 30, color: '#1E3A8A', id: 'service-crane-15' },
    { name: '25 Ton Crane', value: 35, color: '#14B8A6', id: 'service-crane-25' },
    { name: '40 Ton Crane', value: 25, color: '#F97316', id: 'service-crane-40' },
    { name: '50 Ton Crane', value: 10, color: '#8B5CF6', id: 'service-crane-50' },
  ];

  // Route performance data
  const routePerformance = [
    { route: 'JNPT → Kalamboli', trips: 45, revenue: 450000 },
    { route: 'Nhava Sheva → Turbhe', trips: 38, revenue: 380000 },
    { route: 'Kalamboli → Panvel', trips: 52, revenue: 520000 },
    { route: 'Turbhe → JNPT', trips: 35, revenue: 350000 },
    { route: 'Panvel → Nhava Sheva', trips: 42, revenue: 420000 },
  ];

  // Status breakdown
  const statusData = [
    { name: 'Completed', value: requests.filter(r => r.status === 'Completed').length, color: '#10B981', id: 'status-completed' },
    { name: 'In Progress', value: requests.filter(r => r.status === 'In Progress').length, color: '#8B5CF6', id: 'status-in-progress' },
    { name: 'Approved', value: requests.filter(r => r.status === 'Approved').length, color: '#3B82F6', id: 'status-approved' },
    { name: 'Pending', value: requests.filter(r => r.status === 'Pending').length, color: '#EAB308', id: 'status-pending' },
  ];

  const handleExportReport = () => {
    try {
      // Create a new workbook
      const workbook = XLSX.utils.book_new();

      // Sheet 1: Summary
      const summaryData = [
        { Metric: 'Total Revenue', Value: '₹3,180,000', Change: '+23%' },
        { Metric: 'Total Bookings', Value: '318', Change: '+15%' },
        { Metric: 'Avg Revenue/Booking', Value: '₹10,000', Change: '+8%' },
        { Metric: 'Net Profit Margin', Value: '63%', Change: '+5%' },
      ];
      const summarySheet = XLSX.utils.json_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');

      // Sheet 2: Monthly Bookings
      const monthlyData = monthlyBookings.map(item => ({
        Month: item.month,
        Bookings: item.bookings,
        'Revenue (₹)': item.revenue,
        'Expenses (₹)': item.expenses,
        'Profit (₹)': item.revenue - item.expenses,
      }));
      const monthlySheet = XLSX.utils.json_to_sheet(monthlyData);
      XLSX.utils.book_append_sheet(workbook, monthlySheet, 'Monthly Bookings');

      // Sheet 3: Service Distribution
      const serviceData = serviceDistribution.map(item => ({
        'Service Type': item.name,
        'Bookings': item.value,
        'Percentage': `${item.value}%`,
      }));
      const serviceSheet = XLSX.utils.json_to_sheet(serviceData);
      XLSX.utils.book_append_sheet(workbook, serviceSheet, 'Service Distribution');

      // Sheet 4: Route Performance
      const routeData = routePerformance.map(item => ({
        Route: item.route,
        Trips: item.trips,
        'Revenue (₹)': item.revenue,
        'Avg Revenue/Trip (₹)': Math.round(item.revenue / item.trips),
      }));
      const routeSheet = XLSX.utils.json_to_sheet(routeData);
      XLSX.utils.book_append_sheet(workbook, routeSheet, 'Route Performance');

      // Sheet 5: Status Breakdown
      const statusInfo = statusData.map(item => ({
        Status: item.name,
        Count: item.value,
        Percentage: `${((item.value / requests.length) * 100).toFixed(1)}%`,
      }));
      const statusSheet = XLSX.utils.json_to_sheet(statusInfo);
      XLSX.utils.book_append_sheet(workbook, statusSheet, 'Status Breakdown');

      // Sheet 6: All Requests
      const requestsData = requests.map(req => ({
        'Request ID': req.id,
        'Customer': req.customerName,
        'Service Type': req.serviceType,
        'Pickup Location': req.pickupLocation,
        'Delivery Location': req.deliveryLocation,
        'Date': req.date,
        'Status': req.status,
        'Priority': req.priority || 'Normal',
      }));
      const requestsSheet = XLSX.utils.json_to_sheet(requestsData);
      XLSX.utils.book_append_sheet(workbook, requestsSheet, 'All Requests');

      // Generate filename with current date
      const currentDate = new Date().toISOString().split('T')[0];
      const filename = `SS_Translift_Logistics_Report_${currentDate}.xlsx`;

      // Write the workbook and trigger download
      XLSX.writeFile(workbook, filename);

      toast.success('Report exported successfully!');
    } catch (error) {
      console.error('Error exporting report:', error);
      toast.error('Failed to export report. Please try again.');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Analytics & Reports</h2>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Comprehensive insights into your logistics operations
            </p>
          </div>
          <div className="flex gap-3">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1month">Last Month</SelectItem>
                <SelectItem value="3months">Last 3 Months</SelectItem>
                <SelectItem value="6months">Last 6 Months</SelectItem>
                <SelectItem value="1year">Last Year</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleExportReport} className="bg-green-600 hover:bg-green-700">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card className="p-6 border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-slate-600 dark:text-slate-400">Total Revenue</p>
              <TrendingUp className="w-4 h-4 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">₹3.18M</h3>
            <p className="text-xs text-green-600 mt-1">+23% from last period</p>
          </Card>
          <Card className="p-6 border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-slate-600 dark:text-slate-400">Total Bookings</p>
              <Calendar className="w-4 h-4 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">318</h3>
            <p className="text-xs text-blue-600 mt-1">+15% from last period</p>
          </Card>
          <Card className="p-6 border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-slate-600 dark:text-slate-400">Avg Revenue/Booking</p>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">₹10,000</h3>
            <p className="text-xs text-orange-600 mt-1">+8% from last period</p>
          </Card>
          <Card className="p-6 border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-slate-600 dark:text-slate-400">Net Profit Margin</p>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">63%</h3>
            <p className="text-xs text-green-600 mt-1">+5% from last period</p>
          </Card>
        </div>

        {/* Charts Row 1 */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Monthly Bookings Trend */}
          <Card className="p-6 border-slate-200 dark:border-slate-800">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-6">Monthly Bookings Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyBookings}>
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
                <Area type="monotone" dataKey="bookings" stroke="#1E3A8A" fill="#1E3A8A" fillOpacity={0.6} name="Bookings" isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          {/* Service Distribution */}
          <Card className="p-6 border-slate-200 dark:border-slate-800">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-6">Service Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={serviceDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {serviceDistribution.map((entry) => (
                    <Cell key={entry.id} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Revenue vs Expenses */}
        <Card className="p-6 border-slate-200 dark:border-slate-800">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-6">Revenue vs Expenses</h3>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={monthlyBookings}>
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
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={2} name="Revenue (₹)" isAnimationActive={false} />
              <Line type="monotone" dataKey="expenses" stroke="#EF4444" strokeWidth={2} name="Expenses (₹)" isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Charts Row 2 */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Route Performance */}
          <Card className="p-6 border-slate-200 dark:border-slate-800">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-6">Route Performance</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={routePerformance} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                <XAxis type="number" className="text-xs" />
                <YAxis dataKey="route" type="category" className="text-xs" width={120} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="trips" fill="#14B8A6" radius={[0, 8, 8, 0]} name="Trips" isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Status Breakdown */}
          <Card className="p-6 border-slate-200 dark:border-slate-800">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-6">Request Status Breakdown</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry) => (
                    <Cell key={entry.id} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}