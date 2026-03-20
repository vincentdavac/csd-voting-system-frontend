import { ApexOptions } from 'apexcharts';
import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { DollarSign, LineChart, TrendingUp } from 'lucide-react';

interface Props {
  data: { day: string; total: number }[];
}

const TotalRevenueTimeline: React.FC<Props> = ({ data }) => {
  const categories = data.map((item) => item.day);
  const seriesData = data.map((item) => item.total);
  const totalRevenue = seriesData.reduce((a, b) => a + b, 0);

  const options: ApexOptions = {
    // Aligned with your Primary Blue palette
    colors: ['#3C50E0'],
    chart: {
      fontFamily: 'Satoshi, sans-serif',
      type: 'area',
      height: 335,
      toolbar: { show: false },
      zoom: { enabled: false },
      dropShadow: {
        enabled: true,
        color: '#3C50E0',
        top: 10,
        blur: 4,
        left: 0,
        opacity: 0.1,
      },
    },
    dataLabels: { enabled: false },
    stroke: {
      curve: 'smooth',
      width: 3,
    },
    // Tactical Gradient Fill
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.45,
        opacityTo: 0.05,
        stops: [20, 100],
      },
    },
    grid: {
      borderColor: '#E2E8F0',
      strokeDashArray: 5,
      xaxis: { lines: { show: true } },
      yaxis: { lines: { show: false } },
    },
    xaxis: {
      categories: categories,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: {
          colors: '#64748b',
          fontWeight: 700,
          fontSize: '10px',
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: '#64748b',
          fontWeight: 700,
          fontSize: '10px',
        },
        formatter: (val) => `₱${val.toLocaleString()}`,
      },
    },
    markers: {
      size: 4,
      colors: '#fff',
      strokeColors: '#3C50E0',
      strokeWidth: 3,
      hover: { size: 6 },
    },
    legend: { show: false },
    tooltip: {
      theme: 'dark',
      y: { formatter: (val) => `₱${val.toLocaleString()}` },
    },
  };

  return (
    <div className="col-span-12 rounded-[32px] border border-stroke bg-white p-8 shadow-2xl dark:border-strokedark dark:bg-boxdark xl:col-span-4 flex flex-col">
      {/* TACTICAL HEADER */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="text-primary" size={14} />
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">
              Financial Pulse
            </span>
          </div>
          <h4 className="text-2xl font-black text-black dark:text-white uppercase italic tracking-tighter">
            Revenue Flow
          </h4>
        </div>
        <div className="p-3 rounded-2xl bg-gray-50 dark:bg-meta-4 flex items-center justify-center">
          <DollarSign className="text-gray-400" size={20} />
        </div>
      </div>

      {/* REVENUE SUMMARY CHIP */}
      <div className="mb-8 p-4 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">
            Weekly Gross
          </span>
          <span className="text-xl font-black text-primary italic tracking-tighter">
            ₱{totalRevenue.toLocaleString()}
          </span>
        </div>
        <div className="h-10 w-10 rounded-full border-2 border-primary/20 flex items-center justify-center">
          <LineChart size={18} className="text-primary" />
        </div>
      </div>

      {/* CHART CONTENT */}
      <div className="flex-1 relative">
        <div id="chartRevenue" className="-ml-5 -mb-9 h-[300px]">
          {data.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center p-10">
              <p className="text-xs font-black text-gray-400 uppercase italic">
                Ledger Empty
              </p>
            </div>
          ) : (
            <ReactApexChart
              options={options}
              series={[{ name: 'Revenue', data: seriesData }]}
              type="area"
              height="100%"
            />
          )}
        </div>
      </div>

      {/* SYSTEM STATUS FOOTER */}
      <div className="mt-8 pt-4 border-t border-stroke dark:border-strokedark flex items-center justify-between">
        <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">
          Registry Sync: 100%
        </span>
        <span className="text-[8px] font-black text-primary uppercase italic tracking-tighter">
          Verified Stream
        </span>
      </div>
    </div>
  );
};

export default TotalRevenueTimeline;
