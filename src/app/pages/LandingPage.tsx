import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { TruckIcon, Truck, Package, Box, Factory, Ship, Building2, ArrowRight, Phone, Mail, MapPin, CheckCircle } from 'lucide-react';

export function LandingPage() {
  const navigate = useNavigate();

  const services = [
    {
      icon: Box,
      title: '20-Foot Standard',
      description: 'Standard shipping containers for general cargo',
    },
    {
      icon: Box,
      title: '40-Foot Containers',
      description: 'Standard and high-cube containers for larger shipments',
    },
    {
      icon: Package,
      title: 'Reefer Containers',
      description: 'Temperature-controlled containers for sensitive cargo',
    },
    {
      icon: Factory,
      title: 'Flat Rack & ODC',
      description: 'Specialized containers for oversized and heavy cargo',
    },
  ];

  const industries = [
    { icon: Factory, name: 'Manufacturing' },
    { icon: Ship, name: 'Ports & Shipping' },
    { icon: Building2, name: 'Construction' },
    { icon: Package, name: 'Logistics' },
  ];

  const steps = [
    { number: '1', title: 'Request Quote', description: 'Share your transport requirements' },
    { number: '2', title: 'Get Approval', description: 'Receive confirmation and pricing' },
    { number: '3', title: 'Schedule Service', description: 'Choose your preferred date and time' },
    { number: '4', title: 'Safe Delivery', description: 'Track and receive your cargo' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <header className="border-b bg-white dark:bg-slate-900 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <TruckIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-lg text-slate-900 dark:text-white">S.S. Translift</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">Kalamboli, Navi Mumbai</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#services" className="text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white">Services</a>
              <a href="#about" className="text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white">About</a>
              <a href="#contact" className="text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white">Contact</a>
              <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>Login</Button>
            </nav>
            <Button className="md:hidden" variant="ghost" size="sm" onClick={() => navigate('/login')}>Login</Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#3b4d7a] via-[#4a5a8a] to-[#525e7f] dark:from-[#1e2847] dark:via-[#2a3558] dark:to-[#323d5f]">
        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 px-4 py-2 rounded-full mb-8">
              <MapPin className="w-4 h-4" />
              <span className="text-sm font-medium">Serving Navi Mumbai & JNPT Port Area</span>
            </div>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Professional Container<br />Transport Services
            </h2>
            <p className="text-lg md:text-xl text-slate-200 dark:text-slate-300 mb-10 max-w-2xl mx-auto">
              Specialized logistics solutions for container transport across all major ports. Handling 20FT, 40FT, Reefer, Flat Rack, and ODC containers with professional care 24/7.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-6 text-base"
                onClick={() => navigate('/login')}
              >
                Request Transport
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="bg-transparent border-2 border-white/30 text-white hover:bg-white/10 px-8 py-6 text-base"
                onClick={() => navigate('/signup')}
              >
                Get Quote
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Our Services</h3>
            <p className="text-lg text-slate-600 dark:text-slate-400">Comprehensive logistics solutions for every need</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <Card key={index} className="p-6 hover:shadow-lg transition-shadow border-slate-200 dark:border-slate-800">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-bold text-lg mb-2 text-slate-900 dark:text-white">{service.title}</h4>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">{service.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">How It Works</h3>
            <p className="text-lg text-slate-600 dark:text-slate-400">Simple and efficient process</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-900 to-blue-700 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  {step.number}
                </div>
                <h4 className="font-bold text-lg mb-2 text-slate-900 dark:text-white">{step.title}</h4>
                <p className="text-slate-600 dark:text-slate-400 text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries Served */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Industries We Serve</h3>
            <p className="text-lg text-slate-600 dark:text-slate-400">Trusted by leading companies across sectors</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {industries.map((industry, index) => {
              const Icon = industry.icon;
              return (
                <Card key={index} className="p-8 text-center hover:shadow-lg transition-shadow border-slate-200 dark:border-slate-800">
                  <Icon className="w-12 h-12 mx-auto mb-4 text-blue-900 dark:text-blue-400" />
                  <h4 className="font-medium text-slate-900 dark:text-white">{industry.name}</h4>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Get In Touch</h3>
            <p className="text-lg text-slate-600 dark:text-slate-400">We're here to help with your logistics needs</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="p-6 text-center border-slate-200 dark:border-slate-800">
              <Phone className="w-8 h-8 mx-auto mb-4 text-orange-600" />
              <h4 className="font-medium mb-2 text-slate-900 dark:text-white">Phone</h4>
              <p className="text-slate-600 dark:text-slate-400 text-sm">+91 98765 43210</p>
            </Card>
            <Card className="p-6 text-center border-slate-200 dark:border-slate-800">
              <Mail className="w-8 h-8 mx-auto mb-4 text-orange-600" />
              <h4 className="font-medium mb-2 text-slate-900 dark:text-white">Email</h4>
              <p className="text-slate-600 dark:text-slate-400 text-sm">info@sstranslift.com</p>
            </Card>
            <Card className="p-6 text-center border-slate-200 dark:border-slate-800">
              <MapPin className="w-8 h-8 mx-auto mb-4 text-orange-600" />
              <h4 className="font-medium mb-2 text-slate-900 dark:text-white">Location</h4>
              <p className="text-slate-600 dark:text-slate-400 text-sm">Kalamboli, Navi Mumbai, Maharashtra</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 dark:bg-black text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-700 to-blue-600 rounded-lg flex items-center justify-center">
                  <TruckIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold">S.S. Translift</h4>
                  <p className="text-xs text-slate-400">Reliable Transport</p>
                </div>
              </div>
              <p className="text-sm text-slate-400">Professional container transport services across all major ports in Navi Mumbai.</p>
            </div>
            <div>
              <h5 className="font-medium mb-4">Container Types</h5>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>20-Foot Standard</li>
                <li>40-Foot Containers</li>
                <li>Reefer Containers</li>
                <li>Flat Rack & ODC</li>
              </ul>
            </div>
            <div>
              <h5 className="font-medium mb-4">Company</h5>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>About Us</li>
                <li>Contact</li>
                <li>Careers</li>
                <li>Privacy Policy</li>
              </ul>
            </div>
            <div>
              <h5 className="font-medium mb-4">Contact Info</h5>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>Kalamboli, Navi Mumbai</li>
                <li>Maharashtra, India</li>
                <li>+91 98765 43210</li>
                <li>info@sstranslift.com</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-sm text-slate-400">
            <p>&copy; 2026 S.S. Translift. All rights reserved. Transport Operations - Navi Mumbai, Maharashtra</p>
          </div>
        </div>
      </footer>
    </div>
  );
}