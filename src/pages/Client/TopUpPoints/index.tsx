import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import API_BASE_URL from '../../../config/api';
import VotingLoader from '../../../common/Loader/VotingLoader'; // Import VotingLoader
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
const TopUpPoints = () => {
  const { authUser } = useAuth();
  const [studentData, setStudentData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const navigate = useNavigate();

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
    : 'GUEST';
  const studentNo = studentData.student_id || 'N/A';
  const email = studentData.email || 'N/A';
  const contactNumber = studentData.contact_number || 'N/A';
  const qrCodeString = studentData.qr_string || 'N/A';

  let qrCodeImage = studentData.qr_image || studentData.qr_image_path || '';
  if (qrCodeImage && !qrCodeImage.startsWith('http')) {
    qrCodeImage = `${API_BASE_URL}/storage/${qrCodeImage}`;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020d26] flex flex-col items-center relative transition-colors duration-300 overflow-x-hidden">
      {/* TACTICAL BACKGROUND DECOR */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#2563eb 1px, transparent 1px)`,
          backgroundSize: '30px 30px',
        }}
      />

      {/* MOBILE BACK BUTTON */}
      <div className="absolute top-6 left-6 z-20">
        <button
          onClick={() => navigate('/client/dashboard')}
          className="group flex items-center justify-center h-12 w-12 rounded-2xl bg-white dark:bg-white/5 shadow-xl text-slate-600 dark:text-slate-400 active:scale-95 transition-all border border-slate-100 dark:border-white/10 hover:border-blue-500"
        >
          <ArrowLeft
            size={24}
            className="group-hover:-translate-x-1 transition-transform"
          />
        </button>
      </div>

      {/* HEADER SECTION */}
      <div className="w-full max-w-4xl px-6 mt-20 md:mt-24 text-center relative z-10">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mb-3 tracking-tighter uppercase italic">
          Top Up Points
        </h1>
        <p className="text-sm font-bold text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
          Present this{' '}
          <span className="text-blue-600 dark:text-blue-400">QR Code</span> to
          student staff for point allocation.
        </p>
      </div>

      {/* CREDENTIAL CARD */}
      <div className="w-full max-w-md px-4 mt-10 mb-20 relative z-10">
        <div className="relative group">
          {/* Glow Effect */}
          <div className="absolute -inset-1 bg-gradient-to-b from-blue-600 to-cyan-500 rounded-[3rem] blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>

          <div className="relative bg-white dark:bg-[#041130] rounded-[2.5rem] shadow-2xl p-8 flex flex-col items-center border-4 border-slate-100 dark:border-white/5 transition-all">
            {/* QR TERMINAL BOX */}
            <div className="relative group/qr overflow-hidden bg-slate-50 dark:bg-black/40 p-6 rounded-[2rem] mb-6 border-2 border-slate-100 dark:border-white/10 shadow-inner">
              {/* Corner Accents */}
              <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-blue-600/40" />
              <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-blue-600/40" />

              {/* Animated Scan Line */}
              <div className="absolute top-0 left-0 w-full h-[2px] bg-blue-500/50 blur-sm animate-[scan_3s_linear_infinite] z-20" />

              {qrCodeImage ? (
                <img
                  src={qrCodeImage}
                  alt="System QR"
                  className="h-56 w-56 md:h-64 md:w-64 rounded-xl bg-white object-contain relative z-10 p-2 dark:brightness-90 transition-all group-hover/qr:scale-105"
                />
              ) : (
                <div className="h-56 w-56 md:h-64 md:w-64 rounded-xl flex flex-col items-center justify-center text-center px-8 bg-slate-200 dark:bg-white/5">
                  <AlertCircle size={40} className="text-slate-400 mb-2" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Offline Profile
                  </p>
                </div>
              )}
            </div>

            {/* SERIAL IDENTIFIER */}
            <div className="px-4 py-1.5 rounded-lg bg-slate-100 dark:bg-white/5 mb-8 border border-slate-200 dark:border-white/10">
              <h1 className="text-[11px] font-mono font-black tracking-[0.3em] text-slate-500 dark:text-blue-400/70 uppercase">
                {qrCodeString || 'NO-SIGNAL-AUTH'}
              </h1>
            </div>

            {/* STUDENT DATA ENTRIES */}
            <div className="w-full space-y-6 text-center">
              <div>
                <h3 className="font-black text-2xl sm:text-3xl text-slate-900 dark:text-white uppercase italic tracking-tighter mb-1">
                  {fullName}
                </h3>
                <p className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                  {yearLevel}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-left">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    Access ID
                  </p>
                  <p className="text-xs font-bold text-slate-900 dark:text-white font-mono">
                    {studentNo}
                  </p>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    Program
                  </p>
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate uppercase tracking-tighter">
                    {program}
                  </p>
                </div>
              </div>

              <div className="space-y-1 opacity-60">
                <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tight">
                  {email}
                </p>
                <p className="text-[10px] font-mono font-medium text-slate-400">
                  Contact Trace: {contactNumber}
                </p>
              </div>
            </div>

            {/* SYSTEM FOOTER */}
            <div className="w-full mt-10 pt-6 border-t border-slate-100 dark:border-white/10 flex flex-col items-center gap-2">
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                  System Active
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
      @keyframes scan {
        0% { top: 0; }
        100% { top: 100%; }
      }
    `,
        }}
      />
    </div>
  );
};

export default TopUpPoints;
