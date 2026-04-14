import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { useCleanerAuth } from '../../context/CleanerAuthContext';

export function CleanerProfile() {
  const navigate = useNavigate();
  const { user, logout } = useCleanerAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('');
  const [postcode, setPostcode] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [availability, setAvailability] = useState({
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: false,
    sunday: false,
  });

  const handleAvailabilityChange = (day: keyof typeof availability) => {
    setAvailability({
      ...availability,
      [day]: !availability[day],
    });
  };

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

  return (
    <main className="bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12 flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Profile</h1>
            <p className="text-lg text-slate-600">Manage your profile and availability</p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => navigate('/cleaner/jobs')}
            >
              ← Back to Jobs
            </Button>
            <Button
              variant="outline"
              onClick={async () => {
                await logout();
                navigate('/cleaner/login');
              }}
            >
              Logout
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Profile Form */}
          <div className="lg:col-span-2">
            <Card>
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
                      placeholder="Sarah"
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
                      placeholder="Johnson"
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
                    placeholder="sarah@example.com"
                  />
                </div>

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
                    Service Area Postcode
                  </label>
                  <input
                    type="text"
                    value={postcode}
                    onChange={(e) => setPostcode(e.target.value.toUpperCase())}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent outline-none"
                    placeholder="NN1"
                  />
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
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </Card>
          </div>

          {/* Availability Card */}
          <div>
            <Card>
              <h2 className="text-xl font-bold text-slate-900 mb-6">Your Availability</h2>

              <div className="space-y-3">
                {Object.entries(availability).map(([day, isAvailable]) => (
                  <div key={day} className="flex items-center">
                    <input
                      type="checkbox"
                      id={day}
                      checked={isAvailable}
                      onChange={() => handleAvailabilityChange(day as keyof typeof availability)}
                      className="w-5 h-5 text-brand-600 rounded cursor-pointer"
                    />
                    <label htmlFor={day} className="ml-3 text-sm font-medium text-slate-700 cursor-pointer capitalize">
                      {day}
                    </label>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-slate-200">
                <p className="text-xs text-slate-500 mb-4">
                  Select the days you're available to work. You'll receive job requests for available days only.
                </p>
              </div>
            </Card>

            {/* Stats Card */}
            <Card className="mt-6">
              <h3 className="text-sm font-semibold text-slate-700 mb-4">Performance</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-slate-600">Jobs Completed</p>
                  <p className="text-2xl font-bold text-slate-900">8</p>
                </div>
                <div>
                  <p className="text-xs text-slate-600">Average Rating</p>
                  <p className="text-2xl font-bold text-brand-600">4.8 ⭐</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
