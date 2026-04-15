import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { DebugPanel } from '../../components/common/DebugPanel';
import { useAdmin } from '../../context/AdminContext';
import { useAuth } from '../../context/AuthContext';

export function CleanerOnboarding() {
  const navigate = useNavigate();
  const { onboardCleaner, isLoading: contextLoading } = useAdmin();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    postcode: '',
    accountHolderName: '',
    sortCode: '',
    accountNumber: '',
    compensationType: 'hourly',
    hourlyRate: '16',
    payoutFrequency: 'weekly',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  if (!user) {
    navigate('/admin/login');
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.email || !formData.email.includes('@')) {
      newErrors.email = 'Valid email required';
    }
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name required';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name required';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number required';
    }
    if (!formData.postcode.trim()) {
      newErrors.postcode = 'Postcode required';
    }
    if (!formData.accountHolderName.trim()) {
      newErrors.accountHolderName = 'Account holder name required';
    }
    if (!formData.sortCode || formData.sortCode.length !== 6) {
      newErrors.sortCode = 'Sort code must be 6 digits';
    }
    if (!formData.accountNumber || formData.accountNumber.length < 8) {
      newErrors.accountNumber = 'Account number must be at least 8 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      // Create a temporary cleaner ID for now
      const cleanerId = `cleaner_${Date.now()}`;

      const success = await onboardCleaner({
        cleanerId,
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        postcode: formData.postcode,
        accountHolderName: formData.accountHolderName,
        sortCode: formData.sortCode,
        accountNumber: formData.accountNumber,
        compensationType: formData.compensationType,
        hourlyRate: parseFloat(formData.hourlyRate),
        payoutFrequency: formData.payoutFrequency,
      });

      if (success) {
        setSuccessMessage(`✓ Cleaner ${formData.firstName} ${formData.lastName} onboarded successfully!`);

        // Reset form
        setFormData({
          email: '',
          firstName: '',
          lastName: '',
          phone: '',
          postcode: '',
          accountHolderName: '',
          sortCode: '',
          accountNumber: '',
          compensationType: 'hourly',
          hourlyRate: '16',
          payoutFrequency: 'weekly',
        });

        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (error: any) {
      setErrors({ submit: error.message || 'Failed to onboard cleaner' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <DebugPanel />
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Onboard Cleaner</h1>
        <p className="text-slate-600">Add a new cleaner to the platform</p>
      </div>

      {successMessage && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-700">{successMessage}</p>
        </div>
      )}

      {errors.submit && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{errors.submit}</p>
        </div>
      )}

      <Card>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent outline-none ${
                    errors.email ? 'border-red-500 bg-red-50' : 'border-slate-300'
                  }`}
                  placeholder="cleaner@example.com"
                />
                {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent outline-none ${
                    errors.phone ? 'border-red-500 bg-red-50' : 'border-slate-300'
                  }`}
                  placeholder="01604 123456"
                />
                {errors.phone && <p className="text-sm text-red-600 mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent outline-none ${
                    errors.firstName ? 'border-red-500 bg-red-50' : 'border-slate-300'
                  }`}
                  placeholder="Jane"
                />
                {errors.firstName && <p className="text-sm text-red-600 mt-1">{errors.firstName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent outline-none ${
                    errors.lastName ? 'border-red-500 bg-red-50' : 'border-slate-300'
                  }`}
                  placeholder="Smith"
                />
                {errors.lastName && <p className="text-sm text-red-600 mt-1">{errors.lastName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Service Area Postcode
                </label>
                <input
                  type="text"
                  name="postcode"
                  value={formData.postcode}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent outline-none ${
                    errors.postcode ? 'border-red-500 bg-red-50' : 'border-slate-300'
                  }`}
                  placeholder="NN1 1AA"
                />
                {errors.postcode && <p className="text-sm text-red-600 mt-1">{errors.postcode}</p>}
              </div>
            </div>
          </div>

          {/* Bank Details */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Bank Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Account Holder Name
                </label>
                <input
                  type="text"
                  name="accountHolderName"
                  value={formData.accountHolderName}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent outline-none ${
                    errors.accountHolderName ? 'border-red-500 bg-red-50' : 'border-slate-300'
                  }`}
                  placeholder="Jane Smith"
                />
                {errors.accountHolderName && <p className="text-sm text-red-600 mt-1">{errors.accountHolderName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Sort Code
                </label>
                <input
                  type="text"
                  name="sortCode"
                  value={formData.sortCode}
                  onChange={handleChange}
                  maxLength={6}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent outline-none ${
                    errors.sortCode ? 'border-red-500 bg-red-50' : 'border-slate-300'
                  }`}
                  placeholder="200000"
                />
                {errors.sortCode && <p className="text-sm text-red-600 mt-1">{errors.sortCode}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Account Number
                </label>
                <input
                  type="text"
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent outline-none ${
                    errors.accountNumber ? 'border-red-500 bg-red-50' : 'border-slate-300'
                  }`}
                  placeholder="12345678"
                />
                {errors.accountNumber && <p className="text-sm text-red-600 mt-1">{errors.accountNumber}</p>}
              </div>
            </div>
          </div>

          {/* Compensation */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Compensation</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Hourly Rate (£)
                </label>
                <input
                  type="number"
                  name="hourlyRate"
                  value={formData.hourlyRate}
                  onChange={handleChange}
                  step="0.50"
                  min="0"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Payout Frequency
                </label>
                <select
                  name="payoutFrequency"
                  value={formData.payoutFrequency}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent outline-none"
                >
                  <option value="weekly">Weekly</option>
                  <option value="biweekly">Bi-weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/cleaners')}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Onboarding...' : '✓ Onboard Cleaner'}
            </Button>
          </div>
        </form>
      </Card>
      </div>
    </>
  );
}
