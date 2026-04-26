import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { authAPI } from '../../api/authApi';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) { toast.error('Email is required'); return; }
    try {
      setLoading(true);
      await authAPI.requestPasswordResetOtp({ email: email.trim().toLowerCase() });
      toast.success('OTP sent to your email');
      navigate('/verify-otp', { state: { purpose: 'reset', email: email.trim().toLowerCase() } });
    } catch (error) {
      toast.error(error.response?.data?.error || error.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-7 border border-gray-100">
        <h1 className="text-2xl font-bold text-primary mb-2 font-heading">Forgot Password</h1>
        <p className="text-sm text-gray-500 mb-6">Enter your email and we will send an OTP.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
            <input
              id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
            />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-accent hover:bg-accent-dark text-secondary font-semibold py-2.5 rounded-lg disabled:opacity-60 transition-colors text-sm">
            {loading ? 'Sending OTP...' : 'Send OTP'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <Link to="/login" className="text-sm text-secondary hover:text-primary transition-colors">Back to Login</Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
