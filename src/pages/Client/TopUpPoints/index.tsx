import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import API_BASE_URL from '../../../config/api';
import VotingLoader from '../../../common/Loader/VotingLoader'; // Import VotingLoader
import { ArrowLeft } from 'lucide-react';
const TopUpPoints = () => {
  const { authUser } = useAuth();
  const [studentData, setStudentData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchClientProfile = async () => {
      if (!authUser?.token) return;

      setIsLoading(true); // Start loading
      try {
        const res = await fetch(`${API_BASE_URL}/clients/me`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authUser.token}`,
            Accept: 'application/json',
          },
        });

        if (res.ok) {
          const json = await res.json();
          const clientObj =
            json.data?.client?.attributes || json.data?.client || null;
          setStudentData(clientObj);
        }
      } catch (error) {
        console.error('Failed to fetch client profile', error);
      } finally {
        setIsLoading(false); // Stop loading
      }
    };

    fetchClientProfile();
  }, [authUser]);

  if (isLoading) {
    return (
      <VotingLoader
        title="Loading QR Code"
        description="Fetching your student data..."
      />
    );
  }

  if (!studentData) {
    return (
      <div className="min-h-screen dark:bg-gray-900 flex items-center justify-center py-6">
        <p className="text-xl text-red-500 font-semibold">
          Unable to load student data. Please log in again.
        </p>
      </div>
    );
  }

  // Map backend data to display variables
  const fullName = `${studentData.first_name || ''} ${
    studentData.last_name || ''
  }`.trim();
  const program = studentData.program?.name || 'External Guest';
  const yearLevel = studentData.year_level
    ? `${studentData.year_level} Year`
    : '';
  const studentNo = studentData.student_id || 'N/A';
  const email = studentData.email || 'N/A';
  const contactNumber = studentData.contact_number || 'N/A';
  const qrCodeString = studentData.qr_string || 'N/A';

  let qrCodeImage = studentData.qr_image || studentData.qr_image_path || '';
  if (qrCodeImage && !qrCodeImage.startsWith('http')) {
    qrCodeImage = `${API_BASE_URL}/storage/${qrCodeImage}`;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center relative transition-colors duration-300">
      {/* Top Left Button for Mobile */}
      <div className="absolute top-4 left-4 sm:hidden">
        <button
          onClick={() => window.history.back()}
          className="p-2.5 rounded-full bg-white dark:bg-gray-800 shadow-lg text-gray-600 dark:text-gray-300 active:scale-95 transition-all border border-gray-100 dark:border-gray-700"
        >
          <ArrowLeft size={20} />
        </button>
      </div>

      {/* Header */}
      <div className="w-full max-w-4xl px-6 mt-12 md:mt-16 text-center">
        <h1 className="text-2xl sm:text-3xl font-black text-[#071c4f] dark:text-blue-400 mb-2 tracking-tight">
          Top Up Points
        </h1>
        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
          Present this QR code to the student staff to top up your points.
        </p>
      </div>

      {/* Student QR Card */}
      <div className="w-full max-w-md px-4 mt-8">
        {/* Container with refined shadow and border */}
        <div className="bg-white dark:bg-gray-800 rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] p-8 flex flex-col items-center border border-gray-50 dark:border-gray-700 transition-all hover:translate-y-[-4px]">
          {/* QR Code Container */}
          <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-3xl mb-4 ring-1 ring-gray-100 dark:ring-gray-700 shadow-inner">
            {qrCodeImage ? (
              <img
                src={qrCodeImage}
                alt="Your QR Code"
                className="h-56 w-56 md:h-64 md:w-64 rounded-xl bg-white object-contain mix-blend-multiply dark:mix-blend-normal"
              />
            ) : (
              <div className="h-56 w-56 md:h-64 md:w-64 rounded-xl bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-medium text-gray-400 text-center px-8 uppercase tracking-widest">
                QR Code Not Available
              </div>
            )}
          </div>

          {/* QR Code String */}
          <h1 className="text-xs sm:text-sm font-mono font-bold tracking-[0.3em] text-gray-400 dark:text-gray-500 mb-8 uppercase">
            {qrCodeString || '--- --- ---'}
          </h1>

          {/* Student Info */}
          <h3 className="font-black text-xl sm:text-2xl text-[#071c4f] dark:text-white text-center mb-1">
            {fullName}
          </h3>

          <div className="space-y-0.5 mb-6 text-center">
            <p className="text-sm sm:text-base font-bold text-green-600 dark:text-green-400 tracking-wide">
              {studentNo}
            </p>
            <p className="text-sm sm:text-base font-medium text-gray-600 dark:text-gray-300">
              {program} {yearLevel ? `• Year ${yearLevel}` : ''}
            </p>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              {email}
            </p>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              {contactNumber}
            </p>
          </div>

          {/* Thank You Message */}
          <div className="w-full pt-6 border-t border-gray-100 dark:border-gray-700">
            <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.15em] text-gray-400 dark:text-gray-500 text-center">
              Thank you for topping up!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopUpPoints;
