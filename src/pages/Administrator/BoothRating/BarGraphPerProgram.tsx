import { ApexOptions } from 'apexcharts';
import React, { useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { Layers, ListFilter, TrendingUp } from 'lucide-react';

interface BoothRatingData {
  id: number;
  attributes: {
    project_title: string;
    ratings_sum: number | null;
    program?: {
      name: string;
    };
  };
}

interface BarGraphPerProgramProps {
  programName: string;
  exhibitorsData: BoothRatingData[];
}

const BarGraphPerProgram: React.FC<BarGraphPerProgramProps> = ({
  programName,
  exhibitorsData,
}) => {
  const [filter, setFilter] = useState<'top5' | 'top10' | 'all'>('top5');

  // Define a theme color based on the program name
  const getProgramColor = (name: string) => {
    const colors: Record<string, string> = {
      IT: '#3C50E0',
      CS: '#10B981',
      IS: '#F59E0B',
      EMC: '#FF6B6B',
    };
    return colors[name.toUpperCase()] || '#3C50E0';
  };

  const themeColor = getProgramColor(programName);

  const programExhibitors = exhibitorsData.filter((ex) => {
    const progName = ex.attributes?.program?.name || '';
    return progName.toUpperCase().includes(programName.toUpperCase());
  });

  const sortedExhibitors = [...programExhibitors].sort(
    (a, b) =>
      (b.attributes?.ratings_sum || 0) - (a.attributes?.ratings_sum || 0),
  );

  let displayedExhibitors = sortedExhibitors;
  if (filter === 'top5') displayedExhibitors = sortedExhibitors.slice(0, 5);
  else if (filter === 'top10')
    displayedExhibitors = sortedExhibitors.slice(0, 10);

  const categories = displayedExhibitors.map(
    (ex) => ex.attributes?.project_title,
  );
  const data = displayedExhibitors.map((ex) => ex.attributes?.ratings_sum || 0);

  const series = [{ name: 'Total Score', data }];

  const options: ApexOptions = {
    colors: [themeColor],
    chart: {
      fontFamily: 'Satoshi, sans-serif',
      type: 'bar',
      height: 335,
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    plotOptions: {
      bar: {
        horizontal: true, // Switched to horizontal for better readability in grid views
        borderRadius: 4,
        barHeight: '40%',
        distributed: false,
      },
    },
    dataLabels: {
      enabled: true,
      textAnchor: 'start',
      style: { colors: ['#fff'], fontWeight: 700 },
      offsetX: 0,
      formatter: (val) => val.toString(),
    },
    xaxis: {
      categories: categories.length > 0 ? categories : ['No Data'],
      labels: { show: false },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: { fontSize: '12px', fontWeight: 700, colors: ['#64748b'] },
      },
    },
    grid: {
      show: false,
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: 'horizontal',
        shadeIntensity: 0.25,
        gradientToColors: [themeColor + 'CC'],
        inverseColors: true,
        opacityFrom: 1,
        opacityTo: 0.85,
      },
    },
    tooltip: { theme: 'dark' },
  };

  return (
    <div className="col-span-12 rounded-[24px] border border-stroke bg-white p-6 shadow-xl dark:border-strokedark dark:bg-boxdark xl:col-span-6">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-lg"
            style={{ backgroundColor: themeColor }}
          >
            <TrendingUp size={20} />
          </div>
          <div>
            <h4 className="text-lg font-black text-black dark:text-white leading-tight">
              {programName}{' '}
              <span className="text-gray-400 font-medium text-sm">Ranking</span>
            </h4>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-lg bg-gray-50 px-2 py-1 dark:bg-meta-4">
          <ListFilter size={14} className="text-gray-400" />
          <select
            value={filter}
            onChange={(e) =>
              setFilter(e.target.value as 'top5' | 'top10' | 'all')
            }
            className="bg-transparent text-[11px] font-black uppercase tracking-wider text-black outline-none dark:text-white"
          >
            <option value="top5">Top 5</option>
            <option value="top10">Top 10</option>
            <option value="all">All</option>
          </select>
        </div>
      </div>

      <div className="relative min-h-[300px]">
        {displayedExhibitors.length > 0 ? (
          <div id={`boothChart-${programName}`} className="-ml-4">
            <ReactApexChart
              options={options}
              series={series}
              type="bar"
              height={320}
            />
          </div>
        ) : (
          <div className="flex h-[300px] flex-col items-center justify-center opacity-20">
            <Layers size={48} />
            <p className="mt-2 text-sm font-bold uppercase tracking-widest">
              No Data Available
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BarGraphPerProgram;
