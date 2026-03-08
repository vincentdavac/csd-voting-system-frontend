import React from 'react';
import { Link } from 'react-router-dom';
import LogoDark from '../../../images/logo/csd_logo_lightmode.svg';
import Logo from '../../../images/logo/csd_logo_darkmode.svg';
import SelectProgram from './SelectProgram';
import YearLevel from './YearLevel';

const SignUp: React.FC = () => {
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

              <form>
                {/* Program + Student ID */}
                <div className="mb-4 flex gap-4 flex-wrap">
                  <div className="flex-1 min-w-[120px]">
                    <label className="mb-2.5 block font-medium text-black dark:text-white">
                      Program
                    </label>
                    <SelectProgram />
                  </div>

                  <div className="flex-1 min-w-[120px]">
                    <label className="mb-2.5 block font-medium text-black dark:text-white">
                      Year Level
                    </label>
                    <YearLevel />
                  </div>
                </div>

                <div className="mb-4 flex gap-4 flex-wrap">
                  <div className="flex-1 min-w-[120px]">
                    <label className="mb-2.5 block font-medium text-black dark:text-white">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="w-full rounded-lg border border-stroke bg-transparent py-3 px-4 text-black outline-none text-sm sm:text-base focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>
                  <div className="flex-1 min-w-[120px]">
                    <label className="mb-2.5 block font-medium text-black dark:text-white">
                      Student Number
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your student number"
                      className="w-full rounded-lg border border-stroke bg-transparent py-3 px-4 text-black outline-none text-sm sm:text-base focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>
                </div>

                {/* First + Last Name */}
                <div className="mb-4 flex gap-4 flex-wrap">
                  <div className="flex-1 min-w-[120px]">
                    <label className="mb-2.5 block font-medium text-black dark:text-white">
                      First Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your first name"
                      className="w-full rounded-lg border border-stroke bg-transparent py-3 px-4 text-black outline-none text-sm sm:text-base focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>

                  <div className="flex-1 min-w-[120px]">
                    <label className="mb-2.5 block font-medium text-black dark:text-white">
                      Last Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your last name"
                      className="w-full rounded-lg border border-stroke bg-transparent py-3 px-4 text-black outline-none text-sm sm:text-base focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>
                </div>

                {/* Contact Number */}
                <div className="mb-4">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Contact Number
                  </label>
                  <input
                    type="text"
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
                      className="w-full rounded-md border border-stroke p-3 outline-none transition file:mr-4 file:rounded file:border-[0.5px] text-sm sm:text-base file:border-stroke file:bg-[#EEEEEE] file:py-1 file:px-2.5 file:text-sm focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-strokedark dark:file:bg-white/30 dark:file:text-white"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="mb-4">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="Enter your password"
                    className="w-full rounded-lg border border-stroke bg-transparent py-3 px-4 text-black outline-none text-sm sm:text-base focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>

                {/* Confirm Password */}
                <div className="mb-6">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    placeholder="Confirm your password"
                    className="w-full rounded-lg border border-stroke bg-transparent py-3 px-4 text-black outline-none text-sm sm:text-base focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>

                {/* Register Button */}
                <div className="mb-5">
                  <input
                    type="submit"
                    value="Register"
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
