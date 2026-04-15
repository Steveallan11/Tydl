import { useState } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { useAdmin } from '../../context/AdminContext';
import { CleanerOnboardingModal } from './CleanerOnboardingModal';
import { Cleaner } from '../../types/operations';

export function CleanerManagementSection() {
  const { cleaners, onboardCleaner, refreshData } = useAdmin();
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCleaners = cleaners.filter(c =>
    (c.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const verifiedCleaners = cleaners.filter(c => c.verificationStatus === 'verified').length;
  const pendingCleaners = cleaners.filter(c => c.verificationStatus === 'pending').length;

  const handleCleanerOnboarded = async () => {
    setShowOnboardingModal(false);
    await refreshData();
  };

  return (
    <div className="space-y-6">
      {/* Cleaner Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div>
            <p className="text-sm font-medium text-slate-600 mb-1">Total Cleaners</p>
            <p className="text-3xl font-bold text-slate-900">{cleaners.length}</p>
          </div>
        </Card>
        <Card>
          <div>
            <p className="text-sm font-medium text-slate-600 mb-1">Verified</p>
            <p className="text-3xl font-bold text-green-600">{verifiedCleaners}</p>
          </div>
        </Card>
        <Card>
          <div>
            <p className="text-sm font-medium text-slate-600 mb-1">Pending Verification</p>
            <p className="text-3xl font-bold text-amber-600">{pendingCleaners}</p>
          </div>
        </Card>
      </div>

      {/* Cleaner List */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Cleaners</h2>
          <Button
            onClick={() => setShowOnboardingModal(true)}
          >
            + Onboard Cleaner
          </Button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent outline-none"
          />
        </div>

        {/* Cleaner Table */}
        {filteredCleaners.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-600">
              {searchTerm ? 'No cleaners match your search' : 'No cleaners onboarded yet'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 font-semibold text-slate-900">Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-900">Email</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-900">Phone</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-900">Postcode</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-900">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-900">Rating</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-900">Jobs</th>
                </tr>
              </thead>
              <tbody>
                {filteredCleaners.map((cleaner) => (
                  <tr key={cleaner.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-4">
                      <p className="font-semibold text-slate-900">
                        {cleaner.firstName} {cleaner.lastName}
                      </p>
                    </td>
                    <td className="py-3 px-4 text-slate-700">{cleaner.email}</td>
                    <td className="py-3 px-4 text-slate-700">{cleaner.phone}</td>
                    <td className="py-3 px-4 text-slate-700">{cleaner.postcode}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        cleaner.verificationStatus === 'verified'
                          ? 'bg-green-100 text-green-800'
                          : cleaner.verificationStatus === 'pending'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {cleaner.verificationStatus === 'verified' ? '✓ Verified' :
                         cleaner.verificationStatus === 'pending' ? '⏳ Pending' :
                         '✗ Rejected'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <span>⭐</span>
                        <span className="font-semibold text-slate-900">
                          {(cleaner.rating || 0).toFixed(1)}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-900">
                        {cleaner.jobsCompleted || 0}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Onboarding Modal */}
      {showOnboardingModal && (
        <CleanerOnboardingModal
          onClose={() => setShowOnboardingModal(false)}
          onSuccess={handleCleanerOnboarded}
        />
      )}
    </div>
  );
}
