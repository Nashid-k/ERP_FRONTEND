import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../../services/authService';
import { useToast } from '../../context/ToastContext';
import { Mail, ArrowLeft, Send, CheckCircle2 } from 'lucide-react';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [devToken, setDevToken] = useState('');

  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await authService.forgotPassword(email.trim());
      setSubmitted(true);
      toast.success(res.message);
      if (res.devResetToken) {
        setDevToken(res.devResetToken);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error requesting password reset.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-2xl sm:text-3xl font-extrabold text-white">
          Reset Your Password
        </h2>
        <p className="mt-2 text-center text-sm text-slate-400">
          Enter your authorized email to receive a password reset link
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-2xl rounded-2xl border border-slate-100">
          {submitted ? (
            <div className="text-center py-4 space-y-4">
              <div className="inline-flex p-3 bg-emerald-100 rounded-full text-emerald-600">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Request Processed</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                If an active ERP account is associated with <strong>{email}</strong>, password reset instructions have been sent.
              </p>

              {devToken && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-left text-xs text-blue-900 space-y-1">
                  <p className="font-semibold">Developer Fast-Track Reset Link:</p>
                  <Link
                    to={`/reset-password?token=${devToken}&email=${encodeURIComponent(email)}`}
                    className="text-blue-700 underline font-mono break-all"
                  >
                    Click here to reset password directly
                  </Link>
                </div>
              )}

              <div className="pt-4">
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to Login
                </Link>
              </div>
            </div>
          ) : (
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Account Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your registered email"
                    className="block w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center items-center gap-2 py-2.5 px-4 rounded-xl shadow-md text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 transition-all disabled:opacity-60 cursor-pointer"
                >
                  {isLoading ? 'Sending...' : 'Send Reset Link'}
                  <Send className="w-4 h-4" />
                </button>
              </div>

              <div className="text-center pt-2">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-800"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
