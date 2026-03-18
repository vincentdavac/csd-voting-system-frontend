import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ClickOutside from '../ClickOutside';
import UserOne from '../../images/user/user-01.png'; 
import { LogOut, QrCode, ScanQrCode, TicketCheck } from 'lucide-react';
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
  const fullName = client ? `${client.first_name || ''} ${client.last_name || ''}`.trim() : 'Loading...';
  const programName = client?.program?.name || 'Voter';

  console.log("ETO PO ANG ROLE:" + studentRole);
  console.log("HELLOW PO");

  console.log("AUTH USER:", authUser);
console.log("CLIENT:", client);
  
  let profilePic = UserOne;
  const dbImage = client?.id_picture || client?.image;
  if (dbImage) {
    profilePic = dbImage.startsWith('http') ? dbImage : `${API_BASE_URL}/storage/${dbImage}`;
  }

  return (
    <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
      <Link
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-4"
        to="#"
      >
        <span className="hidden text-right lg:block">
          <span className="block text-sm font-medium text-black dark:text-white">
            {fullName}
          </span>
          <span className="block text-xs">{programName}</span>
        </span>

        <span className="h-12 w-12 rounded-full overflow-hidden border border-stroke dark:border-strokedark">
          <img 
            src={profilePic} 
            alt="User" 
            className="h-full w-full object-cover"
          />
        </span>

        <svg
          className="hidden fill-current sm:block"
          width="12"
          height="8"
          viewBox="0 0 12 8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0.410765 0.910734C0.736202 0.585297 1.26384 0.585297 1.58928 0.910734L6.00002 5.32148L10.4108 0.910734C10.7362 0.585297 11.2638 0.585297 11.5893 0.910734C11.9147 1.23617 11.9147 1.76381 11.5893 2.08924L6.58928 7.08924C6.26384 7.41468 5.7362 7.41468 5.41077 7.08924L0.410765 2.08924C0.0853277 1.76381 0.0853277 1.23617 0.410765 0.910734Z"
            fill=""
          />
        </svg>
      </Link>

      {/* */}
      {dropdownOpen && (
        <div
          className={`absolute right-0 mt-4 flex w-62.5 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark`}
        >
          <ul className="flex flex-col gap-5 border-b border-stroke px-6 py-7.5 dark:border-strokedark">
            <li>
              <Link
                to="/client/top-up-points"
                className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
                onClick={() => setDropdownOpen(false)}
              >
                <QrCode />
                Top-Up Points
              </Link>
            </li>
            <li>
              <Link
                to="/client/qr-code-scanner"
                className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
                onClick={() => setDropdownOpen(false)}
              >
                <ScanQrCode />
                QR Code Scanner
              </Link>
            </li>

            {/* Conditional rendering – only show for non-student roles (e.g. president) */}
            {studentRole === 'president' && (
              <li>
                <Link
                  to="/client/transactions"
                  className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
                  onClick={() => setDropdownOpen(false)}
                >
                  <TicketCheck />
                  Transactions
                </Link>
              </li>
            )}
          </ul>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3.5 px-6 py-4 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
          >
            <LogOut />
            Log Out
          </button>
        </div>
      )}
      {/* */}
    </ClickOutside>
  );
};

export default DropdownUser;