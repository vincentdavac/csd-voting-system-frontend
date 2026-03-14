import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LogoDark from '../../../images/logo/csd_logo_lightmode.svg';
import Logo from '../../../images/logo/csd_logo_darkmode.svg';
import { useAuth } from '../../../context/AuthContext';
import API_BASE_URL from '../../../config/api';
import { useAlert } from '../../../components/Alert/AlertContext';

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
        user: data.data.user.attributes,
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
    <div className="min-h-screen flex flex-col xl:flex-row items-center justify-center bg-gray-2 dark:bg-boxdark-2 p-4">
      {/* Mobile Centered Logo */}
      <div className="block xl:hidden mb-6 text-center">
        <img src={LogoDark} alt="Logo" className="mx-auto h-20 w-auto" />
      </div>

      {/* Container */}
      <div className="w-full max-w-full xl:max-w-6xl rounded-lg border border-stroke bg-white shadow-lg dark:border-strokedark dark:bg-boxdark">
        <div className="flex flex-wrap items-center">
          {/* LEFT SIDE - Illustration / Logo (Desktop Only) */}
          <div className="hidden xl:flex w-1/2 justify-center items-center p-12">
            <Link className="mb-5 inline-block" to="/admin/signin">
              <img
                className="hidden dark:block mx-auto max-w-xs"
                src={Logo}
                alt="Logo"
              />
              <img
                className="dark:hidden mx-auto max-w-xs"
                src={LogoDark}
                alt="Logo"
              />
            </Link>
          </div>

          {/* RIGHT SIDE - Sign In Form */}
          <div className="w-full xl:w-1/2 xl:border-l-2 border-stroke dark:border-strokedark">
            <div className="w-full p-6 sm:p-10 xl:p-16">
              <h2 className="mb-8 text-2xl sm:text-3xl font-bold text-black dark:text-white text-center">
                Sign In
              </h2>

              <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
                {/* Email Field */}
                <div>
                  <label className="mb-1 block text-sm sm:text-base font-medium text-black dark:text-white">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border border-stroke bg-transparent py-3 px-4 sm:py-4 sm:px-6 text-black text-sm sm:text-base outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>

                {/* Password Field */}
                <div>
                  <label className="mb-1 block text-sm sm:text-base font-medium text-black dark:text-white">
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-lg border border-stroke bg-transparent py-3 px-4 sm:py-4 sm:px-6 text-black text-sm sm:text-base outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>

                {/* Sign In Button */}
                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full cursor-pointer rounded-lg border border-[#071c4f] bg-[#071c4f] py-3 sm:py-4 text-white text-sm sm:text-base transition hover:bg-opacity-90 disabled:opacity-50"
                  >
                    {loading ? 'Signing In...' : 'Sign In'}
                  </button>
                </div>

                {/* Forgot Password */}
                <div className="text-right">
                  <Link
                    to="/admin/forget-password"
                    className="text-[#071c4f] text-sm sm:text-base font-medium hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>

                {/* Sign Up Link */}
                <div className="text-center mt-4 sm:mt-6">
                  <p className="text-sm sm:text-base">
                    Don’t have an account?{' '}
                    <Link
                      to="/admin/signup"
                      className="text-[#071c4f] font-medium hover:underline"
                    >
                      Sign Up
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
