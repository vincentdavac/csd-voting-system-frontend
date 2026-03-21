import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LogoDark from '../../../images/logo/csd_logo_lightmode.svg';
import Logo from '../../../images/logo/csd_logo_darkmode.svg';
import { useAuth } from '../../../context/AuthContext';
import API_BASE_URL from '../../../config/api';
import { useAlert } from '../../../components/Alert/AlertContext';
import { Mail, LogIn, Lock as LockIcon } from 'lucide-react';

const SignIn: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/users/login`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        const errors = data.errors
          ? (Object.values(data.errors).flat() as string[])
          : [data.message || 'Login failed'];

        errors.forEach((msg) => showAlert('error', msg));

        setLoading(false);
        return;
      }

      // Use AuthContext login to save token
      login({
        role: data.data.role,
        token: data.data.token,
        user: {
          id: data.data.user.id,
          ...data.data.user.attributes,
        },
      });

      // Show success alert
      showAlert('success', 'Login successful!');

      // Redirect to client dashboard
      navigate('/admin/dashboard');
    } catch (err: any) {
      console.error(err);
      showAlert('error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f1f5f9] dark:bg-[#020d26] p-4 sm:p-6">
      {/* Mobile Logo Container - Adjusted height for better vertical space on mobile */}
      <div className="block xl:hidden mb-6 text-center animate-fade-in">
        <img
          src={LogoDark}
          alt="Logo"
          className="mx-auto h-20 sm:h-20 w-auto drop-shadow-md"
        />
      </div>

      {/* Main Container - Controlled stacking and width */}
      <div className="w-full max-w-lg xl:max-w-5xl overflow-hidden rounded-3xl border border-stroke bg-white shadow-2xl dark:border-strokedark dark:bg-boxdark flex flex-col xl:flex-row">
        {/* LEFT SIDE: Brand & Aesthetic (Desktop Only) */}
        <div className="hidden xl:flex w-1/2 flex-col justify-center items-center p-12 bg-gradient-to-br from-[#071c4f] to-[#020d26] relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl animate-pulse" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />

          <Link
            to="/admin/signin"
            className="relative z-10 transition-transform hover:scale-105 duration-300"
          >
            <img
              className="hidden dark:block mx-auto max-w-xs drop-shadow-2xl"
              src={LogoDark}
              alt="Logo"
            />
            <img
              className="dark:hidden mx-auto max-w-xs drop-shadow-2xl"
              src={Logo}
              alt="Logo"
            />
          </Link>

          <div className="mt-8 text-center relative z-10">
            <h2 className="text-white text-2xl font-black italic tracking-widest uppercase">
              client Portal
            </h2>
            <p className="text-gray-400 mt-2 text-sm font-medium tracking-widest">
              SECURE ACCESS TERMINAL
            </p>
          </div>
        </div>

        {/* RIGHT SIDE: Sign In Form - Responsive Padding */}
        <div className="w-full xl:w-1/2 bg-white dark:bg-boxdark">
          <div className="w-full p-6 py-10 sm:p-12 xl:p-20">
            <div className="mb-8 sm:mb-10 text-center xl:text-left">
              <h2 className="text-2xl sm:text-3xl font-black text-black dark:text-white italic tracking-tight">
                Welcome Back
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm mt-2 font-medium">
                Enter your credentials to participate in the event.
              </p>
            </div>

            <form className="space-y-5 sm:space-y-6" onSubmit={handleSubmit}>
              {/* Email Field */}
              <div className="group">
                <label className="mb-2 block text-[10px] sm:text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 group-focus-within:text-primary transition-colors">
                  Email
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <Mail size={18} />
                  </span>
                  <input
                    type="email"
                    placeholder="name@it-activity.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-stroke bg-gray-50 py-3.5 sm:py-4 pl-12 pr-6 text-sm sm:text-base text-black outline-none transition-all focus:border-primary focus:bg-white dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary shadow-sm"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="group">
                <label className="mb-2 block text-[10px] sm:text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 group-focus-within:text-primary transition-colors">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <LockIcon size={18} />
                  </span>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-stroke bg-gray-50 py-3.5 sm:py-4 pl-12 pr-6 text-sm sm:text-base text-black outline-none transition-all focus:border-primary focus:bg-white dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary shadow-sm"
                  />
                </div>
              </div>

              {/* Forgot Password Link */}
              <div className="flex justify-end">
                <Link
                  to="/admin/forget-password"
                  className="text-[10px] sm:text-xs font-bold text-primary hover:text-[#071c4f] dark:hover:text-white transition-colors underline-offset-4 hover:underline uppercase tracking-wider"
                >
                  Reset Password?
                </Link>
              </div>

              {/* Sign In Button - Optimized for Mobile Taps */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 rounded-xl bg-[#071c4f] py-3.5 sm:py-4 px-6 text-white font-black uppercase text-xs sm:text-sm tracking-widest transition-all hover:bg-[#0a276e] active:scale-[0.97] disabled:opacity-50 shadow-lg shadow-primary/20"
              >
                {loading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    <LogIn size={18} className="sm:size-5" />
                    <span>Login Account</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Footer Version Tag - Shrunk slightly for mobile */}
      <div className="mt-8 text-[8px] sm:text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] sm:tracking-[0.5em] text-center">
        ITECHTIVITY 2026 • Secure Terminal
      </div>
    </div>
  );
};

export default SignIn;
