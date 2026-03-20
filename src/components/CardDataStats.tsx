import React, { ReactNode } from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface CardDataStatsProps {
  title: string;
  total: string;
  rate: string;
  levelUp?: boolean;
  levelDown?: boolean;
  children: ReactNode;
}

const CardDataStats: React.FC<CardDataStatsProps> = ({
  title,
  total,
  rate,
  levelUp,
  levelDown,
  children,
}) => {
  return (
    <div className="relative overflow-hidden rounded-[32px] border border-stroke bg-white p-6 shadow-2xl transition-all hover:scale-[1.02] dark:border-strokedark dark:bg-boxdark">
      {/* Background Decorative Element */}
      <div className="absolute -right-4 -top-4 opacity-[0.03] dark:opacity-[0.05] text-black dark:text-white pointer-events-none transform rotate-12">
        {children}
      </div>

      <div className="flex items-center justify-between mb-5">
        {/* Tactical Icon Container */}
        <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-50 dark:bg-meta-4 shadow-inner border border-stroke dark:border-strokedark group">
          <div className="text-primary transition-transform duration-300 group-hover:scale-110">
            {children}
          </div>
          {/* Corner Accents */}
          <div className="absolute -top-1 -left-1 h-2 w-2 border-t-2 border-l-2 border-primary/30 rounded-tl-sm" />
          <div className="absolute -bottom-1 -right-1 h-2 w-2 border-b-2 border-r-2 border-primary/30 rounded-br-sm" />
        </div>

        {rate && (
          <div
            className={`flex items-center gap-1 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-tighter ${
              levelUp
                ? 'bg-green-100 text-green-600 dark:bg-green-500/10'
                : levelDown
                ? 'bg-red-100 text-red-600 dark:bg-red-500/10'
                : 'bg-gray-100 text-gray-500 dark:bg-meta-4'
            }`}
          >
            {levelUp && <ArrowUpRight size={12} />}
            {levelDown && <ArrowDownRight size={12} />}
            {rate}
          </div>
        )}
      </div>

      <div className="space-y-1">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] leading-none">
          {title}
        </p>
        <h4 className="text-3xl font-black text-black dark:text-white uppercase italic tracking-tighter">
          {total}
        </h4>
      </div>

      {/* Terminal Status Bar */}
      <div className="mt-4 h-1 w-full bg-gray-50 dark:bg-meta-4 rounded-full overflow-hidden">
        <div className="h-full w-1/3 bg-gradient-to-r from-primary/50 to-primary animate-pulse" />
      </div>
    </div>
  );
};

export default CardDataStats;
