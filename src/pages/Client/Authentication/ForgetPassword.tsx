import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LogoDark from '../../../images/logo/mobile-view-light.svg';
import Logo from '../../../images/logo/mobile-view-dark.svg';
import { useAlert } from '../../../components/Alert/AlertContext';
import API_BASE_URL from '../../../config/api';

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
    <div className="min-h-screen flex flex-col xl:flex-row items-center justify-center bg-gray-2 dark:bg-boxdark-2 p-4">
      {/* Mobile Centered Logo */}
      <div className="block xl:hidden mb-6 text-center">
        <img src={LogoDark} alt="Logo" className="mx-auto h-50 w-auto" />
      </div>

      {/* Container */}
      <div className="w-full max-w-full xl:max-w-6xl rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex flex-wrap items-center">
          {/* LEFT SIDE - Illustration / Logo (Desktop Only) */}
          <div className="hidden xl:flex w-1/2 justify-center items-center p-12">
            <Link className="mb-5 inline-block" to="/client/signin">
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

          {/* RIGHT SIDE - Forget Password Form */}
          <div className="w-full xl:w-1/2 xl:border-l-2 border-stroke dark:border-strokedark">
            <div className="w-full p-6 sm:p-10 xl:p-16">
              <h2 className="mb-8 text-2xl sm:text-3xl font-bold text-black dark:text-white text-center">
                Forgot Password
              </h2>

              <p className="mb-6 text-sm sm:text-base text-center text-gray-600 dark:text-gray-300">
                Enter your email address and we'll send you a link to reset your
                password.
              </p>

              <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
                {/* Email Field */}
                <div>
                  <label className="mb-1 block text-sm sm:text-base font-medium text-black dark:text-white">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border border-stroke bg-transparent py-3 px-4 sm:py-4 sm:px-6 text-black text-sm sm:text-base outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>

                {/* Reset Password Button */}
                <div>
                  <input
                    type="submit"
                    value={loading ? 'Sending...' : 'Send Reset Link'}
                    disabled={loading}
                    className="w-full cursor-pointer rounded-lg border border-[#071c4f] bg-[#071c4f] py-3 sm:py-4 text-white text-sm sm:text-base transition hover:bg-opacity-90"
                  />
                </div>

                {/* Back to Sign In */}
                <div className="text-center mt-4 sm:mt-6">
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                    Remember your password?{' '}
                    <Link
                      to="/client/signin"
                      className="text-[#071c4f] font-medium hover:underline"
                    >
                      Sign In
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

export default ForgetPassword;
