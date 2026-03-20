import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { X, CheckCheck, Bell, Clock, Loader2 } from 'lucide-react';
import ClickOutside from '../ClickOutside';
import { useAuth } from '../../context/AuthContext';
import API_BASE_URL from '../../config/api';

interface NotificationItem {
  id: number;
  attributes: {
    title: string;
    body: string;
    createdDate: string;
    createdTime: string;
    status: string;
    sender: {
      id_picture: string;
      name: string;
    };
  };
}

const DropdownNotification = () => {
  const { authUser } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchNotifications = useCallback(async () => {
    if (!authUser?.token) return;

    try {
      setIsLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/notifications/client/unread`,
        {
          headers: {
            Authorization: `Bearer ${authUser.token}`,
            Accept: 'application/json',
          },
        },
      );

      if (response.ok) {
        const result = await response.json();
        setNotifications(result.data || []);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setIsLoading(false);
    }
  }, [authUser?.token]);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000); // Auto-refresh every minute
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const markAsRead = async (id: number) => {
    if (!authUser?.token) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/notifications/client/read/${id}`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${authUser.token}`,
            Accept: 'application/json',
          },
        },
      );

      if (response.ok) {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllRead = async () => {
    if (!authUser?.token || notifications.length === 0) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/notifications/client/read-all`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${authUser.token}`,
            Accept: 'application/json',
          },
        },
      );

      if (response.ok) {
        setNotifications([]);
      }
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  return (
    <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
      <li className="list-none">
        <Link
          onClick={() => setDropdownOpen(!dropdownOpen)}
          to="#"
          className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-100/50 hover:border-blue-500/50 hover:text-blue-600 dark:border-white/10 dark:bg-white/5 dark:text-white transition-all duration-300 group"
        >
          {/* HIGH-VISIBILITY ALERT PIN */}
          {notifications.length > 0 && (
            <span className="absolute -top-1 -right-1 z-10 flex h-3.5 w-3.5 items-center justify-center">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75"></span>
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-600 border-2 border-white dark:border-[#020d26]"></span>
            </span>
          )}

          <Bell
            size={20}
            className="group-hover:animate-[wiggle_0.3s_ease-in-out] transition-colors"
          />
        </Link>

        {dropdownOpen && (
          <div className="absolute -right-16 mt-4 flex h-[450px] w-80 flex-col rounded-[2rem] border-4 border-slate-100 bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200 dark:border-white/5 dark:bg-[#020d26] sm:right-0">
            {/* HEADER SECTION */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-white/5">
              <div>
                <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-0.5">
                  System Log
                </h5>
                <p className="text-sm font-black text-slate-900 dark:text-white italic uppercase tracking-tighter">
                  Notifications ({notifications.length})
                </p>
              </div>

              {notifications.length > 0 && (
                <button
                  onClick={markAllRead}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600/10 text-[10px] font-black text-blue-600 uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all"
                >
                  <CheckCheck size={12} /> Clear All
                </button>
              )}
            </div>

            {/* NOTIFICATION LEDGER */}
            <ul className="flex flex-col overflow-y-auto scrollbar-hide flex-1">
              {isLoading && notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-3 opacity-40">
                  <Loader2 size={24} className="animate-spin text-blue-600" />
                  <p className="text-[10px] font-black uppercase tracking-widest">
                    Scanning...
                  </p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-2 opacity-30 italic">
                  <p className="text-xs font-bold uppercase tracking-tighter">
                    No active notification(s)
                  </p>
                </div>
              ) : (
                notifications.map((notif) => (
                  <li key={notif.id} className="group/item">
                    <div className="relative flex items-start gap-4 border-b border-slate-50 px-6 py-4 transition-all hover:bg-slate-50 dark:border-white/5 dark:hover:bg-white/5">
                      {/* Active Indicator Line */}
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 opacity-0 group-hover/item:opacity-100 transition-opacity" />

                      <div className="relative flex-shrink-0">
                        <img
                          src={
                            notif.attributes.sender?.id_picture ||
                            '/user-profile.png'
                          }
                          alt="sender"
                          className="h-10 w-10 rounded-xl object-cover ring-2 ring-slate-100 dark:ring-white/10"
                          onError={(e) => {
                            e.currentTarget.src = '/user-profile.png';
                          }}
                        />
                      </div>

                      <div className="flex flex-1 flex-col min-w-0">
                        <p className="text-xs leading-snug text-slate-600 dark:text-slate-300">
                          <span className="font-black text-slate-900 dark:text-white uppercase italic tracking-tight">
                            {notif.attributes.title}
                          </span>{' '}
                          {notif.attributes.body}
                        </p>

                        <div className="flex items-center gap-2 mt-1.5">
                          <Clock size={10} className="text-slate-400" />
                          <p className="text-[9px] font-mono font-bold text-slate-400 uppercase">
                            {notif.attributes.createdDate} //{' '}
                            {notif.attributes.createdTime}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(notif.id);
                        }}
                        className="opacity-0 group-hover/item:opacity-100 rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </li>
                ))
              )}
            </ul>

            {/* FOOTER DECOR */}
            <div className="px-6 py-3 border-t border-slate-50 dark:border-white/5 flex justify-center">
              <p className="text-[8px] font-mono text-slate-300 dark:text-white/10 uppercase tracking-[0.3em]">
                C.S.D Voting System
              </p>
            </div>
          </div>
        )}
      </li>

      <style
        dangerouslySetInnerHTML={{
          __html: `
      @keyframes wiggle {
        0%, 100% { transform: rotate(0deg); }
        25% { transform: rotate(10deg); }
        75% { transform: rotate(-10deg); }
      }
    `,
        }}
      />
    </ClickOutside>
  );
};

export default DropdownNotification;
