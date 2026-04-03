import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { TruckIcon, ArrowLeft, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export function TransportRequestForm() {
  const navigate = useNavigate();
  const { addRequest, user } = useApp();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    customerName: user?.name || '',
    companyName: '',
    phoneNumber: '',
    pickupLocation: '',
    dropLocation: '',
    craneType: '',
    loadWeight: '',
    serviceDate: '',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.customerName || !formData.companyName || !formData.phoneNumber || 
        !formData.pickupLocation || !formData.dropLocation || !formData.craneType || 
        !formData.loadWeight || !formData.serviceDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    addRequest(formData);
    setSubmitted(true);
    toast.success('Transport request submitted successfully!');

    // Simulate Excel export
    console.log('Excel Export Data:', {
      ...formData,
      requestId: `REQ${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
      status: 'Pending',
      timestamp: new Date().toISOString(),
    });
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center border-slate-200 dark:border-slate-800">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Request Submitted!</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Your transport request has been submitted successfully. Our team will review and get back to you shortly.
          </p>
          <div className="flex flex-col gap-3">
            <Button onClick={() => navigate('/customer/dashboard')} className="bg-blue-900 hover:bg-blue-800">
              Go to Dashboard
            </Button>
            <Button variant="outline" onClick={() => { setSubmitted(false); setFormData({ ...formData, notes: '' }); }}>
              Submit Another Request
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-900 to-blue-700 rounded-lg flex items-center justify-center">
                <TruckIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-xl text-slate-900 dark:text-white">New Transport Request</h1>
                <p className="text-xs text-slate-600 dark:text-slate-400">S.S. Translift - Navi Mumbai</p>
              </div>
            </div>
            <Button variant="outline" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="p-8 border-slate-200 dark:border-slate-800">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Customer Information */}
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Customer Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="customerName">Customer Name *</Label>
                  <Input
                    id="customerName"
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    placeholder="John Doe"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="companyName">Company Name *</Label>
                  <Input
                    id="companyName"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    placeholder="Company Pvt Ltd"
                    className="mt-1"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="phoneNumber">Phone Number *</Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Transport Details */}
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Transport Details</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="pickupLocation">Pickup Location *</Label>
                  <Input
                    id="pickupLocation"
                    value={formData.pickupLocation}
                    onChange={(e) => setFormData({ ...formData, pickupLocation: e.target.value })}
                    placeholder="e.g., JNPT Port, Navi Mumbai"
                    className="mt-1"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="dropLocation">Drop Location *</Label>
                  <Input
                    id="dropLocation"
                    value={formData.dropLocation}
                    onChange={(e) => setFormData({ ...formData, dropLocation: e.target.value })}
                    placeholder="e.g., Kalamboli MIDC"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="craneType">Crane Type *</Label>
                  <Select value={formData.craneType} onValueChange={(value) => setFormData({ ...formData, craneType: value })}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select crane type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15 Ton Truck Crane">15 Ton Truck Crane</SelectItem>
                      <SelectItem value="25 Ton Hydraulic Crane">25 Ton Hydraulic Crane</SelectItem>
                      <SelectItem value="40 Ton Mobile Crane">40 Ton Mobile Crane</SelectItem>
                      <SelectItem value="50 Ton All Terrain Crane">50 Ton All Terrain Crane</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="loadWeight">Load Weight (kg) *</Label>
                  <Input
                    id="loadWeight"
                    value={formData.loadWeight}
                    onChange={(e) => setFormData({ ...formData, loadWeight: e.target.value })}
                    placeholder="e.g., 15000"
                    className="mt-1"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="serviceDate">Service Date *</Label>
                  <Input
                    id="serviceDate"
                    type="date"
                    value={formData.serviceDate}
                    onChange={(e) => setFormData({ ...formData, serviceDate: e.target.value })}
                    className="mt-1"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>
            </div>

            {/* Additional Notes */}
            <div>
              <Label htmlFor="notes">Additional Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Any special requirements or instructions..."
                rows={4}
                className="mt-1"
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <Button type="submit" size="lg" className="flex-1 bg-blue-900 hover:bg-blue-800">
                Submit Request
              </Button>
              <Button type="button" size="lg" variant="outline" onClick={() => navigate(-1)}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>

        <p className="text-center text-sm text-slate-600 dark:text-slate-400 mt-6">
          Your request will be reviewed within 24 hours. You'll receive a confirmation via phone.
        </p>
      </div>
    </div>
  );
}