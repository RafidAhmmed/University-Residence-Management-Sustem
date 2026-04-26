import { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { authAPI } from '../../api/authApi';

const VerifyOTP = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const purpose = location.state?.purpose;
  const email = location.state?.email;

  useEffect(() => {
    if (!purpose || !email) {
      toast.error('Missing OTP verification context. Please start again.');
      navigate('/login', { replace: true });
    }
  }, [purpose, email, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otp.trim()) { toast.error('OTP is required'); return; }
    try {
      setLoading(true);
      if (purpose === 'register') {
        await authAPI.verifyRegisterOtp({ email, otp: otp.trim() });
        toast.success('Registration complete. Please login.');
        navigate('/login', { replace: true });
      } else if (purpose === 'reset') {
        await authAPI.verifyPasswordResetOtp({ email, otp: otp.trim() });
        toast.success('OTP verified. Set your new password.');
        navigate('/change-password', { state: { email, otp: otp.trim() } });
      }
    } catch (error) {
      toast.error(error.response?.data?.error || error.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-7 border border-gray-100">
        <h1 className="text-2xl font-bold text-primary mb-2 font-heading">Verify OTP</h1>
        <p className="text-sm text-gray-500 mb-6">Enter the OTP sent to {email || 'your email'}.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1.5">OTP Code</label>
            <input
              id="otp" type="text" maxLength={6} value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              placeholder="6-digit OTP"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 tracking-[0.2em] text-center text-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
            />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-accent hover:bg-accent-dark text-secondary font-semibold py-2.5 rounded-lg disabled:opacity-60 transition-colors text-sm">
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <Link to="/login" className="text-sm text-secondary hover:text-primary transition-colors">Back to Login</Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;
