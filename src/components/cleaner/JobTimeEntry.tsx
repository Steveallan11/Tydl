import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';

interface JobTimeEntryProps {
  jobId: string;
  customerName: string;
  address: string;
  scheduledTime: string;
  onSubmit: (data: TimeEntryData) => Promise<void>;
  onCancel: () => void;
}

export interface TimeEntryData {
  jobId: string;
  actualStartTime: string;
  actualEndTime: string;
  actualDuration: number; // in minutes
  breakDuration: number; // in minutes
  notes: string;
  images: File[];
}

export function JobTimeEntry({
  jobId,
  customerName,
  address,
  scheduledTime,
  onSubmit,
  onCancel,
}: JobTimeEntryProps) {
  const [isStarted, setIsStarted] = useState(false);
  const [startTime, setStartTime] = useState<string | null>(null);
  const [endTime, setEndTime] = useState<string | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [breakDuration, setBreakDuration] = useState(0);
  const [notes, setNotes] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleStartJob = () => {
    setStartTime(new Date().toISOString());
    setIsStarted(true);
    setError('');
  };

  const handleEndJob = () => {
    setEndTime(new Date().toISOString());
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages([...images, ...Array.from(e.target.files)]);
    }
  };

  const handleSubmit = async () => {
    if (!startTime) {
      setError('Please start the job first');
      return;
    }

    if (!endTime) {
      setError('Please end the job before submitting');
      return;
    }

    setIsSubmitting(true);
    try {
      const start = new Date(startTime);
      const end = new Date(endTime);
      const durationMinutes = Math.round((end.getTime() - start.getTime()) / 60000);
      const actualDuration = Math.max(0, durationMinutes - breakDuration);

      await onSubmit({
        jobId,
        actualStartTime: startTime,
        actualEndTime: endTime,
        actualDuration,
        breakDuration,
        notes,
        images,
      });
    } catch (err: any) {
      setError(err.message || 'Failed to submit time entry');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update elapsed time every second if job is in progress
  React.useEffect(() => {
    if (!isStarted || !startTime || endTime) return;

    const interval = setInterval(() => {
      const now = new Date();
      const start = new Date(startTime);
      const duration = Math.floor((now.getTime() - start.getTime()) / 1000 / 60);
      setElapsedTime(duration);
    }, 1000);

    return () => clearInterval(interval);
  }, [isStarted, startTime, endTime]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="mb-6 pb-6 border-b border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">{customerName}</h2>
          <p className="text-slate-600">{address}</p>
          <p className="text-sm text-slate-500 mt-2">Scheduled: {scheduledTime}</p>
        </div>

        {!isStarted ? (
          // Pre-start state
          <div className="text-center py-12">
            <div className="text-6xl mb-4">⏱️</div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Ready to start?</h3>
            <p className="text-slate-600 mb-8">
              Click below to start tracking time for this job. You can add notes and photos as you work.
            </p>
            <Button onClick={handleStartJob} className="mb-4">
              Start Job
            </Button>
            <button
              onClick={onCancel}
              className="text-slate-600 hover:text-slate-900 text-sm font-medium"
            >
              Cancel
            </button>
          </div>
        ) : endTime ? (
          // Job completed - review state
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-700 font-medium">✓ Job completed</p>
              <p className="text-sm text-green-600 mt-1">
                Actual duration: {elapsedTime} minutes (minus {breakDuration} min break = {Math.max(0, elapsedTime - breakDuration)} min worked)
              </p>
            </div>

            {/* Notes Section */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Notes & Issues Found (optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Document any issues, damage, special requests..."
                rows={4}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent outline-none"
              />
            </div>

            {/* Images Section */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Photos/Videos (optional)
              </label>
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center mb-4">
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer block">
                  <p className="text-slate-600">📸 Click to upload photos or videos</p>
                  <p className="text-xs text-slate-500">or drag and drop</p>
                </label>
              </div>

              {images.length > 0 && (
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-sm font-medium text-slate-700 mb-3">
                    {images.length} file(s) selected:
                  </p>
                  <div className="space-y-2">
                    {images.map((img, idx) => (
                      <div key={idx} className="flex items-center justify-between text-sm text-slate-600">
                        <span>📎 {img.name}</span>
                        <button
                          onClick={() => setImages(images.filter((_, i) => i !== idx))}
                          className="text-red-600 hover:text-red-700 text-xs"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Break Duration */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Break Duration (minutes)
              </label>
              <input
                type="number"
                value={breakDuration}
                onChange={(e) => setBreakDuration(parseInt(e.target.value) || 0)}
                min="0"
                max={elapsedTime}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent outline-none"
              />
              <p className="text-xs text-slate-500 mt-1">
                Actual work time: {Math.max(0, elapsedTime - breakDuration)} minutes
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-4 border-t border-slate-200">
              <Button
                variant="outline"
                onClick={onCancel}
                className="flex-1"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                className="flex-1"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : '✓ Submit Job'}
              </Button>
            </div>
          </div>
        ) : (
          // Job in progress - active timer state
          <div className="space-y-6">
            {/* Live Timer */}
            <div className="bg-gradient-to-br from-brand-50 to-blue-50 rounded-lg p-8 text-center">
              <p className="text-sm text-slate-600 mb-2">ELAPSED TIME</p>
              <div className="text-6xl font-bold text-brand-600 font-mono mb-2">
                {Math.floor(elapsedTime / 60)}:{(elapsedTime % 60).toString().padStart(2, '0')}
              </div>
              <p className="text-slate-600">{elapsedTime} minutes</p>
            </div>

            {/* Break Duration Input */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Break Duration So Far (minutes)
              </label>
              <input
                type="number"
                value={breakDuration}
                onChange={(e) => setBreakDuration(parseInt(e.target.value) || 0)}
                min="0"
                max={elapsedTime}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent outline-none"
              />
            </div>

            {/* Quick Notes */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Add Notes While Working
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any issues found? Special requests?"
                rows={3}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent outline-none"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {/* End Job Button */}
            <Button onClick={handleEndJob} className="w-full bg-green-600 hover:bg-green-700">
              ✓ Finish Job
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
