import { ApexOptions } from 'apexcharts';
import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { TRANSACTION } from './Transactions';

interface BarChartProps {
  transactions: TRANSACTION[];
}

const BarChart: React.FC<BarChartProps> = ({ transactions }) => {
  const [series, setSeries] = useState<{ name: string; data: number[] }[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const revenueMap: Record<string, number> = {};

    transactions.forEach((t) => {
      const label = t.yearLevel === null ? 'Visitor' : `Year ${t.yearLevel}`;
      if (!revenueMap[label]) revenueMap[label] = 0;
      revenueMap[label] += t.amountPaid;
    });

    const sortedLabels = Object.keys(revenueMap).sort((a, b) => {
      if (a === 'Visitor') return 1;
      if (b === 'Visitor') return -1;
      return a.localeCompare(b);
    });

    const revenueSeries = sortedLabels.map((label) => revenueMap[label]);

    setCategories(sortedLabels);
    setSeries([{ name: 'Total Revenue', data: revenueSeries }]);
  }, [transactions]);

  const options: ApexOptions = {
    colors: ['#3C50E0'],
    chart: {
      fontFamily: 'Satoshi, sans-serif',
      type: 'bar',
      height: 350,
      toolbar: { show: false },
      dropShadow: {
        enabled: true,
        top: 10,
        left: 0,
        blur: 4,
        color: '#3C50E0',
        opacity: 0.1,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '35%',
        borderRadius: 8,
        borderRadiusApplication: 'end',
      },
    },
    dataLabels: {
      enabled: false,
    },
    grid: {
      strokeDashArray: 5,
      borderColor: '#E2E8F0',
      yaxis: { lines: { show: true } },
      xaxis: { lines: { show: false } },
    },
    xaxis: {
      categories: categories,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: {
          fontWeight: 700,
          fontSize: '11px',
          colors: '#64748B',
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          fontWeight: 600,
          colors: '#64748B',
        },
        formatter: (val) => `₱${val.toLocaleString()}`,
      },
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: 'vertical',
        shadeIntensity: 0.25,
        opacityFrom: 1,
        opacityTo: 0.7,
        stops: [0, 90, 100],
      },
    },
    tooltip: {
      theme: 'dark',
      y: {
        formatter: (val) => `₱${val.toLocaleString()}`,
      },
    },
  };

  return (
    <div className="col-span-12 rounded-[32px] border border-stroke bg-white p-8 shadow-2xl dark:border-strokedark dark:bg-boxdark xl:col-span-8 transition-all hover:shadow-primary/5">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h4 className="text-xl font-black text-black dark:text-white tracking-tight uppercase italic">
            Revenue Performance
          </h4>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
            Collection totals per year level
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 rounded-xl bg-gray-50 px-4 py-2 dark:bg-meta-4">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-[10px] font-black text-gray-500 uppercase">
            Live Audit
          </span>
        </div>
      </div>

      <div className="relative">
        <div id="revenueBarChart" className="-ml-5">
          {series[0]?.data.length === 0 ? (
            <div className="flex h-[350px] flex-col items-center justify-center gap-2">
              <p className="text-xs font-black uppercase tracking-widest text-gray-300">
                No Transaction Data
              </p>
            </div>
          ) : (
            <ReactApexChart
              options={options}
              series={series}
              type="bar"
              height={350}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default BarChart;
