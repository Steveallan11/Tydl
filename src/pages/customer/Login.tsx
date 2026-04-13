import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { useCustomerAuth } from '../../context/CustomerAuthContext';

export function CustomerLogin() {
  const navigate = useNavigate();
  const { login, error: authError, clearError } = useCustomerAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setIsLoading(true);

    try {
      await login(email, password);
      navigate('/customer/dashboard');
    } catch (err) {
      console.error('Login failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="bg-gradient-to-br from-brand-600 via-brand-500 to-blue-600 min-h-screen flex items-center justify-center px-6 py-12">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-brand-600 rounded-lg flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">
            T
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back</h1>
          <p className="text-slate-600">Sign in to your Tydl account</p>
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
              placeholder="you@example.com"
              required
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
              required
            />
          </div>

          {/* Error Message */}
          {authError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700 text-sm font-medium">{authError}</p>
            </div>
          )}

          {/* Submit Button */}
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        {/* Sign Up Link */}
        <div className="mt-6 pt-6 border-t border-slate-200 text-center">
          <p className="text-slate-600">
            Don't have an account?{' '}
            <Link to="/customer/signup" className="text-brand-600 font-semibold hover:text-brand-700">
              Sign up
            </Link>
          </p>
        </div>

        {/* Quick Access */}
        <div className="mt-6 pt-6 border-t border-slate-200">
          <p className="text-xs text-slate-600 font-semibold mb-3">Quick Actions</p>
          <div className="space-y-2">
            <Link to="/" className="block text-center text-sm text-brand-600 hover:text-brand-700 font-medium">
              ← Back to Home
            </Link>
            <Link to="/book/postcode" className="block text-center text-sm text-slate-600 hover:text-slate-700 font-medium">
              Book without account
            </Link>
          </div>
        </div>
      </Card>
    </main>
  );
}
