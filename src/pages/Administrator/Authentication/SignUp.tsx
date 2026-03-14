import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LogoDark from '../../../images/logo/csd_logo_lightmode.svg';
import Logo from '../../../images/logo/csd_logo_darkmode.svg';
import { useAlert } from '../../../components/Alert/AlertContext';
import API_BASE_URL from '../../../config/api';

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [idPicture, setIdPicture] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    const formData = new FormData();
    formData.append('first_name', firstName);
    formData.append('last_name', lastName);
    formData.append('email', email);
    formData.append('contact_number', contactNumber);
    if (idPicture) formData.append('image', idPicture);

    try {
      const res = await fetch(`${API_BASE_URL}/users/register`, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.errors) {
          // Cast errors to a known type
          const errors = data.errors as Record<string, string[]>;

          Object.values(errors).forEach((fieldErrors) => {
            fieldErrors.forEach((message) => showAlert('error', message));
          });
        } else {
          showAlert('error', data.message || 'Registration failed');
        }
        setLoading(false);
        return;
      }

      showAlert('success', 'Registration successful!');
      navigate('/admin/signin');
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
        <img src={LogoDark} alt="Logo" className="mx-auto h-20 w-auto" />
      </div>

      {/* Form Container */}
      <div className="w-full max-w-full xl:max-w-6xl rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex flex-wrap items-center">
          {/* LEFT SIDE - Illustration / Logo (Desktop Only) */}
          <div className="hidden w-full xl:block xl:w-1/2">
            <div className="py-16 px-12 text-center">
              <Link className="mb-5.5 inline-block" to="/admin/signin">
                <img
                  className="hidden dark:block mx-auto"
                  src={Logo}
                  alt="Logo"
                />
                <img
                  className="dark:hidden mx-auto"
                  src={LogoDark}
                  alt="Logo"
                />
              </Link>
            </div>
          </div>

          {/* RIGHT SIDE - Sign Up Form */}
          <div className="w-full xl:w-1/2 xl:border-l-2 border-stroke dark:border-strokedark">
            <div className="w-full p-4 sm:p-8 md:p-12 xl:p-16">
              <h2 className="mb-6 text-2xl sm:text-3xl font-bold text-black dark:text-white text-center">
                Register
              </h2>

              <form onSubmit={handleSubmit}>
                {/* First + Last Name */}
                <div className="mb-4 flex gap-4 flex-wrap">
                  <div className="flex-1 min-w-[120px]">
                    <label className="mb-2.5 block font-medium text-black dark:text-white">
                      First Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your first name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full rounded-lg border border-stroke bg-transparent py-3 px-4 text-black outline-none text-sm sm:text-base focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>

                  <div className="flex-1 min-w-[120px]">
                    <label className="mb-2.5 block font-medium text-black dark:text-white">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Enter your last name"
                      className="w-full rounded-lg border border-stroke bg-transparent py-3 px-4 text-black outline-none text-sm sm:text-base focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div className="mb-4">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border border-stroke bg-transparent py-3 px-4 text-black outline-none text-sm sm:text-base focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>

                {/* Contact Number */}
                <div className="mb-4">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Contact Number
                  </label>
                  <input
                    type="text"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    placeholder="Enter your contact number"
                    className="w-full rounded-lg border border-stroke bg-transparent py-3 px-4 text-black outline-none text-sm sm:text-base focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>

                {/* ID Picture */}
                <div className="mb-4">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    ID Picture
                  </label>

                  <div>
                    <input
                      type="file"
                      onChange={(e) => {
                        if (e.target.files) setIdPicture(e.target.files[0]);
                      }}
                      className="w-full rounded-md border border-stroke p-3 outline-none transition file:mr-4 file:rounded file:border-[0.5px] text-sm sm:text-base file:border-stroke file:bg-[#EEEEEE] file:py-1 file:px-2.5 file:text-sm focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-strokedark dark:file:bg-white/30 dark:file:text-white"
                    />
                  </div>
                </div>

                {/* Register Button */}
                <div className="mb-5">
                  <input
                    type="submit"
                    value={loading ? 'Registering...' : 'Register'}
                    disabled={loading}
                    className="w-full cursor-pointer rounded-lg border border-[#071c4f] bg-[#071c4f] py-3 px-4 text-white text-sm sm:text-base transition hover:bg-opacity-90"
                  />
                </div>

                {/* Forgot Password */}
                <div className="mb-4 text-right">
                  <Link
                    to="/admin/forget-password"
                    className="text-[#071c4f] font-medium text-sm sm:text-base hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>

                {/* Sign In Link */}
                <div className="mt-6 text-center">
                  <p className="text-sm sm:text-base">
                    Already have an account?{' '}
                    <Link
                      to="/admin/signin"
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

export default SignUp;
