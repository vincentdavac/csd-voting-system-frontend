import { ApexOptions } from 'apexcharts';
import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { Target, Activity, Info } from 'lucide-react';

interface Props {
  data: { program: string; votes: number }[];
}

// Updated tactical palette: High-contrast professional blues and teals
const PREDEFINED_COLORS = [
  '#3C50E0',
  '#80CAEE',
  '#6577F3',
  '#0FADCF',
  '#5E3BEE',
  '#14B8A6',
];

const PieChartTotalVotesPerProgram: React.FC<Props> = ({ data }) => {
  const activeData = data.filter((item) => item.votes > 0);
  const labels = activeData.map((item) => item.program);
  const series = activeData.map((item) => item.votes);
  const totalVotes = series.reduce((a, b) => a + b, 0);

  const options: ApexOptions = {
    chart: {
      fontFamily: 'Satoshi, sans-serif',
      type: 'donut',
      toolbar: { show: false },
    },
    colors: PREDEFINED_COLORS,
    labels: labels,
    legend: { show: false },
    plotOptions: {
      pie: {
        donut: {
          size: '80%',
          background: 'transparent',
          labels: {
            show: true,
            total: {
              show: true,
              showAlways: true,
              label: 'TOTAL TICKETS',
              fontSize: '10px',
              fontWeight: '900',
              color: '#64748b',
              formatter: () => totalVotes.toLocaleString(),
            },
            value: {
              show: true,
              fontSize: '28px',
              fontWeight: '900',
              color: '#1c2434', // Will be adjusted via CSS for dark mode
              offsetY: 5,
            },
          },
        },
      },
    },
    dataLabels: { enabled: false },
    stroke: { width: 0 },
    tooltip: {
      theme: 'dark',
      y: { formatter: (val) => `${val} Votes` },
    },
    responsive: [
      { breakpoint: 2600, options: { chart: { width: 320 } } },
      { breakpoint: 640, options: { chart: { width: 250 } } },
    ],
  };

  return (
    <div className="col-span-12 rounded-[32px] border border-stroke bg-white p-8 shadow-2xl dark:border-strokedark dark:bg-boxdark xl:col-span-4 flex flex-col transition-all hover:shadow-primary/5">
      {/* TACTICAL HEADER */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Activity className="text-primary animate-pulse" size={14} />
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">
              Live Feed Active
            </span>
          </div>
          <h5 className="text-2xl font-black text-black dark:text-white uppercase italic tracking-tighter">
            Program Share
          </h5>
        </div>
        <div className="p-2 rounded-xl bg-gray-50 dark:bg-meta-4">
          <Target className="text-gray-400" size={20} />
        </div>
      </div>

      {/* CHART CONTENT */}
      <div className="mb-6 flex-1 flex items-center justify-center min-h-[300px]">
        {series.length === 0 ? (
          <div className="flex flex-col items-center gap-3 text-center border-2 border-dashed border-stroke dark:border-strokedark rounded-[24px] p-10 w-full">
            <Info className="text-gray-300" size={32} />
            <p className="text-xs font-black text-gray-400 uppercase italic">
              Waiting for incoming data...
            </p>
          </div>
        ) : (
          <div id="chartThree" className="mx-auto">
            <ReactApexChart
              options={options}
              series={series}
              type="donut"
              height={320}
            />
          </div>
        )}
      </div>

      {/* GRID-BASED DYNAMIC LEGEND */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-4 pt-8 border-t border-stroke dark:border-strokedark">
        {labels.map((label, index) => {
          const value = series[index];
          const percentage =
            totalVotes > 0 ? Math.round((value / totalVotes) * 100) : 0;
          return (
            <div key={label} className="group flex items-center gap-3">
              <span
                className="h-2.5 w-2.5 rounded-full shrink-0 shadow-sm transition-transform group-hover:scale-150"
                style={{
                  backgroundColor:
                    PREDEFINED_COLORS[index % PREDEFINED_COLORS.length],
                }}
              ></span>
              <div className="flex flex-col min-w-0">
                <span className="text-[9px] font-black text-gray-400 uppercase truncate tracking-tight group-hover:text-primary transition-colors">
                  {label}
                </span>
                <span className="text-sm font-black text-black dark:text-white italic leading-none">
                  {percentage}%
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* DARK MODE CENTER TEXT COLOR FIX */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .dark .apexcharts-datalabel-value { fill: #ffffff !important; }
        .apexcharts-datalabel-label { fill: #64748b !important; }
      `,
        }}
      />
    </div>
  );
};

export default PieChartTotalVotesPerProgram;
