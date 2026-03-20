import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ClickOutside from '../ClickOutside';
import UserOne from '../../images/user/user-01.png';
import {
  ChevronDown,
  LogOut,
  QrCode,
  ScanQrCode,
  TicketCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAlert } from '../Alert/AlertContext';
import API_BASE_URL from '../../config/api';

const DropdownUser = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { authUser, logout } = useAuth();
  const { showAlert } = useAlert();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    showAlert('success', 'Logged out successfully!');
    navigate('/client/signin');
  };

  const client = authUser?.user as any;
  const studentRole = client?.student_role;
  const fullName = client
    ? `${client.first_name || ''} ${client.last_name || ''}`.trim()
    : 'Loading...';
  const programName = client?.program?.name || 'Voter';

  console.log('ETO PO ANG ROLE:' + studentRole);
  console.log('HELLOW PO');

  console.log('AUTH USER:', authUser);
  console.log('CLIENT:', client);

  let profilePic = UserOne;
  const dbImage = client?.id_picture || client?.image;
  if (dbImage) {
    profilePic = dbImage.startsWith('http')
      ? dbImage
      : `${API_BASE_URL}/storage/${dbImage}`;
  }

  return (
    <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
      <Link
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-3 sm:gap-4 group transition-all"
        to="#"
      >
        {/* User Info - Hidden on small mobile */}
        <span className="hidden text-right md:block">
          <span className="block text-sm font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">
            {fullName}
          </span>
          <span className="block text-[10px] font-mono font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
            {programName}
          </span>
        </span>

        {/* Profile Image with Tactical Frame */}
        <div className="relative">
          <div
            className={`absolute -inset-1 bg-gradient-to-tr ${
              studentRole === 'president'
                ? 'from-amber-500 to-yellow-300'
                : 'from-blue-600 to-cyan-400'
            } rounded-2xl opacity-20 group-hover:opacity-40 transition-opacity blur-sm`}
          />
          <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-2xl overflow-hidden border-2 border-white dark:border-[#020d26] relative z-10 shadow-lg">
            <img
              src={profilePic || '/default-avatar.png'}
              alt="User Node"
              className="h-full w-full object-cover"
            />
          </div>
          {/* Status Indicator */}
          <div className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-white dark:border-[#020d26] bg-green-500 z-20" />
        </div>

        <ChevronDown
          size={18}
          className={`hidden sm:block text-slate-400 transition-transform duration-300 ${
            dropdownOpen ? 'rotate-180' : ''
          }`}
        />
      </Link>

      {/* Dropdown Menu - Tactical Ledger Style */}
      {dropdownOpen && (
        <div className="absolute right-0 mt-4 flex w-64 flex-col rounded-[2rem] border-4 border-slate-100 bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200 dark:border-white/5 dark:bg-[#020d26] overflow-hidden">
          {/* User Role Header (Mobile Only Info) */}
          <div className="md:hidden px-6 py-4 border-b border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/5">
            <p className="text-sm font-black text-slate-900 dark:text-white uppercase italic truncate">
              {fullName}
            </p>
            <p className="text-[9px] font-mono font-bold text-blue-600 uppercase">
              {programName}
            </p>
          </div>

          <ul className="flex flex-col border-b border-slate-100 px-3 py-4 dark:border-white/5">
            <li>
              <Link
                to="/client/top-up-points"
                className="flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-blue-600/5 hover:text-blue-600 dark:hover:bg-blue-500/10 transition-all group/item"
                onClick={() => setDropdownOpen(false)}
              >
                <div className="p-2 rounded-lg bg-slate-100 dark:bg-white/5 group-hover/item:bg-blue-600 group-hover/item:text-white transition-colors">
                  <QrCode size={18} />
                </div>
                <span className="uppercase tracking-tight">Top-Up Points</span>
              </Link>
            </li>
            <li>
              <Link
                to="/client/qr-code-scanner"
                className="flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-blue-600/5 hover:text-blue-600 dark:hover:bg-blue-500/10 transition-all group/item"
                onClick={() => setDropdownOpen(false)}
              >
                <div className="p-2 rounded-lg bg-slate-100 dark:bg-white/5 group-hover/item:bg-blue-600 group-hover/item:text-white transition-colors">
                  <ScanQrCode size={18} />
                </div>
                <span className="uppercase tracking-tight">
                  QR Code Scanner
                </span>
              </Link>
            </li>

            {studentRole === 'president' && (
              <li>
                <Link
                  to="/client/transactions"
                  className="flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-blue-600/5 hover:text-blue-600 dark:hover:bg-blue-500/10 transition-all group/item"
                  onClick={() => setDropdownOpen(false)}
                >
                  <div className="p-2 rounded-lg bg-slate-100 dark:bg-white/5 group-hover/item:bg-amber-500 group-hover/item:text-white transition-colors">
                    <TicketCheck size={18} />
                  </div>
                  <span className="uppercase tracking-tight">Transactions</span>
                </Link>
              </li>
            )}
          </ul>

          {/* Logout Action */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3.5 w-full px-7 py-5 text-sm font-black uppercase tracking-[0.2em] text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all text-left"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      )}
    </ClickOutside>
  );
};

export default DropdownUser;
