import { ApexOptions } from 'apexcharts';
import React, { useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { Vote, Filter, Award, Inbox } from 'lucide-react';

interface ExhibitorData {
  id: number;
  attributes: {
    project_title: string;
    votes_sum: number | null;
    program?: {
      name: string;
    };
  };
}

interface BarGraphPerProgramProps {
  programName: string;
  exhibitorsData: ExhibitorData[];
}

const BarGraphPerProgram: React.FC<BarGraphPerProgramProps> = ({
  programName,
  exhibitorsData,
}) => {
  const [filter, setFilter] = useState<'top5' | 'top10' | 'all'>('top5');

  // Dynamic program themes to match your previous components
  const getTheme = (name: string) => {
    const themes: Record<string, { color: string; bg: string }> = {
      IT: { color: '#3C50E0', bg: 'bg-blue-500/10' },
      CS: { color: '#10B981', bg: 'bg-emerald-500/10' },
      IS: { color: '#F59E0B', bg: 'bg-amber-500/10' },
      EMC: { color: '#FF6B6B', bg: 'bg-rose-500/10' },
    };
    return (
      themes[name.toUpperCase()] || { color: '#3C50E0', bg: 'bg-blue-500/10' }
    );
  };

  const theme = getTheme(programName);

  const programExhibitors = exhibitorsData.filter((ex) => {
    const progName = ex.attributes?.program?.name || '';
    return progName.toUpperCase().includes(programName.toUpperCase());
  });

  const sortedExhibitors = [...programExhibitors].sort(
    (a, b) => (b.attributes?.votes_sum || 0) - (a.attributes?.votes_sum || 0),
  );

  let displayedExhibitors = sortedExhibitors;
  if (filter === 'top5') displayedExhibitors = sortedExhibitors.slice(0, 5);
  else if (filter === 'top10')
    displayedExhibitors = sortedExhibitors.slice(0, 10);

  const categories = displayedExhibitors.map(
    (ex) => ex.attributes?.project_title,
  );
  const data = displayedExhibitors.map((ex) => ex.attributes?.votes_sum || 0);

  const series = [{ name: 'Total Votes', data }];

  const options: ApexOptions = {
    colors: [theme.color],
    chart: {
      fontFamily: 'Satoshi, sans-serif',
      type: 'bar',
      height: 335,
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    plotOptions: {
      bar: {
        horizontal: true, // Switched to horizontal for better title readability
        borderRadius: 6,
        columnWidth: '30%',
        barHeight: '45%',
        distributed: false,
        dataLabels: { position: 'end' },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val) => val.toLocaleString(),
      style: { colors: ['#fff'], fontWeight: 700, fontSize: '12px' },
      offsetX: -10,
    },
    xaxis: {
      categories: categories.length > 0 ? categories : ['No Data'],
      labels: { show: false },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: { fontSize: '11px', fontWeight: 800, colors: ['#64748b'] },
      },
    },
    grid: { show: false },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: 'horizontal',
        shadeIntensity: 0.5,
        gradientToColors: [theme.color + '99'],
        opacityFrom: 1,
        opacityTo: 1,
      },
    },
    tooltip: { theme: 'dark' },
  };

  return (
    <div className="col-span-12 rounded-[24px] border border-stroke bg-white p-6 shadow-xl dark:border-strokedark dark:bg-boxdark xl:col-span-6 transition-all hover:shadow-2xl">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-xl ${theme.bg}`}
          >
            <Award size={20} style={{ color: theme.color }} />
          </div>
          <div>
            <h4 className="text-lg font-black text-black dark:text-white leading-tight uppercase tracking-tight">
              {programName}{' '}
              <span className="text-gray-400 font-bold text-xs uppercase block">
                Vote Leaderboard
              </span>
            </h4>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-1.5 dark:bg-meta-4">
          <Filter size={14} className="text-gray-500" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="bg-transparent text-[11px] font-black uppercase text-black outline-none dark:text-white cursor-pointer"
          >
            <option value="top5">Top 5</option>
            <option value="top10">Top 10</option>
            <option value="all">All</option>
          </select>
        </div>
      </div>

      <div className="relative">
        {displayedExhibitors.length > 0 ? (
          <div id={`chartTwo-${programName}`} className="-ml-4">
            <ReactApexChart
              options={options}
              series={series}
              type="bar"
              height={320}
            />
          </div>
        ) : (
          <div className="flex h-[320px] flex-col items-center justify-center opacity-30 text-gray-500">
            <Inbox size={48} strokeWidth={1} />
            <p className="mt-3 text-[10px] font-black uppercase tracking-[0.2em]">
              No Votes Recorded
            </p>
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center gap-2 border-t border-stroke pt-4 dark:border-strokedark">
        <Vote size={14} className="text-gray-400" />
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          Total {programName} Entries: {programExhibitors.length}
        </p>
      </div>
    </div>
  );
};

export default BarGraphPerProgram;
