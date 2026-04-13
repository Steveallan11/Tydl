import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { StepIndicator } from '../../components/booking/StepIndicator';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { useBooking } from '../../context/BookingContext';
import { FREQUENCIES } from '../../lib/constants';
import { Frequency } from '../../types/booking';
import { validateDate, validateTime } from '../../lib/validation';

const frequencyIcons: Record<Frequency, string> = {
  once: '⚡',
  weekly: '📅',
  biweekly: '📅',
  monthly: '📅',
};

export function FrequencyScheduling() {
  const navigate = useNavigate();
  const { formData, updateFormData } = useBooking();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleFrequencyChange = (frequency: Frequency) => {
    updateFormData({ frequency });
    if (errors.frequency) {
      setErrors({ ...errors, frequency: '' });
    }
  };

  const handleNext = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.frequency) {
      newErrors.frequency = 'Please select a frequency';
    }
    if (!formData.scheduledDate) {
      newErrors.scheduledDate = 'Date is required';
    } else if (!validateDate(formData.scheduledDate)) {
      newErrors.scheduledDate = 'Please select today or a future date';
    }
    if (!formData.scheduledTime) {
      newErrors.scheduledTime = 'Time is required';
    } else if (!validateTime(formData.scheduledTime)) {
      newErrors.scheduledTime = 'Please select a valid time';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    navigate('/book/addons');
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <StepIndicator currentStep={5} totalSteps={9} />

      <Card>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">When do you need cleaning?</h1>
        <p className="text-slate-600 mb-6">Pick a frequency and your first date.</p>

        <div className="space-y-6">
          {/* Frequency */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">
              How often?
            </label>
            <div className="space-y-3">
              {Object.entries(FREQUENCIES).map(([key, label]) => (
                <label
                  key={key}
                  className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    formData.frequency === key
                      ? 'border-brand-500 bg-brand-50'
                      : 'border-slate-200 hover:border-brand-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="frequency"
                    value={key}
                    checked={formData.frequency === key}
                    onChange={() => handleFrequencyChange(key as Frequency)}
                    className="w-5 h-5 text-brand-600 accent-brand-600"
                  />
                  <span className="text-lg">{frequencyIcons[key as Frequency]}</span>
                  <span className="font-medium text-slate-700">{label}</span>
                </label>
              ))}
            </div>
            {errors.frequency && <p className="text-sm text-red-600 mt-2">{errors.frequency}</p>}
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">
              First clean date
            </label>
            <input
              type="date"
              min={new Date().toISOString().split('T')[0]}
              value={formData.scheduledDate || ''}
              onChange={(e) => updateFormData({ scheduledDate: e.target.value })}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent outline-none ${
                errors.scheduledDate ? 'border-red-500 bg-red-50' : 'border-slate-300'
              }`}
            />
            {errors.scheduledDate && <p className="text-sm text-red-600 mt-2">{errors.scheduledDate}</p>}
          </div>

          {/* Time */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">
              Preferred time
            </label>
            <input
              type="time"
              value={formData.scheduledTime || ''}
              onChange={(e) => updateFormData({ scheduledTime: e.target.value })}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent outline-none ${
                errors.scheduledTime ? 'border-red-500 bg-red-50' : 'border-slate-300'
              }`}
            />
            {errors.scheduledTime && <p className="text-sm text-red-600 mt-2">{errors.scheduledTime}</p>}
            <p className="text-xs text-slate-500 mt-2">We'll confirm the exact time with your cleaner.</p>
          </div>
        </div>

        <div className="flex gap-4 justify-between pt-6">
          <Button variant="outline" onClick={() => navigate('/book/supplies')}>
            ← Back
          </Button>
          <Button onClick={handleNext}>
            Next →
          </Button>
        </div>
      </Card>
    </div>
  );
}
