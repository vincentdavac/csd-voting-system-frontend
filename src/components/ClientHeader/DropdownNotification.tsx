import { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, CheckCheck } from 'lucide-react';
import ClickOutside from '../ClickOutside';

const DropdownNotification = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifying, setNotifying] = useState(true);

  const notifications = [
    {
      id: 1,
      title: 'Edit your information in a swipe',
      body: 'Sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim.',
      date: '12 May, 2025',
      image: 'https://i.pravatar.cc/40?img=1',
    },
    {
      id: 2,
      title: 'It is a long established fact',
      body: 'That a reader will be distracted by the readable.',
      date: '24 Feb, 2025',
      image: 'https://i.pravatar.cc/40?img=2',
    },
    {
      id: 3,
      title: 'There are many variations',
      body: 'Of passages of Lorem Ipsum available, but the majority have suffered.',
      date: '04 Jan, 2025',
      image: 'https://i.pravatar.cc/40?img=3',
    },
  ];

  const markAsRead = (id: number) => {
    console.log('Mark as read:', id);
  };

  const markAllRead = () => {
    console.log('Mark all as read');
    setNotifying(false);
  };

  return (
    <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
      <li>
        <Link
          onClick={() => {
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

          {/* Bell Icon */}
          <svg
            className="fill-current duration-300 ease-in-out"
            width="18"
            height="18"
            viewBox="0 0 18 18"
          >
            <path d="M16.1999 14.9343L15.6374 14.0624C15.5249 13.8937 15.4687 13.7249 15.4687 13.528V7.67803C15.4687 6.01865 14.7655 4.47178 13.4718 3.31865C12.4312 2.39053 11.0812 1.7999 9.64678 1.6874V1.1249C9.64678 0.787402 9.36553 0.478027 8.9999 0.478027C8.6624 0.478027 8.35303 0.759277 8.35303 1.1249V1.65928C4.92178 2.05303 2.4749 4.66865 2.4749 7.79053V13.528C2.44678 13.8093 2.39053 13.9499 2.33428 14.0343L1.7999 14.9343C1.63115 15.2155 1.63115 15.553 1.7999 15.8343C1.96865 16.0874 2.2499 16.2562 2.55928 16.2562H8.38115V16.8749C8.38115 17.2124 8.6624 17.5218 9.02803 17.5218C9.36553 17.5218 9.6749 17.2405 9.6749 16.8749V16.2562H15.4687C15.778 16.2562 16.0593 16.0874 16.228 15.8343C16.3968 15.553 16.3968 15.2155 16.1999 14.9343Z" />
          </svg>
        </Link>

        {dropdownOpen && (
          <div className="absolute -right-22 mt-2.5 flex h-90 w-75 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark sm:right-0 sm:w-80">
            {/* Header */}
            <div className="flex items-center justify-between px-4.5 py-3">
              <h5 className="text-sm font-medium text-bodydark2">
                Notifications
              </h5>

              <button
                onClick={markAllRead}
                className="flex items-center gap-1 text-xs text-primary hover:underline"
              >
                <CheckCheck size={14} />
                Mark all read
              </button>
            </div>

            {/* Notifications */}
            <ul className="flex h-auto flex-col overflow-y-auto">
              {notifications.map((notif) => (
                <li key={notif.id}>
                  <div className="flex items-start gap-3 border-t border-stroke px-4.5 py-3 hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4">
                    {/* Avatar */}
                    <img
                      src={notif.image}
                      alt="user"
                      className="h-10 w-10 rounded-full object-cover"
                    />

                    {/* Content */}
                    <Link to="#" className="flex flex-1 flex-col gap-1">
                      <p className="text-sm">
                        <span className="font-medium text-black dark:text-white">
                          {notif.title}
                        </span>{' '}
                        {notif.body}
                      </p>

                      <p className="text-xs text-gray-500">{notif.date}</p>
                    </Link>

                    {/* Mark as Read */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        markAsRead(notif.id);
                      }}
                      className="rounded p-1 text-gray-400 hover:bg-gray-200 hover:text-red-500 dark:hover:bg-meta-4"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </li>
    </ClickOutside>
  );
};

export default DropdownNotification;
