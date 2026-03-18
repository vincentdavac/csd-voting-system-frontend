import { ApexOptions } from 'apexcharts';
import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { TRANSACTION } from './Transactions';

interface PieChartProps {
  transactions: TRANSACTION[];
}

const PieChart: React.FC<PieChartProps> = ({ transactions }) => {
  const [series, setSeries] = useState<number[]>([]);
  const [labels, setLabels] = useState<string[]>([]);

  useEffect(() => {
    // Aggregate revenue by year level
    const revenueMap: Record<string, number> = {};

    transactions.forEach((t) => {
      const label = t.yearLevel === null ? 'Visitor' : `Year ${t.yearLevel}`;
      if (!revenueMap[label]) revenueMap[label] = 0;
      revenueMap[label] += t.amountPaid;
    });

    const sortedLabels = Object.keys(revenueMap).sort((a, b) => {
      if (a === 'Visitor') return 1; // Visitors last
      if (b === 'Visitor') return -1;
      return a.localeCompare(b);
    });

    const revenueSeries = sortedLabels.map((label) => revenueMap[label]);

    setLabels(sortedLabels);
    setSeries(revenueSeries);
  }, [transactions]);

  const options: ApexOptions = {
    chart: {
      fontFamily: 'Satoshi, sans-serif',
      type: 'donut',
    },
    colors: ['#3C50E0', '#6577F3', '#8FD0EF', '#0FADCF', '#F97316', '#EF4444'],
    labels: labels,
    legend: { show: false, position: 'bottom' },
    plotOptions: {
      pie: {
        donut: { size: '65%', background: 'transparent' },
      },
    },
    dataLabels: { enabled: false },
    responsive: [
      { breakpoint: 2600, options: { chart: { width: 380 } } },
      { breakpoint: 640, options: { chart: { width: 200 } } },
    ],
  };

  return (
    <div className="sm:px-7.5 col-span-12 rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">
      <div className="mb-3 justify-between gap-4 sm:flex">
        <h5 className="text-xl font-semibold text-black dark:text-white">
          Revenue Per Year Level
        </h5>
      </div>

      <div className="mb-2">
        <div id="chartThree" className="mx-auto flex justify-center">
          <ReactApexChart options={options} series={series} type="donut" />
        </div>
      </div>

      <div className="-mx-8 flex flex-wrap items-center justify-center gap-y-3">
        {labels.map((label, idx) => {
          const color =
            options.colors?.[idx % (options.colors.length || 1)] || '#000';
          const total = series[idx];
          const percentage = Math.round(
            (total / series.reduce((a, b) => a + b, 0)) * 100,
          );

          return (
            <div key={label} className="sm:w-1/2 w-full px-8">
              <div className="flex w-full items-center">
                <span
                  className="mr-2 block h-3 w-full max-w-3 rounded-full"
                  style={{ backgroundColor: color }}
                ></span>
                <p className="flex w-full justify-between text-sm font-medium text-black dark:text-white">
                  <span>{label}</span>
                  <span>{percentage}%</span>
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PieChart;
