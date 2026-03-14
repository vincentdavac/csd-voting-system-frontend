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
    <div>
      <div className="relative z-20 bg-white dark:bg-form-input text-sm sm:text-base">
        <span className="absolute top-1/2 left-4 z-30 -translate-y-1/2">
          <Computer />
        </span>

        <select
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setIsOptionSelected(true);
          }}
          className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input ${
            isOptionSelected ? 'text-black dark:text-white' : ''
          }`}
        >
          <option value="" disabled className="text-body dark:text-bodydark">
            Select Program
          </option>
          {programs.map((program) => (
            <option
              key={program.id}
              value={program.id.toString()}
              className="text-body dark:text-bodydark"
            >
              {program.attributes.name}
            </option>
          ))}
        </select>

        <span className="absolute top-1/2 right-4 z-10 -translate-y-1/2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <g opacity="0.8">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                fill="#637381"
              />
            </g>
          </svg>
        </span>
      </div>
    </div>
  );
};

export default SelectProgram;
