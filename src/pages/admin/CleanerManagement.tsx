import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { CleanerOnboardingForm, CleanerOnboardingFormData } from '../../components/admin/CleanerOnboardingForm';
import { useAdmin } from '../../context/AdminContext';
import { signUpCleaner, getCleanerById } from '../../lib/supabase';

export function CleanerManagement() {
  const navigate = useNavigate();
  const { cleaners, onboardCleaner, refreshData } = useAdmin();
  const [showOnboardingForm, setShowOnboardingForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'verified' | 'pending' | 'rejected'>('all');

  const handleFormSubmit = async (formData: CleanerOnboardingFormData) => {
    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      // Step 1: Create auth account
      const { user, cleaner } = await signUpCleaner(
        formData.email,
        Math.random().toString(36).slice(-12), // Generate temporary password
        formData.firstName,
        formData.lastName,
        formData.phone,
        formData.postcode
      );

      // Step 2: Onboard cleaner with bank details and payout settings
      const success = await onboardCleaner({
        cleanerId: cleaner.id,
        accountHolderName: formData.accountHolderName,
        sortCode: formData.sortCode,
        accountNumber: formData.accountNumber,
        compensationType: formData.compensationType,
        flatRatePerJob: formData.flatRatePerJob,
        hourlyRate: formData.hourlyRate,
        percentageOfRevenue: formData.percentageOfRevenue,
        payoutFrequency: formData.payoutFrequency,
        minimumPayout: formData.minimumPayout,
      });

      if (success) {
        setSuccessMessage(`✓ ${formData.firstName} ${formData.lastName} has been added successfully!`);
        setShowOnboardingForm(false);
        await refreshData();
      } else {
        setError('Failed to save cleaner details. Please try again.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create cleaner account');
      console.error('Error creating cleaner:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCleaners = cleaners.filter((cleaner: any) => {
    const matchesSearch =
      `${cleaner.first_name || ''} ${cleaner.last_name || ''}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cleaner.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cleaner.phone?.includes(searchTerm);

    const status = cleaner.verification_status || cleaner.verificationStatus;
    const matchesStatus = filterStatus === 'all' || status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900">Cleaner Management</h1>
        {!showOnboardingForm && (
          <Button onClick={() => setShowOnboardingForm(true)}>
            + Add New Cleaner
          </Button>
        )}
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-700">{successMessage}</p>
        </div>
      )}

      {/* Onboarding Form */}
      {showOnboardingForm && (
        <div className="mb-6">
          <CleanerOnboardingForm
            onSubmit={handleFormSubmit}
            isLoading={isLoading}
            error={error}
            onCancel={() => setShowOnboardingForm(false)}
          />
        </div>
      )}

      {/* Cleaners List */}
      {!showOnboardingForm && (
        <Card>
          {/* Search and Filter */}
          <div className="mb-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Search Cleaners
              </label>
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent outline-none"
              />
            </div>

            <div className="flex gap-2">
              {(['all', 'verified', 'pending', 'rejected'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filterStatus === status
                      ? 'bg-brand-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Cleaners Table */}
          {filteredCleaners.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Name</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Email</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Phone</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Jobs</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Rating</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredCleaners.map((cleaner: any) => (
                    <tr key={cleaner.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <p className="font-medium text-slate-900">
                          {cleaner.first_name} {cleaner.last_name}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {cleaner.email}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {cleaner.phone}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                            cleaner.verification_status === 'verified' ||
                            cleaner.verificationStatus === 'verified'
                              ? 'bg-green-100 text-green-800'
                              : cleaner.verification_status === 'pending' ||
                                cleaner.verificationStatus === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {cleaner.verification_status || cleaner.verificationStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {cleaner.jobs_completed || cleaner.jobsCompleted || 0}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {(cleaner.rating || 0).toFixed(1)} ⭐
                      </td>
                      <td className="px-6 py-4">
                        <button className="text-brand-600 hover:text-brand-700 font-medium text-sm">
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-500 text-lg">
                {searchTerm || filterStatus !== 'all'
                  ? 'No cleaners found matching your criteria'
                  : 'No cleaners yet. Add one to get started.'}
              </p>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
