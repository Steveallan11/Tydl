import { useState } from 'react';
import { Button } from '../common/Button';
import { Card } from '../common/Card';

export interface CleanerOnboardingFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  postcode: string;
  accountHolderName: string;
  sortCode: string;
  accountNumber: string;
  compensationType: 'flat_rate' | 'hourly' | 'percentage';
  flatRatePerJob?: number;
  hourlyRate?: number;
  percentageOfRevenue?: number;
  payoutFrequency: 'weekly' | 'biweekly' | 'monthly';
  minimumPayout: number;
  availability: {
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
  };
}

interface CleanerOnboardingFormProps {
  onSubmit: (data: CleanerOnboardingFormData) => Promise<void>;
  isLoading?: boolean;
  error?: string;
  onCancel?: () => void;
}

export function CleanerOnboardingForm({
  onSubmit,
  isLoading = false,
  error,
  onCancel,
}: CleanerOnboardingFormProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<CleanerOnboardingFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    postcode: '',
    accountHolderName: '',
    sortCode: '',
    accountNumber: '',
    compensationType: 'flat_rate',
    flatRatePerJob: 25,
    hourlyRate: 0,
    percentageOfRevenue: 0,
    payoutFrequency: 'weekly',
    minimumPayout: 50,
    availability: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: false,
      sunday: false,
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checkboxName = name as keyof typeof formData.availability;
      setFormData(prev => ({
        ...prev,
        availability: {
          ...prev.availability,
          [checkboxName]: (e.target as HTMLInputElement).checked,
        },
      }));
    } else if (name in formData.availability) {
      // Skip availability inputs here
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name.includes('Rate') || name.includes('Payout') || name.includes('Percentage')
          ? parseFloat(value) || 0
          : value,
      }));
    }
  };

  const handleAvailabilityChange = (day: keyof typeof formData.availability) => {
    setFormData(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: !prev.availability[day],
      },
    }));
  };

  const handleNext = () => {
    // Basic validation for current step
    if (step === 1) {
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.postcode) {
        return;
      }
    } else if (step === 2) {
      if (!formData.accountHolderName || !formData.sortCode || !formData.accountNumber) {
        return;
      }
    }

    if (step < 4) {
      setStep(step + 1);
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit(formData);
    } catch (err) {
      console.error('Form submission error:', err);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Add New Cleaner</h2>
        <p className="text-slate-600">Step {step} of 4</p>
        <div className="mt-4 w-full bg-slate-200 rounded-full h-2">
          <div
            className="bg-brand-600 h-2 rounded-full transition-all"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Personal Information */}
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900">Personal Information</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Postcode
                </label>
                <input
                  type="text"
                  name="postcode"
                  value={formData.postcode}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent outline-none"
                  required
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Bank Details */}
        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900">Bank Details</h3>
            <p className="text-sm text-slate-600">Account information for payouts</p>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Account Holder Name
              </label>
              <input
                type="text"
                name="accountHolderName"
                value={formData.accountHolderName}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Sort Code
                </label>
                <input
                  type="text"
                  name="sortCode"
                  value={formData.sortCode}
                  onChange={handleInputChange}
                  placeholder="XX-XX-XX"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Account Number
                </label>
                <input
                  type="text"
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleInputChange}
                  placeholder="8 digits"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent outline-none"
                  required
                />
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-sm text-amber-800">
                🔒 Bank details are encrypted and stored securely.
              </p>
            </div>
          </div>
        )}

        {/* Step 3: Compensation Settings */}
        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900">Compensation Settings</h3>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Compensation Type
              </label>
              <select
                name="compensationType"
                value={formData.compensationType}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent outline-none"
              >
                <option value="flat_rate">Flat Rate per Job</option>
                <option value="hourly">Hourly Rate</option>
                <option value="percentage">Percentage of Revenue</option>
              </select>
            </div>

            {formData.compensationType === 'flat_rate' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Flat Rate per Job (£)
                </label>
                <input
                  type="number"
                  name="flatRatePerJob"
                  value={formData.flatRatePerJob || 0}
                  onChange={handleInputChange}
                  step="0.50"
                  min="0"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent outline-none"
                />
              </div>
            )}

            {formData.compensationType === 'hourly' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Hourly Rate (£/hour)
                </label>
                <input
                  type="number"
                  name="hourlyRate"
                  value={formData.hourlyRate || 0}
                  onChange={handleInputChange}
                  step="0.50"
                  min="0"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent outline-none"
                />
              </div>
            )}

            {formData.compensationType === 'percentage' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Percentage of Revenue (%)
                </label>
                <input
                  type="number"
                  name="percentageOfRevenue"
                  value={formData.percentageOfRevenue || 0}
                  onChange={handleInputChange}
                  step="1"
                  min="0"
                  max="100"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent outline-none"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Payout Frequency
                </label>
                <select
                  name="payoutFrequency"
                  value={formData.payoutFrequency}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent outline-none"
                >
                  <option value="weekly">Weekly</option>
                  <option value="biweekly">Bi-weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Minimum Payout (£)
                </label>
                <input
                  type="number"
                  name="minimumPayout"
                  value={formData.minimumPayout}
                  onChange={handleInputChange}
                  step="10"
                  min="0"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Availability */}
        {step === 4 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900">Availability</h3>
            <p className="text-sm text-slate-600">Select days when cleaner is available</p>

            <div className="grid grid-cols-2 gap-4">
              {Object.entries(formData.availability).map(([day, available]) => (
                <label key={day} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={available}
                    onChange={() => handleAvailabilityChange(day as keyof typeof formData.availability)}
                    className="w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-2 focus:ring-brand-600"
                  />
                  <span className="text-slate-700 font-medium capitalize">{day}</span>
                </label>
              ))}
            </div>

            <div className="bg-slate-50 rounded-lg p-4 mt-6">
              <h4 className="font-semibold text-slate-900 mb-2">Review Details</h4>
              <div className="space-y-2 text-sm">
                <p><span className="text-slate-600">Name:</span> {formData.firstName} {formData.lastName}</p>
                <p><span className="text-slate-600">Email:</span> {formData.email}</p>
                <p><span className="text-slate-600">Compensation:</span> {formData.compensationType.replace('_', ' ')}</p>
                <p><span className="text-slate-600">Payout Frequency:</span> {formData.payoutFrequency}</p>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700 text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-4 justify-between pt-6 border-t border-slate-200">
          {step > 1 ? (
            <Button variant="outline" onClick={handlePrev} disabled={isLoading}>
              ← Previous
            </Button>
          ) : (
            <Button variant="outline" onClick={onCancel} disabled={isLoading}>
              Cancel
            </Button>
          )}

          {step < 4 ? (
            <Button onClick={handleNext} disabled={isLoading}>
              Next →
            </Button>
          ) : (
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Cleaner'}
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
}
