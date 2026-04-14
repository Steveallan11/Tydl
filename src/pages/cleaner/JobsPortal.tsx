import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { useCleanerAuth } from '../../context/CleanerAuthContext';
import { getCleanerJobs, updateBookingStatus } from '../../lib/supabase';

const STATUS_COLORS = {
  confirmed: { bg: 'bg-amber-50', border: 'border-amber-200', badge: 'bg-amber-100 text-amber-700', label: 'Awaiting Response' },
  assigned: { bg: 'bg-green-50', border: 'border-green-200', badge: 'bg-green-100 text-green-700', label: 'Assigned' },
  'in-progress': { bg: 'bg-blue-50', border: 'border-blue-200', badge: 'bg-blue-100 text-blue-700', label: 'In Progress' },
  completed: { bg: 'bg-slate-50', border: 'border-slate-200', badge: 'bg-slate-100 text-slate-700', label: 'Completed' },
};

export function JobsPortal() {
  const navigate = useNavigate();
  const { cleaner, logout } = useCleanerAuth();
  const [jobs, setJobs] = useState<any[]>([]);
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadJobs = async () => {
      try {
        if (!cleaner?.id) {
          setIsLoading(false);
          return;
        }
        const data = await getCleanerJobs(cleaner.id);
        setJobs(data || []);
      } catch (err: any) {
        console.error('Failed to load jobs:', err);
        setError('Failed to load jobs');
      } finally {
        setIsLoading(false);
      }
    };

    loadJobs();
  }, [cleaner?.id]);

  const handleAcceptJob = async (jobId: string) => {
    setIsSaving(true);
    try {
      await updateBookingStatus(jobId, 'assigned');
      setJobs(jobs.map(job => job.id === jobId ? { ...job, status: 'assigned' } : job));
    } catch (err: any) {
      setError('Failed to accept job');
      console.error('Error:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleStartJob = async (jobId: string) => {
    setIsSaving(true);
    try {
      await updateBookingStatus(jobId, 'in-progress');
      setJobs(jobs.map(job => job.id === jobId ? { ...job, status: 'in-progress' } : job));
    } catch (err: any) {
      setError('Failed to start job');
      console.error('Error:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCompleteJob = async (jobId: string) => {
    setIsSaving(true);
    try {
      await updateBookingStatus(jobId, 'completed');
      setJobs(jobs.map(job => job.id === jobId ? { ...job, status: 'completed' } : job));
    } catch (err: any) {
      setError('Failed to complete job');
      console.error('Error:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const assignedJobs = jobs.filter(j => j.status === 'assigned');
  const confirmedJobs = jobs.filter(j => j.status === 'confirmed');
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

        {/* Loading/Error States */}
        {isLoading && (
          <Card className="mb-12 text-center py-8">
            <p className="text-slate-600">Loading your jobs...</p>
          </Card>
        )}

        {error && (
          <Card className="mb-12 bg-red-50 border-red-200 text-red-700">
            <p className="text-sm font-medium">{error}</p>
          </Card>
        )}

        {/* Stats */}
        {!isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <p className="text-sm text-slate-600 mb-1">Confirmed Jobs</p>
              <p className="text-3xl font-bold text-amber-600">{confirmedJobs.length}</p>
            </div>
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <p className="text-sm text-slate-600 mb-1">Assigned</p>
              <p className="text-3xl font-bold text-green-600">{assignedJobs.length}</p>
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
        )}

        {/* Jobs Grid */}
        {!isLoading && (
          <div className="space-y-8">
            {/* Confirmed Jobs */}
            {confirmedJobs.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">⏳ Confirmed Jobs</h2>
                <div className="grid gap-6">
                  {confirmedJobs.map(job => (
                    <Card
                      key={job.id}
                      className={`border-l-4 border-l-amber-500 ${
                        selectedJob === job.id ? 'ring-2 ring-brand-500' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-slate-900">
                            {job.customer?.first_name} {job.customer?.last_name}
                          </h3>
                          <p className="text-sm text-slate-500 mt-1">ID: {job.id}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${STATUS_COLORS.confirmed.badge}`}>
                          {STATUS_COLORS.confirmed.label}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div>
                          <p className="text-xs text-slate-600 mb-1">Service</p>
                          <p className="font-semibold text-slate-900">{job.service_type}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-600 mb-1">Date</p>
                          <p className="font-semibold text-slate-900">{job.scheduled_date}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-600 mb-1">Time</p>
                          <p className="font-semibold text-slate-900">{job.scheduled_time}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-600 mb-1">Price</p>
                          <p className="font-mono font-bold text-brand-600 text-lg">£{job.total_price}</p>
                        </div>
                      </div>

                      <div className="mb-6 pb-6 border-b border-slate-200">
                        <p className="text-sm text-slate-600 mb-2">Address</p>
                        <p className="font-medium text-slate-900">{job.customer?.full_address}</p>
                      </div>

                      <div className="flex gap-3">
                        <Button
                          onClick={() => handleAcceptJob(job.id)}
                          disabled={isSaving}
                          className="flex-1"
                        >
                          {isSaving ? 'Accepting...' : 'Accept Job'}
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

            {/* Assigned Jobs */}
            {assignedJobs.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">✓ Assigned</h2>
                <div className="grid gap-6">
                  {assignedJobs.map(job => (
                    <Card key={job.id} className="border-l-4 border-l-green-500">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-slate-900">
                            {job.customer?.first_name} {job.customer?.last_name}
                          </h3>
                          <p className="text-sm text-slate-500 mt-1">ID: {job.id}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${STATUS_COLORS.assigned.badge}`}>
                          {STATUS_COLORS.assigned.label}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div>
                          <p className="text-xs text-slate-600 mb-1">Service</p>
                          <p className="font-semibold text-slate-900">{job.service_type}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-600 mb-1">Date</p>
                          <p className="font-semibold text-slate-900">{job.scheduled_date}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-600 mb-1">Time</p>
                          <p className="font-semibold text-slate-900">{job.scheduled_time}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-600 mb-1">Price</p>
                          <p className="font-mono font-bold text-brand-600 text-lg">£{job.total_price}</p>
                        </div>
                      </div>

                      <div className="mb-6 pb-6 border-b border-slate-200">
                        <p className="text-sm text-slate-600 mb-2">Address</p>
                        <p className="font-medium text-slate-900">{job.customer?.full_address}</p>
                      </div>

                      <Button
                        onClick={() => handleStartJob(job.id)}
                        disabled={isSaving}
                        className="w-full"
                      >
                        {isSaving ? 'Starting...' : 'Mark In Progress'}
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
                          <h3 className="text-xl font-bold text-slate-900">
                            {job.customer?.first_name} {job.customer?.last_name}
                          </h3>
                          <p className="text-sm text-slate-500 mt-1">ID: {job.id}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${STATUS_COLORS['in-progress'].badge}`}>
                          {STATUS_COLORS['in-progress'].label}
                        </span>
                      </div>

                      <div className="mb-6 pb-6 border-b border-slate-200">
                        <p className="text-sm text-slate-600 mb-2">Address</p>
                        <p className="font-medium text-slate-900">{job.customer?.full_address}</p>
                      </div>

                      <Button
                        onClick={() => handleCompleteJob(job.id)}
                        disabled={isSaving}
                        className="w-full bg-green-600 hover:bg-green-700"
                      >
                        {isSaving ? 'Completing...' : 'Mark Completed'}
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
                          <h3 className="text-xl font-bold text-slate-900">
                            {job.customer?.first_name} {job.customer?.last_name}
                          </h3>
                          <p className="text-sm text-slate-500 mt-1">Date: {job.scheduled_date}</p>
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
                <p className="text-2xl font-bold text-slate-900 mb-2">No jobs assigned yet</p>
                <p className="text-slate-600">Check back soon for assigned cleaning jobs!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
