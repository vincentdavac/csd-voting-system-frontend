import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LogoDark from '../../../images/logo/mobile-view-light.svg';
import Logo from '../../../images/logo/mobile-view-dark.svg';
import { useAuth } from '../../../context/AuthContext';
import API_BASE_URL from '../../../config/api';
import { useAlert } from '../../../components/Alert/AlertContext';
import { Mail, LockIcon, ArrowRight } from 'lucide-react';

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
      const res = await fetch(`${API_BASE_URL}/clients/login`, {
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
        is_activated:
          data.data.is_activated ??
          data.data.client?.attributes?.is_activated ??
          false,
        user: {
          id: data.data.client.id,
          ...data.data.client.attributes,
        },
      });

      // Show success alert
      showAlert('success', 'Login successful!');

      // Redirect to client dashboard
      navigate('/client/dashboard');
    } catch (err: any) {
      console.error(err);
      showAlert('error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8fafc] dark:bg-[#010717] p-4 sm:p-6 transition-colors duration-500">
      {/* Mobile Logo Container - Improved scale and vertical rhythm */}
      <div className="block xl:hidden mb-6 text-center animate-in fade-in zoom-in duration-700">
        <img
          src={LogoDark}
          alt="Logo"
          className="mx-auto h-40 sm:h-16 w-auto drop-shadow-[0_0_15px_rgba(7,28,79,0.2)]"
        />
      </div>

      {/* Main Container - Added Glassmorphism and specialized borders */}
      <div className="w-full max-w-lg xl:max-w-5xl overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white/80 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:border-white/10 dark:bg-[#020d26]/80 flex flex-col xl:flex-row">
        {/* LEFT SIDE: Brand & Aesthetic */}
        <div className="hidden xl:flex w-1/2 flex-col justify-center items-center p-12 bg-gradient-to-br from-[#071c4f] via-[#041130] to-[#020d26] relative overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 h-80 w-80 rounded-full bg-blue-600/20 blur-[100px] animate-pulse" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-80 w-80 rounded-full bg-indigo-600/20 blur-[100px]" />
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

          <Link
            to="/"
            className="relative z-10 transition-all hover:scale-105 active:scale-95 duration-500"
          >
            <img
              className="hidden dark:block mx-auto max-w-xs drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
              src={LogoDark}
              alt="Logo"
            />
            <img
              className="dark:hidden mx-auto max-w-xs drop-shadow-2xl"
              src={Logo}
              alt="Logo"
            />
          </Link>

          <div className="mt-10 text-center relative z-10">
            <h2 className="text-white text-3xl font-black italic tracking-[0.2em] uppercase leading-none">
              Client Portal
            </h2>
            <div className="h-1 w-12 bg-blue-500 mx-auto mt-4 rounded-full" />
            <p className="text-blue-200/50 mt-4 text-[10px] font-bold tracking-[0.4em] uppercase">
              CSD Voting System 2026
            </p>
          </div>
        </div>

        {/* RIGHT SIDE: Sign In Form */}
        <div className="w-full xl:w-1/2">
          <div className="w-full p-8 py-12 sm:p-14 xl:p-20">
            <div className="mb-10 text-center xl:text-left">
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white italic tracking-tight leading-none">
                Welcome Back
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-3 font-medium">
                Initialize session to access the CSD event.
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Email Field */}
              <div className="space-y-2">
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 ml-1">
                  Email
                </label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                    <Mail size={18} strokeWidth={2.5} />
                  </span>
                  <input
                    type="email"
                    placeholder="name@it-activity.com"
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50/50 py-4 pl-12 pr-6 text-sm font-bold outline-none transition-all focus:border-blue-600 focus:bg-white dark:border-white/5 dark:bg-white/5 dark:text-white dark:focus:border-blue-500 dark:focus:bg-transparent shadow-inner"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 ml-1">
                  Password
                </label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                    <LockIcon size={18} strokeWidth={2.5} />
                  </span>
                  <input
                    type="password"
                    placeholder="••••••••"
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50/50 py-4 pl-12 pr-6 text-sm font-bold outline-none transition-all focus:border-blue-600 focus:bg-white dark:border-white/5 dark:bg-white/5 dark:text-white dark:focus:border-blue-500 dark:focus:bg-transparent shadow-inner"
                  />
                </div>
              </div>

              {/* Forgot Password */}
              <div className="flex justify-end pr-1">
                <Link
                  to="/client/forget-password"
                  className="text-[10px] font-black text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-white transition-all uppercase tracking-widest"
                >
                  Forget Passoword?
                </Link>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-4 mt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="group w-full flex items-center justify-center gap-3 rounded-2xl bg-[#071c4f] py-4.5 text-white font-black uppercase text-xs sm:text-sm tracking-[0.2em] transition-all hover:bg-blue-700 hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] active:scale-[0.95] disabled:opacity-50"
                >
                  {loading ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <>
                      <span>Login Account</span>
                      <ArrowRight
                        size={18}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </>
                  )}
                </button>

                <Link
                  to="/client/signup"
                  className="w-full flex items-center justify-center rounded-2xl border-2 border-slate-200 dark:border-white/10 py-4 text-slate-900 dark:text-white font-black uppercase text-xs sm:text-sm tracking-[0.2em] transition-all hover:bg-slate-50 dark:hover:bg-white/5 active:scale-[0.95]"
                >
                  Create New Account
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-10 flex flex-col items-center gap-2">
        <div className="h-[1px] w-8 bg-slate-300 dark:bg-slate-800" />
        <div className="text-[9px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.6em]">
          System Terminal v2.0.4 • 2026
        </div>
      </div>
    </div>
  );
};

export default SignIn;
