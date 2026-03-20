import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LogoDark from '../../../images/logo/mobile-view-light.svg';
import { useAlert } from '../../../components/Alert/AlertContext';
import API_BASE_URL from '../../../config/api';
import { ChevronLeft, Mail, ShieldQuestion } from 'lucide-react';

const ForgetPassword: React.FC = () => {
  const { showAlert } = useAlert();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      showAlert('error', 'Email is required.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/clients/forget-password`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Display API validation errors if present
        if (data.errors) {
          const errors = data.errors as Record<string, string[]>;
          const allMessages = Object.values(errors).flat().join('\n');
          showAlert('error', allMessages);
        } else {
          showAlert('error', data.message || 'Failed to send reset link.');
        }
      } else {
        showAlert('success', data.message || 'Reset link sent successfully!');
        setEmail(''); // clear input after success
        navigate('/client/signin');
      }
    } catch (err) {
      console.error(err);
      showAlert('error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f1f5f9] dark:bg-[#020d26] p-4 sm:p-6">
      {/* Mobile Logo Container - Scaled down for vertical efficiency */}
      <div className="block xl:hidden mb-6 text-center animate-fade-in">
        <img
          src={LogoDark}
          alt="Logo"
          className="mx-auto h-40 sm:h-16 w-auto drop-shadow-md"
        />
      </div>

      {/* Main Container */}
      <div className="w-full max-w-lg xl:max-w-5xl overflow-hidden rounded-3xl border border-stroke bg-white shadow-2xl dark:border-strokedark dark:bg-boxdark flex flex-col xl:flex-row">
        {/* LEFT SIDE: Recovery Aesthetics (Desktop Only) */}
        <div className="hidden xl:flex w-1/2 flex-col justify-center items-center p-12 bg-gradient-to-br from-[#071c4f] to-[#020d26] relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]" />
          <div className="relative z-10 text-center">
            <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white shadow-xl">
              <ShieldQuestion size={40} className="animate-pulse" />
            </div>
            <h2 className="text-white text-2xl font-black italic tracking-widest uppercase">
              Account Recovery
            </h2>
            <p className="text-gray-400 mt-4 text-sm font-medium max-w-xs leading-relaxed">
              Initiate password override protocol. Verification link will be
              dispatched to your registered email.
            </p>
          </div>
        </div>

        {/* RIGHT SIDE: Form - Adaptive Padding */}
        <div className="w-full xl:w-1/2 bg-white dark:bg-boxdark">
          <div className="w-full p-6 py-10 sm:p-12 xl:p-20">
            <div className="mb-8 sm:mb-10 text-center xl:text-left">
              <Link
                to="/client/signin"
                className="inline-flex items-center gap-2 text-[10px] sm:text-xs font-black uppercase tracking-widest text-primary hover:text-[#071c4f] dark:hover:text-white transition-colors mb-4 sm:mb-6"
              >
                <ChevronLeft size={14} />
                Back to Signin
              </Link>
              <h2 className="text-2xl sm:text-3xl font-black text-black dark:text-white italic tracking-tight">
                Forgot Password?
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm mt-2 font-medium leading-relaxed">
                Enter your email to receive a recovery password.
              </p>
            </div>

            <form className="space-y-6 sm:space-y-8" onSubmit={handleSubmit}>
              {/* Email Field */}
              <div className="group">
                <label className="mb-2 block text-[10px] sm:text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 group-focus-within:text-primary transition-colors">
                  Registered Email
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <Mail size={18} />
                  </span>
                  <input
                    type="email"
                    placeholder="student@it-activity.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-stroke bg-gray-50 py-3.5 sm:py-4 pl-12 pr-6 text-sm sm:text-base text-black outline-none transition-all focus:border-primary focus:bg-white dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary shadow-sm"
                    required
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 rounded-xl bg-[#071c4f] py-3.5 sm:py-4 px-6 text-white font-black uppercase text-xs sm:text-sm tracking-widest transition-all hover:bg-[#0a276e] active:scale-[0.97] disabled:opacity-50 shadow-lg shadow-primary/20"
                >
                  {loading ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    'Dispatch Reset Link'
                  )}
                </button>
              </div>
            </form>

            {/* Help Link - Border and spacing adjusted for mobile */}
            <div className="mt-8 sm:mt-10 text-center border-t border-stroke dark:border-strokedark pt-6 sm:pt-8">
              <p className="text-xs sm:text-sm font-medium text-gray-500">
                Still having trouble?{' '}
                <a
                  href="mailto:support@it-activity.com"
                  className="text-primary font-bold hover:underline block sm:inline mt-1 sm:mt-0"
                >
                  Contact Administrator
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Version Tag */}
      <div className="mt-8 text-[8px] sm:text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] sm:tracking-[0.5em] text-center">
        ITECHTIVITY 2026 • Security Layer
      </div>
    </div>
  );
};

export default ForgetPassword;
