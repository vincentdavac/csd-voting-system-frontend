const TopUpPoints = () => {
  // Example student data
  const student = {
    program: 'BS in Information Technology',
    yearLevel: '3rd Year',
    studentNo: 'IT-2026-001',
    fullName: 'Juan Dela Cruz',
    email: 'juan.delacruz@example.com',
    contactNumber: '09123456789',
    qrCodeImage:
      'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=IT-2026-001',
    qrCodeString: 'IT-2026-001',
  };

  return (
    <div className="min-h-screen dark:bg-gray-900 flex flex-col items-center justify-center">
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
        <div className="bg-white dark:bg-boxdark rounded-2xl shadow-2xl p-6 flex flex-col items-center justify-center transition-transform hover:scale-105">
          {/* QR Code */}
          <div className="bg-gradient-to-r   rounded-xl mb-4">
            <img
              src={student.qrCodeImage}
              alt="QR Code"
              className="h-48 w-48 rounded-lg bg-white"
            />
          </div>

          {/* Student Info */}
          <h3 className="font-bold text-sm sm:text-base text-[#071c4f] text-center">
            {student.fullName}
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 text-center">
            {student.studentNo}
          </p>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 text-center">
            {student.program} - {student.yearLevel}
          </p>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 text-center">
            {student.email}
          </p>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-4 text-center">
            {student.contactNumber}
          </p>

          {/* QR Code String */}
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 text-center">
            {student.qrCodeString}
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
