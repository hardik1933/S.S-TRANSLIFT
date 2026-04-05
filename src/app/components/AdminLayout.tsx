import { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  LayoutDashboard,
  FileText,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Bell,
  Sun,
  Moon,
  TruckIcon,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  UserPlus,
  CheckCircle,
  DollarSign,
  Package,
  AlertCircle,
} from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { ScrollArea } from './ui/scroll-area';
import { useState } from 'react';

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, darkMode, toggleDarkMode, notifications, markNotificationRead } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin-dashboard' },
    { icon: FileText, label: 'Transport Requests', path: '/admin-dashboard/requests' },
    { icon: Users, label: 'Workers', path: '/admin-dashboard/workers' },
    { icon: BarChart3, label: 'Reports & Analytics', path: '/admin-dashboard/reports' },
    { icon: Settings, label: 'Settings', path: '/admin-dashboard/settings' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  // Get icon and color based on notification type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'worker_entry':
        return { icon: Package, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/30' };
      case 'status_update':
        return { icon: CheckCircle, color: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/30' };
      case 'admin_action':
        return { icon: AlertCircle, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-100 dark:bg-purple-900/30' };
      case 'payment':
        return { icon: DollarSign, color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-100 dark:bg-orange-900/30' };
      default:
        return { icon: Bell, color: 'text-slate-600 dark:text-slate-400', bg: 'bg-slate-100 dark:bg-slate-900/30' };
    }
  };

  // Mobile Sidebar Content (Full width with labels)
  const MobileSidebarContent = () => (
    <>
      <div className="p-6 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-slate-900 dark:bg-slate-700 rounded-lg flex items-center justify-center">
            <TruckIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-slate-900 dark:text-white">S.S. Translift</h2>
            <p className="text-xs text-slate-600 dark:text-slate-400">Admin Portal</p>
          </div>
        </div>
      </div>

      <nav className="p-4 flex-1">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Button
                key={item.path}
                variant={isActive ? 'secondary' : 'ghost'}
                className={`w-full justify-start ${
                  isActive ? 'bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600' : ''
                }`}
                onClick={() => {
                  navigate(item.path);
                  setMobileMenuOpen(false);
                }}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.label}
              </Button>
            );
          })}
        </div>
      </nav>

      <div className="p-4 border-t border-slate-200 dark:border-slate-700">
        <Button
          variant="ghost"
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </Button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex">
      {/* Desktop Sidebar - Collapsible */}
      <aside 
        className={`hidden lg:flex lg:flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 fixed h-screen transition-all duration-300 ease-in-out z-50 ${
          sidebarExpanded ? 'w-64' : 'w-20'
        }`}
      >
        {/* Logo Section */}
        <div className={`p-6 border-b border-slate-200 dark:border-slate-700 ${sidebarExpanded ? '' : 'px-4'}`}>
          <div className={`flex items-center ${sidebarExpanded ? 'space-x-3' : 'justify-center'}`}>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-900 to-blue-700 rounded-lg flex items-center justify-center flex-shrink-0">
              <TruckIcon className="w-6 h-6 text-white" />
            </div>
            {sidebarExpanded && (
              <div className="overflow-hidden">
                <h2 className="font-bold text-slate-900 dark:text-white whitespace-nowrap">S.S. Translift</h2>
                <p className="text-xs text-slate-600 dark:text-slate-400 whitespace-nowrap">Admin Portal</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className={`p-4 flex-1 ${sidebarExpanded ? '' : 'px-2'}`}>
          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Button
                  key={item.path}
                  variant={isActive ? 'secondary' : 'ghost'}
                  className={`w-full ${sidebarExpanded ? 'justify-start' : 'justify-center'} ${
                    isActive ? 'bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600' : ''
                  }`}
                  onClick={() => navigate(item.path)}
                  title={!sidebarExpanded ? item.label : undefined}
                >
                  <Icon className={`w-5 h-5 ${sidebarExpanded ? 'mr-3' : ''}`} />
                  {sidebarExpanded && <span className="whitespace-nowrap">{item.label}</span>}
                </Button>
              );
            })}
          </div>
        </nav>

        {/* Logout Button */}
        <div className={`p-4 border-t border-slate-200 dark:border-slate-700 ${sidebarExpanded ? '' : 'px-2'}`}>
          <Button
            variant="ghost"
            className={`w-full ${sidebarExpanded ? 'justify-start' : 'justify-center'} text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950`}
            onClick={handleLogout}
            title={!sidebarExpanded ? 'Logout' : undefined}
          >
            <LogOut className={`w-5 h-5 ${sidebarExpanded ? 'mr-3' : ''}`} />
            {sidebarExpanded && 'Logout'}
          </Button>
        </div>

        {/* Toggle Button */}
        <div className={`absolute -right-3 top-20 ${sidebarExpanded ? '' : ''}`}>
          <Button
            size="icon"
            variant="outline"
            className="h-6 w-6 rounded-full bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 shadow-md hover:shadow-lg"
            onClick={() => setSidebarExpanded(!sidebarExpanded)}
          >
            {sidebarExpanded ? (
              <ChevronLeft className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ease-in-out ${sidebarExpanded ? 'lg:ml-64' : 'lg:ml-20'}`}>
        {/* Top Header */}
        <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40">
          <div className="px-4 lg:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Mobile Menu */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden">
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64 p-0">
                  <MobileSidebarContent />
                </SheetContent>
              </Sheet>

              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                {menuItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
              </h1>
            </div>

            <div className="flex items-center space-x-2">
              {/* Dark Mode Toggle */}
              <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>

              {/* Notifications */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-red-600 text-white text-xs">
                        {unreadCount}
                      </Badge>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0" align="end">
                  <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                    <h3 className="font-medium">Notifications</h3>
                  </div>
                  <ScrollArea className="h-80">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-slate-500">No notifications</div>
                    ) : (
                      <div className="divide-y divide-slate-200 dark:divide-slate-700">
                        {notifications.map((notification) => {
                          const { icon: Icon, color, bg } = getNotificationIcon(notification.type);
                          return (
                            <div
                              key={notification.id}
                              className={`p-4 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors ${
                                !notification.read ? 'bg-blue-50 dark:bg-blue-950/20' : ''
                              }`}
                              onClick={() => markNotificationRead(notification.id)}
                            >
                              <div className="flex items-start space-x-3">
                                <div className={`${bg} rounded-lg p-2 flex-shrink-0`}>
                                  <Icon className={`w-4 h-4 ${color}`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-slate-900 dark:text-white mb-1">
                                    {notification.message}
                                  </p>
                                  <div className="flex items-center justify-between">
                                    <p className="text-xs text-slate-500 dark:text-slate-400">{notification.time}</p>
                                    {notification.workerName && (
                                      <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                                        by {notification.workerName}
                                      </span>
                                    )}
                                  </div>
                                  {notification.requestId && (
                                    <span className="text-xs text-slate-600 dark:text-slate-300 mt-1 inline-block">
                                      {notification.requestId}
                                    </span>
                                  )}
                                </div>
                                {!notification.read && (
                                  <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-1"></div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </ScrollArea>
                </PopoverContent>
              </Popover>

              {/* User Profile */}
              <div className="hidden sm:flex items-center space-x-3 pl-3 border-l border-slate-200 dark:border-slate-700">
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{user?.name}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 capitalize">{user?.role}</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-slate-700 to-slate-900 rounded-full flex items-center justify-center text-white font-medium">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}