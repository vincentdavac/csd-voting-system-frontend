import { Computer } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import API_BASE_URL from '../../../config/api'; // make sure to define your API_BASE_URL

interface Program {
  id: number;
  attributes: {
    name: string;
    description: string;
    image: string;
    createdDate: string;
    createdTime: string;
    updatedDate: string;
    updatedTime: string;
  };
}

interface SelectProgramProps {
  value: string;
  onChange: (programName: string) => void;
}

const SelectProgram: React.FC<SelectProgramProps> = ({ value, onChange }) => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [isOptionSelected, setIsOptionSelected] = useState<boolean>(false);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/programs`);
        const data = await res.json();
        if (data.status === 'success') {
          setPrograms(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch programs:', error);
      }
    };
    fetchPrograms();
  }, []);

  return (
    <div className="group relative w-full">
      {/* Input Wrapper to isolate stacking context */}
      <div className="relative flex items-center">
        {/* Left Icon - Fixed and hoisted higher for visibility */}
        <span className="absolute left-4 z-[40] pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
          <Computer size={18} strokeWidth={2.5} />
        </span>

        <select
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setIsOptionSelected(true);
          }}
          /* Added truncate and optimized padding for mobile to prevent text-overlap with icons */
          className={`relative z-[30] w-full appearance-none rounded-2xl border-2 border-slate-100 bg-slate-50/50 py-3.5 sm:py-4 pl-12 pr-11 text-sm font-bold outline-none transition-all truncate
          focus:border-blue-600 focus:bg-white 
          dark:border-white/5 dark:bg-white/5 dark:focus:border-blue-500 dark:focus:bg-transparent shadow-inner 
          ${
            isOptionSelected
              ? 'text-slate-900 dark:text-white'
              : 'text-slate-400 dark:text-slate-500'
          }`}
        >
          <option value="" disabled className="dark:bg-[#020d26]">
            Select Program
          </option>
          {programs.map((program) => (
            <option
              key={program.id}
              value={program.id.toString()}
              className="text-slate-900 dark:text-white dark:bg-[#020d26]"
            >
              {program.attributes.name}
            </option>
          ))}
        </select>

        {/* Custom Chevron Icon - Increased z-index to stay on top of the select bg */}
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

export default SelectProgram;
