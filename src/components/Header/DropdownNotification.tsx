import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, CheckCheck, Bell } from 'lucide-react';
import ClickOutside from '../ClickOutside';
import { useAuth } from '../../context/AuthContext';
import API_BASE_URL from '../../config/api';

const DropdownNotification = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifying, setNotifying] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const { authUser } = useAuth();

  const fetchNotifications = async () => {
    if (!authUser?.token) return;
    try {
      const res = await fetch(`${API_BASE_URL}/notifications/admin/unread`, {
        headers: {
          Authorization: `Bearer ${authUser.token}`,
          Accept: 'application/json',
        },
      });
      const json = await res.json();

      if (json.data) {
        const notifsArray = Array.isArray(json.data)
          ? json.data
          : json.data.data || [];

        setNotifications(notifsArray);
        setNotifying(notifsArray.length > 0);
      }
    } catch (error) {
      console.error('Failed to fetch notifications', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [authUser?.token]);

  const markAsRead = async (id: number) => {
    if (!authUser?.token) return;
    try {
      // FIX: Match the exact URL format of the Laravel route
      await fetch(`${API_BASE_URL}/notifications/admin/read/${id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${authUser.token}`,
          Accept: 'application/json',
        },
      });

      const updated = notifications.filter((n) => n.id !== id);
      setNotifications(updated);
      setNotifying(updated.length > 0);
    } catch (error) {
      console.error('Failed to mark notification as read', error);
    }
  };

  const markAllAsRead = async () => {
    if (!authUser?.token) return;
    try {
      await fetch(`${API_BASE_URL}/notifications/admin/read-all`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${authUser.token}`,
          Accept: 'application/json',
        },
      });
      setNotifications([]);
      setNotifying(false);
      setDropdownOpen(false);
    } catch (error) {
      console.error('Failed to mark all as read', error);
    }
  };

  return (
    <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
      <li>
        <Link
          onClick={() => {
            setNotifying(false);
            setDropdownOpen(!dropdownOpen);
          }}
          to="#"
          className="relative flex h-8.5 w-8.5 items-center justify-center rounded-full border-[0.5px] border-stroke bg-gray hover:text-primary dark:border-strokedark dark:bg-meta-4 dark:text-white"
        >
          <span
            className={`absolute -top-0.5 right-0 z-1 h-2 w-2 rounded-full bg-meta-1 ${
              notifying === false ? 'hidden' : 'inline'
            }`}
          >
            <span className="absolute -z-1 inline-flex h-full w-full animate-ping rounded-full bg-meta-1 opacity-75"></span>
          </span>

          <Bell size={18} />
        </Link>

        {dropdownOpen && (
          <div className="absolute -right-27 mt-2.5 flex h-90 w-75 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark sm:right-0 sm:w-80">
            <div className="flex items-center justify-between px-4.5 py-3">
              <h5 className="text-sm font-medium text-bodydark2">
                Notifications ({notifications.length})
              </h5>
              {notifications.length > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="flex items-center gap-1 text-xs text-primary hover:underline"
                >
                  <CheckCheck size={14} /> Mark all read
                </button>
              )}
            </div>

            <ul className="flex h-auto flex-col overflow-y-auto">
              {notifications.length === 0 ? (
                <li className="flex flex-col items-center justify-center py-8 text-sm text-gray-500">
                  <Bell size={24} className="mb-2 opacity-20" />
                  No new notifications
                </li>
              ) : (
                notifications.map((notif) => (
                  <li key={notif.id}>
                    <div className="flex items-start gap-3 border-t border-stroke px-4.5 py-3 hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4">
                      {/* Sender Avatar */}
                      <img
                        src={
                          notif.attributes.sender?.id_picture ||
                          '/user-profile.png'
                        }
                        alt="user"
                        className="h-10 w-10 rounded-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/user-profile.png';
                        }}
                      />

                      {/* Content */}
                      <div className="flex flex-1 flex-col gap-1">
                        <p className="text-sm">
                          <span className="font-medium text-black dark:text-white">
                            {notif.attributes.title}
                          </span>{' '}
                          {notif.attributes.body}
                        </p>
                        <p className="text-xs text-gray-500">
                          {notif.attributes.createdDate} at{' '}
                          {notif.attributes.createdTime}
                        </p>
                      </div>

                      {/* Mark as Read Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(notif.id);
                        }}
                        className="rounded p-1 text-gray-400 hover:bg-gray-200 hover:text-red-500 dark:hover:bg-meta-4"
                        title="Dismiss"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        )}
      </li>
    </ClickOutside>
  );
};

export default DropdownNotification;
