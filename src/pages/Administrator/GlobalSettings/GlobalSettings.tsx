import React, { useState, useEffect } from 'react';
import {
  Save,
  Clock,
  CalendarDays,
  Settings,
  ShieldCheck,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import API_BASE_URL from '../../../config/api';
import { useAuth } from '../../../context/AuthContext';
import { useAlert } from '../../../components/Alert/AlertContext';

const GlobalSettings = () => {
  const { authUser } = useAuth();
  const { showAlert } = useAlert();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    voting_start_date: '',
    voting_end_date: '',
    daily_start_time: '',
    daily_end_time: '',
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/settings/status`);
        const data = await res.json();
        if (data.settings) {
          setSettings({
            voting_start_date: data.settings.voting_start_date,
            voting_end_date: data.settings.voting_end_date,
            daily_start_time: data.settings.daily_start_time,
            daily_end_time: data.settings.daily_end_time,
          });
        }
      } catch (error) {
        console.error('Failed to fetch settings:', error);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!authUser?.token) return;
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/settings/update`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${authUser.token}`,
        },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        showAlert('success', 'Global settings updated successfully!');
      } else {
        const data = await res.json();
        showAlert('error', data.message || 'Failed to update settings.');
      }
    } catch (error) {
      showAlert('error', 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      <Breadcrumb pageName="Global Settings" />

      <div className="overflow-hidden rounded-[32px] border border-stroke bg-white shadow-2xl dark:border-strokedark dark:bg-boxdark transition-all">
        {/* Header Section */}
        <div className="bg-primary/[0.03] border-b border-stroke px-8 py-7 dark:border-strokedark flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/30">
              <Settings size={24} />
            </div>
            <div>
              <h3 className="text-xl font-black text-black dark:text-white tracking-tight">
                Election Time Controls
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Configure the active dates and daily operational hours.
              </p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 rounded-full bg-green-50 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-green-600 dark:bg-green-500/10">
            <ShieldCheck size={14} /> System Secure
          </div>
        </div>

        <div className="p-8 sm:p-10">
          {/* DATE RANGE SECTION */}
          <div className="mb-10">
            <h4 className="mb-6 flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-gray-400">
              <CalendarDays size={16} className="text-primary" /> Schedule
              Duration
            </h4>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-bold text-black dark:text-white ml-1">
                  Start Date
                </label>
                <input
                  type="date"
                  name="voting_start_date"
                  value={settings.voting_start_date}
                  onChange={handleChange}
                  className="w-full rounded-2xl border-2 border-gray-100 bg-gray-50 py-4 px-6 text-sm font-medium outline-none transition-all focus:border-primary focus:bg-white dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-black dark:text-white ml-1">
                  End Date
                </label>
                <input
                  type="date"
                  name="voting_end_date"
                  value={settings.voting_end_date}
                  onChange={handleChange}
                  className="w-full rounded-2xl border-2 border-gray-100 bg-gray-50 py-4 px-6 text-sm font-medium outline-none transition-all focus:border-primary focus:bg-white dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                />
              </div>
            </div>
          </div>

          <hr className="mb-10 border-stroke dark:border-strokedark" />

          {/* DAILY HOURS SECTION */}
          <div className="mb-12">
            <h4 className="mb-6 flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-gray-400">
              <Clock size={16} className="text-primary" /> Daily Operational
              Hours
            </h4>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-bold text-black dark:text-white ml-1">
                  Opening Time
                </label>
                <input
                  type="time"
                  name="daily_start_time"
                  value={settings.daily_start_time}
                  onChange={handleChange}
                  className="w-full rounded-2xl border-2 border-gray-100 bg-gray-50 py-4 px-6 text-sm font-medium outline-none transition-all focus:border-primary focus:bg-white dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-black dark:text-white ml-1">
                  Closing Time
                </label>
                <input
                  type="time"
                  name="daily_end_time"
                  value={settings.daily_end_time}
                  onChange={handleChange}
                  className="w-full rounded-2xl border-2 border-gray-100 bg-gray-50 py-4 px-6 text-sm font-medium outline-none transition-all focus:border-primary focus:bg-white dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                />
              </div>
            </div>
          </div>

          {/* NOTIFICATION BOX */}
          <div className="mb-8 flex gap-4 rounded-2xl bg-amber-50 p-5 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20">
            <AlertCircle className="shrink-0 text-amber-600" size={20} />
            <p className="text-xs leading-relaxed text-amber-700 dark:text-amber-500 font-medium">
              Updating these settings will immediately affect system access for
              all participants. Ensure the selected time zone matches your
              server configuration.
            </p>
          </div>

          {/* SUBMIT BUTTON */}
          <button
            onClick={handleSave}
            disabled={loading}
            className="group relative flex w-full items-center justify-center gap-3 rounded-2xl bg-primary py-5 px-10 text-base font-black text-white shadow-xl shadow-primary/20 transition-all hover:scale-[1.01] hover:bg-opacity-95 active:scale-[0.98] disabled:opacity-70"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={22} />
                Updating System...
              </>
            ) : (
              <>
                <Save size={22} />
                Save Global Settings
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GlobalSettings;
