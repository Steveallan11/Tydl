import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { DebugPanel } from '../../components/common/DebugPanel';
import { useAdmin } from '../../context/AdminContext';

export function CleanerDetail() {
  const { cleanerId } = useParams<{ cleanerId: string }>();
  const navigate = useNavigate();
  const { cleaners, refreshData } = useAdmin();

  const cleaner = cleaners.find(c => c.id === cleanerId);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    postcode: '',
    verificationStatus: 'pending' as 'pending' | 'verified' | 'rejected',
  });

  useEffect(() => {
    if (cleaner) {
      setFormData({
        firstName: cleaner.firstName || '',
        lastName: cleaner.lastName || '',
        email: cleaner.email || '',
        phone: cleaner.phone || '',
        postcode: cleaner.postcode || '',
        verificationStatus: cleaner.verificationStatus || 'pending',
      });
    }
  }, [cleaner]);

  if (!cleaner) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12">
        <DebugPanel />
        <Card>
          <div className="text-center py-12">
            <p className="text-slate-600 text-lg">Cleaner not found</p>
            <Button
              variant="outline"
              onClick={() => navigate('/admin/cleaners')}
              className="mt-4"
            >
              Back to Cleaners
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // TODO: Add API call to update cleaner
      console.log('[CleanerDetail] Would save:', formData);
      await refreshData();
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving cleaner:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-amber-100 text-amber-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <>
      <DebugPanel />
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">
              {cleaner.firstName} {cleaner.lastName}
            </h1>
            <p className="text-slate-600">{cleaner.email}</p>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate('/admin/cleaners')}
          >
            ← Back
          </Button>
        </div>

        {/* Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <p className="text-sm text-slate-600 mb-1">Status</p>
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${getStatusColor(cleaner.verificationStatus || 'pending')}`}>
              {cleaner.verificationStatus === 'verified' ? '✓ Verified' :
               cleaner.verificationStatus === 'pending' ? '⏳ Pending' :
               '✗ Rejected'}
            </span>
          </Card>
          <Card>
            <p className="text-sm text-slate-600 mb-1">Jobs Completed</p>
            <p className="text-3xl font-bold text-slate-900">{cleaner.jobsCompleted || 0}</p>
          </Card>
          <Card>
            <p className="text-sm text-slate-600 mb-1">Rating</p>
            <div className="flex items-center gap-2">
              <span className="text-2xl">⭐</span>
              <p className="text-2xl font-bold text-slate-900">{(cleaner.rating || 0).toFixed(1)}</p>
            </div>
          </Card>
          <Card>
            <p className="text-sm text-slate-600 mb-1">Service Area</p>
            <p className="text-lg font-bold text-slate-900">{cleaner.postcode}</p>
          </Card>
        </div>

        {/* Main Content */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Profile Details</h2>
            {!isEditing && (
              <Button onClick={() => setIsEditing(true)}>
                ✏️ Edit Profile
              </Button>
            )}
          </div>

          {isEditing ? (
            /* Edit Mode */
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleChange('firstName', e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleChange('lastName', e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Service Area Postcode
                </label>
                <input
                  type="text"
                  value={formData.postcode}
                  onChange={(e) => handleChange('postcode', e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Verification Status
                </label>
                <select
                  value={formData.verificationStatus}
                  onChange={(e) => handleChange('verificationStatus', e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent outline-none"
                >
                  <option value="pending">⏳ Pending Verification</option>
                  <option value="verified">✓ Verified</option>
                  <option value="rejected">✗ Rejected</option>
                </select>
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving...' : '✓ Save Changes'}
                </Button>
              </div>
            </div>
          ) : (
            /* View Mode */
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-slate-600 mb-1">First Name</p>
                  <p className="text-lg font-medium text-slate-900">{formData.firstName}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">Last Name</p>
                  <p className="text-lg font-medium text-slate-900">{formData.lastName}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">Email</p>
                  <p className="text-lg font-medium text-slate-900">{formData.email}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">Phone</p>
                  <p className="text-lg font-medium text-slate-900">{formData.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">Service Area</p>
                  <p className="text-lg font-medium text-slate-900">{formData.postcode}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">Verification Status</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${getStatusColor(formData.verificationStatus)}`}>
                    {formData.verificationStatus === 'verified' ? '✓ Verified' :
                     formData.verificationStatus === 'pending' ? '⏳ Pending' :
                     '✗ Rejected'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Additional Info */}
        <Card className="mt-8">
          <h3 className="text-xl font-bold text-slate-900 mb-4">Additional Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <p className="text-slate-600 mb-1">Created Date</p>
              <p className="font-medium text-slate-900">
                {cleaner.createdAt ? new Date(cleaner.createdAt).toLocaleDateString() : 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-slate-600 mb-1">Last Updated</p>
              <p className="font-medium text-slate-900">
                {cleaner.updatedAt ? new Date(cleaner.updatedAt).toLocaleDateString() : 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-slate-600 mb-1">Cleaner ID</p>
              <p className="font-mono text-sm text-slate-700 break-all">{cleaner.id}</p>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
