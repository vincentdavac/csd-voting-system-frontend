import { ApexOptions } from 'apexcharts';
import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { Trophy, BarChart3 } from 'lucide-react';

interface Props {
  data: { project_title: string; total_votes: number }[];
}

const BarGraphTopExhibitors: React.FC<Props> = ({ data }) => {
  // Sort data to ensure highest is at the top for the horizontal view
  const sortedData = [...data]
    .sort((a, b) => b.total_votes - a.total_votes)
    .slice(0, 5);

  const categories = sortedData.map((item) => item.project_title);
  const seriesData = sortedData.map((item) => item.total_votes);

  const options: ApexOptions = {
    colors: ['#3C50E0'],
    chart: {
      fontFamily: 'Satoshi, sans-serif',
      type: 'bar',
      toolbar: { show: false },
      sparkline: { enabled: false },
    },
    plotOptions: {
      bar: {
        horizontal: true, // Switched to horizontal for better readability of titles
        borderRadius: 6,
        columnWidth: '50%',
        barHeight: '60%',
        distributed: true, // Allows each bar to have its own color if needed
        dataLabels: { position: 'top' },
      },
    },
    // Adding a subtle gradient to the bars
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: 'horizontal',
        shadeIntensity: 0.5,
        gradientToColors: ['#80CAEE'], // Fades from Primary to Secondary
        inverseColors: true,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100],
      },
    },
    grid: {
      show: false,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: false } },
    },
    dataLabels: {
      enabled: true,
      textAnchor: 'start',
      style: {
        colors: ['#fff'],
        fontSize: '10px',
        fontWeight: '900',
      },
      formatter: (val) => `${val}`,
      offsetX: 10,
    },
    xaxis: {
      categories: categories,
      labels: { show: false },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        show: true,
        maxWidth: 150,
        style: {
          colors: '#64748b',
          fontSize: '11px',
          fontWeight: '700',
        },
      },
    },
    tooltip: {
      theme: 'dark',
      y: { formatter: (val) => `${val} Votes` },
    },
  };

  return (
    <div className="col-span-12 rounded-[32px] border border-stroke bg-white p-8 shadow-2xl dark:border-strokedark dark:bg-boxdark xl:col-span-4 flex flex-col">
      {/* HEADER WITH TROPHY ICON */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Trophy className="text-yellow-500" size={16} />
            <span className="text-[10px] font-black text-yellow-500 uppercase tracking-[0.3em]">
              Leaderboard
            </span>
          </div>
          <h4 className="text-2xl font-black text-black dark:text-white uppercase italic tracking-tighter">
            Top 5 Exhibitors
          </h4>
        </div>
        <div className="p-2 rounded-xl bg-gray-50 dark:bg-meta-4">
          <BarChart3 className="text-gray-400" size={20} />
        </div>
      </div>

      {/* CHART CONTENT */}
      <div className="flex-1 relative">
        {sortedData.length === 0 ? (
          <div className="flex h-[350px] flex-col items-center justify-center gap-3 border-2 border-dashed border-stroke dark:border-strokedark rounded-[24px]">
            <div className="h-12 w-12 rounded-full bg-gray-50 dark:bg-meta-4 flex items-center justify-center">
              <BarChart3 className="text-gray-300" size={24} />
            </div>
            <p className="text-xs font-black text-gray-400 uppercase italic">
              Awaiting First Votes
            </p>
          </div>
        ) : (
          <div id="topExhibitorsChart" className="-ml-4 h-[350px]">
            <ReactApexChart
              options={options}
              series={[{ name: 'Total Votes', data: seriesData }]}
              type="bar"
              height="100%"
            />
          </div>
        )}
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .apexcharts-yaxis-label { text-transform: uppercase; font-style: italic; letter-spacing: -0.02em; }
      `,
        }}
      />
    </div>
  );
};

export default BarGraphTopExhibitors;
