import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import API_BASE_URL from '../../../config/api';

const TopUpPoints = () => {
  const { authUser } = useAuth();
  const [studentData, setStudentData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchClientProfile = async () => {
      if (!authUser?.token) return;

      try {
        const res = await fetch(`${API_BASE_URL}/clients/me`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${authUser.token}`,
            'Accept': 'application/json',
          },
        });

        if (res.ok) {
          const json = await res.json();
          // Extract the client attributes depending on exactly how ClientResource is structured
          const clientObj = json.data?.client?.attributes || json.data?.client || null;
          setStudentData(clientObj);
        }
      } catch (error) {
        console.error('Failed to fetch client profile', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClientProfile();
  }, [authUser]);

  if (isLoading) {
    return (
      <div className="min-h-screen dark:bg-gray-900 flex items-center justify-center py-6">
        <p className="text-xl text-[#071c4f] dark:text-white font-semibold">Loading QR Code...</p>
      </div>
    );
  }

  if (!studentData) {
    return (
      <div className="min-h-screen dark:bg-gray-900 flex items-center justify-center py-6">
        <p className="text-xl text-red-500 font-semibold">Unable to load student data. Please log in again.</p>
      </div>
    );
  }

  // Safely map the backend data to display variables
  const fullName = `${studentData.first_name || ''} ${studentData.last_name || ''}`.trim();
  const program = studentData.program?.name || 'Assigned Program';
  const yearLevel = studentData.year_level ? `${studentData.year_level} Year` : '';
  const studentNo = studentData.student_id || 'N/A';
  const email = studentData.email || 'N/A';
  const contactNumber = studentData.contact_number || 'N/A';
  const qrCodeString = studentData.qr_string || 'N/A';

  // Depending on if your backend returns the full URL or just the storage path
  // we ensure it formats to a valid image source.
  let qrCodeImage = studentData.qr_image || studentData.qr_image_path || '';
  if (qrCodeImage && !qrCodeImage.startsWith('http')) {
    qrCodeImage = `${API_BASE_URL}/storage/${qrCodeImage}`;
  }

  return (
    <div className="min-h-screen dark:bg-gray-900 flex flex-col items-center">
      {/* Header */}
      <div className="w-full max-w-4xl px-4 mt-4 text-center">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#071c4f] mb-2">
          Top Up Points
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-gray-700 dark:text-gray-300">
          Present this QR code to the student staff to top up your points.
        </p>
      </div>

      {/* Student QR Card */}
      <div className="w-full max-w-sm px-4 mt-8">
        <div className="bg-white dark:bg-boxdark rounded-2xl shadow-2xl p-6 flex flex-col items-center transition-transform hover:scale-105">
          {/* QR Code */}
          <div className="bg-gradient-to-r rounded-xl mb-4">
            {qrCodeImage ? (
              <img
                src={qrCodeImage}
                alt="Your QR Code"
                className="h-48 w-48 rounded-lg bg-white p-2 object-contain"
              />
            ) : (
              <div className="h-48 w-48 rounded-lg bg-gray-200 flex items-center justify-center text-sm text-gray-500 text-center px-4">
                QR Code Not Available
              </div>
            )}
          </div>

          {/* Student Info */}
          <h3 className="font-bold text-sm sm:text-base text-[#071c4f] text-center">
            {fullName}
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 text-center">
            {studentNo}
          </p>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 text-center">
            {program} {yearLevel ? `- ${yearLevel}` : ''}
          </p>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 text-center">
            {email}
          </p>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-4 text-center">
            {contactNumber}
          </p>

          {/* QR Code String */}
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 text-center">
            {qrCodeString}
          </p>

          {/* Thank You Message */}
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 text-center">
            Thank you for topping up your points!
          </p>
        </div>
      </div>
    </div>
  );
};

export default TopUpPoints;