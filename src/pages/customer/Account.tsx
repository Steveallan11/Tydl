import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { useCustomerAuth } from '../../context/CustomerAuthContext';

export function Account() {
  const navigate = useNavigate();
  const { user, logout } = useCustomerAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('');
  const [postcode, setPostcode] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      // Simulate saving profile changes
      await new Promise(resolve => setTimeout(resolve, 500));
      setSaveMessage('Profile saved successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (err) {
      console.error('Failed to save profile:', err);
      setSaveMessage('Failed to save profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setSaveMessage('Passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      setSaveMessage('Password must be at least 6 characters');
      return;
    }

    setIsSaving(true);
    try {
      // Simulate password change
      await new Promise(resolve => setTimeout(resolve, 500));
      setSaveMessage('Password changed successfully!');
      setShowPasswordForm(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (err) {
      console.error('Failed to change password:', err);
      setSaveMessage('Failed to change password');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12 flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Account Settings</h1>
            <p className="text-lg text-slate-600">Manage your profile and preferences</p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => navigate('/customer/dashboard')}
            >
              ← Back to Dashboard
            </Button>
            <Button
              variant="outline"
              onClick={async () => {
                await logout();
                navigate('/customer/login');
              }}
            >
              Logout
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Account Form */}
          <div className="lg:col-span-2">
            {/* Personal Information */}
            <Card className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Personal Information</h2>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent outline-none"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent outline-none"
                      placeholder="Smith"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent outline-none"
                    placeholder="john@example.com"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent outline-none"
                      placeholder="07700 123456"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Postcode
                    </label>
                    <input
                      type="text"
                      value={postcode}
                      onChange={(e) => setPostcode(e.target.value.toUpperCase())}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent outline-none"
                      placeholder="NN1"
                    />
                  </div>
                </div>

                {saveMessage && (
                  <div className={`p-4 rounded-lg ${saveMessage.includes('success') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                    {saveMessage}
                  </div>
                )}

                <Button
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="w-full"
                >
                  {isSaving ? 'Saving...' : 'Save Profile Changes'}
                </Button>
              </div>
            </Card>

            {/* Password Section */}
            <Card>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Security</h2>

              {!showPasswordForm ? (
                <Button
                  variant="outline"
                  onClick={() => setShowPasswordForm(true)}
                  className="w-full"
                >
                  Change Password
                </Button>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent outline-none"
                      placeholder="••••••••"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent outline-none"
                      placeholder="••••••••"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent outline-none"
                      placeholder="••••••••"
                    />
                  </div>

                  {saveMessage && (
                    <div className={`p-4 rounded-lg ${saveMessage.includes('success') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                      {saveMessage}
                    </div>
                  )}

                  <div className="flex gap-3">
                    <Button
                      onClick={handleChangePassword}
                      disabled={isSaving}
                      className="flex-1"
                    >
                      {isSaving ? 'Updating...' : 'Update Password'}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowPasswordForm(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div>
            {/* Account Status */}
            <Card className="mb-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Account Status</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-slate-600">Account Type</p>
                  <p className="text-sm font-semibold text-slate-900">Regular Customer</p>
                </div>
                <div>
                  <p className="text-xs text-slate-600">Member Since</p>
                  <p className="text-sm font-semibold text-slate-900">January 2026</p>
                </div>
                <div>
                  <p className="text-xs text-slate-600">Total Bookings</p>
                  <p className="text-sm font-semibold text-slate-900">3</p>
                </div>
              </div>
            </Card>

            {/* Preferences */}
            <Card>
              <h3 className="text-lg font-bold text-slate-900 mb-4">Preferences</h3>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="w-5 h-5 text-brand-600 rounded" />
                  <span className="ml-3 text-sm text-slate-700">Email confirmations</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="w-5 h-5 text-brand-600 rounded" />
                  <span className="ml-3 text-sm text-slate-700">Booking reminders</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="w-5 h-5 text-brand-600 rounded" />
                  <span className="ml-3 text-sm text-slate-700">Promotional emails</span>
                </label>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
