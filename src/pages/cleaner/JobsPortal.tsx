import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { useCleanerAuth } from '../../context/CleanerAuthContext';

const MOCK_JOBS = [
  {
    id: 'BK-1704067200000',
    customerName: 'Emma Rodriguez',
    service: 'regular-clean',
    date: '2026-04-15',
    time: '14:00',
    address: '42 High Street, Northampton',
    price: 90,
    status: 'pending',
  },
  {
    id: 'BK-1704067200001',
    customerName: 'James Thompson',
    service: 'deep-clean',
    date: '2026-04-16',
    time: '10:00',
    address: '87 Market Road, Northampton',
    price: 130,
    status: 'accepted',
  },
  {
    id: 'BK-1704067200002',
    customerName: 'Sophie Chen',
    service: 'regular-clean',
    date: '2026-04-17',
    time: '15:30',
    address: '15 Park Lane, Northampton',
    price: 90,
    status: 'accepted',
  },
];

const STATUS_COLORS = {
  pending: { bg: 'bg-amber-50', border: 'border-amber-200', badge: 'bg-amber-100 text-amber-700', label: 'Awaiting Response' },
  accepted: { bg: 'bg-green-50', border: 'border-green-200', badge: 'bg-green-100 text-green-700', label: 'Accepted' },
  'in-progress': { bg: 'bg-blue-50', border: 'border-blue-200', badge: 'bg-blue-100 text-blue-700', label: 'In Progress' },
  completed: { bg: 'bg-slate-50', border: 'border-slate-200', badge: 'bg-slate-100 text-slate-700', label: 'Completed' },
};

export function JobsPortal() {
  const navigate = useNavigate();
  const { user, logout } = useCleanerAuth();
  const [jobs, setJobs] = useState(MOCK_JOBS);
  const [selectedJob, setSelectedJob] = useState<string | null>(null);

  const handleAcceptJob = (jobId: string) => {
    setJobs(jobs.map(job => job.id === jobId ? { ...job, status: 'accepted' } : job));
  };

  const handleStartJob = (jobId: string) => {
    setJobs(jobs.map(job => job.id === jobId ? { ...job, status: 'in-progress' } : job));
  };

  const handleCompleteJob = (jobId: string) => {
    setJobs(jobs.map(job => job.id === jobId ? { ...job, status: 'completed' } : job));
  };

  const acceptedJobs = jobs.filter(j => j.status === 'accepted');
  const pendingJobs = jobs.filter(j => j.status === 'pending');
  const inProgressJobs = jobs.filter(j => j.status === 'in-progress');
  const completedJobs = jobs.filter(j => j.status === 'completed');

  return (
    <main className="bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12 flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">My Jobs</h1>
            <p className="text-lg text-slate-600">View and manage your assigned cleaning jobs</p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => navigate('/cleaner/profile')}
            >
              👤 Profile
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

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <p className="text-sm text-slate-600 mb-1">Pending Jobs</p>
            <p className="text-3xl font-bold text-amber-600">{pendingJobs.length}</p>
          </div>
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <p className="text-sm text-slate-600 mb-1">Accepted</p>
            <p className="text-3xl font-bold text-green-600">{acceptedJobs.length}</p>
          </div>
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <p className="text-sm text-slate-600 mb-1">In Progress</p>
            <p className="text-3xl font-bold text-blue-600">{inProgressJobs.length}</p>
          </div>
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <p className="text-sm text-slate-600 mb-1">Completed</p>
            <p className="text-3xl font-bold text-slate-600">{completedJobs.length}</p>
          </div>
        </div>

        {/* Jobs Grid */}
        <div className="space-y-8">
          {/* Pending Jobs */}
          {pendingJobs.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">⏳ Awaiting Response</h2>
              <div className="grid gap-6">
                {pendingJobs.map(job => (
                  <Card
                    key={job.id}
                    className={`border-l-4 border-l-amber-500 ${
                      selectedJob === job.id ? 'ring-2 ring-brand-500' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">{job.customerName}</h3>
                        <p className="text-sm text-slate-500 mt-1">ID: {job.id}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${STATUS_COLORS.pending.badge}`}>
                        {STATUS_COLORS.pending.label}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div>
                        <p className="text-xs text-slate-600 mb-1">Service</p>
                        <p className="font-semibold text-slate-900">{job.service}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-600 mb-1">Date</p>
                        <p className="font-semibold text-slate-900">{job.date}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-600 mb-1">Time</p>
                        <p className="font-semibold text-slate-900">{job.time}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-600 mb-1">Price</p>
                        <p className="font-mono font-bold text-brand-600 text-lg">£{job.price}</p>
                      </div>
                    </div>

                    <div className="mb-6 pb-6 border-b border-slate-200">
                      <p className="text-sm text-slate-600 mb-2">Address</p>
                      <p className="font-medium text-slate-900">{job.address}</p>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        onClick={() => handleAcceptJob(job.id)}
                        className="flex-1"
                      >
                        Accept Job
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setSelectedJob(selectedJob === job.id ? null : job.id)}
                      >
                        Details
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Accepted Jobs */}
          {acceptedJobs.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">✓ Accepted</h2>
              <div className="grid gap-6">
                {acceptedJobs.map(job => (
                  <Card key={job.id} className="border-l-4 border-l-green-500">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">{job.customerName}</h3>
                        <p className="text-sm text-slate-500 mt-1">ID: {job.id}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${STATUS_COLORS.accepted.badge}`}>
                        {STATUS_COLORS.accepted.label}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div>
                        <p className="text-xs text-slate-600 mb-1">Service</p>
                        <p className="font-semibold text-slate-900">{job.service}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-600 mb-1">Date</p>
                        <p className="font-semibold text-slate-900">{job.date}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-600 mb-1">Time</p>
                        <p className="font-semibold text-slate-900">{job.time}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-600 mb-1">Price</p>
                        <p className="font-mono font-bold text-brand-600 text-lg">£{job.price}</p>
                      </div>
                    </div>

                    <div className="mb-6 pb-6 border-b border-slate-200">
                      <p className="text-sm text-slate-600 mb-2">Address</p>
                      <p className="font-medium text-slate-900">{job.address}</p>
                    </div>

                    <Button
                      onClick={() => handleStartJob(job.id)}
                      className="w-full"
                    >
                      Mark In Progress
                    </Button>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* In Progress Jobs */}
          {inProgressJobs.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">🔄 In Progress</h2>
              <div className="grid gap-6">
                {inProgressJobs.map(job => (
                  <Card key={job.id} className="border-l-4 border-l-blue-500">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">{job.customerName}</h3>
                        <p className="text-sm text-slate-500 mt-1">ID: {job.id}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${STATUS_COLORS['in-progress'].badge}`}>
                        {STATUS_COLORS['in-progress'].label}
                      </span>
                    </div>

                    <div className="mb-6 pb-6 border-b border-slate-200">
                      <p className="text-sm text-slate-600 mb-2">Address</p>
                      <p className="font-medium text-slate-900">{job.address}</p>
                    </div>

                    <Button
                      onClick={() => handleCompleteJob(job.id)}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      Mark Completed
                    </Button>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Completed Jobs */}
          {completedJobs.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">✓ Completed</h2>
              <div className="grid gap-6">
                {completedJobs.map(job => (
                  <Card key={job.id} className="border-l-4 border-l-slate-400 opacity-75">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">{job.customerName}</h3>
                        <p className="text-sm text-slate-500 mt-1">Date: {job.date}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${STATUS_COLORS.completed.badge}`}>
                        {STATUS_COLORS.completed.label}
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* No Jobs */}
          {jobs.length === 0 && (
            <div className="text-center py-16">
              <p className="text-2xl font-bold text-slate-900 mb-2">No jobs yet</p>
              <p className="text-slate-600">Check back soon for assigned cleaning jobs!</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
