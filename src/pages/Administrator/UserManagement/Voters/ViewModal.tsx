import {
  X,
  Mail,
  Phone,
  CalendarDays,
  User,
  School,
  Hash,
  Wallet,
  Ticket,
  QrCode,
  ShieldCheck,
} from 'lucide-react';
import { VOTER } from './VotersTable';

interface ViewModalProps {
  voter: VOTER;
  onClose: () => void;
}

const ViewModal: React.FC<ViewModalProps> = ({ voter, onClose }) => {
  const DetailItem = ({
    icon: Icon,
    label,
    value,
  }: {
    icon: any;
    label: string;
    value: string | number;
  }) => (
    <div className="flex items-start gap-3.5 rounded-lg border border-stroke bg-white p-4 shadow-sm dark:border-strokedark dark:bg-boxdark">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-primary dark:bg-meta-4 dark:text-white">
        <Icon size={20} />
      </div>
      <div>
        <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
        <p className="font-medium text-black dark:text-white">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-[32px] bg-white dark:bg-boxdark shadow-2xl overflow-hidden border border-white/10 transform transition-all animate-in zoom-in-95 duration-200">
        {/* BRANDING ACCENT */}
        <div className="h-2 w-full bg-[repeating-linear-gradient(45deg,#3c50e0,#3c50e0_10px,#2563eb_10px,#2563eb_20px)]" />

        {/* HEADER */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-stroke dark:border-strokedark bg-white/50 dark:bg-boxdark/50 backdrop-blur-sm">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <ShieldCheck className="text-primary" size={16} />
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">
                Verified Voter Dossier
              </span>
            </div>
            <h3 className="text-2xl font-black text-black dark:text-white uppercase italic tracking-tighter">
              Profile Details
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-3 rounded-2xl text-gray-400 hover:bg-gray-100 dark:hover:bg-meta-4 hover:text-red-500 transition-all active:scale-90"
          >
            <X size={24} />
          </button>
        </div>

        {/* CONTENT AREA */}
        <div className="flex-1 overflow-y-auto p-8 md:p-10 space-y-10 custom-scrollbar">
          {/* TOP CARD: IDENTITY & VERIFICATION */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* ID SECTION */}
            <div className="lg:col-span-8 flex flex-col md:flex-row items-center gap-8 p-8 rounded-[24px] bg-gray-50 dark:bg-meta-4/10 border border-stroke dark:border-strokedark relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <User size={120} />
              </div>

              <div className="relative shrink-0">
                <img
                  src={voter.idPicture}
                  alt="Official ID"
                  className="h-40 w-40 rounded-[32px] object-cover border-4 border-white dark:border-boxdark shadow-2xl grayscale-[0.2] hover:grayscale-0 transition-all"
                />
                <div className="absolute -bottom-2 -right-2 h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white ring-4 ring-gray-50 dark:ring-meta-4">
                  <ShieldCheck size={20} />
                </div>
              </div>

              <div className="flex-1 text-center md:text-left">
                <div className="mb-4">
                  {voter.studentRole === 'president' ? (
                    <span className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-1 text-[10px] font-black uppercase text-white tracking-widest italic shadow-lg shadow-blue-500/20">
                      <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                      Executive Level
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-black dark:bg-white px-4 py-1 text-[10px] font-black uppercase text-white dark:text-black tracking-widest italic">
                      Standard Registry
                    </span>
                  )}
                </div>

                <h4 className="text-4xl font-black text-black dark:text-white uppercase italic tracking-tighter mb-2 leading-none">
                  {voter.fullName}
                </h4>

                <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4">
                  <div className="flex items-center gap-2 text-gray-500 font-bold uppercase text-[11px] tracking-tight bg-white dark:bg-boxdark px-3 py-1.5 rounded-xl shadow-sm">
                    <Hash size={14} className="text-primary" />{' '}
                    {voter.studentNo}
                  </div>
                  <div className="flex items-center gap-2 text-gray-500 font-bold uppercase text-[11px] tracking-tight bg-white dark:bg-boxdark px-3 py-1.5 rounded-xl shadow-sm">
                    <School size={14} className="text-primary" />{' '}
                    {voter.program}
                  </div>
                </div>
              </div>
            </div>

            {/* QR SECTION */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center p-8 rounded-[24px] border-2 border-dashed border-stroke dark:border-strokedark text-center">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">
                Secure Access Token
              </p>
              <div className="p-4 bg-white rounded-2xl shadow-xl mb-4 group cursor-help transition-transform hover:scale-105">
                <img
                  src={voter.qrImage}
                  alt="QR Code"
                  className="h-28 w-28 object-contain"
                />
              </div>
              <div className="space-y-1">
                <code className="text-xs font-black text-primary bg-primary/10 px-3 py-1 rounded-lg">
                  {voter.qrCode}
                </code>
                <p className="text-[9px] font-bold text-gray-400 uppercase italic mt-2">
                  Scan to re-verify integrity
                </p>
              </div>
            </div>
          </div>

          {/* BOTTOM SECTION: DETAILED INFO GRID */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <h5 className="text-[12px] font-black text-black dark:text-white uppercase tracking-[0.3em] italic">
                Registry Information
              </h5>
              <div className="h-px flex-1 bg-stroke dark:bg-strokedark" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <DetailItem
                icon={Mail}
                label="Official Email"
                value={voter.email}
              />
              <DetailItem
                icon={Phone}
                label="Contact Line"
                value={voter.contactNumber}
              />
              <DetailItem
                icon={CalendarDays}
                label="Enrollment Date"
                value={voter.datetime}
              />
              <DetailItem
                icon={Ticket}
                label="Total Votes Invoiced"
                value={voter.totalVotesPurchased}
              />
              <DetailItem
                icon={Wallet}
                label="Available Balance"
                value={`${voter.remainingVotes} VOTES`}
              />
              <DetailItem
                icon={QrCode}
                label="Year Level"
                value={`Year ${voter.yearLevel}`}
              />
            </div>
          </div>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="p-8 border-t border-stroke dark:border-strokedark bg-gray-50 dark:bg-meta-4/20 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic">
            Confidential Electoral Data • DO NOT SHARE
          </p>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-10 py-4 bg-black dark:bg-white text-white dark:text-black text-xs font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all"
          >
            Terminal Exit
          </button>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(60, 80, 224, 0.2); border-radius: 10px; }
      `,
        }}
      />
    </div>
  );
};

export default ViewModal;
