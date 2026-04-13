import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';

export function AdminLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const success = await login(email, password);

    if (success) {
      navigate('/admin/dashboard');
    } else {
      setError('Invalid email or password');
      setPassword('');
    }

    setIsLoading(false);
  };

  return (
    <main className="bg-gradient-to-br from-brand-600 via-brand-500 to-blue-600 min-h-screen flex items-center justify-center px-6">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-brand-600 rounded-lg flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">
            T
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Tydl Admin</h1>
          <p className="text-slate-600">Sign in to manage bookings</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent outline-none"
              placeholder="admin@tydl.com"
              autoFocus
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent outline-none"
              placeholder="••••••••"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        {/* Test Credentials */}
        <div className="mt-8 pt-6 border-t border-slate-200">
          <p className="text-xs text-slate-600 font-semibold mb-3">Test Credentials (MVP)</p>
          <div className="space-y-2 text-xs">
            <div className="bg-slate-50 rounded p-3 font-mono">
              <p className="text-slate-700">
                <span className="text-slate-500">Email:</span> admin@tydl.com
              </p>
              <p className="text-slate-700">
                <span className="text-slate-500">Password:</span> tydl2026
              </p>
            </div>
            <div className="bg-slate-50 rounded p-3 font-mono">
              <p className="text-slate-700">
                <span className="text-slate-500">Email:</span> support@tydl.com
              </p>
              <p className="text-slate-700">
                <span className="text-slate-500">Password:</span> support123
              </p>
            </div>
          </div>
        </div>
      </Card>
    </main>
  );
}
