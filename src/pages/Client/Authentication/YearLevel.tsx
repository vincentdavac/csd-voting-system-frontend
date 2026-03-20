import { CalendarSearch } from 'lucide-react';
import React, { useState } from 'react';

interface YearLevelProps {
  value: string;
  onChange: (level: string) => void;
}

const YearLevel: React.FC<YearLevelProps> = ({ value, onChange }) => {
  const [selectedOption, setSelectedOption] = useState<string>(value);

  return (
    <div className="group relative w-full">
      {/* Flex container to align icons and select relative to each other */}
      <div className="relative flex items-center">
        {/* Left Icon - Elevated Z-index for mobile visibility */}
        <span className="absolute left-4 z-[40] pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
          <CalendarSearch size={18} strokeWidth={2.5} />
        </span>

        <select
          value={selectedOption}
          onChange={(e) => {
            setSelectedOption(e.target.value);
            onChange(e.target.value);
          }}
          /* Added 'truncate' to handle long text on small screens 
           Standardized padding to match the Program Select exactly
        */
          className={`relative z-[30] w-full appearance-none rounded-2xl border-2 border-slate-100 bg-slate-50/50 py-3.5 sm:py-4 pl-12 pr-11 text-sm font-bold outline-none transition-all truncate
          focus:border-blue-600 focus:bg-white 
          dark:border-white/5 dark:bg-white/5 dark:focus:border-blue-500 dark:focus:bg-transparent shadow-inner 
          ${
            selectedOption
              ? 'text-slate-900 dark:text-white'
              : 'text-slate-400 dark:text-slate-500'
          }`}
        >
          <option value="" disabled className="dark:bg-[#020d26]">
            Select Year Level
          </option>
          <option
            value="1"
            className="text-slate-900 dark:text-white dark:bg-[#020d26]"
          >
            First Year
          </option>
          <option
            value="2"
            className="text-slate-900 dark:text-white dark:bg-[#020d26]"
          >
            Second Year
          </option>
          <option
            value="3"
            className="text-slate-900 dark:text-white dark:bg-[#020d26]"
          >
            Third Year
          </option>
          <option
            value="4"
            className="text-slate-900 dark:text-white dark:bg-[#020d26]"
          >
            Fourth Year
          </option>
        </select>

        {/* Right Chevron - Elevated Z-index so it doesn't get buried */}
        <span className="absolute right-4 z-[40] pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </span>
      </div>
    </div>
  );
};

export default YearLevel;
