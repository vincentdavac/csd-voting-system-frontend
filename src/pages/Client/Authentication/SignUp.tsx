import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LogoDark from '../../../images/logo/mobile-view-light.svg';
import Logo from '../../../images/logo/mobile-view-dark.svg';
import SelectProgram from './SelectProgram';
import YearLevel from './YearLevel';
import { useAlert } from '../../../components/Alert/AlertContext';
import API_BASE_URL from '../../../config/api';

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  // Form states
  const [programId, setProgramId] = useState<string>('');
  const [yearLevel, setYearLevel] = useState<string>('');
  const [studentId, setStudentId] = useState('');
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
    formData.append('program_id', programId);
    formData.append('year_level', yearLevel);
    formData.append('student_id', studentId);
    formData.append('email', email);
    formData.append('first_name', firstName);
    formData.append('last_name', lastName);
    formData.append('contact_number', contactNumber);
    if (idPicture) formData.append('id_picture', idPicture);

    try {
      const res = await fetch(`${API_BASE_URL}/clients`, {
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
      navigate('/client/signin');
    } catch (err) {
      console.error(err);
      showAlert('error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f1f5f9] dark:bg-[#020d26] p-4 sm:p-6">
      {/* Mobile Logo Container */}
      <div className="block xl:hidden mb-6 text-center animate-fade-in">
        <img
          src={LogoDark}
          alt="Logo"
          className="mx-auto h-40 sm:h-16 w-auto drop-shadow-md"
        />
      </div>

      {/* Main Container */}
      <div className="w-full max-w-lg xl:max-w-6xl overflow-hidden rounded-3xl border border-stroke bg-white shadow-2xl dark:border-strokedark dark:bg-boxdark flex flex-col xl:flex-row">
        {/* LEFT SIDE: Brand & Aesthetic (Desktop Only) */}
        <div className="hidden xl:flex w-5/12 flex-col justify-center items-center p-12 bg-gradient-to-br from-[#071c4f] to-[#020d26] relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]" />

          <Link
            to="/client/signin"
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
              Create Account
            </h2>
            <p className="text-gray-400 mt-2 text-xs font-medium tracking-[0.2em]">
              CSD Voting System 2026
            </p>
          </div>
        </div>

        {/* RIGHT SIDE: Register Form */}
        <div className="w-full xl:w-7/12 bg-white dark:bg-boxdark">
          <div className="w-full p-6 sm:p-10 xl:p-16">
            <div className="mb-8 text-center xl:text-left">
              <h2 className="text-2xl sm:text-3xl font-black text-black dark:text-white italic tracking-tight">
                Create Account
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm mt-1 font-medium">
                Join the ITECHTIVITY 2026.
              </p>
            </div>

            <form className="space-y-4 sm:space-y-5" onSubmit={handleSubmit}>
              {/* Program + Year Level (Side by Side) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="group">
                  <label className="mb-1.5 block text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">
                    Program
                  </label>
                  <SelectProgram
                    value={programId}
                    onChange={(id: string) => setProgramId(id)}
                  />
                </div>
                <div className="group">
                  <label className="mb-1.5 block text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">
                    Year Level
                  </label>
                  <YearLevel
                    value={yearLevel}
                    onChange={(level: string) => setYearLevel(level)}
                  />
                </div>
              </div>

              {/* Email + Student ID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="group">
                  <label className="mb-1.5 block text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="name@university.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-stroke bg-gray-50 py-3 px-4 text-sm text-black outline-none transition-all focus:border-primary focus:bg-white dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
                <div className="group">
                  <label className="mb-1.5 block text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">
                    Student Number
                  </label>
                  <input
                    type="text"
                    placeholder="202X-XXXXX"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    className="w-full rounded-xl border border-stroke bg-gray-50 py-3 px-4 text-sm text-black outline-none transition-all focus:border-primary focus:bg-white dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
              </div>

              {/* First + Last Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="group">
                  <label className="mb-1.5 block text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">
                    First Name
                  </label>
                  <input
                    type="text"
                    placeholder="Juan"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full rounded-xl border border-stroke bg-gray-50 py-3 px-4 text-sm text-black outline-none transition-all focus:border-primary focus:bg-white dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
                <div className="group">
                  <label className="mb-1.5 block text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">
                    Last Name
                  </label>
                  <input
                    type="text"
                    placeholder="Dela Cruz"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full rounded-xl border border-stroke bg-gray-50 py-3 px-4 text-sm text-black outline-none transition-all focus:border-primary focus:bg-white dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
              </div>

              {/* Contact Number */}
              <div className="group">
                <label className="mb-1.5 block text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">
                  Contact Number
                </label>
                <input
                  type="text"
                  placeholder="09XXXXXXXXX"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  className="w-full rounded-xl border border-stroke bg-gray-50 py-3 px-4 text-sm text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                />
              </div>

              {/* ID Picture Upload */}
              <div className="group">
                <label className="mb-1.5 block text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">
                  Identity Verification (ID Picture)
                </label>
                <input
                  type="file"
                  onChange={(e) => {
                    if (e.target.files) setIdPicture(e.target.files[0]);
                  }}
                  className="w-full rounded-xl border border-stroke bg-gray-50 p-2 text-xs file:mr-4 file:rounded-lg file:border-0 file:bg-[#071c4f] file:py-2 file:px-4 file:text-white file:font-black file:uppercase file:text-[10px] dark:border-form-strokedark dark:bg-form-input dark:text-white"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-4 space-y-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center rounded-xl bg-[#071c4f] py-4 px-6 text-white font-black uppercase text-xs sm:text-sm tracking-widest transition-all hover:bg-[#0a276e] active:scale-[0.97] disabled:opacity-50 shadow-lg shadow-primary/20"
                >
                  {loading
                    ? 'Processing Registration...'
                    : 'Finalize Registration'}
                </button>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                  <Link
                    to="/client/signin"
                    className="text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-primary transition-colors"
                  >
                    Already Registered?{' '}
                    <span className="text-primary underline">Sign In</span>
                  </Link>
                  <Link
                    to="/client/forget-password"
                    className="text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-primary transition-colors"
                  >
                    Forgot Password?
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Footer Tag */}
      <div className="mt-8 text-[8px] sm:text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] text-center">
        ITECHTIVITY 2026 • Secure Terminal Access
      </div>
    </div>
  );
};

export default SignUp;
