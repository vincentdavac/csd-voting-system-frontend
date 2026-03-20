import React, { useState, useEffect } from 'react';
import { Save, Clock, CalendarDays, Settings } from 'lucide-react';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import API_BASE_URL from '../../../config/api';
import { useAuth } from '../../../context/AuthContext';

const GlobalSettings = () => {
  const { authUser } = useAuth();
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
        alert('Global settings updated successfully!');
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to update settings.');
      }
    } catch (error) {
      console.error(error);
      alert('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Breadcrumb pageName="Global Settings" />

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark flex items-center gap-2">
          <Settings className="text-primary" />
          <h3 className="font-medium text-black dark:text-white">
            Election Time Controls
          </h3>
        </div>
        
        <div className="p-6.5">
          {/* DATES */}
          <div className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="mb-2.5 block text-black dark:text-white flex items-center gap-2">
                <CalendarDays size={18} /> Voting Start Date
              </label>
              <input
                type="date"
                name="voting_start_date"
                value={settings.voting_start_date}
                onChange={handleChange}
                className="w-full rounded border border-stroke bg-transparent py-3 px-5 outline-none focus:border-primary dark:border-strokedark dark:bg-meta-4"
              />
            </div>
            <div>
              <label className="mb-2.5 block text-black dark:text-white flex items-center gap-2">
                <CalendarDays size={18} /> Voting End Date
              </label>
              <input
                type="date"
                name="voting_end_date"
                value={settings.voting_end_date}
                onChange={handleChange}
                className="w-full rounded border border-stroke bg-transparent py-3 px-5 outline-none focus:border-primary dark:border-strokedark dark:bg-meta-4"
              />
            </div>
          </div>

          {/* DAILY TIMES */}
          <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="mb-2.5 block text-black dark:text-white flex items-center gap-2">
                <Clock size={18} /> Daily Opening Time
              </label>
              <input
                type="time"
                name="daily_start_time"
                value={settings.daily_start_time}
                onChange={handleChange}
                className="w-full rounded border border-stroke bg-transparent py-3 px-5 outline-none focus:border-primary dark:border-strokedark dark:bg-meta-4"
              />
            </div>
            <div>
              <label className="mb-2.5 block text-black dark:text-white flex items-center gap-2">
                <Clock size={18} /> Daily Closing Time
              </label>
              <input
                type="time"
                name="daily_end_time"
                value={settings.daily_end_time}
                onChange={handleChange}
                className="w-full rounded border border-stroke bg-transparent py-3 px-5 outline-none focus:border-primary dark:border-strokedark dark:bg-meta-4"
              />
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded bg-primary p-3 font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
          >
            <Save size={20} />
            {loading ? 'Saving Changes...' : 'Save Global Settings'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GlobalSettings;