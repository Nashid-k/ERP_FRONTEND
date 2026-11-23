import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Lock, CheckCircle2, AlertCircle, Eye, EyeOff, Shield, ArrowRight } from 'lucide-react';

export const AcceptInvitation = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const emailParam = searchParams.get('email') || '';

  const [email, setEmail] = useState(emailParam);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  // Validate token on mount
  useEffect(() => {
    if (!token) {
      setIsVerifying(false);
      setTokenValid(false);
      setErrorMessage('No invitation token provided. Please open the link sent to your email.');
      return;
    }

    const checkToken = async () => {
      try {
        const res = await authService.verifyEmail(token, emailParam);
        if (res.success) {
          setTokenValid(true);
          if (res.exactEmail) {
            setEmail(res.exactEmail);
          } else if (res.email && !email) {
            setEmail(res.email);
          }
          if (res.name) setName(res.name);
        } else {
          setTokenValid(false);
          setErrorMessage(res.message || 'Invitation token is invalid or expired.');
        }
      } catch (err) {
        setTokenValid(false);
        setErrorMessage(
          err.response?.data?.message || 'Invitation token has expired, is invalid, or has already been used.'
        );
      } finally {
        setIsVerifying(false);
      }
    };

    checkToken();
  }, [token, emailParam]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email || !email.trim()) {
      setErrorMessage('Please provide your authorized corporate email address.');
      return;
    }

    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await authService.acceptInvitation({
        token,
        email: email.trim(),
        password,
        confirmPassword,
        name: name.trim()
      });

      toast.success(res.message || 'Account activated successfully!');
      login(res.token, res.user);

      if (res.user.role === 'SUPER_ADMIN') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to activate account. Please contact support.';
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-blue-500/20 font-black text-2xl">
            T
          </div>
        </div>
        <h2 className="mt-4 text-center text-2xl sm:text-3xl font-extrabold text-white">
          Activate Your Talkism Account
        </h2>
        <p className="mt-2 text-center text-xs sm:text-sm text-slate-400">
          Talkism Private Limited • Employee Onboarding & Security Credentials
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-2xl rounded-2xl border border-slate-100">
          {isVerifying ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent mb-3" />
              <p className="text-sm font-medium text-slate-600">Verifying invitation credentials...</p>
            </div>
          ) : !tokenValid ? (
            <div className="text-center py-6 space-y-4">
              <div className="inline-flex p-3 bg-rose-100 rounded-full text-rose-600">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Invalid or Expired Invitation</h3>
              <p className="text-sm text-slate-600">{errorMessage}</p>
              <div className="pt-4">
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center px-4 py-2 border border-slate-300 text-sm font-semibold rounded-xl text-slate-700 bg-white hover:bg-slate-50"
                >
                  Return to Login
                </Link>
              </div>
            </div>
          ) : (
            <form className="space-y-5" onSubmit={handleSubmit}>
              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-sm text-rose-800 font-medium">
                  {errorMessage}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Authorized Corporate Email
                </label>
                <input
                  type="email"
                  required
                  disabled={Boolean(emailParam)}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your authorized corporate email"
                  className={`block w-full px-3.5 py-2.5 text-sm rounded-xl border ${
                    Boolean(emailParam)
                      ? 'border-slate-200 bg-slate-100 text-slate-600 font-medium cursor-not-allowed'
                      : 'border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 bg-white'
                  }`}
                />
                <div className="mt-1">
                  {emailParam ? (
                    <span className="text-[11px] text-emerald-600 flex items-center gap-1 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Identity bound: Email address verified by Super Admin
                    </span>
                  ) : (
                    <span className="text-[11px] text-amber-600 flex items-center gap-1 font-medium">
                      <Shield className="w-3.5 h-3.5" /> For security, please enter the corporate email address that received the invitation
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Display Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  className="block w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Create Password (min 8 chars)
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a strong password"
                    className="block w-full px-3.5 py-2.5 pr-10 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Confirm Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm password"
                  className="block w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900"
                />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center items-center gap-2 py-2.5 px-4 rounded-xl shadow-md text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 transition-all disabled:opacity-60 cursor-pointer"
                >
                  {isLoading ? 'Activating Account...' : 'Activate & Enter ERP'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
