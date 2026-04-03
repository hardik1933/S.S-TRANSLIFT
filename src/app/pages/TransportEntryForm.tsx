import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { TruckIcon, ArrowLeft, CheckCircle, Save } from 'lucide-react';
import { toast } from 'sonner';

export function TransportEntryForm() {
  const navigate = useNavigate();
  const { addRequest, user } = useApp();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    // Basic Info
    date: new Date().toISOString().split('T')[0],
    billNumber: '',
    customerName: '',
    companyName: '',
    phoneNumber: '',
    
    // Transport Details
    partyName: '',
    brokerName: '',
    pickupLocation: '',
    dropLocation: '',
    portName: '',
    
    // Container & Vehicle
    containerType: '20-Foot Standard' as '20-Foot Standard' | '40-Foot Standard' | '40-Foot High Cube' | 'Reefer Container' | 'Flat Rack Container' | 'ODC Container',
    vehicleNumber: '',
    containerNumber: '',
    loadWeight: '',
    cargoDescription: '',
    
    // Financial
    parkingCharges: 0,
    freightAmount: 0,
    truckFreight: 0,
    companyMargin: 0,
    advancePayment: 0,
    balancePayment: 0,
    paymentMode: 'Cash' as 'Cash' | 'NEFT' | 'UPI' | 'Cheque',
    
    // Status & Notes
    notes: '',
    serviceDate: '',
    addedBy: user?.name || '',
  });

  useEffect(() => {
    if (!user || user.role !== 'worker') {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (user?.name) {
      setFormData((prev) => ({ ...prev, addedBy: user.name }));
    }
  }, [user?.name]);

  // Auto-calculate company margin
  useEffect(() => {
    const margin = (formData.freightAmount || 0) - (formData.truckFreight || 0);
    setFormData(prev => ({ ...prev, companyMargin: margin }));
  }, [formData.freightAmount, formData.truckFreight]);

  // Auto-calculate balance payment
  useEffect(() => {
    const balance = (formData.freightAmount || 0) - (formData.advancePayment || 0);
    setFormData(prev => ({ ...prev, balancePayment: balance }));
  }, [formData.freightAmount, formData.advancePayment]);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const requiredFields = [
      'billNumber', 'customerName', 'companyName', 'phoneNumber',
      'partyName', 'pickupLocation', 'dropLocation', 'vehicleNumber',
      'loadWeight', 'serviceDate'
    ];

    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    
    if (missingFields.length > 0) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await addRequest({ ...formData } as unknown as Record<string, unknown>);
      setSubmitted(true);
      toast.success('Transport entry saved to the database. Awaiting admin approval.');
    } catch (err) {
      console.error(err);
      toast.error(
        err instanceof Error
          ? err.message
          : 'Could not save entry. Check required Supabase columns and RLS for transport_requests.',
      );
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center border-slate-200 dark:border-slate-800">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Entry Submitted!</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Your transport entry has been submitted successfully and is awaiting admin approval.
          </p>
          <div className="space-y-3">
            <Button 
              className="w-full bg-blue-900 hover:bg-blue-800"
              onClick={() => navigate('/worker/dashboard')}
            >
              Back to Dashboard
            </Button>
            <Button 
              variant="outline"
              className="w-full"
              onClick={() => {
                setSubmitted(false);
                setFormData({
                  date: new Date().toISOString().split('T')[0],
                  billNumber: '',
                  customerName: '',
                  companyName: '',
                  phoneNumber: '',
                  partyName: '',
                  brokerName: '',
                  pickupLocation: '',
                  dropLocation: '',
                  portName: '',
                  containerType: '20-Foot Standard',
                  vehicleNumber: '',
                  containerNumber: '',
                  loadWeight: '',
                  cargoDescription: '',
                  parkingCharges: 0,
                  freightAmount: 0,
                  truckFreight: 0,
                  companyMargin: 0,
                  advancePayment: 0,
                  balancePayment: 0,
                  paymentMode: 'Cash',
                  notes: '',
                  serviceDate: '',
                  addedBy: user?.name || '',
                });
              }}
            >
              Add Another Entry
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate('/worker/dashboard')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-900 to-blue-700 rounded-lg flex items-center justify-center">
                <TruckIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-xl text-slate-900 dark:text-white">S.S. Translift</h1>
                <p className="text-xs text-slate-600 dark:text-slate-400">New Transport Entry</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="p-8 border-slate-200 dark:border-slate-800">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Daily Transport Diary Entry</h2>
            <p className="text-slate-600 dark:text-slate-400">
              Fill in all transport details. Required fields are marked with *
            </p>
          </div>

          <form onSubmit={(e) => void handleSubmit(e)} className="space-y-8">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 pb-2 border-b border-slate-200 dark:border-slate-800">
                Basic Information
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleChange('date', e.target.value)}
                    className="mt-1"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="billNumber">Bill Number *</Label>
                  <Input
                    id="billNumber"
                    placeholder="BILL001"
                    value={formData.billNumber}
                    onChange={(e) => handleChange('billNumber', e.target.value)}
                    className="mt-1"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="customerName">Customer Name *</Label>
                  <Input
                    id="customerName"
                    placeholder="Enter customer name"
                    value={formData.customerName}
                    onChange={(e) => handleChange('customerName', e.target.value)}
                    className="mt-1"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="companyName">Company Name *</Label>
                  <Input
                    id="companyName"
                    placeholder="Enter company name"
                    value={formData.companyName}
                    onChange={(e) => handleChange('companyName', e.target.value)}
                    className="mt-1"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phoneNumber">Phone Number *</Label>
                  <Input
                    id="phoneNumber"
                    placeholder="+91 98765 43210"
                    value={formData.phoneNumber}
                    onChange={(e) => handleChange('phoneNumber', e.target.value)}
                    className="mt-1"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Transport Details */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 pb-2 border-b border-slate-200 dark:border-slate-800">
                Transport Details
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="partyName">Party Name *</Label>
                  <Input
                    id="partyName"
                    placeholder="Enter party name"
                    value={formData.partyName}
                    onChange={(e) => handleChange('partyName', e.target.value)}
                    className="mt-1"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="brokerName">Broker Name</Label>
                  <Input
                    id="brokerName"
                    placeholder="Enter broker name (optional)"
                    value={formData.brokerName}
                    onChange={(e) => handleChange('brokerName', e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="pickupLocation">Pickup Location *</Label>
                  <Input
                    id="pickupLocation"
                    placeholder="From location"
                    value={formData.pickupLocation}
                    onChange={(e) => handleChange('pickupLocation', e.target.value)}
                    className="mt-1"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="dropLocation">Drop Location *</Label>
                  <Input
                    id="dropLocation"
                    placeholder="To location"
                    value={formData.dropLocation}
                    onChange={(e) => handleChange('dropLocation', e.target.value)}
                    className="mt-1"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="portName">Port Name</Label>
                  <Input
                    id="portName"
                    placeholder="Enter port name (optional)"
                    value={formData.portName}
                    onChange={(e) => handleChange('portName', e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="serviceDate">Service Date *</Label>
                  <Input
                    id="serviceDate"
                    type="date"
                    value={formData.serviceDate}
                    onChange={(e) => handleChange('serviceDate', e.target.value)}
                    className="mt-1"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Container & Vehicle Information */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 pb-2 border-b border-slate-200 dark:border-slate-800">
                Container & Vehicle Information
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="containerType">Container Type</Label>
                  <Select 
                    value={formData.containerType} 
                    onValueChange={(value) => handleChange('containerType', value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="20-Foot Standard">20 Foot Standard Container</SelectItem>
                      <SelectItem value="40-Foot Standard">40 Foot Standard Container</SelectItem>
                      <SelectItem value="40-Foot High Cube">40 Foot High Cube Container</SelectItem>
                      <SelectItem value="Reefer Container">Reefer Container</SelectItem>
                      <SelectItem value="Flat Rack Container">Flat Rack Container</SelectItem>
                      <SelectItem value="ODC Container">ODC Container</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="vehicleNumber">Vehicle Number *</Label>
                  <Input
                    id="vehicleNumber"
                    placeholder="MH12 ABC 1234"
                    value={formData.vehicleNumber}
                    onChange={(e) => handleChange('vehicleNumber', e.target.value)}
                    className="mt-1"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="containerNumber">Container Number</Label>
                  <Input
                    id="containerNumber"
                    placeholder="CONT001"
                    value={formData.containerNumber}
                    onChange={(e) => handleChange('containerNumber', e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="loadWeight">Load Weight *</Label>
                  <Input
                    id="loadWeight"
                    placeholder="e.g., 15000 kg"
                    value={formData.loadWeight}
                    onChange={(e) => handleChange('loadWeight', e.target.value)}
                    className="mt-1"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="cargoDescription">Cargo Description</Label>
                  <Input
                    id="cargoDescription"
                    placeholder="Enter cargo description"
                    value={formData.cargoDescription}
                    onChange={(e) => handleChange('cargoDescription', e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="parkingCharges">Parking Charges (₹)</Label>
                  <Input
                    id="parkingCharges"
                    type="number"
                    placeholder="0"
                    value={formData.parkingCharges}
                    onChange={(e) => handleChange('parkingCharges', parseFloat(e.target.value) || 0)}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Financial Information */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 pb-2 border-b border-slate-200 dark:border-slate-800">
                Financial Information
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="freightAmount">Freight Amount (₹)</Label>
                  <Input
                    id="freightAmount"
                    type="number"
                    placeholder="0"
                    value={formData.freightAmount}
                    onChange={(e) => handleChange('freightAmount', parseFloat(e.target.value) || 0)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="truckFreight">Truck Freight (₹)</Label>
                  <Input
                    id="truckFreight"
                    type="number"
                    placeholder="0"
                    value={formData.truckFreight}
                    onChange={(e) => handleChange('truckFreight', parseFloat(e.target.value) || 0)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="companyMargin">Company Margin (₹) - Auto Calculated</Label>
                  <Input
                    id="companyMargin"
                    type="number"
                    value={formData.companyMargin}
                    className="mt-1 bg-slate-100 dark:bg-slate-800"
                    disabled
                  />
                </div>
                <div>
                  <Label htmlFor="advancePayment">Advance Payment (₹)</Label>
                  <Input
                    id="advancePayment"
                    type="number"
                    placeholder="0"
                    value={formData.advancePayment}
                    onChange={(e) => handleChange('advancePayment', parseFloat(e.target.value) || 0)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="balancePayment">Balance Payment (₹) - Auto Calculated</Label>
                  <Input
                    id="balancePayment"
                    type="number"
                    value={formData.balancePayment}
                    className="mt-1 bg-slate-100 dark:bg-slate-800"
                    disabled
                  />
                </div>
                <div>
                  <Label htmlFor="paymentMode">Payment Mode</Label>
                  <Select 
                    value={formData.paymentMode} 
                    onValueChange={(value) => handleChange('paymentMode', value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cash">Cash</SelectItem>
                      <SelectItem value="NEFT">NEFT</SelectItem>
                      <SelectItem value="UPI">UPI</SelectItem>
                      <SelectItem value="Cheque">Cheque</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Remarks */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 pb-2 border-b border-slate-200 dark:border-slate-800">
                Remarks
              </h3>
              <div>
                <Label htmlFor="notes">Additional Notes / Remarks</Label>
                <Textarea
                  id="notes"
                  rows={4}
                  placeholder="Enter any special instructions or remarks..."
                  value={formData.notes}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
              <Button 
                type="submit" 
                className="flex-1 bg-blue-900 hover:bg-blue-800"
              >
                <Save className="w-4 h-4 mr-2" />
                Submit Transport Entry
              </Button>
              <Button 
                type="button"
                variant="outline"
                onClick={() => navigate('/worker/dashboard')}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}